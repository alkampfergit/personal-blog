---
title: "Visual Studio Tools for Git a primer"
description: ""
date: 2013-03-17T17:00:37+02:00
draft: false
tags: [Git,TF Service]
categories: [Team Foundation Server]
---
If you installed Update 2 CTP 4 (now it has go-live and supports upgrade to RTM) you should also  **install the** [**Visual Studio Tools for Git**](http://visualstudiogallery.msdn.microsoft.com/abafc7d6-dcaa-40f4-8a5e-d6724bdb980c) **that permits to work with Git repository directly from a Team Explorer extension**. You can work with GitHub or whatever Git hosting you like and surely you can work with TF Service Git based Team Project. Once you have a Team Project based on Git you can simply to to the Source tab, and grab the url of the repository.

[![SNAGHTML518640](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/SNAGHTML518640_thumb.png "SNAGHTML518640")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/SNAGHTML518640.png)

 ***Figure 1***: *How to find the url of the Git repository from web interface*

You can now copy the url, of you can simply compose id based on this scheme: https:// **myaccountname**.visualstdudio.com/DefaultCollection/ **\_git/teamprojectname**. Once you have a link to the project you can use Visual Studio tools for Git to clone it into a local repository. From  **Figure 1** you can see a couple of interesting links: *the first one link directly to the setting page to [setup alternate credentials](http://blogs.msdn.com/b/visualstudioalm/archive/2013/01/30/getting-started-with-git-in-visual-studio-and-team-foundation-service.aspx) (you will need it if you plan to work with standard git tooling, like command line) to enable access from all the tools that have no idea how to autenticate to TF Service with federation. The second link is a simple link to an help page that explain how to clone a Git Repository*.

If you plan to use Visual Studio integration, you can simply connect to the team project with the new Connect icon and once connected it will prompt you with a simple link to clone the repository

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb20.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image20.png)

 ***Figure 2***: *Once connected to the Team Project VS lead you to clone the repository.*

Now that the repository is cloned correctly you can create a new solution, or open existing one if you cloned a non-empty repository and you  **start working as you were working with standard TFS Source control**. If you modify a file Visual Studio will inform you with standard icon for modified filed

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb21.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image21.png)

 ***Figure 3***: *Source control integration will show you modified file as usual even if the repository is git*

If you go to the home page of Team Explorer you should see a different UI, reflecting the fact that the repository is Git and not standard TFS VCS. Pressing  **Changes** link you are presented with the list of modified files ready to be committed.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb22.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image22.png)

 ***Figure 4***: *Changes bring you to an equivalent of the standard pending-changes window*

This will open a standard UI that shows all modified files, untracked file (files that are in folder, but not added to source control), you can simply type a comment and press Commit.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb23.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image23.png)

 ***Figure 5***: *Standard VS UI to commit changes to local repository*

If you press the link  **Commit** from the Team Explorer Home (Figure 4), the UI will show all local commit that are not synchronized to the remote repository.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb24.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image24.png)

 ***Figure 6***: *Local commits that needs to be pushed to central repository*

Now you need to * **pay lot of attention to the user associated to the commit** *, as you can see in Figure 6, commit is made by user alkampfergit and my profile picture is missing. This happens because I already installed Msysgit and configured it to access my github repositories. To verify your current configuration you can simply open a Git Bash (you need to install Msys git), and issue a

> <font>git config &#8211;global &#8211;list</font>

You should keep care of a couple of settings:  **user.name** and  **user.email** , in my system they correspond to my profile in github, because I’ve already installed and configured git, Visual Studio is actually using those credentials and this is not so good. You can fix this going to  **settings** from the home of Team Explorer and choose to change git settings

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb25.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image25.png)

 ***Figure 7***: *Git settings in Visual Studio*

Now the problem is that VS will overwrite your global settings, and this can be a problem if you still work with github repositories, where I want to use Github username.  **The obvious solution is, configuring global settings with the user you use in most of your projects, and change locally for all other repositories**. To do this, simply open a Git Bash on the folder where you cloned your TF Service Git project and change settings locally

> <font>git config&#8211;local user.name alkampfer</font>
> 
> <font>git config &#8211;local user.email <a href="mailto:alkampfer@nablasoft.com">alkampfer@nablasoft.com</a></font>

Now you can do another commit, to verify that this time the user is correct.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb26.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image26.png)

 ***Figure 8***: *Using correct user will show your profile picture.*

Once you are ready to move all your changes to TF Service, you can simply press the  **Push** button (Figure 8) to push all of your changes to TF Service. Now you can go to Web Interface to verify that your commits are correctly pushed to the server

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb27.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image27.png)

 ***Figure 9***: *Your commits were correctly pushed to the server*

As you can see from Figure 9, first commit has no picture image, because it is associated to my github user. This can puzzle the inexperienced git user, because some people complain for this behavior because, after all, to push to TF Service git repository I need to use my TF Service credentials, so *why git is using credentials from config instead of authentication ones?* The answer is simple,  **in a distributed source control, the identity is used to push, but I can push commits that originated in another repository of another developer**. This is clear if you go to the commits page of the web interface and have a look at commit detail.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb28.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image28.png)

 ***Figure 10***: *Commit details*

From the details you can see that there are three pieces of information, the user that authored and commited is taken from git config, and push operation carry the credential used to connect to the repository. Suppose this scenario, you have your project in TF Service Git repository, cloned in your machine and ask to another developer, that has no access to TF Service account, to contribute on a feature. He will clone from your local repository, helps you to create the feature, commits to your repository (with his username and email) and then his commits will be pushed by you bach to TF Service, but clearly his commits are not associated to any TF User.

*Always remember, whenever you clone a git repository, to configure locally username and email if it is different from the standard one you configured in global git configuration. Your repository will be clearer.*

Gian  Maria.
