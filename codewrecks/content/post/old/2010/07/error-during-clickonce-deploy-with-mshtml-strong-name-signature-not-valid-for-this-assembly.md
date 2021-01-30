---
title: "Error during clickonce deploy with mshtml 8211 Strong name signature not valid for this assembly"
description: ""
date: 2010-07-13T07:00:37+02:00
draft: false
tags: [Net]
categories: [NET framework]
---
To deploy application that use mshtml with clickonce, you need to be sure that microsoft.mshtml.dll is included in the setup of click once, or the application will not install if mshtml.dll is not present on the machine at the time of deploy. But if you include it sometimes clients are not able to install application due to the following error

*Strong name signature not valid for this assembly Microsoft.mshtml.dll*

this is due to the fact that you reference a partially signed version in your project. To solve this remove the reference to mshtml.dll and reference the dll in

*C:\Program Files (x86)\Microsoft.NET\Primary Interop Assemblies\Microsoft.mshtml.dll*

Remove the (x86) if you are on a 32 bit system. Now with the reference to this assembly be sure that is included in the clickonce application files and everything should now work.

alk.
