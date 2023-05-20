---
title: "Install Sharepoint Foundation on Workstation error the user does not exists or is not unique"
description: ""
date: 2012-04-17T19:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
I wish to install  **Sharepoint Foundation 2010 on a Single Workstation machine** (Windows Server 2008 R2) to use with TFS11 Beta and I followed the [really good guide](http://www.dev4side.com/community/blog/2010/5/2/how-to-install-sharepoint-2010-with-a-local-account.aspx) of my friend [Giuseppe Marchi](http://www.peppedotnet.it/) to accomplish this task, but I got a really strange error when I tried to configure the database with powershell

> the user does not exists or is not unique

This is a real annoying stuff, because I’m not a Sharepoint Expert, so I started looking around to understand the cause. First of all you need to be sure to have latest Identity Foundation installed ([you can find installer here](http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=17331)). Then you need to create an account different from Administration, in my example I created a user named WssService and *give a complex password so it met the password complexity rule of the System*. Make this user an administrator of the machine and be sure that it is also an administrator of the SQL Server instance, because he should be able to create databases, be sure also to download [Sharepoint 2010 foundation Service Pack 1](http://www.microsoft.com/download/en/details.aspx?id=26640), because it will maximize the success rate.

Then fire a  **Sharepoint 2010 management shell** , and run a New-SOConfigurationDatabase command, it will ask you the following questions

1) Database name, answer is: [SharePoint2010\_Config](http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=17331 "http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=17331")  
2) Database Server, answer is:  **name of the local machine\instance name** It is really important that you do not specify localhost or (local) as database server, you need to type the exact name of the machine and the instance name if needed

3) FarmCredentials, answer is: nameofthemachine\wssservice

For point 3 it is really important that you use NAMEOFMACHINE\NAMEOFUSER where NAMEOFUSER is the user you created previously (in my example is wssService. if you specify NameOfUser without NAMEOFMACHINE probably you will get the above error.

4) PassPhrase, answer is: a complex password for sharepoint installation, I used the very same password of the aforementioned user (WssService).

It should work, or at least it worked for me.

[![17-04-2012 15-56-06](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/17-04-2012-15-56-06_thumb.png "17-04-2012 15-56-06")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/17-04-2012-15-56-06.png)

Gian Maria.
