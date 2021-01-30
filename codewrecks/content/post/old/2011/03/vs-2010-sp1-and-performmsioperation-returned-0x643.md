---
title: "VS 2010 SP1 and PerformMsiOperation returned 0x643"
description: ""
date: 2011-03-09T09:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Visual Studio]
---
Yesterday I tried to install Service Pack 1 for Visual Studio 2010, and the installation failed after few minutes. Looking in the logfile I found some errors:

*PerformMsiOperation returned 0x643*

The very first error is

*The following applications should be closed before continuing the install:: , TfsCommandRunnerSvr, TfsCommandRunnerSvr (Process Id: 5844), TFS Power Tool Shell Extension (TfsComProviderSvr)       
[3/8/2011, 22:0:39] Returning IDIGNORE. INSTALLMESSAGE\_FILESINUSE [User response to File In Use dialog]*

The solution is to install SP1 after a clean reboot, Just login into the system and start installing SP1 before opening VS or using TFS Shell Extension. If you still find problem try to kill the TfsComProviderSrv process. In my situation a reboot was enough to solve the problem.

Alk.
