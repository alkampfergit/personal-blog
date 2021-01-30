---
title: "Publish a website available only in some branches with VSTS build"
description: ""
date: 2017-07-03T16:00:37+02:00
draft: false
tags: [build,PowerShell,VSTS]
categories: [Team Foundation Server]
---
I have several builds that publish some web projects using standard msbuild task. Here is a sample configuration.

[![Simple image that shows the configuration of a Msbuild Task used to publish a web project.](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb.png "Publishing a web site with msbuild task.")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image.png)

 ***Figure 1***: *Publishing a web site with msbuild task.*

This is super simple thanks to MsBuild task and a bit of MSBuild arguments, but quite often I face an annoying problem:  **what about a new project that lives only on certain branches, but I need to publish in the build only if exists?** >  **Sometimes you need to execute some task in a build only if a file exists on disk (ex: a csproj file)** Suppose this new Jarvis.Catalog.Web project exists today in a feature called feature/xyz, then the feature will be closed to develop in the future then will be merged to a release branch and finally on master branch. This poses a problem,  **the MsBuild task to publish the web project will fail for every branch where that specific web project still does not exists.** This is super annoying because you can set the build not to fail if this specific task failed, but this will mistakenly mark all build as partially succeeded only because that project still is not on that branch.

Thanks to the conditional execution of VSTS it is simple to configure the task to execute only on specific condition, as an example  **run the task only if the build is triggered against feature/xyz branch**.

[![This image shows the conditional execution for the task, everything is explained in the text of the post)](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-1.png "Conditional execution for tasks")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-1.png)

 ***Figure 2***: *Conditional execution for tasks*

This is not really a good solution, because there is still the need to edit the build, including branches to include after merges.  **When the feature/xyz will be merged back to develop, the build should be updated to run the task in develop branch, or feature branch.** > The need to edit the conditional execution of the Task after the solution is “promoted” from branch to branch is annoying and error prone.

The real solution is:  **run the task only if the project file exists on disk,** but this is a condition that is not present in the base set. The reason is: to solve this problem correctly the build should first run a Task that check if the file is on disk, that task should set a build variable and finally the MsBuild task should execute conditionally on that build variable.

To simplify this scenario lets use the new PowerShell task, that now has the option to run a simple script defined in the build. Here is the definition of this PowerShell task, that  **should be placed before the MSBuild task that is going to build the project**.

[![Simple PowerShell tasks to executing an inline script](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-2.png "Simple PowerShell tasks to executing an inline script")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-2.png)

 ***Figure 3***: *Simple PowerShell tasks to executing an inline script*

 **The script is really simple, it just uses Test-Path cmdlet to verify if the file of the project exists on disk.** Here is the whole script:

{{< highlight powershell "linenos=table,linenostart=1" >}}


# You can write your powershell scripts inline here. 
# You can also pass predefined and custom variables to this scripts using arguments
$CatalogWebExists = Test-Path src\Catalog\Jarvis.Catalog.Web\Jarvis.Catalog.Web.csproj
write-host "##vso[task.setvariable variable=CatalogWebExists;]$CatalogWebExists"
write-host "CatalogWebExists=$CatalogWebExists"

{{< / highlight >}}

 **Thanks to the ##vso directive, the task can set a variable of the build called CatalogWebExists and the cool part is that that variable is created if not defined in the build definition.** The above example shows you how you can create a PowerShell tasks that change the value or creates a variable in the build.

After this script ran, we have a new CatalogWebExists build variable that has the value true if the file of the project exists. This allows to a better conditional expression for the MsBuild task.

{{< highlight powershell "linenos=table,linenostart=1" >}}


and(succeeded(), eq(variables['CatalogWebExists'], 'true'))

{{< / highlight >}}

This condition is really what we need, because it runs the task only if the build is successful and if the CatalogWebExists variable is equal to true.  **Thanks to a simple PowerShell script I can conditionally executes a task with a condition determined by the script.** > Thanks to inline PowerShell scripts is really simple to execute a task with a condition evaluated by a PowerShell script.

In this example I’m able to run a script if a file exists, but you are not limited to this scenario.

Gian Maria.
