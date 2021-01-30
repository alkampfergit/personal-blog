---
title: "Bash pornography"
description: ""
date: 2017-01-18T17:00:37+02:00
draft: false
tags: [Git]
categories: [Git]
---
Suppose you have two Git repositories that are in [sync with a VSTS build](http://www.codewrecks.com/blog/index.php/2016/10/22/keep-git-repository-in-sync-between-vsts-tfs-and-git/), after some time the usual problem is that, branches that are deleted from the “main” repository are not deleted from mirrored repository.

The reason is,  **whenever someone does a push on main repository, VSTS build push the branch to the other repository** , but when someone deleted a branch, there is no build triggered, so the mirrored repository still maintain all branches.

This is usually not a big problem, I can accept that cloned repository still maintain deleted branches for some time after a branch is deleted from the original repository and I can accept that this kind of cleanup could be scheduled or done manually periodically. My question is:

> In a git repository with two remotes configured, how can I delete branch in remote B that are not present in remote A?

I am pretty sure that there are lots of possible solutions using node.js or PowerShell or other scripting language.  **After all we are programmer and it is quite simple to issue a git branch –r command, parsing the output to determine branches in repository B that are not in repository A, then issue a git push remote –delete command.** > Since I use git with Bash even in Windows, I really prefer a single line bash instruction that can do everything for me.

The solution is this command and I must admit that it is some sort of Bash Pornography :D.

{{< highlight bash "linenos=table,linenostart=1" >}}


diff --suppress-common-lines &lt;(git branch -r | grep origin/ | sed 1d | sed &quot;s/origin\///&quot;)  " | sed "s/&gt;\s*//" | xargs git push --delete vsts

{{< / highlight >}}

This is some sort of unreadble line, but it works. It is also not really complex, you only need to consider the basic constituent, first of all I use the diff command to diff two input stream. The general syntax is  **diff &lt;(1) &lt;(2)** where 1 and 2 are output of a bash command. In the above example (1) is:

{{< highlight bash "linenos=table,linenostart=1" >}}


(git branch -r | grep origin/ | sed 1d | sed "s/origin\///")

{{< / highlight >}}

This command list all the branches, then keep only lines that start with origin/ (grep origin/ ), then removes the first line (sed 1d) because it contains origin HEAD pointer, and finally remove the trailing origin/ from each line (sed “s/origin\///”). If I run this I got something like this.

[![SNAGHTML16d0ce1](https://www.codewrecks.com/blog/wp-content/uploads/2017/01/SNAGHTML16d0ce1_thumb.png "SNAGHTML16d0ce1")](https://www.codewrecks.com/blog/wp-content/uploads/2017/01/SNAGHTML16d0ce1.png)

 ***Figure 1***: *Output of the command to list all branches in a remote*

 **This is a simple list of all branches that are present on remote origin.** If you look at the big command line, you can notice that the diff instruction diffs the output of this command and another identical command that is used to list branches in VSTS.

The output of the diff command is one line for each branch that is in VSTS and it is not in origin, so  **you can pipe this list to xargs, to issue a push –delete for each branch.** Now you can use this command simply issuing a git fetch for each remotes, then paste the instruction in your bash, press return and the game is done.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/01/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/01/image-1.png)

 ***Figure 2***: *Results of the command, two branches are deleted from VSTS remote because they were deleted from the origin remote*

It is amazing what you can do with bash + awk + sed in a single line :P

Gian Maria.
