---
title: "Troubleshoot WCF The underlying connection was closed A connection that was expected to be kept alive was closed by the server"
description: ""
date: 2012-05-16T19:00:37+02:00
draft: false
tags: [Nhibernate,Wcf]
categories: [Nhibernate]
---
I’ve already blogged in the past on how to [easily troubleshoot WCF Exception](http://www.codewrecks.com/blog/index.php/2012/04/23/troubleshoot-wcf-exception/) and that suggestion is valid for every exception you encounter in WCF. Today I have a function that gave the error

> System.ServiceModel.CommunicationException: The underlying connection was closed: A connection that was expected to be kept alive was closed by the server. —&gt; System.Net.WebException: The underlying connection was closed: A connection that was expected to be kept alive was closed by the server. —&gt; System.IO.IOException: Unable to read data from the transport connection: An existing connection was forcibly closed by the remote host. —&gt; System.Net.Sockets.SocketException: An existing connection was forcibly closed by the remote host

This problem is usually caused by some error in the communication channel, but even in such a situation, enabling the trace listener immediately gave to you an idea of the problem.

[![SNAGHTML20daa9b](http://www.codewrecks.com/blog/wp-content/uploads/2012/05/SNAGHTML20daa9b_thumb.png "SNAGHTML20daa9b")](http://www.codewrecks.com/blog/wp-content/uploads/2012/05/SNAGHTML20daa9b1.png)

 ***Figure 1***: *How to identify the problem thanks to WCF Trace Listener*

In my situation the error is ClientProxy …. is not expected and this is due to the fact that I’m returning from WCF a couple of classes that are mapped with NHIbernate, the entity returned has a property of type Customer that is a lazy property, thus at runtime it is represented by a dynamic proxy that is not known to WCF. The solution is trivial, just issue a Fetch(obj =&gt; obj.Client) in the LINQ query to fetch Client and avoiding NH to create a proxy, but the key point is that with WCF trace listener, finding problems in WCF is matter of few seconds.

Gian MAria.

<font style="background-color: #f0f0e0">&#160;</font>
