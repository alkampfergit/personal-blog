---
title: "Add Reporting to an existing Team Project"
description: ""
date: 2016-04-07T15:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
In previous post I demonstrated [how you can create a Team Project from Web Interface thanks to TFS 2015 Update 2](http://www.codewrecks.com/blog/index.php/2016/04/03/create-a-team-project-from-web-ui-in-tfs-2015-update-2/). The only drawback of this approach is that  **no Sharepoint Site and no Reporting Services portal are created**.

While SharePoint integration is now an uncommon requirement, reporting services are still used. After my new Team Project (named*Test Project 2* ) was created from web interface, I verified that nothing gets created in my Reporting Services instance.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-5.png)

 ***Figure 1***: *No reporting was created for new Team Project*

>  **Thanks to** [**TFS Power Tools**](https://visualstudiogallery.msdn.microsoft.com/898a828a-af00-42c6-bbb2-530dc7b8f2e1) **you are able to create both SharePoint portal and Reporting services for an existing project**.

You can add reporiting with the tfpt.exe power tools command line utility. As an example here is the help for the * **addprojectreports** *command, used to create reports for an already created Team Project.

[![This image shows the list of options available to the addprojectreports command.](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-3.png "Help of the addprojectreports command")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-3.png)

 ***Figure 2***: *Help of the addprojectreports command*

This is the exact command line I need to recreate reports for my Team Project is:

{{< highlight bash "linenos=table,linenostart=1" >}}


tfpt addprojectreports 
/collection:http://tfs.cyberpunk.local:8080/tfs/ExperimentalCollection 
/teamproject:"Test Project 2"
 	/processTemplate:"CMMI"

{{< / highlight >}}

After a little while tfpf.exe created everything as I can verify from Reporting Services Site, now I have the usual folder for the Team Project that contains all Reports.

[![After tfpf addprojectreports command all reports for the team project are correctly created in Reporting Services Site](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-6.png "Reports were created for the Team Project")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-6.png)

 ***Figure 3***: *Reports were created for the Team Project*

The same can be done with SharePoint portal. Thanks to Power Tools you  **can create the Team Project directly from the Web Site and add portal or reports subsequently and only if you need them.** Gian Maria.
