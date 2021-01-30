---
title: "Configure Visual Studio 2017 155 for pull 8211rebase"
description: ""
date: 2017-12-23T12:00:37+02:00
draft: false
tags: [Git,Visual Studio]
categories: [Git]
---
 **I’m a great fan of rebasing over merge and I’m convinced that the default pull should be a fetch and rebase** , using fetch and merge only when it is really needed. Not having the option to configure a GUI to do a pull –rebase is a really annoying problem, that can be somewhat limited configuring pull.rebase git option to true, as explained in [previous post](http://www.codewrecks.com/blog/index.php/2017/12/19/configure-git-repository-for-automatic-pull-rebase/). Actually, the lack of rebase on pull option makes me stop using the IDE.

> To have a linear history in Git, always consider rebase over merge, especially for everyday pulls.

I’ve used this technique extensively with VS 2017, the only drawback is an error during pull because VS complains about “unknown merge result” since he was not able to find merge commit. Give this, I was always reluctant to suggest to customers, because it is not good having your IDE constantly show error at each pull.

 **After updating to 15.5 version I noticed that the error went away and the IDE correctly tells me that a pull with a rebase occurred**. If I open the global or repository settings in Team Explorer I can found that now, finally, pull.rebase is supported.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-14.png)

 ***Figure 1***: *Pull with rebase is now supported, as well as other interesting options.*

Actually these are the basic settings of Git, if you configure the repository or globally the Rebase local branch when pulling, it will set pull.rebase to true, nothing more. **The important aspect is that the IDE now honor the settings**. Suppose you have one local commit and one remote commit like in  ***Figure 2***: [![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-15.png)

 ***Figure 2***: *Classic situation where you have local commit and remote commits*

 **Now if you simply press the pull command in the IDE, you will see that VS is correctly issuing a rebase.** When everything is finished you are informed that indeed a rebase was done, the error went away.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-16.png)

 ***Figure 3***: *Visual  Studio correctly rebased local branch on the remote branch.*

With this latest addition I can confirm that Visual Studio is now a really interesting IDE to work with Git (even if, if you are experienced with Git, probably you will still stick in CommandLine most of your time).

P.s: Another nice addition is the support to prune after fetch and support to push –force. If you try to push a commit after an amend, instead of the standard error, you will be prompted with a  MessageBox that asks you if you really want to force the push.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-17.png)

 ***Figure 4***: *MessageBox asking for a push force if needed.*

If you are curious about why VS is using a –force-with-lease instead of a standard –force, [please read this article](https://developer.atlassian.com/blog/2015/04/force-with-lease/). Basically it is a way to force the push if no one had pushed something else in the meanwhile. If you really need to force a push, like when you rebase a feature branch, you can always use commandline.

Gian Maria.
