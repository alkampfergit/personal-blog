---
title: "Use different Excel TFS  VSTS Addin at the same time"
description: ""
date: 2016-09-03T10:00:37+02:00
draft: false
tags: [Excel,Tfs,VSTS]
categories: [Office,Team Foundation Server]
---
If you are a consultant, it is quite common that you work with various version of TFS Server at the same time. I have my personal account on VSTS, always updated to the latest version, but I have also customer that still uses TFS 2012 or TFS 2010.

Microsoft test newer version of TFS against lots of applications to be sure that **newer versions of TFS do not break usage of existing tools.** This means that usually you can upgrade your TFS without worrying that your VS 2010 or Visual Basic 6 stops working. You need to be aware that the opposite is not true. This imply that  **newer version of Visual Studio could not work well with older version of TFS**. This decision is done because Microsoft is encouraging people to keep their TFS installation up to date, and it would be a nightmare to always guarantee that newer tools would be able to communicate with the older service API.

> To minimize compatibility problems, you should keep your TFS on-premise updated to the latest version.

Tool as Visual Studio are usually not a problem,  **you can keep as many VS version you want side by side** , so if you still use TFS2012 you can still use VS 2012 without any problem. But you can have problems with other tools.

Office TFS addin is installed automatically with Visual Studio Team Explorer or with any version of Visual Studio. This means that **whenever you update your VS or you installa new VS version the Office addin is also updated**.

> Starting from Visual Studio 2015 there is no Team Explorer anymore, if you want to install only the Office addin you can use the standalone installer following links on this post from Brian Harry.

In Italian Visual Studio forum [there is a question](https://social.msdn.microsoft.com/Forums/it-IT/48f5d6ce-26ae-4d0e-9897-d255df02f96d/team-foundation-addin-per-excel-non-pi-funzionante-dopo-update-3-di-vs-2015?forum=vstfsit) where a  **user experienced problem in exporting Work Item Query result to Excel after upgrading to Visual Studio 2015 Update 3**. He is able to connect Excel to VSTS, but the addin does not work anymore with on-premise TFS 2012. This situation prove that the addin is working correctly with latest TFS version, but it does not support anymore older TFS version.

The solution to this problem is simple, because you can choose in Excel the addin version you want to use. You just need to go to Excel Settings, then choose Add-ins (1) then manage Com Add-ins (2) and finally press the Go button.

![](https://social.msdn.microsoft.com/Forums/getfile/928586)

 ***Figure 1***: *Managing Excel addins from settings pane.*

If you scroll down the addin list,  **you should see several version of the addin for TFS** , one for each version of Visual Studio you have installed. In my machine I have VS2012, VS2013 and VS2015 so I have three distinct version of the addin.

![]()

 ***Figure 2***: *Multiple TFS Addin installed if you have multiple version of Team Explorer.*

You can understand the version of the addin simply looking at the location, but the cool part is that you can enable more than one addin at the very same time. As a result you have multiple Team ribbon tab in your Excel as shown in Figure 3.

![](https://social.msdn.microsoft.com/Forums/getfile/928591)

 ***Figure 3***: *Multiple TFS Addin enabled at the very same time*

I need to admit that this is not really a nice situation to have, because you are confused and there is no clear clue to which version of the add-in each tab is referring to,  **but at least you can use both of them at the very same time**. If you prefer you can simply enable an old version (say 2012 version) to make sure that it works with your main TFS instance. Usually if you enable an older version it should be capable of working with newer instance of TFS.

I’ve not tested this technique thoroughly but it should work without problem.

Gian Maria.
