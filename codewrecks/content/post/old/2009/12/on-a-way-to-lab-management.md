---
title: "On a way to lab management"
description: ""
date: 2009-12-12T08:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Visual Studio]
---
Iâ€™m installing Lab Management, and since it is a complex environment some problems can arise. Iâ€™m following the four part tutorial that [you can find here](http://blogs.msdn.com/lab_management/archive/2009/11/18/Getting-started-with-Lab-Management-_2800_Part-1_2900_.aspx), and this morning I face the first problem.

When I try to add my Hyper-V host to the Vitual Machine Manager (SCVMM) I have this problem.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image11.png)

As you can see, when I try to add an Hyper-V enabled machine (The same where SCVMM is running) it tells me that virtualization software is Unknown, even if hyper-V is up and running fine.

To address such problem, you need to install a couple of programs, the first one is the [Microsoft Baseline Configuration Analyzer](http://www.microsoft.com/downloads/details.aspx?familyid=DB70824D-ABAE-4A92-9AA2-1F43C0FA49B3&amp;displaylang=en), that is needed to install and run System Center [Virtual Machine Manager configuration Analyzer](http://www.microsoft.com/downloads/details.aspx?FamilyID=02d83950-c03d-454e-803b-96d1c1d5be24&amp;displaylang=en#filelist). In my situation I immediately see an error.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image12.png)

I installed IIS, but this does not solve my problem, So I checked event log, and I see some strange errors related to hper-V (14050), and [I found some information he](http://www.aspdeveloper.net/tiki-index.php?page=VirtualServerEvents_14050)re. I check my network settings, correct a little problem and then trying again to add the machine. The error was still there, the machine has â€œUnknownâ€ virtualization software. My only possibility was to continue the installation, asking to SCVMM to enable hyper-v role. When I finish the operation the script runs fine, it enabled instantaneously the Hyper-V role (it was already up and running) and the installation went good.

alk.

Technorati Tags: [Lab Management](http://technorati.com/tags/Lab+Management)
