---
title: "CCNEt and Unable to read the specified saved state The configuration data may be invalid"
description: ""
date: 2008-04-24T00:00:37+02:00
draft: false
tags: [Frameworks]
categories: [Frameworks]
---
Yesterday one of my colleagues stopped for a while the cc.net in our server, then this morning I look at the dashboard and find an error

> Unable to read the specified saved state. The configuration data may be invalid.

after some minutes wendering in internet trying to find a solution I check the cc.net directory, in my server is **D:\CruiseControl\CruiseControl.NET\server**. Now in this directory there are some files with *state*extension, one for each project. It turns out that a file has zero lenght :(, moreover I start cc.net with debug active and in log file I see

> 2008-04-24 09:41:10,453 [RepManagement:ERROR] Exception: Unable to read the specified saved state.  The configuration data may be invalid.  
> ———-  
> ThoughtWorks.CruiseControl.Core.CruiseControlException: Unable to read the specified saved state.  The configuration data may be invalid. —&gt; System.InvalidOperationException: There is an error in XML document (0, 0). —&gt;  **<font color="#ff0000">System.Xml.XmlException: Root element is missing.</font>** >    at System.Xml.XmlTextReaderImpl.Throw(Exception e)  
>    at System.Xml.XmlTextReaderImpl.ThrowWithoutLineInfo(String res)
> 
> ———-

Ok, that gives me the hint that cc.net is trying to read the file with a xmlreader not trapping exception, I simply open state file of another project and I copied all the content to the corrupted one, changing the data as appropriated. The state file is really simple, the only thing you need is the last label, not to lose sequential order, I restored simply checking the archive where the nant script stores old build, and the game is done. Cc.net is active again.

alk.

Tags: [Cruise Control.NEt](http://technorati.com/tag/Cruise%20Control%20.NEt) [CC.Net](http://technorati.com/tag/CC.Net)
