---
title: "Power of the TFS 2010 Build system"
description: ""
date: 2010-10-04T15:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Tfs]
---
Tfs 2010 introduces a lot of news for the Build System, and now Tfs Build it is probably the best choice when you need to setup a Continuous Integration environment for your applications.

One of the most powerful concept is the ability to use multiple Agents, and the use of Workflow Foundation 4.0 as the orchestrator engine for the build. As a result, you can use one of the basic template or you can build a customized one, just creating or modifying the basic workflow. Just to show the degree of customization you can reach, [this article](http://blogs.msdn.com/b/jimlamb/archive/2010/09/14/parallelized-builds-with-tfs2010.aspx) by [Jim Lamb](http://blogs.msdn.com/b/jimlamb/) shows you a customized build workflow that parallelize the build by Platform/configuration among the various available agents. Have fun.

Alk.
