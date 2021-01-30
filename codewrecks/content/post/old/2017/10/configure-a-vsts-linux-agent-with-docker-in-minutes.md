---
title: "Configure a VSTS Linux agent with docker in minutes"
description: ""
date: 2017-10-14T14:00:37+02:00
draft: false
tags: [build,linux,VSTS]
categories: [Azure DevOps,Visual Studio ALM]
---
It is really simple to create a build agent for VSTS that runs in Linux and is capable of building and packaging your DotNetCore project, I’ve explained everything in [a previous post](http://www.codewrecks.com/blog/index.php/2017/09/30/dotnetcore-ci-linux-and-vsts/), but I want to remind you that, with docker, the whole process is really simple.

 **Anyone knows that setting up a build machine often takes time.** VSTS makes it super simple to install the Agent , just download a zip, call a script to configure the agent and the game is done. But this is only one side of the story. Once the agent is up, if you fire a build, it will fail if you did not install all the tools to compile your project (.NET Framework) and often you need to install the whole Visual Studio environment because you have specific dependencies. I have also code that needs MongoDB and Sql Server to run tests against those two databases, this will usually require more manual work to setup everything.

> In this situation Docker is your lifesaver, because it allowed me to setup a build agent in linux in less than one minute.

Here are the steps: first of all unit tests use an Environment Variable to grab the connection string to Mongodb, MsSql and every external service they need. This is a key part, because  **each build agent can setup those environment variable to point to the right server.** You can think that 99% of the time the connection are something like mongodb://localhost:27017/, because the build agent usually have mongodb installed locally to speedup the tests, but you cannot be sure so it is better to leave to each agent the ability to change those variables.

With this prerequisite, I installed a simple Ubuntu machine and then install Docker. Once Docker is up and running I just fire up three Docker environment, first one is the mongo database

{{< highlight bash "linenos=table,linenostart=1" >}}


sudo docker run -d -p 27017:27017 --restart unless-stopped --name mongommapv1 mongo

{{< / highlight >}}

Than, thanks to Microsoft, I can run Sql Server in linux in a container, here is the second Docker container to run MSSQL

{{< highlight bash "linenos=table,linenostart=1" >}}


sudo docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=my_password' -p 1433:1433 --name msssql --restart=unless-stopped -d microsoft/mssql-server-linux

{{< / highlight >}}

This will start a container with Microsoft Sql Server, listening on standard port 1433 and with sa user and password my\_password. Finally I start the docker agent for VSTS

{{< highlight bash "linenos=table,linenostart=1" >}}


sudo docker run \
  -e VSTS_ACCOUNT=prxm \
  -e VSTS_TOKEN=xxx\
  -e TEST_MONGODB=mongodb://172.17.0.1 \
  -e TEST_MSSQL='Server=172.17.0.1;user id=sa;password=my_password' \
  -e VSTS_AGENT='schismatrix' \
  -e VSTS_POOL=linux \
  --restart unless-stopped \
  --name vsts-agent-prxm \
  -it microsoft/vsts-agent

{{< / highlight >}}

 **Thanks to the –e option I can specify any environment variable I want, this allows me to specify TEST\_MSSQL and TEST\_MONGODB variables for the third docker container, the VSTS Agent**. The ip of mongodb and MSSql are on a special interface called docker0, that is a virtual network interfaces shared by docker containers.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-3.png)

 ***Figure 1***: *configuration of docker0 interface on the host machine*

 **Since I’ve configured the container to bridge mongo and SQL port on the same port of the host, I can access MongoDB and MSSQL directly using the docker0 interface ip address of the host.** You can use docker inspect to know the exact ip of the docker container on this subnet but you can just use the ip of the host.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-4.png)

 ***Figure 2***: *Connecting to mongodb instance*

> With just three lines of code my agent is up and running and is capable of executing build that require external databases engine to verify the code.

This is the perfect technique to spinup a new build server in minutes (except the time needed for my network to download Docker images :) ) with few lines of code and on a  **machine that has no UI (clearly you want to do a minimum linux installation to have only the thing you need).** Gian Maria.
