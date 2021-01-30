---
title: "Team foundation server and excel"
description: ""
date: 2009-08-07T10:00:37+02:00
draft: false
tags: [Excel,Tfs]
categories: [Team Foundation Server]
---
One of the greatest features of Tfs is that it is a single product that is able to manage the whole ALM of an application, but another strength point is high level of integration with other tools. One of the coolest feature is the ability to use Excel to manage workitems, without the need to even open visual studio.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image16.png)

It is enough for you to install the team exploer, and you will get office integration. Excel shows a new tab in the ribbon named â€œTeamâ€ that permits you to work with team foundation server. You can choose item specifying a standard workitem query, or you can directly create new workitem or load by id. As an example you can view all opened bugs.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image17.png)

Thanks to high level of integration, you can edit data with combo, in this screenshot you can verify that I can assign a bug to only valid user of tfs. If you want to change the state of a bug you can see that the state column is missing, all you need to do is to select what column to show.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image18.png)

This means that you can edit all information of every workitem, and when you are finished you can press the â€œPublishâ€ button to send updated data to TFS. This is useful for massive operations on works items, since working in excel is simplier and quickier respect to manage work items in visual studio. This is especially useful for project manager, or similar project figures that are not programmers and does not want to install visual studio only to manage workitems.

Creating a new task is as simple as creating a new line on the worksheet, omitting the workitem id and then press publish, immediately you will see that the id field will be populated, thus confirming that new workitems are really added to tfs.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
