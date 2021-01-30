---
title: "Hosted Agents plus Docker perfect match for Azure DevOps and Open source Project"
description: ""
date: 2019-06-10T20:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
If you want to build an OpenSource project with Azure DevOps,  **you can open a free account and you have 10 concurrent pipelines with free agents to build your project, yes, completely free**. The only problem you have in this scenario is that, sometimes, you need some prerequisites installed on the build machine, like MongoDb and they are missing on hosted build.

Lets take as use case [NStore](https://github.com/ProximoSrl/NStore), an open source library for Event Sourcing in C# that needs to run unit test against MongoDb and SqlServer, prerequisites that are not present in Linux Hosted Agents. Before giving up using Hosted Agents and start deploying private agents,  **you need to know that Docker is up and running in Hosted Agents and it can be used to have your missing prerequisites**.

> Thanks to docker you can simply have prerequisites for your build to run in an Hosted Environment

Having docker preinstalled on Hosted Buil Agent gives you a tremendous power, combined with Docker Task. If I want to run a build on Linux Hosted agent of NStore, here is a possible build that runs perfectly fine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image.png)

 ***Figure 1***: *Simple build definition that starts a MongoDb and Sql Server instance with Docker before actually running th ebuild.*

If you examine the very first task it is amazing how simple it is to start a MsSql instance running on your Linux box.  **At the end of Task execution you have a fully functional container running in Hosted Agent**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image-1.png)

 ***Figure 2***: *Running MsSql as a container in Linux*

You just need to remember to redirect the port (-p 1433:1433) so that you can access SqlServer instance and the game is done.

Task number 2 uses the very same technique to run a MongoDB instance inside another docker container instance then Task 3 is a simple Docker Ps command, just to verify that the two container are running correctly. As you can see from  **Figure 3** , it is quite useful to know if the container really started correctly.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image-2.png)

 ***Figure 3***: *Ps command allows for simple dump of all containers running in the machine*

You can log every container output,  **in Task number 4 I’m just running a logs command for the MsSql container, just to verify, in case MsSql test are all failing, why the container did not started** (like you forgot the ACCEPT\_EULA, or you choose a password not enough complex.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image-3.png)

 ***Figure 4***: *Logging output of container to troubleshoot them.*

Remember that if the container does not start correctly your build will have tons of failing tests, so  **you really need a way to quick understand if tests are really failing or your container instance simply did not start (and the reason why it failed)** All subsequent tasks are standard for a.NET Core project, just dotnet restore, build and test your solution, and upload test results in the build result, so you can have a nice result of all of your tests.

> It is almost impossible to pretend that someone gives you a build agent with Everything you can possibly need, but if you give to the user Docker support, life is really easier.

Finally, to make everything flexible, you should grab connection strings for Tests from environment variables. NStore uses a couple of Environment Variable called NSTORE\_MONGODB and NSTORE\_MSSQL to specify connection strings used for test. I really want you to remember that all Variables of a build are copied to Environment Variables during the build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image-4.png)

 ***Figure 5***: *Configuration of test connection strings are directly stored in Build Variables.*

As you can see from  **Figure 5** I used a MongoDb without password (this is a instance in docker that will be destroyed after the build, so it is acceptable to run without a password) but you can usually configure Docker Instances with start parameters. In that example I gave SQL Server a strong password (it is required for the container to start).

 **Remember, if you have an open source project, you can build for free with Azure DevOps pipelines with minimum effort and before giving away using Hosted Agents, just verify if you can have what you miss with Docker.** Gian Maria.
