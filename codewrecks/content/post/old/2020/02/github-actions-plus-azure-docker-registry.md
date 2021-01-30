---
title: "GitHub Actions plus Azure Docker Registry"
description: ""
date: 2020-02-25T17:00:37+02:00
draft: false
tags: [build]
categories: [GitHub]
---
I have some projects that needs SqlServer and MongoDb or ElasticSearch to run some integration tests, these kind of requirements made difficult to use hosted agent for build (in Azure DevOps) or  **whatever build system you are using where a provider gives you pre-configured machine to run your workflow.** Usually each build engine made possible for you to run your own agent and GitHub actions makes no difference ( you can read here about self installed action runners [https://help.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners](https://help.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners))

Since running your own agents requires some work, using available hosted agents is the best solution, but since the list of possible software is almost infinite, **you cannot blame Microsoft or other provider for not giving you some software preinstalled on build machines.** If you are using GitHub Actions, you can read the list of software pre-installed on GitHub action agents here: [https://github.com/actions/virtual-environments/blob/master/images/win/Windows2019-Readme.md](https://github.com/actions/virtual-environments/blob/master/images/win/Windows2019-Readme.md "https://github.com/actions/virtual-environments/blob/master/images/win/Windows2019-Readme.md") the list is quite big, but clearly is far for being enough if you need to run some sort of integration testing.

> It is quite standard for a complex project to require some software to be preinstalled in Build Agent, making difficult to use already available public agents

 **In my situation I needs to run tests against MongoDb and Microsoft SqlServer, both of them missing from GH actions images.** Luckily enough you have docker available, allowing you to run any pre-requisite that is available on a Docker Image.

In my specific situation I need to run the build in Windows and sadly enough there are no many Windows based container images like you have on Linux. In such scenario the solution is easy,  **just create your dockerfile based on Windows image and build your own images.** For Sql Server 2019  I was able to download dockerfile for Sql Server for windows Server 2016 and simply changing the base image to match Windows Server 2019 completes the trick. I did the very same with MongoDb, so I was able to build both Docker Images for Windows Server 2019 in mere minutes.

MongoDb and SqlServer images can be put on a public repository because it does not contains anything related to my software, but  **I want to be sure to being able to publish images to private repository because not every prerequisite can be really public. For this reason I opened a private Docker Registry on Azure**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image.png)

 ***Figure 1***: *My private registry on Azure*

Thanks to azure I was able to create a private registry with few clicks, now I can access repository using standard Azure Login, but  **if I need to do a standard Docker Login with UserName and Password I can use standard access keys to be used a username / password.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image-1.png)

 ***Figure 2***: *Access enabled to my registry thanks to standard username and Password*

While this is not the most secure way to access your registry, using secure UserName and Password allows you to easily access the registry directly from a GitHub Action.

The usual question now is: where do I store UserName and Password for this registry in a secure way to be used by GitHub actions? The answer is: repo secrets.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image-2.png)

 ***Figure 3***: *Secrets settings can be added to every repository to store sensitive data to be used by GitHub actions.*

Since only admins of the repository can create and manage secrets, you can ensure that no other than repo admin can read them. This is usually enough for secuirty but remember that, since you can use secret in GH Actions there is always the risk that someone that has access to the code can create an action to dump these secretes somewhere.

 **If secrets are secure enough, we can simply use a specific action to login to Azure Docker Registry using secrets stored in a GH Action.** {{< highlight bash "linenos=table,linenostart=1" >}}


    - uses: azure/docker-login@v1
      with:
        login-server: 'prxmdocker.azurecr.io' 
        username: '${{ secrets.azure_docker_user }}'
        password: '${{ secrets.azure_docker_token }}'

{{< / highlight >}}

As you can see no key is directly stored inside my source code, the build can safely access my secrets, but no standard user can access them directly looking at code.

Actually this level of security is enough for most users, in my situation I only have SqlServer and Mongo Db and this is more than enough security, but I need you to remember again that,  **anyone that can manipulate an Action, could possibly create / modify an action definition to send him / her secrets.** Once everything is in place and thanks to the [azure/docker-login@v1](mailto:azure/docker-login@v1) action, I can use all docker images that are present in my azure registry.

{{< highlight bash "linenos=table,linenostart=1" >}}


    - name: Start Docker for MSSSql
      run: docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=sqlPw3$secure' -e 'MSSQL_PID=Developer' -p 1433:1433 --name mssql -d prxmdocker.azurecr.io/sql-2019:1.0
    - name: Start Docker for Mongodb
      run: docker run -d -p 27017:27017 prxmdocker.azurecr.io/mongodb-2019:1.0

{{< / highlight >}}

As you can see I can simply ask to my action to start a Sql Server container and a MongoDb container using images taken from my private repository.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/02/image-3.png)

 ***Figure 4***: *GitHub action running using images from my private repository*

 **As you can see, accessing a private Docker Registry on Azure in a GitHub action is really simple, this allows you to automatically run pre-requisites for you actions with few lines of code.** The only drawback is that, for big images, like that one with Sql Server (it is more than 1.5 GB of size) downloading the image will require some times in the action. In my example downloading and running my custom Sql Server image requires 5 minutes.

Gian Maria
