---
title: "Move a TFService source control to TF Service Git based Team Project"
description: ""
date: 2013-01-31T09:00:37+02:00
draft: false
tags: [Git,TF Service]
categories: [Team Foundation Server]
---
Now that with Update 2 we have Git support on TF Service a standard question arise: “how can I move all source from a TF Service standard project to a TF Service Git based Team Project?” The answer is quite simple

First of all you need to install and Configure [Git-Tf](http://gittf.codeplex.com/), an addin that permits to clone a TFS source control in a local Git repository, this is needed to have a full local clone of the source project you want to migrate. Then you need to create a new Team Project in TFService that is based on a Git repository.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image7.png)

 ***Figure 1***: *Create a new team project with Git as a Version Control System.*

Now you need to create a local clone of the original Team Project thanks to tf-git, just open a Git Bash console in a folder of your choice and type the command

<font face="Consolas">git-tf clone &#8211;deep <a href="https://gianmariaricci.visualstudio.com/defaultcollection">https://gianmariaricci.visualstudio.com/defaultcollection</a> $/webfacade</font>

Pay attention to use the –deep option to clone all check-ins of the original TFS repository, you now will be prompted for credentials and the clone operation will begin. I strongly suggest you to [Enable Alternate Credentials](http://blogs.msdn.com/b/buckh/archive/2013/01/07/how-to-connect-to-tf-service-without-a-prompt-for-liveid-credentials.aspx) to connect to your TFS so you can use a standard username/password combination to connect to your TFS Account. Now you can move into the new folder that will have the same name of your TFS Project and you should see all your original check-ins cloned in a local git repository.

[![SNAGHTML79aed7](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/SNAGHTML79aed7_thumb.png "SNAGHTML79aed7")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/SNAGHTML79aed7.png)

 ***Figure 2***: *after a git-tf clone –deep you now have a local git repository with all original check-ins*

Now you can work locally with git and use a standard TFS Version Control System thanks to the git-tf, but since now TF Service has support for standard Git enabled Team Projects,  **you can push all commits to the new Team Project** just created in  **Figure 1** and start working with Git.

To accomplish this you can simply  **set the remote for this repository** to be able to push and pull changes from your new TeamProject running the following three commands.

<font face="Consolas">git remote add origin <a href="https://gianmariaricci.visualstudio.com/defaultcollection/_git/WebFacadeGit">https://gianmariaricci.visualstudio.com/defaultcollection/_git/WebFacadeGit</a>      <br>git fetch      <br>git push origin master:master</font>

The url of the git repository is  **the standard url for your TF Service project collection** [**https://yourname.visualstudio.com/defaultcollection**](https://yourname.visualstudio.com/defaultcollection) **followed by the /\_git/teamprojectname** part that identifies the git repository. The git fetch command will be prompt for password and is used to contact the remote repository and fetch modifications. In our situation we do not have any modification since the repository is empty so nothing happens except you contact the remote server and verify if the remote was set correctly. Finally  **push command will force the local master branch to be pushed to the remote master branch** (and it implicitly creates remote master branch if it does not exists because the repository is empty).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image8.png)

 ***Figure 3***: *Push command creates the remote master branch and pushed all local changes to TF Service Git repository*

The result is the creation of a new branch in the remote TF Service git enabled project, and you should now be able to see all the commits from the web interface.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image9.png)

 ***Figure 4***: *As result of the push, all original check-in into the original project are now standard git commit in the new repository*

Now you need a final git command to  **setup the remote branch as the default upstream of your local master branch** <font face="Consolas">git branch &#8211;set-upstream master origin/master</font>

This command will setup the default connection with your new TF Service Git enabled project, now you can start to work normally with Git. As an example I added a readme.txt, committed locally and finally issued a simple **“git push”** and, voilà, you have done the first push of modification to Git repository in TF Service.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image10.png)

 ***Figure 5***: *The git push operation pushed modification to the upstream TF Service Git server*

To read how to work with Git and the new CTP Visual Studio plugin I [suggest you reading this post](http://blogs.msdn.com/b/visualstudioalm/archive/2013/01/30/getting-started-with-git-in-visual-studio-and-team-foundation-service.aspx).

Gian Maria.
