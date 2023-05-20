---
title: "Add existing project to TFS"
description: ""
date: 2012-01-27T09:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
This is a super basic and easy question, but I found quite often people asking me how to add an existing project to a TFS Team Project. It turns out that there are more than one way of doing this, but I usually suggests this simple path that is quite simple and is understandable from people that comes from the subversion world.

First of all be sure that you have a valid workspace in your computer that maps the folder in the Team Project where you want to put your existing project and issue a  **GetLatest**. If the team project is new you can simply create a workspace going to menu File –&gt; source control –&gt; Workspaces, press add and create a workspace that maps the source to a folder on your pc.

[![SNAGHTML2b6825](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML2b6825_thumb.png "SNAGHTML2b6825")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML2b6825.png)

 ***Figure 1***: *Creating a workspace that maps the whole folder of the source control.*

Now simply go to the local folder and move the existing solution from the original location to the mapped folder, then go to the Team Explorer –&gt; Source control and manually add all the files to Tfs Source Control. In  **Figure2** I represented the process to accomplish this task, first of all select Source Control, press the add button then Visual Studio presents you all the files that are in your local folder but are not present in the source control (they are the candidate to be added to the source control).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image8.png)

 ***Figure 2***: *Adding existing file to source control*

Now you are presented with a list of all the files that will be added to TFS source control, as seen in figure 3

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image9.png)

 ***Figure 3***: *List of files that gets added to the source control.*

As you can see some of the files are excluded (22 in Figure 3), this happens because Visual Studio already knows that certain types of file should be excluded from source control, like all the Bin and Debug folders and **all \*.dll files **. If you have some** lib  **folder where you store third party library, you can go to the Excluded Items tab in** Figure 3  **to add manually all the excluded files you want to be added to the source control. Since this window is usually cluttered with all the bin and obj directory, I found simpler to:

1. 1) in a first pass add all the file suggested by Visual Studio
2. 2) browse to lib directory (or whatever folder contains third party library) and add explicitly all the files in the directory.

Now all files were in Pending-add, this means that they will be sent to the source control with a  check-in, but before the check-in phase you should** open solution file from the source control explorer **windows. After the solution is opened Visual studio should tell you that** this solution is in a source control monitored folder, but source control is not enabled **[![SNAGHTML389943](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML389943_thumb.png "SNAGHTML389943")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML389943.png)

This basically means that, source files are correctly linked to the source control system, but the Visual Studio integration is not enabled, you can simply press Yes and let Visual Studio actually do** binding between projects and source control **.

If the binding does not happens automatically you will get the windows of Figure 4, (you can always open this windows with the menu File –&gt; Source Control –&gt; Change Source control. In this window you can simply select one project at a time and press the Bind button to perform the bind, until all the project files are in Connected Status.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image10.png)** Figure 4: ***Binding windows where you can bind solution and projects file to TFS*

Now you can check-in everything and usually you should create another workspace or ask to another member of the team to do a get-latest of the just-inserted solution, to verify that all the needed files were correctly added to the source control.

Gian Maria.
