---
title: "Optimize your local git repository from time to time"
description: ""
date: 2017-06-22T05:00:37+02:00
draft: false
tags: [Git]
categories: [Git]
---
Git is an exceptional piece of software and I really cannot think living without it. Now  **with superfast SSD, you can use git without performance problem** even for large repositories (maybe you converted an old Subversion or TFVC).

When your repository has thousands of object and especially if you adopt flows of work where you rebase often, probably your repository has large number of unnecessary object that can be deleted safely.  **Git runs for you in the background a special command called** {{< highlight bash "linenos=table,linenostart=1" >}}


git gc

{{< / highlight >}}

It is a Garbage Collection command, that will cleanup your local repository, nothing changes in the remote repository. Sometimes you can also run manually a deeper cleaning of your repository with the command

{{< highlight bash "linenos=table,linenostart=1" >}}


git gc --aggressive

{{< / highlight >}}

You can run from time to time (documentation say you can run every few hundreds commits),  **it will take longer that a normal git gc, but it will help keeping your local git repository fast** even if you work with really large codebase.

Gian Maria.
