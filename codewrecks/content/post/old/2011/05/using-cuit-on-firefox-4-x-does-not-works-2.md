---
title: "Using CUIT on Firefox 4X does not works"
description: ""
date: 2011-05-31T13:00:37+02:00
draft: false
tags: [CUIT,Visual Studio]
categories: [Visual Studio]
---
Suppose you have downloaded the Feature Pack 2 of Visual Studio 2010, enabled firefox support but when you run a CUIT on firefox you got this error.

> Test method TestProject.CodedUITest1.NavigateNablasoftTest threw exception:        
> Microsoft.VisualStudio.TestTools.UITest.Extension.TechnologyNotSupportedException: The * **selected version of Mozilla Firefox is not supported** *for playback. Go to [http://go.microsoft.com/fwlink/?LinkId=157214](http://go.microsoft.com/fwlink/?LinkId=157214) for information on available add-in for possible support.

This happens because FF 4.x is still not supported, but you can download and install FF 3.6 and use them side by side, just select a custom installation and select a different folder to install both of them (Iâ€™ve chosen c:\program files\Firefox 3.6) and you should be able to install FF 3.6 along with FF 4.x (it is a requirement for web developers that want to check how sites renders on both version of FF browser).

Now you need to create another firefox profile as specified in [this link](http://support.mozilla.com/en-US/questions/793341), with this little trick, Now when I open firefox from the link on the menu I got my 4.1 version, but Iâ€™ve created a link to another profile created with the 3.6 version.

[![SNAGHTML185460c](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/SNAGHTML185460c_thumb.png "SNAGHTML185460c")](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/SNAGHTML185460c.png)

 ***Figure 1***: *Iâ€™ve created a link to a profile for FF3.6 so I can use firefox 3.6 when needed*

Now you should be able to run the CUIT again in FF 3.6 with no problem, because the CUIT engine is capable of choosing the right FF version to run the test.

Alk.
