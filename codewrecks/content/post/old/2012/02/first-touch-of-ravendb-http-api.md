---
title: "First touch of RavenDb HTTP API"
description: ""
date: 2012-02-13T11:00:37+02:00
draft: false
tags: [RavenDB]
categories: [NoSql,RavenDB]
---
Previous posts on the NoSql and Raven Series

- [NoSql and a life without Schema](http://www.codewrecks.com/blog/index.php/2012/02/04/nosql-and-a-life-without-schema/)
- [NoSql and a life without schema continued](http://www.codewrecks.com/blog/index.php/2012/02/06/nosql-and-a-life-without-schema-continued/)
- [Rename a property in RavenDb](http://www.codewrecks.com/blog/index.php/2012/02/08/rename-a-property-in-ravendb)

Other posts by Mauro on RavenDb Subject.

- [RavenDb: Start your engines](http://mauroservienti.blogspot.com/2012/01/ravendb-start-your-engines.html)
- [RavenDb: First Contact](http://mauroservienti.blogspot.com/2012/02/ravendb-first-contact.html)

RavenDb is not accessible only from.NET Code, but it fully support an [API based on HTTP](http://old.ravendb.net/documentation/docs-http-api-index) that basically permits to interact with database engine with simple HTTP requests, thus you can access a RavenDb instance from every technology that is capable of issuing Web Requests.

To experiment with HTTP API you can download [Curl](http://curl.haxx.se/download.html), a command line utility to create HTTP requests, just download it and unzip in a folder accessible from command line, or modify PATH environment variable to include the folder where you unzipped Curl, and you are done.

Once you configured curl the easiest command you can issue with HTTP API to RavenDb is a simple GET to retrieve a document from its id.

c:\&gt; curl [Http://localhost:8080/docs/players/1](http://localhost:8080/docs/players/1)

[![SNAGHTML1f29e0d](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/SNAGHTML1f29e0d_thumb.png "SNAGHTML1f29e0d")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/SNAGHTML1f29e0d.png)

 ***Figure 1***: *Simple GET request to retrieve a document by Id*

You can also store documents with a PUT request, to accomplish this scenario you need to issue a slightly different request because this time you need to specify document content in JSON format in the body of the request.

{{< highlight csharp "linenos=table,linenostart=1" >}}
curl -X PUT http://localhost:8080/docs/players/2 -d "{Name:'Mauro', RegistrationDate:'2012-04-06', Age:36}"
{{< / highlight >}}

As you can see it is really similar to previous request, except that I specified the [–X PUT](http://old.ravendb.net/documentation/docs-http-api-update) argument to ask Curl to issue a PUT request and not a standard GET, and I specified the address of the object, as shown in  **Figure 2** , this time I want to insert a players object with Id 2, finally –d option permits to specify the Body of the request and for PUT operation you can simply specify a document in JSON Format.

The answer of the server should be something like {“Key”:”Players/2”, “ETag”:…., but if the answer is completely blank and there is no new object in RavenDb studio, probably the command encountered some error. To better understand what happened under the hood you need to specify – **v** switch to curl command to set maximum verbosity and have a full dump of both request and responsxe. If you issue the command again you should see something like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
 
* About to connect() to localhost port 8080 (#0)
* Trying 127.0.0.1...
* connected
* Connected to localhost (127.0.0.1) port 8080 (#0)
>;; PUT /indexes/byEmail HTTP/1.1
>;; User-Agent: curl/7.24.0 (i386-pc-win32) libcurl/7.24.0 OpenSSL/0.9.8t zlib/1.2
.5
>;; Host: localhost:8080
>;; Accept: */*
>;; Content-Length: 78
>;; Content-Type: application/x-www-form-urlencoded
>;;
* upload completely sent off: 78 out of 78 bytes
<;; HTTP/1.1 401 Unauthorized
<;; Content-Length: 0
<;; Server: Microsoft-HTTPAPI/2.0
<;; WWW-Authenticate: Negotiate
<;; WWW-Authenticate: NTLM
<;; Date: Mon, 06 Feb 2012 08:26:53 GMT
<;;
* Connection #0 to host localhost left intact
* Closing connection #0
{{< / highlight >}}

Now you got the full request/response from curl, in this example in line 15 I see that the answer was a 401 HTTP Code, basically the user is not authorized to modify a document with HTTP API. THs usually happens because the standard configuration of raven server command line, found in the standard *Raven.Server.Exe.Config* file, allows only GET operations from HTTP API. If you just want to experiment and does not care about security for now, you can easily change the appSettings key Raven/AnonymousAccess to the value  **All** , as shown in the following snippet.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<appSettings>
<add key="Raven/Port" value="*"/>
<add key="Raven/DataDir" value="~\Data"/>
<add key="Raven/AnonymousAccess" value="All"/>
</appSettings>
{{< / highlight >}}

If the PUT operation was successful you can look at the RavenDb studio to verify if the document was really inserted. Everything should be ok, but the new document appears different from the old documents inserted by C# code, as shown in  **Figure 2**. As you can see the RavenDb studio does not report the name of the class ( it is called Doc) and the color is different.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image7.png)

 ***Figure 2***: *Document inserted with HTTP API is different from the one inserted with C# code.*

This happens because the document you inserted with the previous call has no metadata, if you want to insert a document that can be loaded from C# and represents a valid Player entity you should specify metadata during PUT operation, using HTTP Headers.

{{< highlight csharp "linenos=table,linenostart=1" >}}
curl -X PUT http://localhost:8080/docs/players/2
-d "{Name:'Mauro', RegistrationDate:'2012-04-06T09:20:25.6657067', Age:36}"
-H "Raven-Entity-Name:Players"
-H "Raven-Clr-Type:RavenDbAbc.Entities.Player, RavenDbAbc"
{{< / highlight >}}

The request was divided in four lines to have a better format for the blog, but the above snippet is a single command line request. The only difference is the presence of two HTTP header (issued with curl switch – **H** ) called “Raven-Entity-Name” and “Raven-Clr-Type” used to specify metadata of the document. After you issued the PUT HTTP Request, you can try to load object from C# code and everything should go smoothly.

Clearly this is not the preferred way to insert documents corresponding to C# objects inside RavenDb, but it is a good sample that shows how to accomplish basic operations against an instance of RavenDb using only HTTP Requests.

Gian Maria.
