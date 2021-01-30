---
title: "Cannot create project in a newly installed TFS"
description: ""
date: 2009-06-15T09:00:37+02:00
draft: false
tags: [NET framework,Experiences]
categories: [NET framework,Experiences]
---
Iâ€™ve just installed Tfs For Workgroup in a small virtual machine to make some experiments. After setting up the machine (Windows 2008) I installed TFS SErvice pack 1 then tfs power toys and finally I opened up visual studio in my desktop machine. I simply connect to the team foundation server and tried to create a new â€œTeam Projectâ€, inserted some values for my test project and then tried to create the project, but here is the result

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image9.png)

Following the link â€œFor More information.. â€œ you can read detailed log, in the end of the file there is an exception

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image10.png)

To avoid being lost in error simply look at the last operation that it tried to do, in this case it was â€œCreating reports on the Sql Server reporting" Servicesâ€ and the cause of the exception is â€œThe permission granted to user â€œTFSALKAMPFER\Alkampfer are insufficientâ€. To solve this problem install on the server the [Team Foundation Server Administration Tool](http://tfsadmin.codeplex.com/)

Then you can launch that tool with administrative privileges, connect to the server and verify permissions. Here are permissions on my newly installed server.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image11.png)

Uh Oh, it seems that my account does not have any rights on reporting services, and limited access to share point, now you can simply click on Reporting Services area.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image12.png)

Since this is a test server and I do not care a lot about security I give to myself full rights, then save changes. Now Iâ€™m able to create team projects.

When you work with a complex system like TFS do not forget to analyze detailed log files in case of errors, it can save you a lot of time.

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
