---
title: "Automatically Deploy PowerShell modules to Build Agents in TFS"
description: ""
date: 2014-02-21T08:00:37+02:00
draft: false
tags: [PowerShell,TFS Build]
categories: [Team Foundation Server]
---
I’ve done some blog post on customizing TFS Build with PowerShell scripts and the very first question I got from this approach is

> How can I store some PowerShell modules “somewhere” and have them available for all Build Agents?

This is a real good question, but sadly enough it has no out-of-the-box answer. Luckily enough you can solve this with a little bit of PowerShell knowledge. Please be aware  **that this solution is based on some assumption on how TFS build actually works and is not guaranteed to be stable in the future** , but I’d like to share with you all if you want to try into your environment.

TFS Build controllers have a special Source Control Folder you can specify to store assemblies that should be available for Agents during the build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb24.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/02/image24.png)

 ***Figure 1***: *Version control path to custom assemblies for Build Controllers*

The very first step is creating a subfolder where you store all PowerShell modules you want to be available to Build Agents during a build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb25.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/02/image25.png)

 ***Figure 2***: *Store your PowerShell Modules inside a specific folder of the Path to custom assemblies*

*This special folder is downloaded for every agent during a build and it is stored inside a specific subfolder of the temp folder of the user configured to run build agents*. Once all modules are committed, it is just a matter of writing a bunch of PowerShell lines of code to identify the directory where that modules are downloaded during the build, and then copy all modules inside one of the default location supported by the PowerShell engine.

{{< highlight powershell "linenos=table,linenostart=1" >}}


Write-Host "TempDirectoryIs"$env:Temp

$scriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

$scriptRoot -Match "\d+"
$agentNumber = $Matches[0]
Write-Host "Build Agent Number is"$agentNumber

Write-Host "PSModulePath = "$env:PSModulePath
$userModuleLocation = $env:PSModulePath.Split(';') | where {$_.Contains('Documents')}
Write-Host "User Powershell Module location is: "$userModuleLocation

$tempBuildDirectory = $env:Temp + "\BuildAgent\" + $agentNumber + "\Assemblies\"
Write-Host "Location of custom assembly: "$tempBuildDirectory
Copy-Item -Path $tempBuildDirectory"PowershellModules\" -Destination $userModuleLocation -Recurse

{{< / highlight >}}

Let me explain how this works. First of all I need to know the location of the temp directory, stored in Environment variables $env:temp. When the build runs this variable is something like: * **C:\Windows\SERVIC~2\LOCALS~1\AppData\Local\Temp** *. This is not the real directory where the agent downloads the content of the custom assembly folder, because each agent creates a specific subdirectory, based on its id Es: *C:\Windows\ServiceProfiles\LocalService\AppData\Local\Temp\ **BuildAgent\<font color="#ff0000">290</font>\Assemblies** *

Agent’s id is also used to create a separate local build folder for each agent, the first step is to store folder location where the executing script is located in variable $scriptRoot. The value is something like: *C:\Builds\ **<font color="#ff0000">290</font>** \Experiments\Simple Powershell Versioning\src\BuildScripts*. As you can see,  **id of the Agent is the first number that appears in folder structure, and extracting it with a simple regex is really straightforward**.

Final step is locating all the paths where PowerShell is actually searching for modules. All locations are stored inside the Environment variable $env:PSModulePath, containing a semicolon separated list of default folders for modules. The script cannot write to all of these folders because some of them are stored in path of disk that requires elevated permission (Es: C:\ProgramFiles).  **Usually one of them is located under Document folder of the current user:** ??* **%UserProfile%\Documents\WindowsPowerShell\Modules** ,*and since it is in user folder build agent can write on it without problem. ** ** Thanks to this knowledge I’ve decided to split the path to find the one that contains the path Documents. I know that this can be a fragile assumption, but it usually works.

The last step is determine $tempBuildDirectory combining temp folder with agent id and finally use a Copy-Item cmdlets to copy all custom PowerShell modules inside the supported module location under agent user directory.

I did not use this strategy really often because it can be fragile.  **If you are using TFVC the best solution usually is** - *Add the custom powershell modules directory to the workflow mapping of the build*
- *use the Import-Module PowerShell command to import modules from a fixed location*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb26.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/02/image26.png)

 ***Figure 3***: *Download your custom PowerShell modules in a know location as part of the build workspace.*

since I’ve stored build scripts inside $Experiments/trunk/Builds/ScriptTest/BuildScripts folder, I can use relative path to find location of PowershellModules on disk and import modules from specific locations. Sadly enough this solution does not works with Git repository and copying the modules with the above technique can be a viable solution.

Gian Maria.
