---
title: "Error publishing Click-once moving from NET 35 to 45"
description: ""
date: 2014-05-20T05:00:37+02:00
draft: false
tags: [ClickOnce]
categories: [NET framework]
---
I’ve a customer where we set up a TFS Build that automatically compile, obfuscates assembly and finally publish with click-once on an internal server. As a part of the process, a tool is used to move the published packages from the internal server to public server, to make it available to final customers. This tool uses mage.exe to change some properties of the package and then repack to publish to final server.

When the  **solution moved from.NET 3.5 to.NET 4.5, published application failed to install with this error** :

> ERROR SUMMARY  
> Below is a summary of the errors, details of these errors are listed later in the log.  
> \* Activation of [http://www.mycompany.net/test/uploadtest/uploadtest.application](http://www.mycompany.net/test/uploadtest/uploadtest.application) resulted in exception. Following failure messages were detected:  
> +  **Application manifest has either a different computed hash than the one specified or no hash specified at all**.   
> + File, UploadTest.exe.manifest, has a different computed hash than specified in manifest.

We first thought that the culprit was the obfuscation process or something related to the build process, because publishing directly from Visual Studio generates a correct installer. Then we were able to replicate the error with a simple application with a single form so we were sure that something wrong happened during the build+publish process. Finally we determined that the problem generates when the published url for the package is changed during the build to point to final location (test server or production server).

Actually  **the process of changing publishing location was done with a direct call to mage.exe command line utility** , and after some investigation we found that the encryption mechanism of Click-once was changed to SHA256RSA in.NET 4.5. Unfortunately mage.exe, does not automatically detect.NET version used by the application to apply the correct hash and uses SHA1 by default. If you want to use mage.exe to change some properties of a click-once application based on.NET 4.5 or greater version you must use  **-a command line option to choose sha256RSA algorithm to calculate manifest hash**. The correct command line must contain – **a sha256RSA** option to generate a correct package.

In my opinion we have a couple of problem here that Microsoft could address.

1)  **The error message you got when you try to install published application, should states that the hash is computed with an incorrect algorithm** , allowing you to better diagnose the error. Telling you that the hash is different from the one specified in the manifest is something misleading because it lead to incorrect assumption that something modifies the files after the hash is generated.

2) Mage.exe should automatically find version of Framework used by the package, and should give you a warning. If checking framework version is not simple, it would be better to always display a warning that tells the user “ **Warning: starting with.NET 4.5 you should use the option -a sha256RSA to resign manifest because we changed the algorithm used** ”.

This is a story that is true even for your application. If you change something so radical from one version to another of your application, always display clear and informative warning to the user, to avoid problems.

Gian Maria.
