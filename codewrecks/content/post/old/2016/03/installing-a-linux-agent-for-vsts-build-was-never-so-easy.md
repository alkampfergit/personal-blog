---
title: "Installing a linux Agent for VSTS build was never so easy"
description: ""
date: 2016-03-30T16:00:37+02:00
draft: false
tags: [build,vNext,VSTS]
categories: [Azure DevOps]
---
If you installed Linux Agents for VSTS vNext build in the past, you already know that it was a simple experience, especially because  **the agent was installed with npm** , so it is a matter of a couple of commands.

The agent is undergoing a substantial change, and in GitHub there is a project about [VSTS Cross Platform Agent (CoreCLR)](https://github.com/Microsoft/vsts-agent/blob/master/README.md),  **a new version of the agent, entirely written in CoreCLR that will substitute the closed source Windows agent and the actual XPlat agent**. This version of the agent is still work-in-progress, and we can expect a preview for OSX and Linux in the next month. Until now, to run vNext build on linux, you should use the [XPlat Agent](https://github.com/Microsoft/vso-agent/blob/master/docs/vsts.md).

 **Installing the actual xpPlat agent is really simple** , just create a folder where you want to install the agent, open a bash in that folder and then issue the command

{{< highlight csharp "linenos=table,linenostart=1" >}}
curl -skSL http://aka.ms/xplatagent | bash{{< / highlight >}}

This will download an install script, and  **does everything for you, installing prerequisite, downloading and installing everything**. At the end of the script you should only execute

{{< highlight csharp "linenos=table,linenostart=1" >}}
./run.sh{{< / highlight >}}

To start configuration of the agent. The official guide suggest you to use Personal Access Token, but standard alternate credentials are fine, if the user is part of the Agent Pool Administrators and Agent Pool Service Account.

 **Once everything is configured, the agent is ready to run your builds**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/03/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/03/image-2.png)

 ***Figure 1***: *Agents configured and running on Linux CentOS machine*

Gian Maria.
