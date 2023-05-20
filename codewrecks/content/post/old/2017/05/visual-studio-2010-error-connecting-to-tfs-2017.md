---
title: "Visual Studio 2010 error connecting to TFS 2017"
description: ""
date: 2017-05-22T15:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
One of the reason why I always suggest of keeping TFS upgraded is the compatibility matrix.  **Microsoft ensure that old tools (like VS 2010) always can connect to latest version of TFS, but the opposite is not true.** This means that new version of Visual Studio could have problem connecting to older instances of TFS.

> Keeping your TFS updated will guarantee that you can use TFS with newer and older tooling (yes, even Visual Basic 6 can work with TFS 2017)

But even if the compatibility matrix confirm that you can use VS 2010 to connect to TFS 2017, you probably need to install some additional software, to guarantee the connection. As an example you can receive the following error when you try to connect to TFS 2017 TFVC repository from VS 2010.

> The user name &lt;guid&gt; is not a fully-qualified name, parameter name workspaceOwner

This error happens because  **you lack some required update to connect to TFS 2017 from VS 2010.** For VS 2010 to connect to VSTS / TFS 2017 these are the steps you need to take.

1. Visual Studio 2010
2. [Team Explorer 2010](http://www.microsoft.com/en-us/download/details.aspx?id=329)
3. [Visual Studio 2010 SP1](http://www.microsoft.com/en-us/download/details.aspx?id=23691)
4. [Visual Studio 2010 GDR for Team Foundation Service](http://www.microsoft.com/en-us/download/details.aspx?id=29082)
5. [Visual Studio 2010 Compatibility Update for Windows 8 and Visual Studio 2012](http://www.microsoft.com/en-us/download/details.aspx?id=34677)

This sequence of steps is taken from the  **Exceptional link of Jesse Houwing** [**http://blog.jessehouwing.nl/2013/10/connecting-to-tfs-from-any-version-of.html**](http://blog.jessehouwing.nl/2013/10/connecting-to-tfs-from-any-version-of.html "http://blog.jessehouwing.nl/2013/10/connecting-to-tfs-from-any-version-of.html") **. This link will specify you all service pack and patch you need to install to connect to various version of TFS.** I strongly suggest you to bookmark that link, because it can really save you when you have old client (like VS 2010, VS 2012) that experiences difficulties connecting to the newest version of TFS / VSTS.

Gian Maria.
