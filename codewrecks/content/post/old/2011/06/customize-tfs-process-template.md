---
title: "Customize TFS Process Template"
description: ""
date: 2011-06-22T06:00:37+02:00
draft: false
tags: [ALM,Process Template,Tfs]
categories: [Team Foundation Server]
---
One of the best aspect of TFS is that it is customizable: we can interact with API, customize builds, handle events and many other interaction, but one of the most important is the ability to customize the [process template.](http://msdn.microsoft.com/en-us/vstudio/aa718795)

![](http://www.gorpal.com/Resources/Images/BridgingGap.jpg)

This capability is fundamental, because permit to adapt TFS to own process, the mantra is ** **do not adapt your process to the tool, but adapt the tool to your process** **. The purpose of an ALM tool is to support your own process, not to force the team to shape itself just to conform to the tool. The ability of a tool to adapt itself to the scenario is the key factor in choosing between various alternative. If you need a wrench you can buy the left one, that works only for a couple of bolt dimension, or you can buy the right one that is adaptable to various bolt's dimension.

![](http://withfriendship.com/images/d/19200/Wrench-image.jpg)![](http://wiki.teamfortress.com/w/images/thumb/0/0e/Wrench_IMG.png/250px-Wrench_IMG.png)

When you start using TFS you can surely start from one of the available Process Template, but usually you should do an [assessment phase](https://www.microsoft.com/assess/Pages/CapabilityTypeSelection.aspx?CatID=912aa1c7-813c-4e30-be0c-02d3f4daa68e) to understand **where you are** then decide **where you want to go**. The most common error is choosing a process template, like MSF for agile and change the way the team work to follow the template. I do not want to say that MSF for Agile is a bad process, but usually your team already has established procedures and processes and it is an error to throw everything away just because a *TFS process* tell us how we should work.

![](http://www.vectorstock.com/assets/preview/251572/business-team-solution-in-process-management-flowc-vector.jpg)

The good news is that you can take a process template and adapt to your need, or you can create an entire template from scratch. The first step is installing [power tools](http://visualstudiogallery.msdn.microsoft.com/c255a1e4-04ba-4f68-8f4e-cd473d6b971f), because they have a graphical Process Template editor that can give you a better editing experience.

The very first step is choosing *process Template Manager* from the Team Project Collection context menu.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Tfs-e-customizzazione-del-process-templa_93B5/image_thumb.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Tfs-e-customizzazione-del-process-templa_93B5/image_2.png)

 ***Figure 1***: *Right click on project collection, then select Team Project Collection Settings –&gt; Process Template manager.*

Now you have the ability to choose one of the installed process templates and download its definition to local machine.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Tfs-e-customizzazione-del-process-templa_93B5/image_thumb_1.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Tfs-e-customizzazione-del-process-templa_93B5/image_4.png)

 ***Figure 2***: *You can choose a process template, and download its definition to a local directory.*

If you look in download directory, you will see a bunch of XML files that you can edit directly with a XML editor to change the template; if you prefer a graphical editor, power tools has a better editing experience. Just open the Tools –&gt; process Editor –&gt; Process Templates –&gt; Open Process Template to open the *process Template Editor*.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Tfs-e-customizzazione-del-process-templa_93B5/image_thumb_2.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Tfs-e-customizzazione-del-process-templa_93B5/image_6.png)

 **Figura 3:** *Aprire il PTE per poter editare il processo scaricato nel passo 2.*

You need to navigate to the folder where you downloaded the process template, open the *processTemplate.xml* file and you can start editing with a GUI tool. I'll explain in future post how you use this editor to customize the various part of the template, stay tuned.

Alk.

Tags: [TFS](http://technorati.com/tag/TFS) [ALM](http://technorati.com/tag/ALM)
