---
title: "Dump all environment variables during a TFS  VSTS Build"
description: ""
date: 2017-08-04T19:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Azure DevOps,Visual Studio ALM]
---
Environment variables are really important during a build, especially because all Build variables are stored as environment variables, and this imply that  **most of the build context is stored inside them**. One of the feature I miss most, is the ability to easily visualize on the result of the build a nice list of all the values of Environment variables. We need also to be aware of the fact that tasks can change environment variables during the build, so we need to be able to decide the exact point of the build where we want variables to be dumped.

> Having a list of all Environment Variables value of the agent during the build is an invaluable feature.

Before moving to writing a VSTS / TFS tasks to accomplish this, I verify how I can obtain this result with a simple Powershell task (then converting into a script will be an easy task). It turns out that the solution is really really simple,  **just drop a PowerShell task wherever you want in the build definition and choose to run this piece of PowerShell code**.

{{< highlight powershell "linenos=table,linenostart=1" >}}


$var = (gci env:*).GetEnumerator() | Sort-Object Name
$out = ""
Foreach ($v in $var) {$out = $out + "`t{0,-28} = {1,-28}`n" -f $v.Name, $v.Value}

write-output "dump variables on $env:BUILD_ARTIFACTSTAGINGDIRECTORY\test.md"
$fileName = "$env:BUILD_ARTIFACTSTAGINGDIRECTORY\test.md"
set-content $fileName $out

write-output "##vso[task.addattachment type=Distributedtask.Core.Summary;name=Environment Variables;]$fileName"

{{< / highlight >}}

This script is super simple, with the gci (Get-ChildItem) cmdlets I can grab a reference to all EnvironmentVariables that are then sorted by name. Then I create a variable called $out and I iterate in all variables to fill $out variable with a markdown text that dump all variables. If you are interested, the `t syntax is used in powershell to create special char, like a tab char.  **Basically I’m dumping each variable in a different line that begins with tab (code formatting in markdown), aligning with 28 chars to have a nice formatting**.

> VSTS / TFS build system allows to upload a simple markdown file to the build detail if you want to add information to your build

Given this I create a test.md file in the artifact directory where I dump the entire content of the $out variable, and  **finally with the task.addattachment command I upload that file to the build**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image.png)

 ***Figure 1***: *Simple PowerShell task to execute inline script to dump Environment Variables*

After the build ran, here is the detail page of the build, where you can see a nice and formatted list of all environment variables of that build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-1.png)

 ***Figure 2***: *Nice formatted list of environment variables in my build details.*

Gian Maria.
