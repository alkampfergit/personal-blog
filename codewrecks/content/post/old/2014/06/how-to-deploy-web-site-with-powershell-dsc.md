---
title: "How to Deploy Web Site with PowerShell DSC"
description: ""
date: 2014-06-11T05:00:37+02:00
draft: false
tags: [devops,PowerShell]
categories: [Agile,Tools and library]
---
I do not want to create another tutorial on DSC and I suggest you reading some introductory articles like: [Introducing PowerShell Desired State Configuration](http://blogs.technet.com/b/privatecloud/archive/2013/08/30/introducing-powershell-desired-state-configuration-dsc.aspx) before reading this article. Since I’m pretty new with PowerShell and I’m starting experimenting with DSC I decided to  **start creating a script to deploy my favorite test application (TailspinToys :) ) on a single Windows 2012 R2 server using only DSC**. This post aims to share my thought on the subject.

I was able to complete the script, even if I encountered some difficulties and I manage to  **automate almost everything, except the installation of Sql Server 2012 (I’m working on it)**. The goal is being able to deploy an application that uses a SQL server database written in Asp.Net 4.5 to a Windows Server with a fresh install, using only DSC Goodness.

First of all I warn you that most of the resources I needed to deploy my site are not available in basic distribution of PoweShell and should be downloaded from Microsoft. To download all the resources in a single package there is a single page in MSDN to [download the entire DSC Resource Kit.](http://gallery.technet.microsoft.com/DSC-Resource-Kit-All-c449312d)

After you downloaded the resource kit you should care about a couple of important points, the first one is that  **these resources are not production ready and they are all experimental**. This is the reason why all these resources starts with an x. So do not expect any official program to support them, if you have problem you should ask people in the forum and you will found solution. The other aspect is:  **if you, like me, appreciate the push model, you need to install all of these modules to all target servers**. This violates in a certain way my requirement of being able to install in a clean server, because the server is not really “clean” if you need to have DSC resources deployed on it. This problem will be mitigated with WMF 5.0 that introduces the concept of [PowerShellGet to automatically discover, install and update Powershell Modules](http://blogs.msdn.com/b/powershell/archive/2014/05/14/windows-management-framework-5-0-preview-may-2014-is-now-available.aspx), so it is really a no-problem.

Once everything is in place, I started creating the script, the first part is the standard one you can find in every PowerShell DSC related article, plus some import instructions to import all the DSC resources I want to use in the package.

{{< highlight powershell "linenos=table,linenostart=1" >}}


Configuration TailspinToys
{
  Import-DscResource -Module xWebAdministration
  Import-DscResource -Module xNetworking
  Import-DscResource -Module xSqlPs
  Import-DscResource -Module xDatabase
  #http://www.vexasoft.com/blogs/powershell/9561687-powershell-4-desired-state-configuration-enforce-ntfs-permissions
  Import-DscResource -Module NTFSPermission

  Node $AllNodes.NodeName 
  { 
    #Install the IIS Role 
    WindowsFeature IIS 
    { 
      Ensure = “Present” 
      Name = “Web-Server” 
    } 

    # Required for SQL Server 
    WindowsFeature installdotNet35 
    {             
        Ensure = "Present" 
        Name = "Net-Framework-Core" 
        Source = "\\neuromancer\Share\Sources_sxs\?Win2012R2" 
    } 

    #Install ASP.NET 4.5 
    WindowsFeature ASP 
    { 
      Ensure = “Present” 
      Name = “Web-Asp-Net45” 
    } 

{{< / highlight >}}

In the beginning of the script the Import-DscResource allow me to import the various resources I’ve installed, and NTFS Permission resource is taken from an [article on VexaSoft site](http://www.vexasoft.com/blogs/powershell/9561687-powershell-4-desired-state-configuration-enforce-ntfs-permissions); many thanks to the author for authoring this module. That article is really useful because it shows  **how easy is create a resource for DSC in the situation where there is nothing already pre-made to obtain your purpose**.

I use a configuration resource and the special name $AllNodes will contain the name of the single server I want to use for the installation. The above part of the scripts takes care of all of the prerequisites of my TailspinToys application. I’m installing.NET 3.5 because it is needed for Sql Server installation, but sadly enough I was not able to make the xSqlServerInstall works, to automatically install Sql Server (Actually it asks me to reboot and even rebooting the DSC scripts stops to run). I’ve decided to install Sql Server manually and wait for a better and more stable version of xSqlServerInstall. Then I request IIS and asp.net 4.5.

 **Running the above script with the right configuration data produces a mof file** that can be used to actually configure the target. Here is the configuration I’,m using.

{{< highlight powershell "linenos=table,linenostart=1" >}}


$ConfigurationData = @{
    AllNodes = @(
        @{
            NodeName="WebTest2"
            SourceDir = "\\neuromancer\Drops\TailspinToys_CD_WebTest1\TailspinToys_CD_WebTest1_20140213.1\"
            PSDscAllowPlainTextPassword=$true
            RebootNodeIfNeeded = $true
         }
   )
}

{{< / highlight >}}

I need the name of the server and the source directory where I stored the distribution of my WebSite. In this example  **I’m using a standard Drop Folder of a TFS Build, so I have my binaries indexed with my symbol server**. The creation of the mof file is simply triggered calling the new defined function TailspinToys passing the configuration above..

{{< highlight powershell "linenos=table,linenostart=1" >}}


TailspinToys -ConfigurationData $ConfigurationData 

{{< / highlight >}}

Now I have a mof file that contains everything I need to create the deploy, and I can *push configuration to desired nodes with:*

{{< highlight vb "linenos=table,linenostart=1" >}}


Start-DscConfiguration -Path.\TailspinToys -Wait -Verbose

{{< / highlight >}}

This will start configuration, connect to all the nodes (in this example the single machine WebTest2) and “* **make it so** *”, moving the state of the nodes to desired state. *The cool part of DSC is that you specify the state you desire on the target nodes, without taking care on  **how this state will be achieved** , this is done by the various resources*. Another interesting aspect is,  **if a resource is already in desired state, the Start-DscConfiguration will do nothing**. When you run the above script the first time it needs a little bit time, because it will install IIS, but if IIS is already installed in target node, nothing happens.

With few lines of PowerShell I was able to install IIS and Asp.NET 4.5 plus.NET 3.5 to my machines.

In the next article I’ll deal on how to deploy the website bits.

Gian Maria.
