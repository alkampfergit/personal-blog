---
title: "Deploy on remote machine during builds"
description: ""
date: 2010-07-06T06:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET,Tools and library]
---
Clearly Lab Management is really good to [manage virtual environment](http://www.codewrecks.com/blog/index.php/2010/06/29/deploy-a-solution-and-a-database-in-a-lab-management-virtual-environment/)s and give a lot of flexibility on how to deploy your application on virtual machines, but if you do not have Lab Management you can still use the same technique to deploy application in remote computer during a build with the use of a simple scripts. The key is the ability to execute code on a remote computer with [beyondexec](http://www.beyondlogic.org/solutions/remoteprocess/BeyondExec.htm) or similar tool. Suppose you need to deploy an application called demo, you have a Tfs build called Demo, and you want to be able to deploy a specific build on a remote server, the solution could be this simple script

*<font size="2">@echo off</font>*

*<font size="2">set RemotePath= \\10.0.0.220\drops\demo\%1\_PublishedWebsites\Demo_Package\*.*       <br>set LocalPath=c:\setup\demo</font>*

*<font size="2">if exist %LocalPath% (       <br>rmdir /s /q %LocalPath%        <br>)        <br>mkdir %LocalPath%</font>*

*<font size="2">if not exist %RemotePath% (       <br>echo remote path %RemotePath% doesn&#8217;t exist        <br>goto Error        <br>)</font>*  
*<font size="2">xcopy /c %RemotePath% %LocalPath%\.       <br>%LocalPath%\Demo.deploy.cmd /Y</font>*

*<font size="2">echo Demo Copied to LocalPath %LocalPath%       <br>exit /b 0</font>*

*<font size="2">:Error       <br>echo Unable to Copy Demo Scripts        <br>exit /b 1</font>*

The script is really simple, it simply compose the drop folder [\\10.0.0.220\drops\demo](file://\\10.0.0.220\drops\demo) with the single argument of the batch to find the path where the build had dropped the packages, then it creates a local directory where to copy all deploy plackage and run it.

Now you can store this script in source control, and use it with a tfs build, to deploy on a remote server, you can for example run from a command prompt:

* **beyondexecv2 \\10.0.0.220 -p "pa$$wordâ€ -c Deploy\DeployWeb.bat demo\_20100607.3** *

This will copy the script on the 10.0.0.220 server, and launch the script with the argument demo\_20100607.3 (the build number), here is the result.

*<font size="1" face="Consolas">BeyondExec V2.05 &#8211; Spawn Remote Processes on Windows NT/2000/XP WorkStations.       <br>Copyright(C) 2002-2003 Craig.Peacock@beyondlogic.org        <br>[10.0.0.220] Establishing Connection...        <br>[10.0.0.220] BeyondExec service already installed on remote machine.        <br>[10.0.0.220] Copying Deploy\DeployWeb.bat to \\10.0.0.220\ADMIN$\temp\DeployWeb.bat        <br>[10.0.0.220] Command Successfully Issued to 10.0.0.220 on Pipe 1.        <br>[win-y4onzs094up] Process started, ProcessID = 9780, ThreadID = 9788        <br>\\10.0.0.220\drops\demo\demo_20100607.3\_PublishedWebsites\Demo_Package\Demo.deploy-readme.txt        <br>\\10.0.0.220\drops\demo\demo_20100607.3\_PublishedWebsites\Demo_Package\Demo.deploy.cmd        <br>\\10.0.0.220\drops\demo\demo_20100607.3\_PublishedWebsites\Demo_Package\Demo.SetParameters.xml        <br>\\10.0.0.220\drops\demo\demo_20100607.3\_PublishedWebsites\Demo_Package\Demo.SourceManifest.xml        <br>\\10.0.0.220\drops\demo\demo_20100607.3\_PublishedWebsites\Demo_Package\Demo.zip        <br>5 File(s) copied        <br>=========================================================        <br>SetParameters from:        <br>&quot;c:\setup\demo\Demo.SetParameters.xml&quot;        <br>You can change IIS Application Name, Physical path, connectionString        <br>or other deploy parameters in the above file.        <br>&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;-        <br> Start executing msdeploy.exe        <br>&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;-        <br> &quot;C:\Program Files\IIS\Microsoft Web Deploy\\msdeploy.exe&quot; -source:package=&#8217;c:\setup\demo\Demo.zip&#8217; -dest:auto,includeAcls=&#8217;False&#8217; -verb:syn        <br>c -disableLink:AppPoolExtension -disableLink:ContentExtension -disableLink:CertificateExtension -setParamFile:&quot;c:\setup\demo\Demo.SetParamet        <br>ers.xml&quot;        <br>Info: Adding sitemanifest (sitemanifest).        <br>Info: Updating createApp (Default Web Site/Demo_deploy).        <br>Info: Adding contentPath (Default Web Site/Demo_deploy).        <br>â€¦        <br>Info: Adding setAcl (Default Web Site/Demo_deploy).        <br>Total changes: 37 (36 added, 0 deleted, 1 updated, 0 parameters changed, 737702 bytes copied)        <br>[win-y4onzs094up] Process terminated with exit code 0 after 00:00:03.850s        <br>[win-y4onzs094up] Removing C:\Windows\temp\DeployWeb.bat</font>*

As you can verify, the beyondexec tool was able to connect to remote machine, copied the deployweb.bat script on the remote machine and launched it with the right argument, now I can verify with IIS that the new web application was created in target machine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image9.png)

Et voilÃ , we deployed a web application to a remote machine with a simple command. You can use this technique in a tfs build to deploy to a remote server.

Alk.
