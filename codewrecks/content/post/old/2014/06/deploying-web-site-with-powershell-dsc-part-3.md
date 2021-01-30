---
title: "Deploying Web Site With PowerShell DSC part 3"
description: ""
date: 2014-06-15T08:00:37+02:00
draft: false
tags: [devops]
categories: [DevOps]
---
- [How to deploy a web site with Powershell DSC](http://www.codewrecks.com/blog/index.php/2014/06/11/how-to-deploy-web-site-with-powershell-dsc/)
- [How to Deploy a Web Site with PowerShell DSC Part 2](http://www.codewrecks.com/blog/index.php/2014/06/12/how-to-deploy-a-web-site-with-powershell-part-2/)

In this last part of this series I’ll explain how to deploy database projects output to local database of node machine. It was the most difficult due to some errors present in the xDatabase resource. Actually **I have a couple of Database Projects in my solution, the first one define the structure of the database needed by my application while the second one reference the first and installs only some test data** with a Post Deploy Script. You can read about this technique in my previous post [Manage Test Data in Visual Studio Database Project](http://www.codewrecks.com/blog/index.php/2013/08/05/manage-test-data-in-visual-studio-database-project/) Sadly enough, the xDatabase resource of DSC is still very rough and grumpy.

*I’ve found two distinct problems:*

The first one is that  **DatabaseName is used as key property of the resource, this means that it is not possible to run two different DacPac on the same database because of duplicate key violation**. This is usually a no-problem, because I could have deployed only the project with test data and since it reference the dacpac with the real structure of the site, both of them should deploy correctly. Unfortunately this does not happens, because you need to add some additional parameters deploy method, and xDatabase resource still not supports [DacDeployOptions](http://msdn.microsoft.com/en-us/library/microsoft.sqlserver.dac.dacdeployoptions%28v=sql.110%29.aspx) class. The fix was trivial, I changed the resource to use the name of the DacPac file as the key and everything just works.

The second problem is more critical and derives from usage of the [DacService.Register](http://msdn.microsoft.com/en-us/library/hh753483.aspx) method inside the script. After the first successful deploy, all the subsequent ones gave me errors. If you got errors during Start-DscConfiguration the output of the cmdlet, even in verbose mode, does not gives you details of real error that happened to target node where the configuration was run.  Usually what you get is a message telling: * **These errors are logged to the ETW channel called  
<br>Microsoft-Windows-DSC/Operational. Refer to this channel for more details** *

It is time to have a look to Event Viewer of the nodes where the failure occurred. Errors are located in Application And Service Logs / Microsoft / Windows / Desired State Configuration. Here is how I found the real error that xDatabase is raising on the target node.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image16.png)

 ***Figure 1***: *Errors in event viewer of Target Node.*

The error is in the update, DacServices.Deploy failed to update the database because it was registered as a Data Tier application and the Deploy command does not update its registration accordingly. This problem was easy to solve, because I need only to Specify RegisterDataTierApplication with a DacDeploymentOptions. I’ve added even this fix to the original xDatabase resource and I’ve added also more logging, so you are able to verify, when dsc runs, what DacServices class is really doing.

If you like I’ve posted my fix at this address: [http://1drv.ms/1osn09U](http://1drv.ms/1osn09U "http://1drv.ms/1osn09U") but remember that * **my fix are not thoroughly tested, and are not official Microsoft Correction in any way. So feel free to use them at your own risk** *. Clearly all these error will be fixed when the final version of xDatabase will be released (I remember you that these resources are pre-release, and this is the reason why they are prefixed with an x).

Now that xDatabase Resource works good, I can define a couple of resources to deploy my two dacpacs to target database.

{{< highlight powershell "linenos=table,linenostart=1" >}}


xDatabase DeployDac 
{ 
    Ensure = "Present" 
    SqlServer = "." 
    SqlServerVersion = "2012" 
    DatabaseName = "TailspinToys" 
    Credentials = (New-Object System.Management.Automation.PSCredential("sa", (ConvertTo-SecureString "xxxxx" -AsPlainText -Force)))
    DacPacPath =  $AllNodes.SourceDir + "Tailspin.Schema.DacPac" 
    DacPacApplicationName = "Tailspin"
} 
xDatabase DeployDacTestData
{ 
    Ensure = "Present" 
    SqlServer = "." 
    SqlServerVersion = "2012" 
    DatabaseName = "TailspinToys" 
    Credentials = (New-Object System.Management.Automation.PSCredential("sa", (ConvertTo-SecureString "xxxxx" -AsPlainText -Force)))
    DacPacPath =  $AllNodes.SourceDir + "Tailspin.SchemaAndTestData.DacPac" 
    DacPacApplicationName = "Tailspin"
} 

{{< / highlight >}}

Shame on me, I’m using explicit UserName and password again in DSC scripts, but actually if I omit Credentials to use integrated security, the xDatabase script fails with a NullReferenceException. Since this is a test server I accept to use clear text password until the xDatabase resource will not be fixed to support integrated authentication.

Here is the link to the full DSC script: [http://1drv.ms/1osoIYZ](http://1drv.ms/1osoIYZ "http://1drv.ms/1osoIYZ"). Have fun with DSC.

Gian Maria.
