---
title: "TFS Integration platform finished sync from codeplex"
description: ""
date: 2010-05-04T07:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
Some [days ago](http://www.codewrecks.com/blog/index.php/2010/03/19/tfs-integration-platform-to-synchronize-from-codeplex-to-tfs2010/) I tried [TFS Integration Platform](http://tfsintegration.codeplex.com/) to sync a project ([Dexter](http://dexterblogengine.codeplex.com/)) from codeplex to a local test TFS with Lab Management capabilities enabled. At that time the sync process did not work very well, the server take a long time before raising an exception and I did not have time to investigate further.

Yesterday I downloaded the latest version, dated 24 April, and try again the sync process. The most interesting stuff is that I was able to open the old project, and start again from the point it was stopped last time, cool. After an hour here is the result.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image5.png)

It finished and it is Green, finally, now I moved to the TFS to see what is happened.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image6.png)

Checkins are there, and clearly, they are numbered differently from the original codeplex tfs :) because in this tfs I have only a couple of test projects. All checkin are made by TfsAdmin, the user I used to connect to my local TFS but the comment in the checkins are preserved

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image7.png)

Source file are all there

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image8.png)

Surely TFS Integration Platform is a project that evolves a lot, it is constantly maintained and you cannot miss it if you work with TFS.

Alk.
