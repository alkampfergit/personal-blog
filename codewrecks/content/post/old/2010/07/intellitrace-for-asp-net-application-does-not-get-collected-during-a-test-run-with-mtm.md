---
title: "Intellitrace for aspnet application does not get collected during a test run with MTM"
description: ""
date: 2010-07-02T06:00:37+02:00
draft: false
tags: [Microsoft Test Manager]
categories: [Team Foundation Server]
---
If you have problem collecting intellitrace during a test run with MTM for an asp.net web application, and you really checked everything but cannot find any clue, check the user you are using to run the application. I have an installation where, using the default application pool will result in intellitrace being collected, while if I use a domain user to run application pool, when I try to signal a bug from MTM, no intellitrace is in the bug's attachment.

The reason of this problem could derive from missing User Profile. Intellitrace is using User Profile to inject environment variables per owner of the application pool, and since User Profile is an OS feature, if no User Profile is loaded by OS, intellitrace could not inject variables, and data gets no collected.

The solution to this problem is to force OS to load user profile for the user before starting the test. Suppose the user that runs the application pool is named tfslab\webAppUsr, you simply need to run this command from a command prompt before you start the test

 **runas  /user:tfslab\webAppUsr /profile cmd.exe** This command simply opens a command prompt with the credentials of the user, thus the OS will create the User Profile. Now keep the cmd.exe windows open during the test, run the test again, and this time intellitrace data should be collected.

alk.
