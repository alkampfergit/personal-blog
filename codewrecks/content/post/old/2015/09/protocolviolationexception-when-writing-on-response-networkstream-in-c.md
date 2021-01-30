---
title: "ProtocolViolationException when writing on response NetworkStream in c"
description: ""
date: 2015-09-25T09:00:37+02:00
draft: false
tags: [Programming]
categories: [Programming]
---
I have a piece of code that is returning data with an HttpListener, but I have intermittent error in logs

> Bytes to be written to the stream exceed the Content-Length bytes size specified

I wonder where is the error, because the code is simply returning a string with proper encoding and the ContentLength64 property of the Response was set correctly.

{{< highlight csharp "linenos=table,linenostart=1" >}}


byte[] buffer = Encoding.UTF8.GetBytes(message);
context.Response.ContentEncoding = Encoding.UTF8;
context.Response.ContentLength64 = buffer.Length;
context.Response.OutputStream.Write(buffer, 0, buffer.Length);
context.Response.OutputStream.Flush();

{{< / highlight >}}

It turns out that some  **clients**  **sometimes used to do HEAD requests**  **and writing to an OutputStream of an HEAD request generates a ProtocolViolationException** , because the client does not expects content to be returned. I’ve simple wrapped the above code with a simple If statement that does not write any content if the HttpMethod of the request is HEAD*(context.Request.HttpMethod != “HEAD”)* and all errors disappeared from log.

Gian Maria.
