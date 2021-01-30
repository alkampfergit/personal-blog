---
title: "Cannot obtain Metadata from when trying to create references with serviceutilexe"
description: ""
date: 2009-04-15T07:00:37+02:00
draft: false
tags: [NET framework,General]
categories: [NET framework,General]
---
I have a simple wcf service hosted in IIS6, when I launch serviceutil.exe ( **svcutil.exe**  **http://10.8.50.1:7507/FileReceiver.svc?wsdl** )  to create a proxy I get a complex and long error, but the first part of the error tells me

> Error: Cannot obtain Metadata from http://10.8.50.1:7507/FileReceiver.svc?wsdl

I lost about half an hour triying to figure out what is wrong. First of all I tried to expose metadata, but this is not possible in IIS6 or at least I got some errors, and nothing works. After half an hour of frustration, I made a supposition, â€œmaybe it is a problem of premission?â€. I changed the identity of the worker process to administrator, and magically everything works as expectedâ€¦

After some searches I discover that the process tries to access the c:\Windows\Temp directory during metadata generation, It is related to the fact that WCF internally used some code generation, thus requiring permission to write to the temp directory. This is annoying because there is no clue that it can be a matter of permissions.

Alk.

Tags: [WCF](http://technorati.com/tag/WCF)
