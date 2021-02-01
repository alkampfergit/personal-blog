---
title: "A tale of Transfer-Encoding chunked microsoft ajax updatepanel and how to detect partial rendering in a httpmodule"
description: ""
date: 2008-03-18T12:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
I usually adopt a custom simple HttpModule to compress programmatically the page content in my asp.net applications.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Private Sub CompressRequest()
            If ((String.IsNullOrEmpty(HttpContext.Current.Request.Headers("Accept-encoding")) = False) AndAlso _
             (HttpContext.Current.Request.Headers("Accept-encoding").Contains("gzip") = True)) Then

                Dim gzip As GZipStream = New GZipStream(HttpContext.Current.Response.Filter, CompressionMode.Compress, True)
                HttpContext.Current.Response.Filter = gzip
                HttpContext.Current.Response.AppendHeader("Content-encoding", "gzip")

            ElseIf ((String.IsNullOrEmpty(HttpContext.Current.Request.Headers("Accept-encoding")) = False) AndAlso _
              (HttpContext.Current.Request.Headers("Accept-encoding").Contains("deflate") = True)) Then

                Dim defl As DeflateStream = New DeflateStream(HttpContext.Current.Response.Filter, CompressionMode.Compress, True)
                HttpContext.Current.Response.Filter = defl
                HttpContext.Current.Response.AppendHeader("Content-encoding", "deflate")
            End If
        End Sub{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is really a simple method to apply a zipped stream wrapper around the standard stream of asp.net response. This worked well until now, I took a site of one of my colleague, and add in some pages with update panel, the update panel does not work, telling that the response is not good and maybe someone is doing response.write() or httptrace.

It turned out that the reason of the error is the CompressorModule, and after an inspection with fiddler I saw that in partial rendering the microsoft ajax script handler use a chunked encoding. (This does not happen in other sites of mine, and I’ll investigate to understand why). When the response is chunk encoded you cannot use the zip routine as I showed you before, to avoid problem I decided not to zip response when the page does partial updates, the question is, how can I detect that the page is doing a partial render in an httpmodule when I really have no reference to the scriptManager object? The solution is to look in HttpRequest for an header called  **x-microsoftajax** and look inside if the value is  **Delta=true**. If these two conditions are met, the page is doing a partial rendering, so I simply avoid to zip the response.

{{< highlight csharp "linenos=table,linenostart=1" >}}
    Private Function RequestCanBeZipped() As Boolean
            If String.Compare("Delta=true", HttpContext.Current.Request.Headers("x-microsoftajax"), True) = 0 Then
                Return False
            End If{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

alk.
