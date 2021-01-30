---
title: "Use ICSharpCodeSharpZipLib to write directly to ResponseOutputStream in a aspnet application"
description: ""
date: 2008-08-26T04:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
I have a web site where I need to dynamically create rtf reports. I decided to use Asp.NEt 3.5 routing, (maybe I’ll discuss another day) so I can redirect request like

[http://localhost/Myapp/reports/reportwizard/14/Report.zip](http://localhost/Myapp/reports/reportwizard/14/Report.zip "http://10.8.0.10/RepManagement/reports/reportwizard/14/Report.zip")

to an handler that dynamically creates the zip file and stream it to the client browser. Here is the code

{{< highlight csharp "linenos=table,linenostart=1" >}}
Dim service As New WebLogic.Report.ReportService
Dim generator As RTFSimpleDocGenerator = service.CreateReport(ReportId)
context.Response.ContentType = "application/zip"
Using ZipStream As ZipOutputStream = New ZipOutputStream(context.Response.OutputStream)
  Dim ZipEntry As ZipEntry = New ZipEntry("report.rtf")
  ZipStream.PutNextEntry(ZipEntry)
  ZipStream.SetLevel(5)
  generator.Save(ZipStream)
End Using{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the code is really simple, I create a ICSharpLib stream directly on context.Response.OutputStream, and then I simply use my rtf generator to write directly on the zipped stream, the result is.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/08/image-thumb6.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/08/image5.png)

What???? It seems that the ICSharpLib tries to send some wrong value to the write method. After about one hour spent trying to understand what is going wrong I was really puzzled. If I redirect the zip stream to a file all works fine, I obtain a perfectly valid zip file, but if I write directly to the response.OutputStream I have the error.

To solve this mistery I creates a simple wrapper stream that does nothing than redirect all the calls to the wrapped stream

{{< highlight chsarp "linenos=table,linenostart=1" >}}
    Public Class mystream : Inherits System.IO.Stream

        Private wrapped As System.IO.Stream

        Public Sub New(ByVal wrapped As Stream)
            Me.wrapped = wrapped
  End Sub

        Public Overrides ReadOnly Property CanRead() As Boolean
            Get
                Return wrapped.CanRead
            End Get
        End Property

       ...

        Public Overrides Sub Write(ByVal buffer() As Byte, ByVal offset As Integer, ByVal count As Integer)
            wrapped.Write(buffer, offset, count)
        End Sub
    End Class{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And discovered that the error occurred because write() gets called with a buffer with: lenght 0, offset 0 and count 0. This seems to me a perfectly reasonable call, unuseful, but reasonable. Checking with reflector you can find this code into the write method of the class HttpResponseStream

{{< highlight csharp "linenos=table,linenostart=1" >}}
int num = buffer.Length - offset;
 if ((offset < 0) || (num <= 0))
  {
 throw new ArgumentOutOfRangeException("offset");
 }
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

So the httpResponseStream does not accepts zero bytes buffer, I wonder why. If you check the FileStream class you can verify that it accepts zero byte buffer array, this is the reason why saving the zip to a file works and saving directly to the response.outputstream gives you the error. The reason why HttpResponseStream does a similar check is a mistery, but I simply change my wrapper stream to be

{{< highlight chsarp "linenos=table,linenostart=1" >}}
        Public Overrides Sub Write(ByVal buffer() As Byte, ByVal offset As Integer, ByVal count As Integer)
            If buffer.Length = 0 Then Return
            wrapped.Write(buffer, offset, count)
        End Sub{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

now my wrapper stream corrects the call avoiding to call the write method If the caller request for a zero byte write. Here is how I construct the zipstream using my wrapper to correct this situation

{{< highlight csharp "linenos=table,linenostart=1" >}}
Using ZipStream As ZipOutputStream = New ZipOutputStream(New mystream(context.Response.OutputStream)){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This makes everything works fine.

alk.

<!--dotnetkickit-->

Tags: [asp.net](http://technorati.com/tag/asp.net)
