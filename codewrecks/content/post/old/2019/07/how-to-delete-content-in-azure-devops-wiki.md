---
title: "How to delete content in Azure DevOps wiki"
description: ""
date: 2019-07-05T14:00:37+02:00
draft: false
tags: [AzureDevOps]
categories: [Git]
---
Today I got a simple but interesting question about Azure DevOps,  **how can I completely delete the content of the wiki** ? There are not so many reason for this, but sometimes you really want to start from scratch. Now suppose you have your wiki:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-3.png)

 ***Figure 1***: *Wiki with a simple page*

You have created some pages, you played a little bit with the wiki, you attached some cute pets photo and content to the wiki itself, maybe just to gain familiarity with the wiki itself.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-4.png)

 ***Figure 2***: *Wiki with some content on it.*

 **Now you want to delete everything, such as that no member of the team should be able to retrieve pages and content anymore**.

> Azure DevOps Wiki are nothing more than a Git Repository with MarkDown content, so you can directly manipulate git repository if you need to alter wiki history

 **To do a low level manipulation of the wiki, you should simply clone wiki repository locally** , you can simply find repository url in the UI

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-5.png)

 ***Figure 3***: *Clone wiki repository from the ui.*

That menu option simply lets you to grab url of the repository, then you can simply clone the repository locally and verify all the commits done in the wiki. (I use command line but you can use any UI of you choiche)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-6.png)

 ***Figure 4***: *Content of the wiki, a simple git repository*

Now if you look a  **Figure 4** you can notice that the wiki is nothing more than a git repository with a commit for each modification you did to the wiki. Now, if you really  **want to reset everything and start wiki from scratch,** you can simply issue a

{{< highlight bash "linenos=table,linenostart=1" >}}


git reset --hard SHA_OF_FIRST_COMMIT

{{< / highlight >}}

Where SHA\_OF\_FIRST\_COMMIT is the address of the very first commit, the one with the comment Initializing wiki, in my example 86ec4c9. After the command was executed your local wikiMaster branch point to the very first commit of the repository, an empty wiki.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-7.png)

 ***Figure 5***: *Your local wikiMaster branch was reset to the very first commit, now wikiMaster point to an empty wiki*

Now you can simply push with –force option to reset remote branch to the very same commit.

{{< highlight bash "linenos=table,linenostart=1" >}}


git push --force

{{< / highlight >}}

 **Open again wiki page to verify that now it reverted to the original version.** Actually the server still has the previous commit in the database, but they are not reachable anymore and they will be deleted over time by internal garbage collection.

> Resetting to the very first commit actually delete everything from the wiki, restoring it to its pristine content

This scenario is not really common, but a real common scenario is when  **you mistakenly write something in the wiki, save the page and then you want to delete what you have written.** There are lots of reason for this requirement, you mistakenly inserted sensitive data like passwords or tokens, or you simply write something that you want to permanently delete.

If you look to  **Figure 4** , suppose you simply paste a wrong image and you want to remove that image and all related content from the history of the page.  **If you simply edit the wiki page, remove the image, then save again the page, the data is still in the history, anyone can find again the content you want to remove. The only solution is to rewrite git history.** >  **Since a Wiki is a git repository, everything you did remain in history of the page, if you included sensitive information, even if you edit the page, removed that information and save again is not enough.** From  **Figure 4** you can verify that the incriminated commit is 97e520e. If you followed my previous example you can simply reset everything to the previous commit,  **actually deleteing every content that was inserted after that commit.** {{< highlight csharp "linenos=table,linenostart=1" >}}


git reset --hard 97e520e^

{{< / highlight >}}

Special char ^ indicates first parent of a commit, so previous instruction tell git to reset to the commit parent of bad commit. After this operation a git push – force will reset the branch from the server. **The incriminated content is now gone, along with every content that was inserted after. Actually you restored wiki content to a past point in time.** >  **Git reset –hard in your wiki repository allows you to restore a Wiki on a point in time, but everything that happened after that moment will be lost.** This is not a perfect approach, suppose you realize that someone stored a password in the wiki some days ago, you  **do not want to lose everything but simply remove that specific content and leaving other commit unchanged.** Thanks to git flexibility you can obtain this operation with an interactive rebase.

{{< highlight bash "linenos=table,linenostart=1" >}}


git rebase 97e520e^ -i

{{< / highlight >}}

 **This will actually trigger a complete rewrite of the history from the parent of the incriminated commit to the last commit of the wiki.** I’m not going to give you a complete explanation of an interactive rebase, but basically you are presented with the list of all commits, starting with the commit you want to delete to the latest commit in the branch.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-8.png)

 ***Figure 6***: *Delete the commit with interactive rebase.*

In  **Figure 6** you are seeing an example in which I have a single commit after the one you want to remove, but nothing changes if you have tons of commits after.  **You simply need to change the command for the first commit (the commit you want to delete) from pick to d (delete). Leave all other rows unchanged.** Then simply save the script to continue (if you are not familiar with VIM simply press I to edit the file, change the file then press ESC to come back in command mode and press : then w then q then ENTER).

This command actually deletes only the commit you want to delete, leaving all following commits unchanged.  **You actually scissor knife removed a single bad save from your wiki.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-9.png)

 ***Figure 7***: *Commit was removed, local branch has not anymore commit 97e520e*

 **Now you should be 100% sure that no one else modified the wiki in the short timespan you need to clone and rebase the repository so you can issue a git push –force to overwrite content of the repo on AzDo instance.** >  **A git interactive rebase is an operation where you are rewriting history, so you can selectively remove a single commit from the history.** This will actually preserve all content of the wiki,  **you only removed a single commit from the wiki**. There is no more history of that commit inside the Wiki. (actually deleted commit is still unreachable on the server, but there is no way for other to retrieve it).

If you want to completely remove a page with all the history of that page, you need to delete multiple commits, but luckily git has a filter-branch or more advanced comment. You can find more detail here [https://help.github.com/en/articles/removing-sensitive-data-from-a-repository](https://help.github.com/en/articles/removing-sensitive-data-from-a-repository "https://help.github.com/en/articles/removing-sensitive-data-from-a-repository")

Have I ever told you how much I love Git? :)

Gian Maria.
