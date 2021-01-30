---
title: "Padding is invalid and cannot be removed"
description: ""
date: 2007-06-19T23:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
After another release of our project in production machine sometimes I see in the log this strange error

System.Security.Cryptography.CryptographicException: Padding is invalid and cannot be removed.

System.Security.Cryptography.CryptographicException: Padding is invalid and cannot be removed.

at System.Security.Cryptography.RijndaelManagedTransform.DecryptData(Byte[] inputBuffer, Int32 inputOffset, Int32 inputCount, Byte[]& outputBuffer, Int32 outputOffset, PaddingMode paddingMode, Boolean fLast)

at System.Security.Cryptography.RijndaelManagedTransform.TransformFinalBlock(Byte[] inputBuffer, Int32 inputOffset, Int32 inputCount)

at System.Security.Cryptography.CryptoStream.FlushFinalBlock()

at System.Web.Configuration.MachineKeySection.EncryptOrDecryptData(Boolean fEncrypt, Byte[] buf, Byte[] modifier, Int32 start, Int32 length, Boolean useValidationSymAlgo)

at System.Web.UI.Page.DecryptString(String s)

at System.Web.Handlers.AssemblyResourceLoader.System.Web.IHttpHandler.ProcessRequest(HttpContext context)

at System.Web.HttpApplication.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute()

at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)

The application is a very standard ASP.NET 2.0 application so I began to investigate further to understand what’s happening. First of all I’m not using any cryptography, this is the fact that initially astonished me. After some wandering in internet I realize that webresource.axd module, internally use cryptography to generate the weird string used to look out for resources and some other stuff. The only solution that I found on the web regards web farm, and suggest to create the same MachineKey entry of web.config file for all the machines. It turns out that in our production server there is no MAchineKey generated, so the system generates one on his own, so I decided to explicitly insert a MachineKey, and in the last 48 hours this problem did not happen again.

If you are interested there are [a lot of sites](http://www.developmentnow.com/articles/machinekey_generator.aspx) that generate quickly online a valid Machine Key,  so the operation is really quick.

Alk.
