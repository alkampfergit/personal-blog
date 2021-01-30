---
title: "Windows Live Messenger error 81000395"
description: ""
date: 2008-07-22T05:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Yesterday I could not connect to Windows live messenger, it gave me error 81000395 telling me that the service was not avaliable. This morning the problem is still there…so I googled a little bit to find solution. I found a lot of thing but noone worked

1) Uninstall and reinstall (did not work)  
2) Uninstall and reinstall old version (It tells me that I need to upgrade an I cannot log)  
3) Disable firewall   
4) Dance some macumba in front of the the pc…..still not work :D  
5) The laptop connected well so the problem is on my desktop….

Then I found [this post](http://www.eggheadcafe.com/software/aspnet/28954005/-are-you-encountering.aspx).

It seems absurd, but here what it happened. This post told you to enable logging, then send the log to the team that will help you to find the solution. I follow the instructions, and deleted all files that are in the Messenger received file folder, then enable logging, then try to log and…..the problem was gone :D. Then I disconnect and try to connect again….no way.

After 10 minutes I discovered that the problem is originated from Avg antivirus, when I disabled the MSN protection everything works again. After 4 years is the first time that AVG gives me problem, now I keep MSN protection deactivated, and I’ll wait for some upgrade.

alk.
