---
title: "When older is better"
description: ""
date: 2007-07-10T01:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Yesterday I was called to solve a problem. There is a web application that works with a ActiveX control packaged in a.Cab file, but client machine have standard user logged. What we needed was the following, when a user navigate to a page that contain a reference to that control, IE should automatically download and install the control even if the user have not administrative rights on the machine.

Microsoft explain [how to use Active Directory](http://support.microsoft.com/default.aspx?scid=kb;EN-US;241163) to do this, it is really useful and I found [another article](http://support.microsoft.com/kb/248023/en-us) that explain how to create a valid msi installer file to achieve the result. What I did not like is that if I create the.msi file with the old “[visual studio installer](http://msdn2.microsoft.com/en-us/vstudio/aa718352.aspx)” everything is good, but I did not found a way to make a valid installer in Visual Studio 2005 installer projects. The problem with visual studio installer is that is a old product that can be installed only if you have installed visual studio 6 on your machine. Since the problem can be solved there was no need to investigate further, but I really like to understand how to make  a valid installer to use with UseCoInstall with visual studio 2005

Alk.
