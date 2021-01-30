---
title: "Scvmm could not reset local administrator password during template creation"
description: ""
date: 2010-03-18T11:00:37+02:00
draft: false
tags: [Lab Management,Team Foundation Server]
categories: [Lab Management,Team Foundation Server]
---
Iâ€™m creating some template in SCVMM to be used with lab management, Iâ€™ve created a windows XP client machine, joined to the domain, installed and configured Test Agent and finally I used SCVMM to convert the machine to a template.

The process finish with an error

> <font style="background-color: #ffffff">Could not reset local Administrator password on WinXPIE8 to empty string before starting Sysprep.</font>
> 
> <font style="background-color: #ffffff">(The password does not meet the password policy requirements. Check the minimum password length, etc etc</font>

The problem is that, since the machine was joined to the domain, even if I open gpedit.msc and try to remove those restriction it is not possible. If I log into win xp machine to be sysprepped Iâ€™m not able to set administrator password blank.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image4.png)

You cannot change that policy, because the machine is joined to a windows 2008 domain

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image5.png)

as you can verify it is grayed out :). The only way to solve this problem is to remove those limitation from the server, first of all I created an Organizational Unit where I will put every machine that is related to lab management.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image6.png)

My brand new Organizational Unit is called LabManagement and Iâ€™ve moved the machine to be sysprepped into this new unit, then you need to move to Group Policy Management and create a new policy and link into this new OU.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image7.png)

Now I change the security setting of the new GPO, removing everything related to password change and requirement :).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image8.png)

Iâ€™ve explicitly disabled every setting related to password security. The GPM tool has a beautiful view of every policy that is settled in a GPO, so verify that everything is ok in your new policy object

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image9.png)

Now I restart the client machine so it query active Directory to get the new policy, now Iâ€™m able to change password to zero chars, and if you open gpedit.msx you can verify that everything is working as expected. Here is my new setting on client machine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image10.png)

Now you can sysprep this machine with zero problem :D

alk.

Tags: [LabManagement](http://technorati.com/tag/LabManagement) [Sysprep](http://technorati.com/tag/Sysprep) [SCVMM](http://technorati.com/tag/SCVMM)
