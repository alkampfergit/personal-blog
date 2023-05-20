---
title: "Converting Existing pipeline to YAML how to avoid double builds"
description: ""
date: 2019-05-04T05:00:37+02:00
draft: false
tags: [Continuous Integration, AzureDevops]
categories: [Azure DevOps]
---
Actually YAML build is the preferred way to create Azure DevOps Build Pipeline and  **converting existing build is really simple thanks to the “View YAML” button that can simply convert every existing pipeline in a YAML definition.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb-12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image-12.png)

 **figure 1:** *Converting existing Pipeline in YAML is easy with the View YAML button present in editor page.*

The usual process is, start a new feature branch to test pipeline conversion to YAML, create the YAML file and a Pipeline based on it, then start testing. Now a problem arise:  **until the YAML definition is not merged in ANY branch of your Git repository, you should keep the old UI Based Build and the new YAML build togheter.** What happens if a customer calls you because it has a bug in an old version, you create a support branch and then realize that in that branch the YAML build definition is not present. What if the actual YAML script is not valid for that code?  **The obvious solution is to keep the old build around until you are 100% sure that the build is not needed anymore.** >  **During conversion from legacy build to YAML it is wise to keep the old build around for a while.** This usually means that you start to  **gradually remove triggers for branches until you merge all the way to master or the last branch** , then you leave the definition around without trigger for a little while, finally you delete it.

The real problem is that usually there is a transition phase where you want both the old pipeline definition to run in parallel with the YAML one, but this will create a trigger for both the build at each publish.

[![SNAGHTML64e597](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/SNAGHTML64e597_thumb.png "SNAGHTML64e597")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/SNAGHTML64e597.png)

 ***Figure 2***: *After a push both build, the old UI Based and the new based on YAML were triggered.*

From  **figure 2** you can understand the problem: each time I push, I have two build that were spinned. Clearly you can start setting up triggers for build to handle this situation, but it is usually tedious.

> The very best situation would be, trigger the right build based on the fact that the YAML definition file is present or not.

A viable solution is:  **abort the standard build if the corresponding YAML Build file is present in the source.** This will perfectly work until YAML build file reach the last active branch, after that moment you can disable the trigger on the original Task based build or completely delete the build because all the relevant branches have now the new YAML definition.

To accomplish this, you can simple add a PowerShell Task in the original build, with a script that checks if the YAML file exists and if the test is positive aborts current build. Luckly enough I’ve found a script ready to use: [Many tanks for the original author of the script](https://blog.lextudio.com/how-to-abort-cancel-a-build-in-vsts-7a41fce5a42c). You can find the original script in [GitHub](https://github.com/lextm/vstsabort) and you can simply take the relevant part putting inside a standard PowerShell task.

[![SNAGHTMLb575bc](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/SNAGHTMLb575bc_thumb.png "SNAGHTMLb575bc")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/SNAGHTMLb575bc.png)

 ***Figure 3***: *Powershell inline task to simply abort the build.*

The script is supposed to work if you have a variable called Token where you place a Personal Access Token with sufficient permission to cancel the build, as explained in the original project on [GitHub](https://github.com/lextm/vstsabort).

Here is my version of the script

{{< highlight powershell "linenos=table,linenostart=1" >}}


if (Test-Path Assets/Builds/BaseCi.yaml) 
{
    Write-Host "Abort the build because corresponding YAML build file is present"
    $url = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis/build/builds/$($env:BUILD_BUILDID)?api-version=2.0"
    $pat = "$(token)" 
    $pair = ":${pat}"
    $b  = [System.Text.Encoding]::UTF8.GetBytes($pair)
    $token = [System.Convert]::ToBase64String($b)
    $body = @{ 'status'='Cancelling' } | ConvertTo-Json
    $pipeline = Invoke-RestMethod -Uri $url -Method Patch -Body $body -Headers @{
        'Authorization' = "Basic $token";
        'Content-Type' = "application/json"
    }
    Write-Host "Pipeline = $($pipeline)"
}
else
{
   write-host "YAML Build is not present, we can continue"
}

{{< / highlight >}}

This is everything you need, after this script is added to the original build definition, you can try to  **queue a build for a branch that has the YAML build definition on it and wait for the execution to be automatically canceled** , as you can see in Figure 4:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb-13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image-13.png)

 ***Figure 4***: *Build cancelled because YAML definition file is present.*

With this workaround we still have double builds triggered, but at least when the branch contains the YAML file, the original build definition will imeediately cancel after check-out, because it knows that a corresponding YAML build was triggered. If the YAML file is not present, the build runs just fine.

This is especially useful because it avoid human error,  **say that a developer manually trigger the old build to create a release or to verify something, if he trigger the old build on a branch that has the new YAML definition, the build will be automatically aborted, so the developer can trigger the right definition.** Gian Maria.
