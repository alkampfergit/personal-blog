---
title: "The beautiful world of Git-XXX"
description: ""
date: 2013-10-31T21:00:37+02:00
draft: false
tags: [Git,git-tf]
categories: [Programming]
---
## Git support in Visual Studio

Having Git Support in Visual Studio is something I like for a lot of reasons; one of the most important one is the ability to use a  **local Git repository even if you work with Standard TFS Source Control or if you work with subversion**. Usually Git includes a  **Git svn utility that permits you to clone a subversion locally, use git locally and then finally push commit back to subversion**. Microsoft also created a [Git-TF](http://gittf.codeplex.com/) java extension that permits you to clone locally a standard TFS Version Control folder. This means that basically you can use all local goodness of git even if the remote repository is TFVC or Subversion and thanks to VS Plugin you have an unified experience.

## Using centralized when you are used to Git is a pity

If you are an experienced Git user you surely will use command line to do your everyday work (like doing a fetch and rebase instead of a standard fetch and merge) but having a nice UI integration in your GUI is somewhat nice for standard operations. Another advantage of having VS support for Git is  **you can teach people to use Git, then with git svn and Git-tf they can work with TFVC, SVN or Git using the same toolset and with a little help of command line tools**. If you and your team should collaborate with others team, nothing is more frustrating that using a lot of different toolset for different VCS.

I worked and I still work with subversion, but never felt good with the various VS integration plugins. I worked for years with svn command line and Tortoise SVN, but I must admit that having support inside VS gives you many interesting features. First of all you can view history or create diff of files, without using other tools. Then you can commit directly from Visual Studio with a nice UI and manage and switch branches directly from VS. **One nice feature of switching branch in Visual Studio is that the IDE knows that the local files changes due to a branch switching and automatically reloads the solution** without warning you that files changed outside VS and asking if you want to reload them.

The ability to use all the goodness of Git locally even if the remote is a centralized VCS is really useful and a feature your team should not miss.

## Can I use a local Git even if I have Subversion repo without being crazy?

The usual question is, how many commands I should issue from command line to work effectively with Git Svn? Is it really possible to mix VS experience with Command line without going crazy?

 **The first command line operation is clearly the clone of a Subversion repository** , it is just easy as typing

{{< highlight bash "linenos=table,linenostart=1" >}}


git svn clone url_of_your_svn_repository

{{< / highlight >}}

This is need only the first time you start working with a svn repository. This command has a nice –s option that is trying to remap branches and tags if your repository has standard layout: /trunk/, /branches/, /tags/, etc. If your svn repository has not a standard layout, I simply clone the trunk or main and each branch separately. Most of the time you can simply clone only the main for the everyday work, then use standard Svn toolset to merge branches.

After you cloned locally it is a good practice to insert a good.gitignore file, you can find tons of examples in github ([https://github.com/github/gitignore](https://github.com/github/gitignore)).

After you cloned the repository you can work locally with Git with any tool you like, like Visual Studio, you can create local branches, you can commit, rebase locally, etc and you need to resort to command line only when it is time to talk with your remote svn repository.

 **The second command line operation you should know is** {{< highlight bash "linenos=table,linenostart=1" >}}


git svn rebase

{{< / highlight >}}

the rebase operation  **download all updates from Subversion and do a rebase of your local modification on top on them**. This basically means that each local commit is replayed on top of new updates downloaded from Subversion. Since Svn is a centralized VCS, it does not permits you to merge locally your modification with remotes, so you are forced to do a rebase. If there are conflicts, rebase operation will stop, and you need to fix conflict typing

{{< highlight bash "linenos=table,linenostart=1" >}}


git difftool

{{< / highlight >}}

This will open the diff tool configured in.gitconfig, I usually use Visual Studio as [I told in this older article](http://www.codewrecks.com/blog/index.php/2013/03/19/how-to-configure-diff-and-merge-tool-in-visual-studio-git-tools/). When all conflics are resolved you can continue the rebase operations

{{< highlight bash "linenos=table,linenostart=1" >}}


git rebase --continue

{{< / highlight >}}

Working locally can generates a lot of local commits to be replayed on top of remote modification during a git svn rebase operation, this can lead to numerous conflics.  **The third command line utility you should know is the** [**interactive rebase as explained here**](http://git-scm.com/book/en/Git-Tools-Rewriting-History). I won’t go into details, but it is easy to take local commits that were not synced to svn and squash them, creating an unique commit. This will lead to less conflict during a rebase.

Then the final command line operation is

{{< highlight bash "linenos=table,linenostart=1" >}}


git svn dcommit

{{< / highlight >}}

That push all your local unsynced commits to the remote subversion repository, equivalent to the Commit Subversion operation.

## What about keeping some local file uncommitted with local modification

Another couple of nice command to know are

{{< highlight bash "linenos=table,linenostart=1" >}}


git stash
git stash pop

{{< / highlight >}}

 **The first one grab all local modifications and park them in a** [**stash**](http://git-scm.com/book/en/Git-Tools-Stashing). This command is super useful if you have local modfiications that you do not want to push to the central repository. In a project I have a web.config file that is different from that one in the repository, I do not want to commit it, but  **if you have local modifications, you can’t do a git svn rebase**. Doing a git stash will park modified web.config file in a stash, leaving everything clean.  **This permits me to do a git svn rebase, merge and then a git svn dcommit to send modification to Svn. Finally git stash pop reapply the same modification to my local copy** , and I have again all my local modifications I do not want to push to central svn repository.

To do a recap, starting working with Git svn is just a matter of cloning with git svn clone then it is a sequence of: git svn rebase to update your local repo, do your modification using standard git tools. When your local modification are ready to be sent to remote svn do an interactive rebase squashing into one commit, issue a git svn rebase to merge your local modification with modification of central svn repository and finally git svn dcommit to commit to central repository.

You can ask yourself if this really worths instead of using one of the many Svn plugin for VS, but  **I assure you that when you got used to Git and local branches, you will understand how useful is being able to use git locally, even if the main repository is a Centralized VCS**.

Gian Maria.
