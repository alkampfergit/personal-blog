---
title: "Resolve associated Work Item at each check-in"
description: ""
date: 2015-09-23T16:00:37+02:00
draft: false
tags: [TFVC]
categories: [Tfs]
---
 **If you work with TFVC when you Check-in your code, the default action is close associate Work Item**. VS2015 has an option for you in Settings pane of the Visual Studio Team Foundation Server Source Control to change this default behavior to associate.

As you can see in  **Figure 1** the default value is to *Resolve associated Work Items on check-in* but you can easily uncheck the option to make “*Associate”*the default action for Work Items associated to a Check-in.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image5.png)

 ***Figure 1***: *Option to resolve associated Work Items on Check-in*

In previous version of Visual Studio (2010, 2012, 2013) you can use a Registry key, as described in [this old post of Matt Mitrick](http://blogs.msdn.com/b/mitrik/archive/2010/12/03/how-to-make-associate-the-default-action-for-work-items.aspx) to obtain the same result.

Gian Maria.
