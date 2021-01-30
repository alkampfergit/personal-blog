---
title: "Dotnetcore CI Linux and VSTS"
description: ""
date: 2017-09-30T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
If you have a  **dotnetcore project, it is a good idea to setup continuous integration on a Linux machine.** This will guarantee that the solution actually compiles correctly and all the tests run perfectly, even in  Linux environment. If you are 100% sure that, if a dotnetcore project runs fine under Windows it should run fine under Linux, you will have some interesting surprises. The first and trivial difference is that Linux filesystem is case sensitive.

> If you use dotnetcore, it is  always a good idea to immediately setup a Build against a Linux environment to ensure portability.

I’m starting creating a dedicated pool for Linux machines. Actually having a dedicated pool is not necessary, because the build can require Linux capability, but  **I’d like to start having all the Linux build agent in a single place for easier management.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-12.png)

 ***Figure 1***: *Create a pool dedicated to build agents running Linux operating system*

Pressing the button “download agent” you are prompted with a nice UI that explain in a really easy way how you should deploy your agent under your linux machine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-7.png)

 ***Figure 2***: *You can easily download the agent from VSTS / TFS web interface*

Instruction are detailed, and it is really easy to start your agent in this way: just running a configure shell script and then you can run the agent with another run.sh shell script.

There is also another interesting approach, you can give a shot to the  **official docker image that you can find here:** [**https://github.com/Microsoft/vsts-agent-docker**](https://github.com/Microsoft/vsts-agent-docker "https://github.com/Microsoft/vsts-agent-docker"). The only thing I need to do is running the docker image with the command.

{{< highlight bash "linenos=table,linenostart=1" >}}


sudo docker run   -e VSTS_ACCOUNT=prxm -d -e VSTS_TOKEN=my_PAT_TOKEN-e VSTS_AGENT='schismatrix' -e VSTS_POOL='Linux' -it microsoft/vsts-agent

{{< / highlight >}}

Please be patient on the first run **because the download can take a little bit, the docker image is pretty big, so you need to patiently wait for the download to finish**. Once the docker image is running, you should verify with sudo docker ps that the image is really running fine and you should check on the Agent Pool page if the agent is really connected. The drawback of this approach is that currently only Ubuntu is supported with Docker, but the situation will surely change in the future.

> Docker is surely the most simple way to run a VSTS / TFS linux build agent.

Another things to pay attention is running the image with the –d option, because whenever you create a new instance of vsts agent from the docker base image,  **the image will download the latest agent and this imply that you need to wait a decent amount of time before the agent is up and running,** especially if you, like me, are on a standard ADSL connection with max download speed of 5 Mbps.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-14.png)

 ***Figure 3***: *Without the –d option, the image will run interactively and you need to wait for the agent to be downloaded*

As you can see from the image, running a new docker instance starts from the base docker image, contacts the VSTS server and download and install the latest version of the agent.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image15_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image15.png)

 ***Figure 4***: *After the agent is downloaded the image automatically configure and run the agent and you are up and running.*

Only when the output of the docker image states Listening for Jobs the agent should be online and usable.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-16.png)

 ***Figure 5***: *Agent is alive and kicking*

Another interesting behavior is that, when you press CTRL+C to stop the interactive container instance, the docker image remove the agent from the server, avoiding the risk to left orphan registration in your VSTS Server.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-17.png)

 ***Figure 6***: *When you stop docker image, the agent is de-registered to avoid orphan agents registration.*

Please remember that, whenever you stop the container with CTRL+C, the container will stop, and when you will restart it, it will download again the VSTS agent.

This happens because, whenever the container stop and run again, it need to redownload everything that is not included in the state of the container itself. This is usually not a big problem, and I need to admit that this little nuance is overcome by the tremendous simplicity you have, **just run a container and you have your agent up and running, with latest version of dotnetcore (2.0) and other goodness.** The real only drawback of this approach, is that you have little control on what is available on the image. As an example, if you need to have some special software installed in the build machine, probably you need to fork the container and configure the docker machine for your need.

Once everything is up and running (docker or manual run.sh) just fire a build and watch it to be executed in your linux machine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-8.png)

 ***Figure 7***: *Build with tests executed in Linux machine.*

Gian Maria
