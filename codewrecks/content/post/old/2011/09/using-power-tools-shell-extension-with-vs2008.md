---
title: "Using Power Tools Shell Extension with VS2008"
description: ""
date: 2011-09-01T11:00:37+02:00
draft: false
tags: [Tfs,Tfs Power Tools]
categories: [Team Foundation Server]
---
Iâ€™m a great fan of TFS power tools, and working as a consultant it is normal for me to use TFS2010 as well TFS2008 servers, because some of my customers still uses TFS2008. In my laptop Iâ€™ve installed VS2008, team explorer and the latest power tools ([August 2011](http://visualstudiogallery.msdn.microsoft.com/c255a1e4-04ba-4f68-8f4e-cd473d6b971f)), then I mapped a workspace from VS2008, but when I right click on mapped folder, no â€œTeam Foundation Serverâ€ menu appears in contextual menu.

All workspaces of TFS2010 have Shell Extension enabled, but the one with TFS2008 was not recognized by the Shell Extension. This happens because Power Tools use the VS2010 Object Model and when you connect to TFS2008 with VS2008, the Team Explorer of VS2010 knows nothing about that workspace. This means that the extension does not recognize the folder as belonging to a workspace, thus no Team Foundation Server menu appears.

The solution is quite simple, you should open VS2010, connect to TFS2008 and verify that the mapping done in VS2008 is visible and working in Source Explorer.

[![01-09-2011 13-16-57](http://www.codewrecks.com/blog/wp-content/uploads/2011/09/01-09-2011-13-16-57_thumb.jpg "01-09-2011 13-16-57")](http://www.codewrecks.com/blog/wp-content/uploads/2011/09/01-09-2011-13-16-57.jpg)

 ***Figure 1***: *Connection windows from VS 2010 to TFS2008, you can verify that it recognize a single project collection with the same name of the server and the three team project.*

If you prefer, you can open a *Visual Studio  **2010** command prompt*, move to the folder mapped in the workspace and issue a simple

*tf workspace*

command, this should show the definition of the workspace defined on that folder.

[![01-09-2011 13-26-32](http://www.codewrecks.com/blog/wp-content/uploads/2011/09/01-09-2011-13-26-32_thumb.jpg "01-09-2011 13-26-32")](http://www.codewrecks.com/blog/wp-content/uploads/2011/09/01-09-2011-13-26-32.jpg)

 ***Figure 2***: *Command tf workspace shows details about the workspace.*

Now the Object Model of VS2010 is aware of the workspace, even if it is against a TFS2008 server, now you can right click (sometimes you need to wait some minutes) the folder and you should see the Team Foundation Server Menu and you should be able to use Shell Extension to a workspace against a TFS2008 server.

Gian Maria.
