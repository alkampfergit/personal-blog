---
title: "svcutil and the infamous This URL does not support DISCO"
description: ""
date: 2008-11-04T10:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
WCF is undoubtedly a complex beast, and sometimes you gets stuck on some strange errors. Suppose you have this configuration

{{< highlight xml "linenos=table,linenostart=1" >}}
<host>
    <baseAddresses>
        <add baseAddress="http://localhost:9000/L4NServer/"/>
        <add baseAddress="net.tcp://localhost:8000/L4NServer/"/>
    </baseAddresses>
</host>
<endpoint
      address="MainLog"
      binding="basicHttpBinding"
      contract="LiveLogger4Log4Net.IL4NServer" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

you can generate the proxy with the command

svcutil [http://localhost:9000/L4NServer/](http://localhost:9000/L4NServer/) /out:client.cs /config:service.config

suppose you want to switch over net.tcp binding, you change the binding for the endpoint (netTcpBinding), you try to generate again the proxy classes with svcutil

svcutil  **net.tcp://localhost:8000/L4NServer/** /out:client.cs /config:service.config

and surprise... it does not work, and you get some strange error like the following

{{< highlight csharp "linenos=table,linenostart=1" >}}
Attempting to download metadata from 'net.tcp://localhost:8000/L4NServer/MainLog
' using WS-Metadata Exchange. This URL does not support DISCO.
Microsoft (R) Service Model Metadata Tool
[Microsoft (R) Windows (R) Communication Foundation, Version 3.0.4506.2152]
Copyright (c) Microsoft Corporation.  All rights reserved.

Error: Cannot obtain Metadata from net.tcp://localhost:8000/L4NServer/MainLog

If this is a Windows (R) Communication Foundation service to which you have acce
ss, please check that you have enabled metadata publishing at the specified addr
ess.  For help enabling metadata publishing, please refer to the MSDN documentat
ion at http://go.microsoft.com/fwlink/?LinkId=65455.
WS-Metadata Exchange Error
    URI: net.tcp://localhost:8000/L4NServer/MainLog

    Metadata contains a reference that cannot be resolved: 'net.tcp://localhost:
8000/L4NServer/MainLog'.

    The socket connection was aborted. This could be caused by an error processi
ng your message or a receive timeout being exceeded by the remote host, or an un
derlying network resource issue. Local socket timeout was '00:05:00'.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you read the messages you could suspect that something on the network does not work properly, at least you read *the socket connection was aborted* but the interesting part of the message is *error: cannot obtain metadata from...* this is the real error messages. To understand why this error occurred read [this page](http://msdn.microsoft.com/en-us/library/aa751951.aspx), but if you are interested in the solution you can add this to the configuration

{{< highlight xml "linenos=table,linenostart=1" >}}
<endpoint
      address="MainLog"
      binding="netTcpBinding"
      contract="LiveLogger4Log4Net.IL4NServer" />
<endpoint
      address="mex"
      binding="mexTcpBinding"
      contract="IMetadataExchange" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can notice I added an endpoint of type IMetadataExchange for the mexTcpBinding, now if you run again the svcutil tool the generation of the client classes will succeed.

alk.

Tags: [WCF](http://technorati.com/tag/WCF) [.NET Framework](http://technorati.com/tag/.NET%20Framework)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/04/svcutil-and-the-infamous-this-url-does-not-support-disco/';</script><script type="text/javascript">var dzone_title = 'svcutil and the infamous This URL does not support DISCO';</script><script type="text/javascript">var dzone_blurb = 'svcutil and the infamous This URL does not support DISCO';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/04/svcutil-and-the-infamous-this-url-does-not-support-disco/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/04/svcutil-and-the-infamous-this-url-does-not-support-disco/)
