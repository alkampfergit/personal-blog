---
title: "Strange Error uploading artifacts in Azure DevOps pipeline"
description: ""
date: 2020-04-11T07:00:37+02:00
draft: false
tags: [security]
categories: [security]
---
I have a library that is entirely written in.NET core that deal with some self signed X509 certificates used to encrypt and digitally sign some data. Software runs perfectly and is composed by a server and client part.

 **At a certain point we decided that the client should be used not only by software that runs.NET core, but also software with full framework** , so I’ve changed target framework to target both netstandard 2.0 and full framework 4.6.1, everything compiles perfectly, tests run fine, everything seems to be green. The problem is that unit test project ran tests only with.NET Core, so I was not exercising tests in full framework.

Running the new project in.NET core application raise no error, but when it run in full Framework, it throws an exception while accessing the private key property of X509Certificate2 object: *System.Security.Cryptography. **CryptographicException** :  **Invalid provider type specified**.*

> Code runs perfect on.NET core runtime, but throws Invalid provider type specified on Full Framework.

Actually the error is quite straightforward, it is just telling me that the implementation of RSA private key of certificate is probably done differently in.NET Standard, an information that I already know, but indeed it was difficult to find where my code was wrong.

After long digging in the internet I found some interesting article that pointed me in the right direction a library that allows for some extension methods called HasCngKey and GetCngPrivateKey(). I spare you the gritty details **, but basically the problem arise because Microsoft change Cryptographic API in Windows** and I was doing a bad thing.

Original code simply cast the PrivateKey property of the certificate to the RSA class, a piece of code that I’ve found somewhere in the internet and that seems pretty straightforward.  **Since my library created the certificate I’m pretty sure that the private key is RSA so I can safely cast to RSA object Right? I was deadly wrong.** {{< highlight csharp "linenos=table,linenostart=1" >}}


var rsa = (RSA)clientCertificate.PrivateKey;

{{< / highlight >}}

The above code works only in.NET Standard because even if Full Framework has an RSA class, its implementation is different from NetStandard and make impossible to directly access PrivateKey property once the certificate was written by.NET Standard code. Welcome to [Crypto API next generation](https://docs.microsoft.com/en-us/windows/win32/seccng/cng-portal) whose acronym is CNG used by.NET Standard.

 **.NET standard code used CNG API to write the certificate, this means that, once loaded by the same class in Full Framework, PrivateKey property cannot be accessed directly from Full Framework,**  **that uses CAPI and is not able to decrypt the key.** To validate the assumption I [referenced a special package from Nuget](https://www.nuget.org/packages/Security.Cryptography/) that allows me to write code that can interact with CNG API from full framework. (wrapped in a #if NETFULL directive to be used only with full framework)

{{< highlight csharp "linenos=table,linenostart=1" >}}


if (clientCertificate.HasCngKey())
{
    var rsa2 = clientCertificate.GetCngPrivateKey();
    var cng = new RSACng(rsa2);
    aesDecryptedKey = cng.Decrypt(licenseVault.EncryptionKey, RSAEncryptionPadding.OaepSHA512);
}

{{< / highlight >}}

This fixed the problem perfectly, actually the HasCngKey methods tells me if the private key is using CNG Api and then allows me to retrieve the key with a call to GetCngPrivateKey().

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-12.png)

 ***Figure 1***: *GetCngPrivateKey() method explanation*

Ok, that confirms all of my suspicions, but I felt really dirty because I have to run a different code for full framework and.NET core and I was really convinced that I was doing something wrong. It turns out that the error was in my code that directly cast PrivateKey property of certificate to RSA,  **because the right call to obtain the RSA object from a X509Certificate2 object is a call to [GetRSAPrivateKey();](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.x509certificates.rsacertificateextensions.getrsaprivatekey?view=netframework-4.8)** {{< highlight csharp "linenos=table,linenostart=1" >}}


RSA rsa = clientCertificate.GetRSAPrivateKey();

{{< / highlight >}}

This method hides nifty gritty implementation details from the caller, it just retrieve the RSA key or returns null if the private key is not RSA. While it seems perfectly legit to cast the PrivateKey to RSA object in.NET Standard, this assumption is not anymore legit to Full Framework.

As always, this is a classic example on how Cryptography is a complex subject, and you should always double check your code.

Gian Maria.
