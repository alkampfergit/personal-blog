---
title: "AcrobatSDK Find the name of active document"
description: ""
date: 2008-06-11T03:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Using AcrobatSDK is damned a hard stuff, the documentation is too big, and there are lot of examples but quite often I do not find useful ones, the result is that I’m feeling lost into all the layers, functions etc. Moreover doing simple things is so damn hard…as an example, here is the code to find the name of the current front document.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 1     // try to get front PDF document 
 2     AVDoc avDoc = AVAppGetActiveDoc();
 3     
 4     if(avDoc==NULL) {
 5         // if no doc is loaded, make a message.
 6         strcat(str,"There is no PDF document loaded in Acrobat.");
 7         return;
 8     }
 9 
10     // if a PDF is open, get its number of pages
11     PDDoc pdDoc = AVDocGetPDDoc (avDoc);
12 
13     // try to get front PDF document 
14     ASFile fileinfo = PDDocGetFile(pdDoc);
15     ASFileSys fileSys = ASFileGetFileSys(fileinfo);
16     ASPathName pathname = ASFileAcquirePathName(fileinfo);
17     char* result = ASFileSysDisplayStringFromPath(fileSys, pathname);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You have first to get a reference to AVDoc (an object from *AcroView*layer) then if a reference is found you have to get a reference to corresponding PDDoc element (taken from *Portable Document*layer). Now you have a reference to the doc and from it you can get a reference to an ASFile object (taken from *Acrobat Support*layer). Then from this object you can take a ASFileSys object and a ASPathName object. Finally the AsFileSysDisplayStringFromPath permits you to get a char array that stores the name of the file.

All these object (AVDoc, PDDoc, ASFile, ASFileSys, ASPathName) are all opaque values, they are handles that have no significance for the programmer. This is probably derived from the earlier version of the SDK, but it would be really better to build a C++ set of wrapper classes to handle these stuff in a way more programmer friendly. You can debug the code, but if you examine all these objects, you find that they are all pointers, uff…

IF the example above did not scare you, I tell you that this snippet does not contain the code to actually release the memory, so…I still have to understand witch of these handles need to be released and how. All this work only to know the name of the front Document…….

alk.

Tags: [Acrobat Sdk](http://technorati.com/tag/Acrobat%20Sdk)

<!--dotnetkickit-->
