---
title: "Using a different unit of measure in task planning in TFS"
description: ""
date: 2013-02-26T14:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
With TFS 2012 you can do work planning with the new agile board, where work is decomposed from PBI to task and  **task are usually estimated in hours**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image10.png)

 ***Figure 1***: *Task estimation is made in hours.*

Using hours is only a matter of convenience, but many agile team does not like hourly estimates and prefer using some other empirical values such as Effort, Story Points, or Cup Of Coffee, where the latter is the number of Cup Of Coffee you need to finish that task :) (dev are caffeine addicted). Avoiding using hours, gave the idea that we are not estimating precisely, especially because we are interested in team Velocity and not knowing how many hours do we need for a certain task.  **For this example suppose our team is used estimating in coc = Cup Of Coffee, and we want the board to reflect this fact**.

The crude fact is that the Estimated effort for task in TFS is just an integer number, and TFS does not care if this number is actually representing hours, Cup Of Coffee or whatever else, it is just a number that can be aggregate with the add operation. The only problem is that **the board shows 4 h, and this immediately gives you the idea that you need to plan in hours**.

If you want to show something like coc = Cup Of Coffee, you first need to import in your computer the CommonConfiguration of the process template with the command

> <font face="Consolas">witadmin <strong>export</strong>commonprocessconfig /collection:</font>[<font face="Consolas">http://localhost:8080/tfs</font>](http://localhost:8080/tfs)<font face="Consolas">/fabrikamfibercollection /p:&quot;test project&quot; /f:c:\temp\commonconfiguration.xml</font>

This is issued against the Brian Keller’s Virtual machine, you should only change the address of the collection to match your collection and the name of the project to match your project. Once the file is downloaded you can edit the xml file changing the*Microsoft.VSTS.Scheduling.RemainingWork* (I’ve used scrum template), and **change the format from *{0} h* to *{0} coc* **.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image11.png)

Now you should update the team project with this new configuration with this command:

> <font face="Consolas">witadmin <strong>import</strong>commonprocessconfig /collection:</font>[<font face="Consolas">http://localhost:8080/tfs</font>](http://localhost:8080/tfs)<font face="Consolas">/fabrikamfibercollection /p:&quot;test project&quot; /f:c:\temp\commonconfiguration.xml</font>

Basically is the same command as before, just change the command from exportcommonprocessconfig to importcommonprocessconfig. If you open again the board you can now verify that** the format used to represent the amount of work is now expressed in Cup Of Coffee **.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image12.png)** Figure 2: ***Task estimation is now show as Cup Of Coffee unit of measure*

The only change is the label: *coc instead of h*, all the rest is the same because it is just a change in how the RemainingWork value is formatted to the user. This changes is reflected in all the part of the agile planner, as an example the capacity of the team is now also measured in Cup Of Coffee.

[![SNAGHTMLeecb1f](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/SNAGHTMLeecb1f_thumb.png "SNAGHTMLeecb1f")](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/SNAGHTMLeecb1f.png)

 ***Figure 3***: *Capacity of the team uses the same format, so you have now capacity in Cup Of Coffee*

If you always use a different unit of measure instead of hours, you can simply  **download the entire process template, change the xml file and upload the process again on the server, so every new Team Project created with that template will use this new configuration**. Just remember that, if you update a common process template, you should  pay attention when you will upgrade TFS with newer version, because you should double check if automatic process template upgrade procedure have not broke the standard upgrade procedure. You can find lot of detail on procedures needed to upgrade process template in MSDN, especially the second link, that shows how to update the process manually if the automatic procedure does not work.

- [Update an Upgraded Team Project to Access New Feature](http://msdn.microsoft.com/en-us/library/ff432837.aspx)
- [Add Features Using a Manual Update Process](http://msdn.microsoft.com/en-us/library/hh500409.aspx)
- [Upgrading to Team foundation Server 11 process templates (channel 9 video)](http://channel9.msdn.com/Blogs/VisualStudio/Upgrading-to-Team-Foundation-Server-11-Process-Templates)

Gian Maria.
