---
title: "Connecting to TFS2010 with API"
description: ""
date: 2010-03-26T07:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
If you know TFS 2008 API and try to connect to a tfs 2010 you could probably start with this snippet, but you will get a 404 exception, telling you that the tfs is not available.

{{< highlight csharp "linenos=table,linenostart=1" >}}
TeamFoundationServer tfs = new TeamFoundationServer("http://vs2010beta2:8080/tfs",
new NetworkCredential("dorikr", "P2ssw0rd"));
tfs.EnsureAuthenticated();
{{< / highlight >}}

The problem is originated by the new [architecture](http://blogs.msdn.com/bharry/archive/2009/04/19/team-foundation-server-2010-key-concepts.aspx) of tfs2010, and the presence of â€œProject collectionsâ€. Project collections are containers for Team Project, and they are the analogue of a TFS2008 server. The above code cannot work, because you are trying to connect with a TeamFoundationServer object to a tfs that contains a certain number of project collection. To make it work you need to change the server string passed to the constructor in this way

{{< highlight csharp "linenos=table,linenostart=1" >}}
TeamFoundationServer tfs = new TeamFoundationServer("http://vs2010beta2:8080/tfs/DefaultCollection",
new NetworkCredential("dorikr", "P2ssw0rd"));
tfs.EnsureAuthenticated();
{{< / highlight >}}

This works perfectly, because now you can use the TeamFoundationServer object to do whatever you want. If you are curious and you want to enumerate project collections avaliable in a server you can use this piece of code:

{{< highlight csharp "linenos=table,linenostart=1" >}}
Uri configurationServerUri = new Uri("http://vs2010beta2:8080/tfs");
TfsConfigurationServer configurationServer =
new TfsConfigurationServer(configurationServerUri, new NetworkCredential("dorikr", "P2ssw0rd"));
ITeamProjectCollectionService tpcService = configurationServer.GetService<ITeamProjectCollectionService>();
var collections = tpcService.GetCollections();
{{< / highlight >}}

As you can see the TfsConfigurationServer object can be queried with the familiar GetService&lt;T&gt; method asking for a ITeamProjectCollectionService, that has the method GetCollections() to have a list of all Team Project Collection present on the server.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image16.png)

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
