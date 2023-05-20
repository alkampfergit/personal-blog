---
title: "Tfs integration platform to synchronize from codeplex to TFS2010"
description: ""
date: 2010-03-19T17:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
One of the most exiting stuff of TFS is the ability to use API to access it, that gave possibilities to people outside MSFT to create tools. One tool to keep at look at is the [TFS integration platform](http://tfsintegration.codeplex.com/), still in very alpha version, but that promises a lot of exiting stuff.

I decided to have a look at it for a very specific task, I want to be able to periodically synchronize a project from Codeplex to TFS2010. This is an interesting scenario for me, because I can have a local version of the project in TFS2010 and I can setup a lab management environment on it, to test lab management on a real project. First of all now we have a clean gui to use integration services, simply go to TFS to TFS connector and fire the TFSMigrationShell.exe

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image11.png)

Now a nice gui opens, I choose to sync the version control system, so I decided to use the VC\_TFSToTFS\_Template, choose codeplex as source, localhost as destination, choose my team project and the game is quite done.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image12.png)

As you can see the original project is the dexterblogengine on tfs05.codeplex.com, and the destination is the Dexter team project on my default colelction. This configuration is not enough, because storing a username and password in configuration is still not supported, so I need to go on Cretendial Manager

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image13.png)

Now I inserted my credentials for the tfs05.codeplex.com

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image14.png)

Then I fire the play button and it start doing stuff :), it begins to find change groups on the source server.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image15.png)

Now I'm waiting to see if everything is ok, because I think that syncing from codeplex is still not a supported scenario, but at least it started :). I'll keep you in touch on the result.

alk.

Tags: [TFS Integration Platform](http://technorati.com/tag/TFS%20Integration%20Platform)
