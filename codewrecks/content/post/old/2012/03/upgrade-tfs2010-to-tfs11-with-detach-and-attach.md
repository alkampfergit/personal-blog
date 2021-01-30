---
title: "Upgrade TFS2010 to TFS11 with Detach and Attach"
description: ""
date: 2012-03-20T20:00:37+02:00
draft: false
tags: [Tfs,Upgrade]
categories: [Team Foundation Server]
---
One of the simplest way to *upgrade with minimum risk* a  **Project Collection** from  **TFS 2010** to  **TFS11 Beta** is using the detach/attach feature of TFS, introduced with version 2010.  Basically all you need to do is Detach the project collection from the old TFS 2010 server and reattach to a brand new TFS11 server, you can read about the whole procedure in an old post that explain how to [**Move a Team Project Collection from one server to another one**](http://www.codewrecks.com/blog/index.php/2010/01/13/moving-a-teamprojectcollection-from-one-server-to-another/).

This operation works because the*attach* routine of TFS11 performs an upgrade during the attach phase and this is done transparently to the user. The real good aspect of this operation is that after the attach process you can reattach the Project Collection in the old server and continue to work wit it. The attach procedure in TFS11 is really simple, when you *restored the Project Collection Database* in the new server, you should open *TFS Administration Console*and choose to *Attach a Project Collection*.

[![List of available Project Collection to Attach](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb22.png "List of available Project Collection to Attach")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image22.png)

 ***Figure 1***: *Attach wizard automatically detect any database that contains a detached Project Collection.*

You should only give a name to the project collection do verification checks and press Attach, everything is done automatically.

[![Result of Attach Operation](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb23.png "Result of Attach Operation")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image23.png)

 ***Figure 2***: *Result of Attach operation, the Project Collection is now converted to TFS11.*

This technique is optimal to  **evaluate the upgrade process** , *without requiring any discontinuity in the service,*all you need to do is detach/attach the Team Project Collection from the old server to the new one, then perform all the manual upgrade operations needed to use new features and perform some test to verify if the upgrade procedure did not ruin anything. All these operation can be performed *while the team still work on the old TFS server* because you can immediately reattach the Project Collection in the old server. When everything is ok you can schedule an offline period where you will do another detach/attach/upgrade to move all the team on upgraded collection.

After the collection is imported you still need to do some manual post upgrade operations if you want to use the new features offered by  **TFS11** , because the imported collection still contains old  **Process Template Definitions** , that does not support new features. To accomplish this operation you need to download [Visual Studio 11 Beta Update Files](http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=29047), a tool to enable new TFS11 features after a Collection was upgraded from TFS2010. You can find a detailed discussion in this MSDN article named: [Updating an Upgraded Team Project to Access New Features](http://msdn.microsoft.com/en-us/library/ff432837%28v=vs.110%29.aspx#download).

If you omit this part you got errors when you try to use new features related to Work Items, if you browse the home page of the project with TFS Web Access you will got an error

[![Errors in Web Access home page because the Process Template was not upgraded](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb24.png "Web Access Error")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image24.png)

 ***Figure 3***: *Imported Team Project still uses old Process Template, new Web Access features are not available.*

After you unzip the Visual Studio 11 Beta Update Files and issued the upgrade command Es. *updateProject " **http://vsalm:8080/tfs/ImportedCollection"** "Tailspin Toys" Agile*you can use all the new cool feature of TFS11.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image25.png)

 ***Figure 4***: *Now everything works, you can see the burndown and tiles for favorites elements*

Now your Project Collection is ready to work with TFS11.

Gian Maria.
