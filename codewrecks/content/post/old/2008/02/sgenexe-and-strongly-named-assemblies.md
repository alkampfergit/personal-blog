---
title: "sgenexe and strongly named assemblies"
description: ""
date: 2008-02-13T03:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
Today I was facing a strange exception with a XmlSerializer, it gives to me FileNotFoundException NHibernate.XmlSerializers, it turns out that the debug settings are set to “break to all exceptions” and so the visual studio Ide warn me even for handled exception.

After some search I found that the xxxx.XmlSerializers assembly is a pregenerated assembly that the xmlserializers looks for before attempting to generate one at runtime, so if you want to have better performance you can pregenerate such an assembly. The only problem is that it seems to me that sgen.exe cannot create strongly typed assembly, so the solution is the following.

*sgen Nhibernate.dll /t:NHibernate.Cfg.MappingSchema.HbmMapping /k*

With this line of code I’m telling sgen to generate serialization assembly for the HbmMapping class and the /k option tells him not to delete the intermediate source file. So it generates for me the c5inkpm7.0.cs file, and now I can simply compile with a strong name

*csc /keyfile:NHibernate.snk /reference:Nhibernate.dll /out:NHibernate.XmlSerializers.dll /target:library c5inkpm7.0.cs*

And the game is done.

Alk.
