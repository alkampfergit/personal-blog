---
title: "Visual Studio 2008 designer hangs"
description: ""
date: 2010-04-23T08:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Visual Studio]
---
This morning, while I was playing with uninstalling office 2010 beta and reinstalling office 2010 RTM I was working, as usually, on a web application.

I opened an aspx file, then click the â€œDesignerâ€ button, and Visual Studio 2008 hangsâ€¦.I waited a couple of minutes, then I terminated it. I verified and VS2008 is hanging every time I try to open a webform in design mode, going to Tools-&gt;Options-&gt;HTML Designer-&gt;Css Styling, I have the very same problem, VS2008 completely freezed, and I need to terminate it from task manager.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image17.png)

The problem should be related to office, because the only difference from yesterday is that Iâ€™ve uninstalled and reinstalled office. Moreover when the VS hangs, it does not use processor time, and seems that it is waiting form another external componentâ€¦. guess whatâ€¦

I begin investigating to see if some other person has the same problem, and I found [this link](http://forums.asp.net/t/1231941.aspx). In the end odlouhy tells that he see a setup.exe program running whenever he tried to opened the designer, so I fired again VS and task manager, goes to CSS Styling menu and I verified that a setup.exe process immediately opens up. This confirms my suspicions, probably VS is launching that setup.exe program and waits for it to finish doing something.

I right click in the process manager and choose â€œOpen file Locationâ€ to see where is the setup.exe that is causing this, and I found this folder

*C:\Program Files (x86)\Common Files\microsoft shared\OFFICE12\Office Setup Controller*

that contains a setup.exe, if you launch manually as administrator you can find this screenshot

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image18.png)

Now I decided to repair the installation and everything is come back again working as expected. This can be probably due to uninstall of office2010 beta components, since yesterday everything works perfectly :)

Hope this will help you if you have the very same problem.

alk.
