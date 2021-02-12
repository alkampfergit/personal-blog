---
title: "Generate a certificate for Wcf service with windows server 2003"
description: ""
date: 2009-09-09T06:00:37+02:00
draft: false
tags: [Security,Wcf]
categories: [NET framework]
---
In the [previous post](http://www.codewrecks.com/blog/index.php/2009/09/08/use-aspnet-membership-provider-with-a-wcf-svc-service/), I showed how to setup authentication with asp.net membership in wsHttpBinding for a Wcf server, and in that post I showed how to use the utility  **makecert.exe** to generate temporary certificates. In production environment you should generate certificates with a Certification Authority.

If you search in the internet how to generate a certificate with windows server 2003 CA, you find very little information, here is how I did it.

First of all install a CA in your server using [this tutorial](http://www.tacteam.net/isaserverorg/vpnkitbeta2/installenterpriseca.htm). If you have already a CA in your computer or domain you can skip this phase.

Now you need to generate the certificate, browse to the web page that is used to interact with the certification authority, it is usually installed in the default application, on a virtual application called certsrv. In my server I have the default application in port 8000 because port 80 is in use so my address is. [http://localhost:8000/certsrv](http://localhost:8000/certsrv), you can check IIS to find where it is installed. When you access the home page you should press *request a certificate*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image11.png)

Then in the next page you must select  ***advanced certificate request*** and in the next page  **Create and submit a request to this CA.** Now you have a similar form.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image12.png)

The name part must be the dns name of your service, if you want to host in [http://myservice.it/service.svc](http://myservice.it/service.svc) you must specify myservice.it. The type of certificate is *Server Authentication Certificate* and key usage must be *Exchange*, and finally you ask to store certificate in the local computer certificate store. Now press ok, and you will be redirect to  a page that tells you that a request was issued to this certification authority, and you need to wait for the request to be approved.

Now open mmc.exe, choose *certification authority* snap in, goes to the *pending requests* section, and issue the certificate.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image13.png)

Now the certificate is issued, return to the browser, go to initial page of the CA and press  **View the status of a pending certificate request** you will be presented a  list of all request that are pending, you should see your previous request, if you select it you will find a page with a link  **install this certificate**. You need to be an administrator to do it, and after you select that link you will find the certificate in the local computer/personal/certificates. Now install the [wse 3.0 extension from microsoft](http://www.microsoft.com/downloads/details.aspx?FamilyID=018a09fd-3a74-43c5-8ec1-8d789091255d), open the *certificate tool* and you will be presented a similar page

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image14.png)

Choose local computer, and personal, press the *open certificate* button, select the new issued certificate and press ok. Now you see the detail of the certificate, press *View private key file properties* and give permission to read the private key to the user that is used to run the application pool. Now configure the wcf service as explained in the previous post and verify that everything is ok. To generate certificates for the clients, you can simply export the current certificate from the mmc certificate snap in.

alk.

Tags: [WCF](http://technorati.com/tag/WCF) [Certification Authority](http://technorati.com/tag/Certification%20Authority)
