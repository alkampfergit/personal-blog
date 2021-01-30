---
title: "Comparison between nant and msbuild"
description: ""
date: 2009-07-10T02:00:37+02:00
draft: false
tags: [Msbuild]
categories: [NET framework]
---
You can find at [this link](http://channel9.msdn.com/wiki/msbuild/equivalenttasks/), a table that compare nant tasks with msbuild tasks. If you look at this table it seems that msbuild lacks a lot of things, but actually there are specific visual studio tasks that have no equivalent in nant, like those one for tfs (open issue etc), publishing with clickonce, run a data generation plan and many more.

In the end msbuild is a great product, but probably it lacks a little on some basic tasks like XML manipulation with xmlpeek and xmlpoke.

Alk.
