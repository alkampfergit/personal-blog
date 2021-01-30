---
title: "How to configure diff and Merge tool in Visual Studio Git Tools"
description: ""
date: 2013-03-19T19:00:37+02:00
draft: false
tags: [Git,VSAlm]
categories: [Visual Studio ALM]
---
If you are using Visual Studio plugin for Git, but you have also configured Git with MSys git, probably you could be surprised by some Visual Studio behavior. The most obvious one is that commits are done using the wrong user.name and user.email configuration as I’ve described in [Visual Studio Tools for Git, a primer,](http://www.codewrecks.com/blog/index.php/2013/03/17/visual-studio-tools-for-git-a-primer/) other one can be:  **tools used to do merge and diff during conflicts**.

Suppose you are working with Visual Studio, you issue a pull and find that there is some conflicts in repository.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image29.png)

 ***Figure 1***: *Pull operation has a conflict*

Now you should resolve all conflicts before being able to continue work: you can click on file name that is conflicting and you are presented with a UI different from the one you are used with standard TFS Source control.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb30.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image30.png)

 ***Figure 2***: *Ui to manage conflicts when you are using Git in Visual Studio*

If you press “compare files” to visualize diff of files,  **it could happen that kdiff3 is opened to visualize the difference, instead of resolving directly inside Visual Studio**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb31.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image31.png)

 ***Figure 3***: *File compare is done with Kdiff3 instead of visualizing them inside Visual Studio*

This happens because Visual Studio Git Plugin uses standard git configuration, your local repository probably does not have any specific tools for diff and merge (unless you configured them), so global settings are honored. To verify actual settings you can open a Git Bash on the repository, issue a  **git config –list** command  **and look at merge.tool and diff.tool settings** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb32.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image32.png)

 ***Figure 4***: *Actual configuration for merge and diff tools*

Since I’ve configured kdiff3 as standard conflict resolution tool after I installed msysgit, Visual Studio honors this settings and opens kdiff3 to do the diff, even if I’m inside the IDE of VS. If you prefer using Visual Studio you should configure VS as diff and merge tools and **you can choose to configure this at repository level or at global level**. To change only a local repository, open.git folder and edit * **config** *file adding this piece of configuration.

Edit: Due to a strange problem with my blog that alters the content of the configuration,

The exact configuration to use visual studio 2013 is found into this gist: [https://gist.github.com/alkampfergit/fca40445f118095e37f549f7058e71cd](https://gist.github.com/alkampfergit/fca40445f118095e37f549f7058e71cd)

The exact configuration to use visual studio 2017 is found into this gist: [https://gist.github.com/alkampfergit/46883dcef9fb4bee39a56ce0e69dcf24](https://gist.github.com/alkampfergit/46883dcef9fb4bee39a56ce0e69dcf24)

If you want to change global configuration, you should edit a file named.gitconfig usually located inside your profile folder (c:\users\yourname).

 **You can edit config file with a standard notepad or text editor, it is a simple text configuration file.** Once saved, return to Visual Studio and choose again to compare files,  **you should now being able to resolve conflicts directly from Visual Studio**. If you like this option you can setup Visual Studio as diff and merge tool in global git configuration, so it will be available for every repository you are working with.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb33.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image33.png)

 ***Figure 5***: *Once configured, Visual Studio is used as a diff tool for Git repository*

You can use Visual Studio not only for diff, but also for merge; press Merge button and you will be prompted with a merge UI.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb34.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image34.png)

 ***Figure 6***: *Merge tool of Visual Studio*

Once a file is merged, you can Press the “accept Merge” button in the top left area to resolve conflict and once all conflicts are resolved, you can go to commit pane and commit locally result of merge operations, and everything is done from inside Visual Studio.

Gian Maria.
