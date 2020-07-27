---
title: "Continuos integration in PowerShell way"
description: "While Azure DevOps Pipeline or GitHub actions or whatever CI engine you choose can do most of the job of building a pipeline for you, sometime going straight PowerShell can be the solution you need"
date: 2020-05-30T15:12:42+02:00
draft: true
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

I'm a great fan of Azure DevOps pipelines, I use them extensively, but I also a fan of simple building strategies, not relying on some specific build engine.

I'm a great fan of Continuous Integration, I've started many years ago with CC.NET and explored various build engine, from Msbuild to Nant then Psake, cake etc. My overall reaction is: I want to be simple. Whenever you need to explain something to a customer / developer / IT guy, it is hard to force a particular technology, it is easy to tell them: just use NAnt because it is the best, but in the end the real thing is: Use Nant because it is the engine I know best and if you asked for my help I'll be really more good if you use the tool that I know.

This is always true, you cannot master all CI engine out there, you had to choose, so I often decide to go straigh PowerShell and do not getting any more unneccessary tool in my toolchain.

Why PowerShell? The reason is straightforward, if you are in Windows Envioronment your IT guy probably already knows PowerShell, it is simple, and it is widely used: if you search for "how to do X in PowerShell" you probably have already a solution.

Another nice aspect of PowerShell is [PowerShell Gallery](http://www.codewrecks.com/post/general/powershell-gallery/) where you can publish your helpers to be available everywhere in your scripts.

Another good aspect is that a PowerShell based build can be run from every computer, no strange prerequisites, it is easy to setup it is easy to test and it is included in your source code.

Whenever you have your PowerShell build up and running, you can simply execute in all major CI engines (Azure DevOps pipelines, GitHub actions, etc), while you are still independent of the real engine. 

How difficult is to create a build using only PowerShell? To answer this question I've taken a simple sample with an ASP.NET application Full framework with a database project. My goal is to have a minimum build that

1. Use Git Version to mark assembly with SemVer
2. Build my solution
3. Publish a web site
4. Modify the web.config to make configuration ready to be released
5. runs some unit tests.
6. Create a nice seven zipped file with everything needed to create a release

This is the very bare minimum for a standard build, and it is quite simple once you create some utilities that can helps you in such common and mundane tasks.

This is the reason why sometimes I approach a build only in PowerShell.