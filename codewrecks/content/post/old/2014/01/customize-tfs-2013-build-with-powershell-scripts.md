---
title: "Versioning assembly during TFS 2013 build with Powershell Scripts"
description: ""
date: 2014-01-11T15:00:37+02:00
draft: false
tags: [TfsBuild]
categories: [Team Foundation Server,Visual Studio ALM]
---
One of the most important  **news in TFS Build 2010 is the introduction of Workflow Foundation** that replaced standard MSBuild scripts used in TFS 2008. Workflow foundation can be really powerful, but indeed it is somewhat scaring and quite often  **customizing a build can be complex**.

You can find some blog post of mine on the subject:

- [Writing a Custom Activity for TFS 2010 Builds](http://www.codewrecks.com/blog/index.php/2010/02/25/writing-a-custom-activity-for-tfs-2010-build-workflow/)
- [Run Test With TypeMock isolator in TFS 2010 Build](http://www.codewrecks.com/blog/index.php/2010/01/27/run-test-with-typemockisolator-during-a-tfs2010-build/)
- [Wrap a MsBuild Custom task inside a custom Action](http://www.codewrecks.com/blog/index.php/2010/01/19/wrap-a-msbuild-custom-task-inside-a-custom-action/)

Years are passed, but  **I still see people scared when it is time to customize the build** , especially because the Workflow can be a little bit intimidating. In TFS2013 the build is still managed by Workflow Foundation, but the new workflow basic template now supports simply customization with scripts.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/01/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/01/image2.png)

 ***Figure 1***: *Pre-build script configured in the build.*

If you look at previous image I’ve setup a simple script to manage assembly versioning and I’ve configured it to run Before the Build, I specified version number thanks to script arguments:  **-assemblyVersion 1.2.0.0 -fileAssemblyVersion 1.2.J.B**. The notation J and B is taken from a nice tool called [Tfs Versioning](http://tfsversioning.codeplex.com/); it is used to manage versioning of assembly with a Custom Action. If you ever used that tool since the beginning (Tfs 2010) you probably discovered that **managing build customization with Custom Action is not so easy**. Setting up Tfs Versioning tools is super easy if you simply use workflow included in the release, but if you already have a customized workflow, you need to modify the Workflow adding the Custom Activity in the right place with the right parameters.

When **you move to TFS 2012 and then to 2012, you need to download the source of the tool and recompile against latest version of build assemblies** , then you need to modify the workflow again. This is one of the most annoying problem of Custom Actions, you need to recompile again when you upgrade build servers to new version of TFS.

A script solution is surely more reusable, so I’ve decided to create a little  **script in Powershell to modify all assemblyinfo.cs files before the build**. I’m not a Powershell expert and my solution is not surely optimal, but is a simple proof of concept on how simple is to accomplish build versioning with a script instead of direct customization of the workflow with custom actions.

To have reusable code I’ve create a  **script called BuildFunctions.psm1 that contains all functions that can be useful during the build**. Here it is the function that takes care of versioning for C# projects.

{{< highlight powershell "linenos=table,linenostart=1" >}}


function Update-SourceVersion
{
  Param 
  (
    [string]$SrcPath,
    [string]$assemblyVersion, 
    [string]$fileAssemblyVersion
  )
    $buildNumber = $env:TF_BUILD_BUILDNUMBER
    if ($buildNumber -eq $null)
    {
        $buildIncrementalNumber = 0
    }
    else
    {
        $splitted = $buildNumber.Split('.')
        $buildIncrementalNumber = $splitted[$splitted.Length - 1]
    }
    if ($fileAssemblyVersion -eq "")
    {
        $fileAssemblyVersion = $assemblyVersion
    }
    Write-Host "Executing Update-SourceVersion in path $SrcPath, Version is $assemblyVersion and File Version is $fileAssemblyVersion"
    $AllVersionFiles = Get-ChildItem $SrcPath AssemblyInfo.cs -recurse
    $jdate = Get-JulianDate
    $assemblyVersion = $assemblyVersion.Replace("J", $jdate).Replace("B", $buildIncrementalNumber)
    $fileAssemblyVersion = $fileAssemblyVersion.Replace("J", $jdate).Replace("B", $buildIncrementalNumber)
    Write-Host "Transformed Version is $assemblyVersion and Transformed File Version is $fileAssemblyVersion"
    foreach ($file in $AllVersionFiles) 
    { 
        Write-Host "Modifying file " + $file.FullName
        #save the file for restore
        $backFile = $file.FullName + "._ORI"
        $tempFile = $file.FullName + ".tmp"
        Copy-Item $file.FullName $backFile
        #now load all content of the original file and rewrite modified to the same file
        Get-Content $file.FullName |
        %{$_ -replace 'AssemblyVersion\("[0-9]+(\.([0-9]+|\*)){1,3}"\)', "AssemblyVersion(""$assemblyVersion"")" } |
        %{$_ -replace 'AssemblyFileVersion\("[0-9]+(\.([0-9]+|\*)){1,3}"\)', "AssemblyFileVersion(""$fileAssemblyVersion"")" }  > $tempFile
        Move-Item $tempFile $file.FullName -force
    }
}

{{< / highlight >}}

If you are a powershell expert, please do not shoot the pianist :), this is my very first serious Powershell script. The cool part is that  **Build Subsystem stores some interesting values in Environment Variables, so I can simply found the actual build number with the code: $buildNumber = $env:TF\_BUILD\_BUILDNUMBER**. The rest of the script is simply string and Date manipulation and a RegularExpression to replace AssemblyVersion and AssemblyFileVersion in original version of the file, [you can find details Here in the original post I’ve used as a sample for my version](http://blogs.msdn.com/b/dotnetinterop/archive/2008/04/21/powershell-script-to-batch-update-assemblyinfo-cs-with-new-version.aspx).

The cool part about this script is that **you can import it in another script to use functions decalred in it**. The goal is maintaining all complexities inside this base script and use these functions in real scripts that gets called by TFS Build. This simplify maintenance, because you only need to maintain function only once.  As an example this is the simple PreBuild script that manages assembly numbering.

{{< highlight powershell "linenos=table,linenostart=1" >}}


 Param
(
[string] $assemblyVersion,
[string] $fileAssemblyVersion
)
Write-Host "Running Pre Build Scripts"
$scriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Import-Module $scriptRoot\BuildFunctions
if ($assemblyVersion -eq "")
{
    $assemblyVersion = "2.3.0.0"
    $fileAssemblyVersion = "2.3.J.B"
}

{{< / highlight >}}

 **Thanks to Import-Module commandlet I can import all functions of file BuildFunctions.psm1**. This is much more simpler than having Custom Actions and insert them inside the workflow.

One of the coolest part of Powershell scripts is the ability to **define parameters in the head of the script** so you can specify them with notation * **–parameter value** *leaving all the parsing burden of commandline to Powershell infrastructure. Another cool part of this approach is that you can  **include a base AssemblyVersion number to be used if no valid number is passed by Command Line.** Thanks to Git Support you can create a simple build definition valid for multiple branches and in such scenario it is much better to have version number stored in source control, because you can specify a different build number for each branch.

Now just fire a build and verify that assemblies in drop folder contains correct numbering.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/01/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/01/image.png)

 ***Figure 2***: *Verify that all the assemblies contains the correct AssemblyVersionFile Number*

 **If something went wrong, you can look at the diagnostic of the build to verify what is happened in the script**. All Write-Host directive are in fact intercepted and are collected inside the diagnostics of the build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/01/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/01/image1.png)

 ***Figure 3***: *Output of the scripts is collected inside the Diagnostic of the build.*

Thanks to this approach you can

- *Create a simple reusable set of functions inside a Powershell Base Script*
- *Use functions contained in Powershell Base Script inside simpler script for each build*
- *All Write-Host output is redirected in diagnostic log of the build to diagnose problem.*
- *Customization is still valid if you upgrade TFS*
- *You can customize the build simply specifying path of the script*.
- * **You can test the script running it locally** *

If you compare how simple is this approach compared to managing customization of Workflow with Custom Action you can understand what a great improvement you got using the new TFS Build templates.

Gian Maria.
