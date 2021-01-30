---
title: "Persistent cache management with Managed Esent"
description: ""
date: 2011-05-02T08:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
I have a program where components could depend from cache, implemented by ICache interface.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image14.png)

I have really different types of cache, for data that needs to be temporary stored in memory I use a cache component based on enterprise library, but there are components that logically needs a cache that will survive after the process will exit.

The first and obvious solution was to create a very simple component that stores cache data on application database, this is especially useful because program running from different computer could share the same cache with no problem. (program was born when [Velocity](http://www.hanselman.com/blog/InstallingConfiguringAndUsingWindowsServerAppFabricAndTheVelocityMemoryCacheIn10Minutes.aspx) still not exists, and we decided to keep everything really simple)

![](http://www.sdtimes.com/blog/image.axd?picture=2010%2F12%2Fdatabase1.jpg)

The main drawback to this approach is the traffic to the database, and we have some specific part of the application based on windows client that communicates over WCF, and deployed outside our organization.

The first solution was to deploy a sql server express with the application, and use the very same cache component based on database, but this solution has some drawback, because we want to keep the installer simple, and not all users likes to have a SQLExpress on their machine, so we need a different solution based on file system.

A simple and quick solution was using a [PersistentDictionary](http://managedesent.codeplex.com/wikipage?title=PersistentDictionaryDocumentation) based on Esent. To keep performances good, I stored all the data needed to query the cache (Key, Timestamp,..) in a separate PersistentDictionary.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private class EsentDb
{
private PersistentDictionary<String, CacheToken> _keyDatabase;
private PersistentDictionary<String, String> _valueDatabase;
{{< / highlight >}}

Code is really simple, because I rely on object serialization to store complex object into a string, with few lines of code and some test now I have a persistent cache that requires no other component, thanks to ESENT.

alk.
