---
title: "Upgrade HP Proliant Microserver N54L Gen7 to Windows Server 2012 troubleshoot"
description: ""
date: 2013-11-27T08:00:37+02:00
draft: false
tags: [HomeLab]
categories: [EverydayLife]
---
Sadly enough if you try to upgrade your Proliant Microserver N54L (or N40L) to Windows Server 2012 R2 **you probably got stuck after the third reboot at 84% when it is time to install computer devices**. The problem is caused by the NIC firmare that is not compatible with Server 2012 R2. Luckly enough, HP just released a patch of the firmware to address this problem, you can find more info in [the last post of this thread](http://h30499.www3.hp.com/t5/ProLiant-Servers-Netservers/Windows-Server-2012-R2-on-HP-Microserver-N36L-N40L-N54L/td-p/6237457#.UpWhUHl3taR).

Actually the new bios is this one.

SOFTPAQ NUMBER:  SP64420  
PART NUMBER: N/A  
FILE NAME:  SP64420.EXE  
TITLE:  System ROMPaq Firmware Upgrade for HP ProLiant MicroServer Servers (For USB Key-Media).  
VERSION:  2013.10.01A  
LANGUAGE:  English  
ROM FAMILY: O41  
REVISION: A

And it fixes the incompatibilities with R2 version of Windows Server,  **if you are interested the** [**direct link of the download is here**](http://h20566.www2.hp.com/portal/site/hpsc/template.PAGE/public/psi/swdHome/?javax.portlet.begCacheTok=com.vignette.cachetoken&amp;javax.portlet.endCacheTok=com.vignette.cachetoken&amp;javax.portlet.prp_bd9b6997fbc7fc515f4cf4626f5c8d01=wsrp-navigationalState%3DswEnvOID%253D4168%257CswLang%253D%257Caction%253DlistDriver&amp;javax.portlet.tpst=bd9b6997fbc7fc515f4cf4626f5c8d01&amp;sp4ts.oid=4310887&amp;ac.admitted=1385537927985.876444892.199480143). The cool part is that the upgrade is really simple, the download contains an utility that will create a bootable usb stick that will do the automatic upgrade for you, just create the usb key, reboot the server with the usb stick installed and you will see upgrade routine that will automatically flash your bios. When you reboot you should see the new date of the bios

2013.10.01 (A) 15 Nov 2013

Now you should insert your Windows Server R2 disk or iso image and you can proceed with a standard installation, everything should go smooth and you can enjoy latest version of MS Server operating system.

Gian Maria.
