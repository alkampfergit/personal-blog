---
title: "Continuous Integration in GitHub Actions deploy in AzureDevops"
description: ""
date: 2020-04-04T05:00:37+02:00
draft: false
tags: [Azure Devops,Github]
categories: [GitHub]
---
My dear friend Matteo just published an [interesting article on integration between GitHub actions and Azure Devops Pipeline here](https://mattvsts.github.io/2020/04/03/CI-on-github-actions-CD-on-Azure-Pipelines/). I have a different scenario where [I’ve already published a GitHub release from a GitHub action](http://www.codewrecks.com/blog/index.php/2020/03/22/github-actions-plus-gitversion/), but I have nothing ready in GitHub to release in my machines.

> While GitHub is really fantastic for source code and starts having a good support for CI with Actions, in the release part it still miss a solution. Usually this is not a problem, because we have Azure DevOps or other products that can fill the gap.

This specific project is a firewall that closes every port in a machine and listen on UDP ports for a specific message to open other ports, thus, a machine where the service is installed has no way to be contacted unless you use the appropriate client to ask for port opening.  **I want the deploy to be automatic, no way I’m going to all my machines, login in RDP and then update the service, everything should happen automatically.** The really nice aspect of Azure DevOps release pipelines, is that, once you installed agents in one or more machines, those machines will contact Azure DevOps and  **pull works to do** without the need for the machine to be contacted from outside world.

> This is a key point of Azure DevOps release pipeline, you do not need to have any special setup in deploy target, you should simply let the target to be able to contact Azure DevOps site ([https://dev.azure.com](https://dev.azure.com)).

Another nice aspect of Azure DevOps release pipeline, is that it can use many sources for artifacts, not only those produced by Azure DevOps CI pipeline. When you add an artifacts, you can choose a GitHub release as well as Jenkins and other CI providers like Azure Artifacts ([check Matteo’s article to see how to publish in azure artifacts from a GitHub Action](https://mattvsts.github.io/2020/04/03/CI-on-github-actions-CD-on-Azure-Pipelines/))

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image.png)

 ***Figure 1***: *Choose GitHub release as artifact source*

To use GitHub as source you should have already connected your azure DevOps to GitHub with a service connection, another cool feature of Azure DevOps. **As an administrator you can connect Azure DevOps account to GitHub, then give permission to specific people to use that service connection, without requiring them to know the real credentials to connect to the service (Github in this example).** Once you have one or more connection active you can simply choose the repository to use. In  **Figure 2** You can see the configuration I choose for my project.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-1.png)

 ***Figure 2***: *Configure GitHub release as artifact source.*

Settings are: Repository (1), default version of the release to use (2) and finally alias you use for that specific artifact in your release (3). Remember that a release can have more than a single artifact as source, if you have a simple project like this, probably you have a single artifact.

 **Now you have the full power of Azure DevOps pipeline at your fingertips** , in this specific example I just need to deploy a Windows Service and this is the pipeline to release in my stages.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-2.png)

 ***Figure 3***: *Release pipeline for a Windows Service*

This is a standard  four phase for a service release, first step is needed to stop the service if it is running, then I extract the artifacts coming from GitHub as 7zipped files, then I overwrite the directory where I’ve installed the service and finally I install the service if needed and restart it.

 **Before launching the release, you need to be sure that you have at least one release associated to that repository** , in this example I have release 0.4.1 and others available.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-3.png)

 ***Figure 4***: *Available releases for my GitHub repository*

When you create a release (if the release is launched manually) you can choose GitHub release you want to use (if the release is automatic it will use release configured in the artifact configuration, usually latest one),  **the connection is done by Azure DevOps for you, no need to know credentials of GitHub, just choose the version you want to install** and Bam, you are ready.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-4.png)

 ***Figure 5***: *Choose the release you want to use directly from Azure DevOps*

When the release starts,  **your target will download the workflow, it will instruct the agent to download artifacts from GitHub** and then your scripts will run releasing the software.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-5.png)

 ***Figure 6***: *Release completed, version 0.4.1 is now released on my machines.*

As you can verify from detail page, artifacts are indeed downloaded by a GitHub standard release.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-6.png)

 ***Figure 7***: *Artifacts downloaded directly from GitHub.*

If everything runs successfully, you will have the new version installed on all machines part of deployment group used.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-7.png)

 ***Figure 8***: *All steps executed successfully.*

As you can see, Azure DevOps has a real powerful way to connect other services like GitHub and this is ideal to compensate the gap that other tools has at the moment. This leaves **you free to compose your tooling chain, using the service that is best for the specific part**.

Gian Maria.
