---
title: "Moving a TeamProjectCollection from one server to another"
description: ""
date: 2010-01-13T13:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
One of the new feature of TFS 2010 is the concept of Project Collection, that is a sort of container for Team Projects. You can think that a Project Collection can be used to have a sort of multiple TFS inside one single server. If you have multiple customers, and you want them to access your TFS, but you want to be sure that customer A cannot see team projects of customer B, you can create a separate project collection for each customer.

One cool feature is that you can move/copy project collections between servers, I have downloaded the trial of VS2010 as [explained in Brian Kellerâ€™s blog](http://blogs.msdn.com/briankel/archive/2007/09/06/a-more-reliable-and-faster-download-experience-for-rosario-vs08-vpc-s.aspx), then I worked on the hyper-v version of the machine for a couple of session in Italy, then I need to move everything I did into another blank VM that uses Virtual Pc, to be run when Hyper-v is not available. To move my modified collection I disconnected the project collection from the original tfs instance.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image7.png)

Once the Project collection was disconnected I simply did a database backup, then moved the backup on the other machine. In the destination machine I detach the original project collection, then restore the database backup from the source machine and reattach the collection again. When you clicked on the â€œAttach Team Project collectionâ€ button a dialog will appear

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image8.png)

In my situation I can verify that a single project collection is importable, the one I detached in the previous step, but now I restored the database from the source machine and that collection contains my new project. After I finished attaching the collection I can verify that it now contains my new Team Project. I got some warning from the process, because the import process find that reporting services and sharepoint already exists (I imported in a machine where that collection already existed) so it tells me to verify if reporting and sharepoint works as expected.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image9.png)

As you can see the DefaultCollection contains my new project I created on another machine and the ProjectCollection was moved between tfs instances.

alk.
