---
title: "Team foundation Build ndash Share Builds among multiple servers"
description: ""
date: 2009-06-25T12:00:37+02:00
draft: false
tags: [Software Architecture,Team Foundation Server]
categories: [Software Architecture,Team Foundation Server]
---
When you begin to use Team Foundation Server, you will create different builds for all of your company's projects. Since building complex products can be resource intensive, it is likely that your Team Foundation Server machine starts to perform slowly. This is a typical issue of Continuous integration servers, since they compile projects at each check-in you will end with a lot of builds and a lot of work to do.

Team Foundation Server addresses this issue separating *[build machines](http://msdn.microsoft.com/en-us/library/ms181710.aspx)* from *Team Foundation Server*. If you find that the build machine is becoming slow, you can simply use another machine in the network to execute some of the builds. In real environment you can even avoid to install build engine in the Tfs machine, delegating builds to other servers. First of all go into another machine, fire the installer of Team Foundation Server, and choose to install a *Team Foundation Build*.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb35.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image35.png)

* **Note:** *if you do not have Active Directory*you Must create in this machine an account with the same name/password of an account of the machine where Team Foundation Server is running and that account must have right to access tfs*. This is a standar requirement, the Build Server needs to access Team Foundation Server to get sources to build and store build result, etc, etc. so it is of vital importance that it runs with sufficient privilege to access TFS server. If you have active directory you do not need to create a specific account, but you must select one AD user that have credential to access TFS during the installation.

When the installer finished, you can go to Visual Studio, Right Click on the Builds in the Team Foundation Server Explorer Tree, then choose *Manage Build Agents*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb36.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image36.png)

Now you can add additional Build Agent, and you can choose the new machine name, where you had previously installed the Team Foundation Build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb37.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image37.png)

Now you can use this new machine to run Builds simply specifying this agent when you create a Build Definition, or you can use it when you manually queue new build. It is really important that the user credentials used to run the Build Service in the new Build machine has the right to access the Team Foundation Server Machine as stated before.

If you had already installed the team Build engine with a wrong user don't panic, you can still manually change build machine settings to correctly access TFS. Go to Service control panel and change the credential used by the *Visual Studio Team Foundation Build* service to use an user that has sufficient credential for TFS. Now restart the service.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb38.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image38.png)

It is highly possible that when you restart the service you get * **access is Denied** * error, it means that the new account does not have sufficient rights to run, first of all the user needs rights to access the folder where you install the Build Agent, but this is usually not enough. *The only way to understand exactly what is wrong  **is going into the Event Viewer** *where you can find detailed errors like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Detailed Message: TF224004: The Visual Studio Team Foundation Build service failed to start because WS2008V1\alkampfer does not have the required access permissions for address http://ws2008v1:9191/Build/v2.0/AgentService.asmx.
Exception Message: HTTP could not register URL http://+:9191/Build/v2.0/AgentService.asmx/. Your process does not have access rights to this namespace (see http://go.microsoft.com/fwlink/?LinkId=70353 for details). (type AddressAccessDeniedException){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This message is one of the most dreadful, it means that the user has no [rights to use that url to host  a web service](http://msdn.microsoft.com/en-us/library/ms733768.aspx). The solution is to run this couple of commands.

{{< highlight csharp "linenos=table,linenostart=1" >}}
netsh http delete urlacl url=http://+:9191/Build/v2.0/AgentService.asmx
netsh http add urlacl url=http://+:9191/Build/v2.0/AgentService.asmx user=alkampfer{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With these two lines of code you are giving to user *Alkampfer*(the one that has right to access Tfs and the one used to run build service) enough rights to create a web service in that url. Now you should be able to start the service. Verify if the Build Agent is running browsing the WebService page (something like [http://10.0.0.11:9191/Build/v2.0/AgentService.asmx](http://10.0.0.11:9191/Build/v2.0/AgentService.asmx "http://10.0.0.11:9191/Build/v2.0/AgentService.asmx")). Now if everything is ok, you should go to *Manage Build Agents* menu and reenable agent if necessary. This step is needed because Tfs disables all Agents that are unable to run. If you fire a build with an agent that has no right to access TFS the TFS disables that agent because it is useless. When you correct the problem, you can simply edit the Build Agent definition, and change its status back to active, now you can schedule again builds on it.

With such a configuration you can divide build tasks across multiple machines, and the whole build process is more scalable. The advantage is that you have a single point of access (the Tfs machine), and from that point you can subdivide works between machines. Since you can install how many build server you want, the whole system is highly scalable.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
