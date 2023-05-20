---
title: "Automatically build and publish nuget packages during TFS Build"
description: ""
date: 2014-02-01T11:00:37+02:00
draft: false
tags: [Continuous Integration]
categories: [Tfs]
---
Previous post on the series

- [Versioning assembly during TFS 2013 build with Powershell Scripts](http://www.codewrecks.com/blog/index.php/2014/01/11/customize-tfs-2013-build-with-powershell-scripts/)

Using powershell to cusotmize build is simple and easy, once you have versioning in place (previous article), if you are realizing some form of reusable library it is time to  **think on how to distribute it to people. One of the obvious choice is using Nuget.** Luckily enough, setting up a nuget server in an azure website is just a matter of

1. Create an empty asp.net MVC project
2. Reference standard Nuget Server package
3. Change web config and add a password for publishing
4. Publish on an azure web sites.

Et voila, you have your Nuget server up and running in really no-time on an azure web site, it is simple and quick to setup.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image3.png)

 ***Figure 1***: *Nuget server running on Windows Azure Web Site*

Now you only need to create a  **simple powershell file to enable automatic publishing of your libraries during TFS Build**. This is really easy, first of all I started including a standard nuspec file inside the library I want to publish. This.nuspec file will contains all the details of the package and the script will only need to change the number, create nuget package and finally publish the package into your nuget server.

Here is a simple.nuspect file for a test project of a log library.

{{< highlight xml "linenos=table,linenostart=1" >}}


<?xml version="1.0"?>
<package >
  <metadata>
    <id>LogLibrary</id>
    <version>1.0.0.0</version>
    <authors>Ricci Gian Maria</authors>
    <owners>Ricci Gian Maria</owners>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <description>Simple log library project to verify build+nuget.</description>
    <releaseNotes>ContinuousIntegration.</releaseNotes>
    <copyright>Copyright 2014 - Ricci Gian Maria</copyright>
    <tags>Example</tags>
  </metadata>

  <files>
    <file src="LogLibrary.dll" target="lib\NET40" />
    <file src="LogLibrary.pdb" target="lib\NET40" />
  </files>
</package>

{{< / highlight >}}

As you can verify it is a standard nuspec file and my goal is creating a powershell script that

1. * **Change version including build number and day in format YYDDD where DDD is the number of day of the year** *
2. * **Execute nuget to create pack file and publish to my server** *

The very first step is including nuget.exe inside my BuildScript folder and check-in everything. This will assure me that everything is needed for the build is contained in source control.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image4.png)

 ***Figure 2***: *Content of the BuildScript folder*

Now the interesting part, the powershell function that does the real work.

{{< highlight powershell "linenos=table,linenostart=1" >}}


function Publish-NugetPackage
{
  Param 
  (
    [string]$SrcPath,
    [string]$NugetPath,
    [string]$PackageVersion, 
    [string]$NugetServer,
    [string]$NugetServerPassword
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
    Write-Host "Executing Publish-NugetPackage in path $SrcPath, PackageVersion is $PackageVersion"
    $jdate = Get-JulianDate
    $PackageVersion = $PackageVersion.Replace("J", $jdate).Replace("B", $buildIncrementalNumber)
    Write-Host "Transformed PackageVersion is $PackageVersion "
    $AllNuspecFiles = Get-ChildItem $SrcPath\*.nuspec
    #Remove all previous packed packages in the directory
    $AllNugetPackageFiles = Get-ChildItem $SrcPath\*.nupkg
    foreach ($file in $AllNugetPackageFiles)
    { 
        Remove-Item $file
    }

    foreach ($file in $AllNuspecFiles)
    { 
        Write-Host "Modifying file " + $file.FullName
        #save the file for restore
        $backFile = $file.FullName + "._ORI"
        $tempFile = $file.FullName + ".tmp"
        Copy-Item $file.FullName $backFile -Force
        #now load all content of the original file and rewrite modified to the same file
        Get-Content $file.FullName |
        %{$_ -replace '<version>[0-9]+(\.([0-9]+|\*)){1,3}</version>', "<version>$PackageVersion</version>" } > $tempFile
        Move-Item $tempFile $file.FullName -force

        #Create the.nupkg from the nuspec file
        $ps = new-object System.Diagnostics.Process
        $ps.StartInfo.Filename = "$NugetPath\nuget.exe"
        $ps.StartInfo.Arguments = "pack `"$file`""
        $ps.StartInfo.WorkingDirectory = $file.Directory.FullName
        $ps.StartInfo.RedirectStandardOutput = $True
        $ps.StartInfo.RedirectStandardError = $True
        $ps.StartInfo.UseShellExecute = $false
        $ps.start()
        if(!$ps.WaitForExit(30000)) 
        {
            $ps.Kill()
        }
        [string] $Out = $ps.StandardOutput.ReadToEnd();
        [string] $ErrOut = $ps.StandardError.ReadToEnd();
        Write-Host "Nuget pack Output of commandline " + $ps.StartInfo.Filename + " " + $ps.StartInfo.Arguments
        Write-Host $Out
        if ($ErrOut -ne "") 
        {
            Write-Error "Nuget pack Errors"
            Write-Error $ErrOut
        }
        #Restore original file
        #Move-Item $backFile $file -Force
    }
    $AllNugetPackageFiles = Get-ChildItem $SrcPath\*.nupkg
    foreach ($file in $AllNugetPackageFiles)
    { 
        #Create the.nupkg from the nuspec file
        $ps = new-object System.Diagnostics.Process
        $ps.StartInfo.Filename = "$NugetPath\nuget.exe"
        $ps.StartInfo.Arguments = "push `"$file`" -s $NugetServer $NugetServerPassword"
        $ps.StartInfo.WorkingDirectory = $file.Directory.FullName
        $ps.StartInfo.RedirectStandardOutput = $True
        $ps.StartInfo.RedirectStandardError = $True
        $ps.StartInfo.UseShellExecute = $false
        $ps.start()
        if(!$ps.WaitForExit(30000)) 
        {
            $ps.Kill()
        }
        [string] $Out = $ps.StandardOutput.ReadToEnd();
        [string] $ErrOut = $ps.StandardError.ReadToEnd();
        Write-Host "Nuget push Output of commandline " + $ps.StartInfo.Filename + " " + $ps.StartInfo.Arguments
        Write-Host $Out
        if ($ErrOut -ne "") 
        {
            Write-Error "Nuget push Errors"
            Write-Error $ErrOut
        }

    }
}

{{< / highlight >}}

My standard disclaimer is: I’m not a powershell expert, so I think that probably there are gazillions of way to do a better powershell script. The function is really simple,  **first of all it starts doing some standard transformation of the package number (as in previous article), then it starts enumerating all.nuspec files present in bin directory of the build**.  **For each nuspec file, it simply do a backup, then change the version number using a simple regex, finally it invoke the nuget.exe process to create the pack file**. To launch an external process and have full control on the output I decided to use (since I’m a.NET programmer) the System.Diagnostic.Process class, that permits me to intercept all standard output and standard error.

After the process ends I use write-host and write-error to dump all the output to the host (it would be a better approach parsing the output and generate a better error message).  **Finally I invoke again nuget.exe to publish the package to my server.** Once this function is in place, you can invoke with a simple script that will be scheduled to be executed AfterBuild.

{{< highlight powershell "linenos=table,linenostart=1" >}}


Param
(
[string] $PackageVersion = "1.0.J.B",
[string] $NugetServer = "http://alkampfernuget.azurewebsites.net/",
[string] $NugetServerPassword = "This_is_my_password"
)

Write-Host "Running Pre Build Scripts"

$scriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Import-Module $scriptRoot\BuildFunctions

Publish-NugetPackage $scriptRoot\..\..\bin $scriptRoot $PackageVersion $NugetServer $NugetServerPassword

{{< / highlight >}}

It is based mainly by convention, the script root is the folder where the script is, and the build is configured with this workspace.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image5.png)

 ***Figure 3***: *Workspace configuration*

The above relative path maps all ScriptTest folder inside the $(SourceDir) of the agent, the script is in the BuildTools directory, so I need to get the parent folder to locate the root of the workspace and another \.. to find the build base directory that contains the bin folder, where the build copy all the output. An even better situation would be using TF\_BUILD\_BINARIESDIRECTORY environment variable, that automatically locates that folder, but that variable is populated only during a build. If you plan to use the script only inside a TFS Build, you can safely use TF\_BUILD\_BINARIESDIRECTORY variable. Here is a modified example that does this

{{< highlight powershell "linenos=table,linenostart=1" >}}


Param
(
[string] $PackageVersion = "1.0.J.B",
[string] $NugetServer = "http://alkampfernuget.azurewebsites.net/",
[string] $NugetServerPassword = "This_is_my_password"
)

Write-Host "Running Pre Build Scripts"
$scriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

#Remove-Module BuildFunctions
Import-Module $scriptRoot\BuildFunctions

$binPath = $env:TF_BUILD_BINARIESDIRECTORY
if ($binPath -eq $null)
{Write-Host "Not running in build, using relative path to identify bin location."
    $binPath = $scriptRoot + "\..\..\bin"
}

Publish-NugetPackage $env:TF_BUILD_BINARIESDIRECTORY $scriptRoot $PackageVersion $NugetServer $NugetServerPassword


{{< / highlight >}}

The above script does nothing except importing the module with the publishing function and invoke the Publish-NugetPackage function.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image6.png)

 ***Figure 4***: *Invoke the script after build*

Now everything is setup correctly, just fire a build and verify that everything is done correctly looking at write-host messages that gets collected in the detailed log of the build. Thanks to log files, you can output as much information you want to diagnose problem that can arise during the build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image7.png)

 **figure 5:** *Verify output of powershell scriptin diagnostic build informations.*

If the script contains some errors, powershell will write error with write-error and this information will make the build partially fails and also all the errors will be output in build details, but not in a real nice form. Since I’ve intercepted all nuget.exe error output and dump with Write-Error, a nuget.exe error message will make the build Partially Fails and you can looks at errors list to understand what happened.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image8.png)

 ***Figure 6***: *How errors in powershell are displayed in build output*

This has **not a nice formatting, because each error line is treated as a single and distinct error in the build**. But at least we are able to identify the root cause of the error, even if they are not really well formatted. When the build is green you will find your packages in the feed of your nuget server.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image9.png)

 ***Figure 7***: *Feed of my packages pushed during the build.*

Each good build will produce a unique version for your package, as you can verify from package console.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image10.png)

 ***Figure 8***: *Listing available packages in Package Manager Console.*

With few lines of powershell you are able to automatically publish your packages to nuget server during TFS Build.

Gian Maria.
