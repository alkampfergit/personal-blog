---
title: "Using PowerShell scripts to deploy your software"
description: ""
date: 2016-06-03T12:00:37+02:00
draft: false
tags: [devops,PowerShell]
categories: [DevOps]
---
I often use PowerShell scripts to package a “release” of a software during a build because it gives me a lots of flexibility.

[Manage artifacts with TFS Build vNext](http://www.codewrecks.com/blog/index.php/2015/06/30/manage-artifacts-with-tfs-build-vnext/)

[Different approaches for publishing Artifacts in build vNext](http://www.codewrecks.com/blog/index.php/2016/01/30/different-approaches-for-publishing-artifacts-in-build-vnext/)

 **The advantage of using PowerShell is complete control over what will be included in the “release” package**. This allows you to manipulate configuration files, remove unnecessary files, copy files from somewhere else in the repository, etc etc.

> The aim of using PowerShell in a build is creating a single archive that contains everything needed to deploy a new release

This is the first paradigm, all the artifacts needed to install the software should be included in one or more zip archives. Once you have this, **the only step that separates you from Continuous Deployment is creating another scripts that is capable of using that archive to install the software in the current system**. This is the typical minimum set of parameters of such a script.

{{< highlight powershell "linenos=table,linenostart=1" >}}


param(
    [string] $deployFileName,
    [string] $installationRoot
)

{{< / highlight >}}

This scripts the name of the package file and the path where the software should be installed. More complex program accepts other configuration parameteres, but this is the simplest situation for a simple software that runs as a service in Windows and needs no configuration. The script does some preparation and then start the real installing phase.

{{< highlight powershell "linenos=table,linenostart=1" >}}


$service = Get-Service -Name "Jarvis - Configuration Service" -ErrorAction SilentlyContinue 
if ($service -ne $null) 
{
    Stop-Service "Jarvis - Configuration Service"
    $service.WaitForStatus("Stopped")
}

Write-Output 'Deleting actual directory'

if (Test-Path $installationRoot) 
{
    Remove-Item $installationRoot -Recurse -Force
}

Write-Output "Unzipping setup file"
Expand-WithFramework -zipFile $file.FullName -destinationFolder $installationRoot

if ($service -eq $null) 
{
    Write-Output "Starting the service in $finalInstallDir\Jarvis.ConfigurationService.Host.exe"

    &amp; "$installationRoot\Jarvis.ConfigurationService.Host.exe" install
} 

{{< / highlight >}}

First step is obtaining a reference to a Windows service called “Jarvis – Configuration Service”, if the service is present the script stops it and wait for it to be really stopped. Once the service is stopped it deletes current directory, and then, extract all the files contained in the zipped archive to the same directory. If the service was not present (it is the very first installation) it invokes the executable with the install option (we are using [TopShelf](http://topshelf-project.com/)).

> The goal  of the script is being able to work for a first time installation, as well of subsequent installations.

A couple of aspect are interesting in this approach: first,  **the software does not have any specific configuration in the installation directory** , when it is time to update, the script delete everything, and then copy the new version on the same path. Second, the script is made to work if the service was already installed, or if this is the very first installation.

Since this simple software indeed uses some configuration in the app.config file, it is duty of the scripts to reconfigure the script after the deploy.

{{< highlight powershell "linenos=table,linenostart=1" >}}


$configFileName = $installationRoot + "\Jarvis.ConfigurationService.Host.exe.config"
$xml = (Get-Content $configFileName)
Edit-XmlNodes $xml -xpath "/configuration/appSettings/add[@key='uri']/@value" -value "http://localhost:55555"
Edit-XmlNodes $xml -xpath "/configuration/appSettings/add[@key='baseConfigDirectory']/@value" -value "..\ConfigurationStore"

$xml.save($configFileName)

{{< / highlight >}}

This snippet of code uses an helper function to change the configuration file with XPath. Here there is another assumption:  **no-one should change configuration file, because it will be overwritten on the next installation**. All the configurations that are contained in configuration file should be passed to the installation script.

> The installation script should accept any configuration that need to be store in application configuration file. This is needed to allow for a full overwrite approac, where the script deletes all previous file and overwrite them with the new version.

In this example we change the port the service is listening and change the directory where this service will store configuration files (it is a configuration file manager). The configuration store is set to..\ConfigurationStore, a folder outside the installation directory. This will preserve content of that folder on the next setup.

> To simplify updates, you should ensure that it is safe to delete old installation folder and overwrite with a new one during upgrade. No configuration or no modification must be necessary in files that are part of the installation.

The script uses hardcoded values: port 55555 and..\ConfigurationStore folder, if you prefer, you can pass these values as parameter of the installation script. The key aspect here is:  **Every configuration file that needs to be manipulated and parametrized after installation, should be placed in other directory. We always ensure that installation folder can be deleted and recreated by the script.** This assumption is strong, but avoid complication of  installation scripts, where the script needs to merge default settings of the new version of the software with the old settings of previous installation. For this reason, the Configuration Service uses a folder outside the standard installation to store configuration.

All scripts can be found in [Jarvis Configuration Service](https://github.com/ProximoSrl/Jarvis.ConfigurationService) project.

Gian Maria.
