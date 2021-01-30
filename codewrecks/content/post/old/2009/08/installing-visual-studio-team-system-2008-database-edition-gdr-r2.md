---
title: "Installing Visual Studio Team System 2008 Database Edition GDR R2"
description: ""
date: 2009-08-06T01:00:37+02:00
draft: false
tags: [VSTSDBEdition]
categories: [NET framework]
---
Today I need to install [VSDB edition GDR](http://www.microsoft.com/downloads/details.aspx?FamilyID=bb3ad767-5f69-4db9-b1c9-8f55759846ed&amp;displaylang=en) into a older virtual machine, I just fired the installer and got this error.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image12.png)

*Visual Studio Team System 2008 Database Edition GRD Does Not Apply or is blocked by another condition on your system. Please click the link below for more details.*

If you click the link you will be redirect to the download page, but if you look carefully you can find detailed installation instructions scrolling down the page

>  **Install** > Localized versions of â€¦â€¦
> 
> 1. Install Microsoft ® Visual Studio Team System 2008 Database Edition SP1 (English) or Microsoft ® Visual Studio Team System 2008 Suite SP1 (English)
> 2. <font color="#ff0000"><strong><em>Uninstall the Database Edition Power Tools if installed.</em></strong> </font>To uninstall the Power Tools from the command line, use: msiexec /X {EA016DAB-E08A-46FB-BBF0-ED6EB8FD4671}
> 3. * **<font color="#ff0000">Uninstall any previous version of the GDR for Database Edition</font>** *. To uninstall a previous version of the GDR from the command line, use: msiexec /X {DDF197C6-4507-3A19-A4B5-0E17CC931370}
> 4. * **<font color="#ff0000">Install Microsoft ® Visual Studio 2008 Service Pack 1 </font>** *
> 5. Install Visual Studio Team System 2008 Database Edition GDR by running the self-extracting executable SETUP.EXE.

In my situation I have to uninstall previous version of GDR

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image13.png)

But I need also to reinstall the SP1 even if it was already installed on that machine. After those operation all went good and the GDR R2 installs perfectly.

alk.

Tags: [Visual Studio Team System Database Edition](http://technorati.com/tag/Visual%20Studio%20Team%20System%20Database%20Edition)
