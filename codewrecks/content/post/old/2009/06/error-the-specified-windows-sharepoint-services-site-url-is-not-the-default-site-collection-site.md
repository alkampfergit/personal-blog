---
title: "Error the specified windows sharepoint services site url is not the default site collection site"
description: ""
date: 2009-06-12T14:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
Iâ€™m installing Tfs 2008 on a Virtual machine. Following the guide I saw that I need first to install Share Point Services 3.0 SP2 before installing team foundation server. You can find those part in the [guide](http://www.microsoft.com/downloads/details.aspx?familyid=FF12844F-398C-4FE9-8B0D-9E84181D9923&amp;displaylang=en) with the title â€œHow to: Install SharePoint Products and Technologies on Windows Serverâ€.

I followed all the instruction, but when team foundation server installer asked me the address of sharepoint site I tried some url but I got the infamous error

> the specified windows sharepoint services site url is not the default site collection site

The missing part in the guide is that after step 19 you need to create a site collection. First of all verify that you are able to browse the root site you have created in step 18

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image4.png)

Ok now verify that you can browse the site collection at site [http://tfsalkampfer/sites/base/default.aspx](http://tfsalkampfer/sites/base/default.aspx "http://tfsalkampfer/sites/base/default.aspx") where tfsalkampfer is the name of the machine, probably you get a 404 error, so goes to the administration pane of sharepoint services

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image5.png)

You need to click â€œapplication managementâ€ and then â€œCreate site collectionâ€. Now you should see the page to create another site collection

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image6.png)

Please be sure that you are working on the Web application you have created for Tfs, then simply use the /sites/ option in the combo and specify whathever name you want for the web site address, iâ€™ve chosen â€œBaseâ€. Now press ok and verify that the site collection is ok browsing [http://tfsalkampfer/sites/base/default.aspx](http://tfsalkampfer/sites/base/default.aspx "http://tfsalkampfer/sites/base/default.aspx"), now you can set the value [http://tfsalkampfer/sites/](http://tfsalkampfer/sites/) as share point site during Tfs installation, and now everything went ok.

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
