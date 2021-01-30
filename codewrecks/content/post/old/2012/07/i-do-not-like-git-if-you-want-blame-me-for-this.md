---
title: "I do not like Git if you want blame me for this"
description: ""
date: 2012-07-25T08:00:37+02:00
draft: false
tags: [Git]
categories: [General]
---
I did not like Git, it is a really personal opinion, but I work a really limited time on github project with some friend of mine and I always find surprise using git, surprises that never happened with other SCS (Hg, Subversion, TFS, etc).

Today I modified a file in my working copy, but after some code I want to revert to the original version, so I issue the revert command with tortoise Git.

[![SNAGHTML25151e2](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML25151e2_thumb.png "SNAGHTML25151e2")](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML25151e2.png)

 ***Figure 1***: *Revert screenshot from tortoise Git*

Now I press Ok, I got this nice confirmation dialog

[![SNAGHTML25211e6](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML25211e6_thumb.png "SNAGHTML25211e6")](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML25211e6.png)

 ***Figure 2***: *Confirmation dialog that confirm me that the file was reverted.*

Now I reopen the solution in Visual Studio but the file is still modified and if I right click on the repo folder and choose again Revert from TortoiseGit I got the very same situation in Figure 1, Tortoise Git is telling me again that the file is modified and it can be reverted.

Then I issue a  **git reset –hard** command but it does not work.

I know that I have a really little knowledge of git because I used it 10 times in a year, but I never find another source control that tells me “hey your file is reverted” but in reality nothing happened.

Gian Maria.
