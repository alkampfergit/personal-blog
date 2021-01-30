---
title: "Move a click once deployed application between servers"
description: ""
date: 2010-06-28T14:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I have a winform application that is distributed internally through a dev server with IIS, the application is distributed in the address

[http://10.8.0.5:10444/MyApplicationNameInternal/publish.htm](http://10.8.0.5:10444/MyApplicationNameInternal/publish.htm "http://10.8.0.5:10444/BuzzManagerInternal/publish.htm")

This application is deployed for internal use and test, and when it is stable it gets deployed to customers machine. To avoid problem I need simply to take the version deployed in our internal server and move it in production machine. To do this you can simply move all the content of the IIS folder from the dev server to production server, then use the MageUi.exe program to change the url.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb34.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image34.png)

Thanks to mage, I can simply use my internal test server to deploy test version, and release to outside customers only specific versions.

alk.
