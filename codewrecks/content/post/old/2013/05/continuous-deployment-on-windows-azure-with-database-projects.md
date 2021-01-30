---
title: "Continuous Deployment on Windows Azure with Database projects"
description: ""
date: 2013-05-22T06:00:37+02:00
draft: false
tags: [Azure,Continuous Deployment]
categories: [Visual Studio ALM]
---
I’ve already blogged about [Deploying on Azure Web Site with Database Project](http://www.codewrecks.com/blog/index.php/2013/03/15/tf-service-deploy-on-azure-web-site-with-database-project/) in the past, but in that article I showed how to accomplish it with customization of the Build Template. That technique is useful because quite often you need to  **run custom scripts or tools to do additional deploy related procedures to the site** , but *if your need is simply deploying schema change to an Azure Database with a Database Project you can accomplish it even without the need to touch the Build Workflow*.

First of all download the publishing profile from your azure site.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image3.png)

 ***Figure 1***: *Download publishing profile from Azure Web Site*

Once you have publishing profile,  **it can be imported in Visual Studio** , just Right-Click on Project node inside Visual Studio and choose Publish. From there you can import publishing profile just downloaded and modify it for your need.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image4.png)

 ***Figure 2***: *Importing publishing profile from Visual Studio*

From the settings tab you have the option to specify a.dacpac file to update database schema.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image5.png)

 ***Figure 3***: *Use a.dacpac to deploy database schema changes*

Unfortunately this configuration is good from direct publishing with Visual Studio, but to make it works during a TFS Build you need to do some manual modification. Once the modified publishing file is changed, you can find it inside Properties/PublishProfiles node of your project, and you can edit it with a simple XML Editor.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image6.png)

 ***Figure 4***: *Modify the location of the dacpac to match the location this file will have during TFS build*

The trick here is  **modifying the path of the.dacpac file to match its location in the build server during the build**. Knowing the location is quite simple, usually I map an entire branch (trunk, main or some release branch) as root dir for the build

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image7.png)

 ***Figure 5***: *Workspace configuration of Deploy build*

Now I need to examine the structure of project folders, suppose the trunk has a sub-folder called TailspinToys that contains my web site project I want to deploy (called Tailspin.WebUpgraded).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image8.png)

 ***Figure 6***: *Folder structure of my project*

When the build takes place, **all build output (including all.dacpac files) are stored in a folder called bin that is one level above the folder you mapped in the build workspace**. To locate the build file during publish, I need to go three folder up to locate the parent of the trunk (my project is in Trunk\TailspinToys\Tailspin.WebUpgraded) then adding bin and the name of the.dacpac file. So the location of dacpac file is..\..\..\bin\xxxxx.dacpac as you can see in  **Figure 4.** Do not worry if it seems complicated, it is just a matter of a couple of tentative to find the root folder ;).

Once the publish file was modified and checked-in you can use it in your build definition.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/05/image9.png)

 ***Figure 7***: *Choose your new publish file as a publishing profile for the build.*

Now you can run the build and database linked to the Web Site will be automatically updated with the definition of your Database Project.

Gian Maria.
