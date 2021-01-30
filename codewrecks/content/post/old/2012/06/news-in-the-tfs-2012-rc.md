---
title: "News in the TFS 2012 RC"
description: ""
date: 2012-06-06T06:00:37+02:00
draft: false
tags: [VS2012]
categories: [Team Foundation Server]
---
I heard many different reactions on the new Team Explorer in Visual Studio 2012, some people really likes it, some other still need to familiarize with it,  **but most of them complained that they find difficult to associate a Work Item to a check in because the drop down list in VS 11 beta only permits you to specify the id of the work item**. The only way in VS2012 to associate a WI to the Chec-in is dragging a Work Item from a Query result to the *Related Work Items area of Pending Changes*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/06/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/06/image.png)

 ***Figure 1***: *Associate a Work Item to the check-in dragging the work item to the Related Work Item area of the Pending Changes section*

This behavior is annoying, because we need to go away from the Pending Changes window, navigate to the Work Item section of the Team Explorer, then issue the query to show results, finally return to Pending Changes and execute Drag&Drop. This is quite clumsy, but it is consistent with the new way to work, because  **the new Team Explorer is designed to easy find own work, so the standard workflow of a programmer is;: open “my work”, start to work on a Task/Bug/etc clicking on “Add to In Progress”, and when it is time to Check-in you already associated the Work Item because it is In Progress** , so you do not need to browse to search for Work Item.

Since lots of developer were already used in associating the Work Item during Check-in and not before in the Visual Studio 2012 RC now you have the ability to query Work Item directly from the Pending Changes area, because  **you have a Queries button that shows all of your personal queries**. Once the query ran, you can drag and drop as usual Work Item to the Related Work Items area.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/06/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/06/image1.png)

 ***Figure 2***: *Ability to run personal query directly from the Pending Changes area*

You have also a third option, just search work item by full text in the appropriate textbox as visible in Figure 3, you  **just type search query in the textbox, press enter and the choose “Open as Query”, then you can simply press the “back” button on Team Explorer and you are back to Pending Changes where you can Drag Work items to associate to Check-in** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/06/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/06/image2.png)

 ***Figure 3***: *Full search in Work Item, then open as Query*

This third capability is the best one, because permits you to do a Full Text search inside work item, but you can also create with easy complex queries as represented in Figure3 where I search all task assigned to me with the string  **t=task A:”@Me”**. This****is much more flexible if you do not have a personal query ready but you remember part of the text of the Work Item or you want simply choose all WI of a certain type assigned to you.

Happy TFS.

Gian Maria
