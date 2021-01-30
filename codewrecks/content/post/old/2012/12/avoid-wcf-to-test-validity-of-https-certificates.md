---
title: "Avoid WCF to test validity of HTTPS certificates"
description: ""
date: 2012-12-19T14:00:37+02:00
draft: false
tags: [Wcf]
categories: [NET framework]
---
In a previous article I deal on [How To test ssl based wcf service](http://www.codewrecks.com/blog/index.php/2011/11/21/how-to-test-ssl-based-wcf-services/) and part of the solution is to create a self issued certificate and make it valid inserting generated certificate in Trusted Root Certification Authority.

This operation makes that CA trusted and is an operation that  **is not so good if you really care on the security of your machine**. There is also situation where you want to temporarily disable the check of the validity of the certificate, ES: you need to revoke certificate and issue another one with a new certification trusted authority , or basically you want your application to use a self issued https certificate in your intranet but you do not want to install that CA in everyone computer Trusted Root Certification Authority. Whatever is your need, sometimes there is the need to use WCF over https and ignore completely any certification error (untrusted CA, revoked certificate, etc)

A possible solution is  **disabling the check for certificate validity for the specific application** , and it can be done in a real simple way. First of all handle the event ServerCertificateValidationCallback

{{< highlight csharp "linenos=table,linenostart=1" >}}


ServicePointManager.ServerCertificateValidationCallback += 
  new RemoteCertificateValidationCallback(ValidateCertificate);

{{< / highlight >}}

You can now simply assure that the certificate is always valid.

{{< highlight csharp "linenos=table,linenostart=1" >}}


 public static bool ValidateCertificate(object sender, X509Certificate cert, X509Chain chain, SslPolicyErrors sslPolicyErrors)
 {
       return true;
 }

{{< / highlight >}}

This routine basically  **ignore every certification error, but you can inspect the variable** [**sslPolicyError**](http://msdn.microsoft.com/en-us/library/vstudio/ms145055%28v=vs.100%29.aspx) **to understand the exact type of the error in certificate validation** , if any. With these simple lines of code you are able to use WCF over HTTPS binding with a certificate that is revokes or that comes from an untrusted CA.

Gian Maria
