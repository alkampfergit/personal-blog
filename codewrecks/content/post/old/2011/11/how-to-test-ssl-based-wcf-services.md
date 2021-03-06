﻿---
title: "How to test SSL based WCF services"
description: ""
date: 2011-11-21T11:00:37+02:00
draft: false
tags: [IIS,Wcf,WCF IIS7]
categories: [ASPNET]
---
I usually work with WCF service that needs to be secured with Certificates or simply using HTTPS. The usual question from other dev in the team is “how can I simulate HTTPS to work with WCF?”

The problem arise that to test https sites, people usually work with IIS self issued certificates.

[![SNAGHTMLa82f3d](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/SNAGHTMLa82f3d_thumb.png "SNAGHTMLa82f3d")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/SNAGHTMLa82f3d.png)

 ***Figure 1***: *Self-Signed certificate in IIS*

This works great for sites, you can use the auto signed certificate in your sites in https binding, then when you navigate to the site you usually got an error because the certificate is not issued for the right site. What I need is usually to modifiy the hosts file in windows, creating an alias of [www.mydomain.com](http://www.mydomain.com) to 127.0.0.1, so I can directly point to the right address with WCF client application and can simply manage to use the local or remote service simply modifying the hosts file.

Sadly enough, WCF does not tolerate problem in certificates and this makes useless working with Self-Signed Certificate. To be able to use a WCF Service secured with SSL in your dev machine you should issue yourself a valid certificate. The solution is using the SelfSSL.exe tool that comes with the [IIS6 Resource Kit Tools](http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=17275).

Once installed you can simply go to installation folder with Administrator Command Prompt (you need to launch the command prompt as administrator or it wont work) and simply create a valid certificate with this command line

* **Selfssl /N:CN=www.codewrecks.com /V :2000 /S:3** *

as you can see with the option /N:CN you are able to specify the Common Name you want to use, the /V option is used to specify the duraction in years of the certificate, and the /S: is used to specify the Id of the site you want to change, just select the “site” node on IIS7 administration console to see the ID assigned to each site.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image4.png)

 ***Figure 2***: *How to find Site ID from IIS administration console*

Now your site should have https binding enabled and it should use the autogenerated certificate, but if you browse the site your browser is still telling you that the certificate is not valid. If you open your certificate from the IIS administration console (just select the root node with your computer name and select *Server Certificates* from the IIS section on the right and double click on the desidered certificate) you can verify the error.

[![SNAGHTMLb106f5](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/SNAGHTMLb106f5_thumb.png "SNAGHTMLb106f5")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/SNAGHTMLb106f5.png)

 ***Figure 3***: *The certificate is not valid because the certification authority is not trusted*

The problem is that the Certification Authority of this certificate is not trusted, so you need to export this certificate to a file, just right-click the certificate and choose “Export”. (remember that you should choose a password to export the certificate)

Now open the mmc certification snap in (just Start-&gt;Run-&gt; **mmc.exe certmgr.msc** ) and choose to import the certificate you just exported

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image5.png)

 ***Figure 4***: *Import the certificate from the Certificates manager.*

Choose the file you previously exported, insert the password you used for the export, then proceed to import the certificates. At the end of the operation, if you open again the certificate from the IIS administration console, everything should be ok.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image6.png)

 ***Figure 5***: *The certificate is now ok and can be used to secure your sites*

If this does not works, and you still got errors when you browse your local site through Https, probably the certificate was imported in the wrong path, just import the exported certificate again as shown in  **figure 4,** but when you are asked for the location where you want to import the certificate press the button browse ( **Figure 6** )

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image7.png)

 ***Figure 6***: *Import the certificate to a specified location.*

Now choose the location as shown in  **Figure 7** and everything should work ok.

[![SNAGHTMLbcf691](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/SNAGHTMLbcf691_thumb.png "SNAGHTMLbcf691")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/SNAGHTMLbcf691.png)

 ***Figure 7***: *Choose the exact location where to import the certificate.*

Now modify the hosts file, mount your WCF service and verify with WCF test client that everything is ok.

Gian Maria.
