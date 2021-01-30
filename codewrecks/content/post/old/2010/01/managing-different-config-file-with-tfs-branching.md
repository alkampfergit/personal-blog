---
title: "Managing different config file with TFS Branching"
description: ""
date: 2010-01-15T13:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
I begin working on a open source project, hosted on codeplex. The first thing I need to do is to modify configuration files to make it work on my machine (in my situation I need only to change the sql connection string). In this scenario a big problem arise, if every developer has a different configuration file, there is the possibility that someone will do a wrong checkin, and send to the server his configuration file. This is a â€œconfiguration hellâ€ when at each check-in you grab modification to configuration file of other developers.

A possible solution in this scenario is to use branches. Suppose you have your standard web.config file that needs to be modified, the first thing I do is to branch it to a different location.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image11.png)

Now I need to modify my workspace, making my web.config local file to point to my branched version. Go to File\Source Control\Workspaces, and edit your workspace in this way.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image12.png)

The important line is the one highlighted in yellow. Basically I told to visual studio to map the d:\develop\Dexter\dexterblogengine\trunk\dexter.web.site\web.config to the $/dexterblogengine/branc/â€¦ With this configuration if you edit web.config to modify the connection string you can verify that in the server the default file is not checked out by you.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image13.png)

You can also see that web.config is grayed out, this because this file is actually not mapped locally by you, so you cannot edit or modify. Then verify that the modified file is the one you branched before.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image14.png)

Ok, now every modification I do to my web.config file does not disturb other people because it point to a version in tfs that was branched from the original one. When I need to modify the master web.config file, to add some extra configuration I can simply edit my local file and then merge all news to the master file.

The good info about this configuration is that periodically you can do a merge from the master file to your local file to grab master modification to the file.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image15.png)

With this simple configuration many people can work, each one with his configuration file, without disturbing each other.

alk.

Tags: [TFS](http://technorati.com/tag/TFS) [Branch](http://technorati.com/tag/Branch)
