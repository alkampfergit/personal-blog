---
title: "Search in Tfs Work Items never was so easy "
description: ""
date: 2011-12-21T11:00:37+02:00
draft: false
tags: [Power Tools,Tfs]
categories: [Team Foundation Server]
---
The search box functionality was introduced with the August release, but I see that some people still does not know it. This question arose during a talk about how to handle the lifecycle of a bug, and when it was time to deal with the “avoid duplication” issue, people told me that they want a simple way to search work item by text, because this is the fastest way to verify if a bug has some duplicate.

Basically the needs you have during search for duplicates is to be able to do a free text search inside title and description to Work Item and a quick way to create duplicate candidate lists, that you need to share with testers and others to verify that they really are duplicates.

The search feature was present in the web interface since the first RTM of TFS 2010, but it is quite often overlooked, because not every person uses the web interface. All you need to do is browse to your Web Interface page (ex. [http://localhost:8080/tfs/web/I](http://localhost:8080/tfs/web/I)) you can notice a nice TextBox to search in Work Items.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image3.png)

 **Figure 1** *: Search functionality inside the Team Web Access application*

But if you have latest power tools installed, you can search directly from Visual Studio, just be sure that you are visualizing the Work Item Tracking toolbar and you should see a nice texbox where you can simply type something and press enter to search.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image4.png)

 ***Figure 2***: *The new free text search textbox added with TFS Power Tools*

Clearly this is really easier and faster than using the web interface. In the December 2011 update you  can use to open a Work Item by Id, simply press the Id and press enter and Visual Studio immediately opens the corresponding work item.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image5.png)

 ***Figure 3***: *Just type the id and press enter to edit a work item if you know the id.*

Do not forget that you can always Right-Click the Work Item and choose “Copy Work Item Shortcut”, this is an extremely useful function if you want to give people not used to Visual Studio the ability to quick edit a work item, just give them the link, and if they have permission, they can view/edit the WO directly from the web.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image6.png)

 ***Figure 4***: *A link to a work item is a Url that points to the edit view of the Work Item.*

This functionality is useful during bug duplication to quick build a series of possible duplicate bug list that is usable from every person in the team that has access to the Web. If you look at the documentation of the Work Item Search Functionality, you can notice that you can even specify complex filter, like “cart T=Bug” that basically search the term cart only in work item Type = Bug.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image7.png)

 ***Figure 5***: *You can issue complex query to the work item search.*

Now suppose the search returns a bunch of Bugs, you can select those one that you believe are duplicates, and then simply Right-Click and choose to “copy Work Item Shortcut” to quick create a list of duplicates, or you can open all those Work Item in project or Excel, or send to Outlook because maybe you need to email to the test team, asking them if that group of Bug are really duplicated.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/12/image8.png)

 ***Figure 6***: *You can create a mail with a single click that contains all selected Work Items.*

You can see that the Ids are clickable and as you can suspect, each link opens the related work item in the Team Web Access web site. Armed with all these possibilities, searching and reviewing list of possible duplicated bug is really easier.

Gian Maria.
