---
title: "Windows Docker Container for Azure Devops Build agent"
description: ""
date: 2020-01-25T11:00:37+02:00
draft: false
tags: [devops,Docker]
categories: [Azure DevOps]
---
Thanks to Docker Compose, [I can spin off an agent for Azure Devops in mere seconds](http://www.codewrecks.com/blog/index.php/2019/12/27/azure-devops-agent-with-docker-compose/) (once you have all the images). Everything I need is just insert the address of my account a valid token and an agent is ready.

 **With.NET core everything is simple, because we have a nice build task that automatically install.NET Core SDK in the agent,** the very same for node.js. This approach is really nice, because it does not require to preinstall too much stuff in your agent, everything is downloaded and installed on the fly when a build needs that specific tooling.

>.NET core Node.Js and other SDK can be installed directly from build definition, without any requirement on the machine where the agent is running

In my projects I need also to build solution based on Full Framework SDK and clearly I want to use the very same Docker approach for Agents. Everything I need is a machine with Windows Server2019 with docker enabled and looking in the internet for needed Dockerfile or pre build images on public registry.

 **I’ve started with a nice article that explain how to** [**install Build Tools inside a container**](https://docs.microsoft.com/en-us/visualstudio/install/build-tools-container?view=vs-2019) **.** This articles gives you a dockerfile that basically is doing everything, just docker build and the container is ready to be used.

The only real modification I need is excluding most of the packages I’m not using in my project; I’ve also changed base image to use.NET Framework 4.8 and not 4.7.2.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-13.png)

 ***Figure 1***: *RUN instruction to install build tools inside a Docker Image.*

Be prepared to wait a litlle bit for the image to be built, because it downloads all the packages from network and then install into the machine. To build the container image from dockerfile you can simply type.

docker build -t buildtools2019:1.0 -m 4GB.

Now I need to modify my Azure Devops Agent dockerfile built [following MSDN instructions](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/docker?view=azure-devops)  and change base image to  **FROM buildtools2019:1.0** this will base the agent image on the new image built with all.NET sdk for full framework and all build tools. With this image the agent can build Full Framework projects.

> Creating a Docker Images with all needed tools for full framework SDK was really easy.

 **The other challenge on creating your build agent in Docker is having all the requirements in other docker images** , for SQL Server I’ve rebuild the container on top of Windows Server Core 2019 image and it runs just fine, for MongoDb I’ve enabled experimental feature to mix Linux and Windows container so I’ve used a Linux based mongodb image with no problem.

My only remaining dependency was ElasticSearch, because I’m using an old version, 2.4 and I’d like to have that image running in Windows Container. **It is not difficult to find some nice guy that published dockerfile for Elasticsearch, here** [**https://github.com/StefanScherer/dockerfiles-windows**](https://github.com/StefanScherer/dockerfiles-windows "https://github.com/StefanScherer/dockerfiles-windows") you can find lots of interesting images for Windows. In my situation I only need Elasticsearch, so I’ve gotten the image, modified to install the version I need and the game is done.

Now I need to have some specific plugins installed in Elasticsearch for my integration tests to run; these situations are the ones where Docker shows its full powers. Since I’ve already an image with elasticsearch, I only need to create a DockerFile based on that image that install required plugin.

{{< highlight bash "linenos=table,linenostart=1" >}}


FROM elasticsearch_custom:2.4.6.1

RUN "C:\elasticsearch\bin\plugin.bat" install delete-by-query

{{< / highlight >}}

Wow, just two lines of code launch docker build command and I have my ElasticSearch machine ready to be used.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-14.png)

 ***Figure 2***: *All my images ready to be used in a Docker compose file*

Now everything you need to do is create the docker compose file, here is an example

{{< highlight bash "linenos=table,linenostart=1" >}}


version: '2.4'

services:
  agent:
    image: azdoagent:1.0
    environment:
      - AZP_TOKEN=****q
      - AZP_POOL=docker
      - AZP_AGENT_NAME=TestAlkampfer
      - AZP_URL=https://dev.azure.com/prxm
      - NSTORE_MONGODB=mongodb://mongo/nstoretest
      - NSTORE_MSSQL=Server=mssql;user id=sa;password=sqlPw3$secure
      - TEST_MONGODB=mongodb://mongo/
      - TEST_ES=http://es:9200

  mssql:
    image: mssqlon2019:latest
    environment:
      - sa_password=sqlPw3$secure
      - ACCEPT_EULA=Y
    ports:
      - "1433:1433"

  mongo:
    platform: linux
    image: mongo
    ports:
      - "27017:27017"

  es:
    image: elasticsearch_jarvis:1.0
    ports: 
      - "9200:9200"

{{< / highlight >}}

Once the file is ready just start an agent with

*docker-compose -f docker-compose.jarvis.yml  up –d*

and your agent is up and running.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-15.png)

 ***Figure 3***: *All docker images up and running*

 **Then I go to my C# project and included all the docker file needed to create images as well as docker compose file directly in source repository.** This allows everyone to locally build docker image and spin out an agent with all the dependency needed to build the project.

 **If your organization uses azure or any other container registry (you can also push to a public registry because all these images does not contains sensitive data) spinning the agent is only a matter of starting docker composer instance.** After a couple of minutes (the time needed by azure devops agent to download everything and configure itself) my builds start running.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-16.png)

 ***Figure 4***: *A build running a Full Framework solution with integration tests on MongoDB and Elasticsearch is running in my docker container.*

From now on, every time I need to have another agent to build my project, I can simply spin out another docker-compose instance and in less than one minute I have another agent up and running.

Gian Maria.
