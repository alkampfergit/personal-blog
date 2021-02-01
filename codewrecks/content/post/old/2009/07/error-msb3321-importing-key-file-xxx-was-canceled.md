---
title: "error MSB3321 Importing key file xxx was canceled"
description: ""
date: 2009-07-01T01:00:37+02:00
draft: false
tags: [Programming]
categories: [Programming]
---
I start to got this error from my Continuous integration machine, after I setup a project for deploy with clickonce the build begins to fail. I'm using CC.net with msbuild scripts and in detailed error I see a message like

> The "ResolveKeySource" task failed unexpectedly.
> 
> System.InvalidOperationException: Showing a modal dialog box or form when the application is not running in UserInteractive mode is not a valid operation. Specify the ServiceNotification or DefaultDesktopOnly style to display a notification from a service application.

This error happens because when the project has a certificate used by click once, you need to import that certificate in order to compile, and since my certificate is password protected the system need to show a form that ask for password to import certificate. Since cc.net runs as service it tries to shows the dialog, but it cannot gain access to a user interface and fail miserably.

The solution is to create a specific user to use for cc.net service (a good practice that you should always do), open a command prompt with credentials of that user, run your build script and wait for the form that ask you the password of the certificate. Once you give the password to msbuild script it installs into appropriate location and subsequent builds will run just ok.

Alk.

Tags: [CC.Net](http://technorati.com/tag/CC.Net)
