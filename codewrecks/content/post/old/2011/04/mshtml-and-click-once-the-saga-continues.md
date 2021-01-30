---
title: "Mshtml and Click-Once the saga continues"
description: ""
date: 2011-04-14T19:00:37+02:00
draft: false
tags: [ClickOnce]
categories: [NET framework]
---
I must admit that I really do not like deploying Click-Once application that uses MSHTML.dll, because I had several [problem in the past](http://www.codewrecks.com/blog/index.php/2010/07/13/error-during-clickonce-deploy-with-mshtml-strong-name-signature-not-valid-for-this-assembly/) and another one rigth now. Today I have to deploy (click once) a new version of an application that was migrated from VS 2008 to Visual Studio 2010, and I found a really strange problem. When I checked the ApplicationFiles to be sure that MSHTML.dll is included in the Click-once package, I did not see it listed from the available assemblies to be included in the deploy.

[![SNAGHTML271abe4](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/SNAGHTML271abe4_thumb.png "SNAGHTML271abe4")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/SNAGHTML271abe4.png)

 ***Figure 1***: *The Mshtml.dll is missing from the list of assemblies that can be included in the click-once setup.*

I tried to recreate the reference, but it seems that Iâ€™m not be able anymore to include the MSHTML.dll in the click-once deploy after the project was migrated to VS2010. Iâ€™ve tried to deploy the application without it, but as I suspected, if you try to install in a pc without.NET SDK, the installation fails because the computer misses the mshtml.dll prerequisite.

The only solution I found to this problem is to edit the visual studio project file directly (it is a simple XML file), just locate the part where the project references the mshtml.dll file.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image5.png)

 ***Figure 2***: *The Visual Studio project file indicates that mshtml.dll should Embed the interop types*

It is strange, but it seems that Visual Studio decides to embed the interop, so you can simply remove the EmbedInteropTypes and reload the project again, now you should be able to include mshtml.dll again in the ApplicationFiles window.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image6.png)

 ***Figure 3***: *you should now be able to include the mshtml.dll in the clickonce package.*

Now I can deploy the application including mshtml.

alk.
