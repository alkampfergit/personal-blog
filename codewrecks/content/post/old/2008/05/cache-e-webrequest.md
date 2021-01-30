---
title: "Cache e webrequest"
description: ""
date: 2008-05-16T05:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
The webRequest object is fantastic to download content from the web, but it has some strange behaviour. Today I implemented cache in a component of mine, it needs to monitor a series of web pages, and clearly it is not useful to download full content of the page if the page itself is not changed. The solution is to use a cache.

First you need to know how does it work cache for web pages, I’m not an expert but it is quite simple, you need to check in the response header for a couple of header, here these tags for [www.nablasoft.com](http://www.nablasoft.com)

Last-Modified: Mon, 23 Apr 2007 14:54:38 GMT  
ETag: “f4bf850b785c71:ceb9”

The tag is needed from the webServer to handle the cache, it is an opaque value that you need to pass in the request header. Now here is the standard situation, I download the page the first time, store the above etag value along with full page content and the url in a database (Actually I use a ICache interface managed by castle.windsor). At each request I check if the url has a content associated with a date, if I have a match in the cache I set the request header accordingly

{{< highlight csharp "linenos=table,linenostart=1" >}}
 1 Public Function GetCachedPageAndPrepareRequest(ByVal request As HttpWebRequest) As DownloadedWebPage
 2         Dim cacheETagToken As String = "ETAG+" + request.RequestUri.AbsoluteUri
 3         Dim token As CacheToken = Cache.GetToken(cacheETagToken)
 4         If token Then
 5             Dim cachedPage As DownloadedWebPage = Cache.GetCacheItem(Of DownloadedWebPage)(request.RequestUri.AbsoluteUri)
 6             If cachedPage Is Nothing Then Return Nothing
 7             Dim etag As String = Cache.GetCacheItem(Of String)(token)
 8             request.IfModifiedSince = token.CacheDate
 9             request.Headers.Add(HttpRequestHeader.IfNoneMatch, etag)
10             Return cachedPage
11         End If
12 Return Nothing{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The structure of the cache is simple, I first check if I have the etag cached, then I check if the page is still in the cache (I do not know if the full data is still in the cache. The real work is in line 8 and 9 where I set cache header in the request. The really strange thing happens when I try to get the response, the problem is that if the cache is still valid the server returned a 304 http code ( **HTTP/1.1 304 Not Modified** ) that represent a valid response but is treated like exception by the framework, here is the code to check if the cache is still valid

{{< highlight xml "linenos=table,linenostart=1" >}}
1 Try
2     requestStatus = DirectCast(ar.AsyncState, MyInternalStatus)
3 Catch webex As WebException
4     If webex.Status = WebExceptionStatus.RequestCanceled Then
5         'Doing something for the cancel request
6     ElseIf webex.Status = WebExceptionStatus.ProtocolError AndAlso webex.Message.IndexOf("304") <> -1 Then
7         OnLoadPageCompleted(requestStatus, requestStatus.mPageCache){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Between line 2 and 3 there are other lines of code but the important thing is that when the server respond 304 the.net throw an exception of type WebException, the question is “how I can found the code?”, the answer is “in the message of the exception”, this is not the best thing to do, at least it surprised me ;). I can accept the exception, mainly because with a 304 the server had closed connection so there is no stream to read the page from, but the WebException object should expose a Int32 property giving back the HTTP1.1 error code, it would be really better.

Alk.

Tags: [WebResponse](http://technorati.com/tag/WebResponse) [HTTP Cache](http://technorati.com/tag/HTTP%20Cache)

<!--dotnetkickit-->
