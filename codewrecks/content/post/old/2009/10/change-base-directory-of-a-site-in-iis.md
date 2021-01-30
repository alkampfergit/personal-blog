---
title: "Change base directory of a site in IIS"
description: ""
date: 2009-10-12T08:00:37+02:00
draft: false
tags: [Programming]
categories: [Programming]
---
This technique works for IIS6 and IIS7 with the "IIS 6 WMI Compatibilityâ€ installed. The purpose is changing the directory of a web site in a remote server. The purpose of this action will be clear in a future post, for now only assume that you want to be able to create a piece of c# code that changes directory of a web site in windows server. Here is a test site.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image3.png)

Now if you run this code.

{{< highlight sql "linenos=table,linenostart=1" >}}
ConnectionOptions connection = new ConnectionOptions();
connection.Username = "administrator";
connection.Password = "xxxxxx";
connection.Authentication = AuthenticationLevel.PacketPrivacy;
ManagementScope scope = new ManagementScope(@"\\WS2008V1\root\MicrosoftIISv2", connection);

//get Fixed disk stats
System.Management.ObjectQuery query =
    new System.Management.ObjectQuery("select * from IIsWebVirtualDirSetting where AppPoolId= 'test'");

//Execute the query 
ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

//Get the results
ManagementObjectCollection oReturnCollection = searcher.Get();
ManagementObject site = oReturnCollection
   .Cast<ManagementObject>()
   .Single();
site["Path"] = @"C:\inetpub\wwwroot";
site.Put();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And if you look at site directory again you will get.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image4.png)

So you have changed the Physical path of the application.

The code is really simple, you need to add reference to System.Management to use WMI, then you create a [ConnectionOptions](http://msdn.microsoft.com/en-us/library/system.management.connectionoptions%28loband%29.aspx) class to specify credentials to use. To access MicrosoftIISv2 object it is really important that you set [AuthenticationLevel](http://msdn.microsoft.com/it-it/library/system.management.authenticationlevel%28loband%29.aspx) to PacketPrivacy. Then you simply need to query for [IIsWebVirtualDirSetting](http://msdn.microsoft.com/en-us/library/ms525005%28loband%29.aspx) using AppPoolId to find the application you want, then simply use a ManagementObjectSearcher to issue the query, and finally use LINQ to grab the only result, change the â€œPathâ€ property and update modification with Put() method.

Alk.

Tags: [IIS](http://technorati.com/tag/IIS)
