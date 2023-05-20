---
title: "Is Manual Release in Azure DevOps useful"
description: ""
date: 2019-02-08T18:00:37+02:00
draft: false
tags: ["ContinuousDeployment"]
categories: [Azure DevOps]
---
When people creates a release in AzureDevOps, they  **primarily focus on how to make the release automatic** , but to be 100% honest, automation in only one side of the release, and probably not the more useful.

First of all  **Release is about auditing and understand which version of the software is released where and by whom**. In this scenario what is more important is “how I can deploy my software in production”.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-5.png)

 ***Figure 1***: *Simple release composed by two steps.*

In  **Figure 1** I created a simple release with two stages, this will clearly states that to go to production I need to deploy on a Test Machine stage, then Deploy to production. I do not want to give you a full tutorial, MSDN is full of nice example, but if you look at the picture, you can notice small user icons before each stage, that allows you to specify who can approve a release in that stage or if the release should start automatically.

> What is more important when you plan the release, is not how you can automate the deployment, but how to structure release flow: stages, people, etc.

As I strongly suggests,  **even if you do not have any idea on how to automate the release, you MUST have at least a release document, that contains detailed instruction on how to install the software.** When you have a release document, you can simply add that document to source control and create a release definition completely manual.

If the release document is included in the source control, you can simply store as result of build artifacts, then it will be automatically downloaded and you can simply create a release like this. In  **Figure 2** you can see a typical two phase release for stages defined in  **Figure 1.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-6.png)

 ***Figure 2***: *A manual release uses a copy file to copy artifacts to a well known location then a manual step.*

I usually have an agent based phase because I want to copy artifacts data from the agent directory to a well known directory. Agent directory is clumsy, and can be deleted by cleanup so I want my release files to be copied in a folder like c:\release ( **Figure 3** )

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-7.png)

 ***Figure 3***: *The only automatic task is copying all the artifacts to c:\release folder*

After this copy, I have another phase, this time it is agentless, because it has only a  **Manual deploy action** ,  **that simply specify to the user where to find the instruction for manual deploy.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-8.png)

 ***Figure 4***: *Manual step in the release process*

This is important because as you can see in  **Figure 4** I can instruct the user on where to find release document (it is in source code, the build add to the artifact, and finally it is copied in the release folder). Another important aspect is the ability to notify specific user to perform manual task.

> Having a manual release document stored in source code allows you to evolve the file along with the code. Each code version has correct release document.

 **Since I use GitVersion to change name of the build based on GitVersion tags I prefer going to the Options tab of the release and change the name of the release**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-10.png)

 ***Figure 5***: *Configure release name format to include BuildNumber*

Release usually have a simple increasing number $(Rev:rr),  **but having something like Release-34 as release name does not tell me anything useful**. If you are curious on what you can use in the Release Name Format field, you can simply check [official documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/?view=azure-devops). From that document you read that you can use BuildNumber, that will contain build number of first artifact of the build.  **In my opinion this is a real useful information if the build name contains GitVerison tags, it allows you to have a meaningful release name.** [![SNAGHTML25af5e9](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/SNAGHTML25af5e9_thumb.png "SNAGHTML25af5e9")](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/SNAGHTML25af5e9.png)

 ***Figure 6***: *New release naming in action.*

If you look at  **Figure 6** you can argue that build name is visible below release number, so the new numbering method (1) does not add information respect the standard numbering with only increase number (2).

 **This is true until you do not move to the deployment group or in other UI of Release Management, because there are many places where you can see only release Name.** If you look at  **Figure 7** you can verify that with the old numbering system I see the release number for each machine, and for machine (1) I know that the latest release is Release 16, while for a machine where I release after numbering change I got Release – 34 – JarvisPackage 4.15.11

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-11.png)

 ***Figure 7***: *Deployment groups with release names*

Thanks to release file definition and Azure DevOps release management, I have a controlled environment where I can know who started a release, which are the artifact deployed to each environment and who perform manual deploy.

> Having a release definition completely manual is a great starting point, because it states what, who and how your software must be deployed, and will log every release, who started it, who performed manual  release, who approved release for every stage, etc.

Once everything works, I usually start writing automation script to automate steps of the release document. Each time a step is automated, I remove it from the deploy document or mark explicitly as “not to do because it is automated”.

Happy DevOps.
