---
title: "Configure Git repository for automatic pull 8211rebase"
description: ""
date: 2017-12-19T19:00:37+02:00
draft: false
tags: [Git,Visual Studio]
categories: [Git]
---
I’m not a great fan of Git Graphical User Interfaces, I use mainly command line, but I needed to admit that, **for novice user, the ability to use a GUI is something that can easy the pain of transition to a new tool**. Visual Studio 2017 is a decent GUI for Git and since.NET developers are used to it, people want to stay as much as possible inside the IDE, leaving the commandline only for special operation (squash, reflog, etc)

 **The main problem I found with VS 2017 is the “pull” button,** because I’m a great fan of pull –rebase instead that normal pull, because the history will be clearer. Suppose you have this situation:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-9.png)

 ***Figure 1***: *Situation before a pull, one local commit, one remote commit*

This is a standard, a developer has created a local commit and we have another commit done in the origin/master branch. This is what the develop see in Visual Studio sync interface:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-10.png)

 ***Figure 2***: *The same situation of Figure 1 as seen in Visual Studio*

From the comment you can see that the incoming commit is a simple add of readme.md file , this is unrelated to the modification done by developer, but if he press the pull button here is the result.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-11.png)

 ***Figure 3***: *A merge commit is created due to the pull operation*

 **If everyone will use the default pull option, the team will create a lot of unnecessary merge commits, thus I really prefer the pull –rebase approach** , but the problem is: in Visual Studio there is no easy way to issue a pull –rebase and the pull button is just to easy to press to convince people to go to command line and issue a pull –rebase. Luckily there is an option that you can configure globally and that will default pull operation to do a rebase instead that a merge

git config –global pull.rebase true

 **After this configuration was done, whenever you issue a git pull, the –rebase option will be added automatically for you.** Since VS 2017 honors git settings, if you press the pull button you got the right behavior, even if it is complaining that the merge result was unknown. (a rebase happened, not a merge)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-12.png)

 ***Figure 4***: *After the pull, VS is complaining because the merge result is unknown, because a rebase was instead done*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-13.png)

 ***Figure 5***: *Indeed GitViz confirm that the pull operation was a pull –rebase*

 **You can just ignore the error in Visual Studio and accept the fact that now, whenever you press the Pull button in Visual Studio you will trigger a pull with a rebase instead that a pull with merge.** This technique is not going to work with older version of Visual Studio, because they used the LibGit2Sharp library.

Gian Maria.
