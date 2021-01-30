---
title: "VSTS Package packages failed to publish"
description: ""
date: 2018-01-18T18:00:37+02:00
draft: false
tags: [nuget,VSTS]
categories: [Azure DevOps]
---
I have a build that publishes nuget packages on MyGet, we decided to move packages to VSTS internal package management, so I simply added another Build Task that pushes packages to VSTS internal feed. Sadly enough I got a really generic error

 **Error: An unexpected error occurred while trying to push the package with VstsNuGetPush.exe.**  **Packages failed to publish** Those two errors does not gives me real information on what went wrong, but looking in the whole log, I verified that the error happens when the task was trying to publish symbols packages (2).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/01/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/01/image-16.png)

 ***Figure 1***: *Complete error log*

It turns out that VSTS Package management is not still capable of publishing symbols package and this generates the error.

To solve this problem you can avoid generating symbols package, or you can simply avoid pushing them to VSTS feed. In the future VSTS feeds will probably supports symbols package and this problem will be gone.

In the meanwhile we have a [issue on GitHub](https://github.com/Microsoft/vsts-tasks/issues/6253) where we asked to the team for a much clearer error message, that can immediately point out the problem during the push.

Gian Maria.
