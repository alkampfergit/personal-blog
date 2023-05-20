---
title: "Local workspaces"
description: ""
date: 2011-09-29T16:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
In Tfs11 one of the most important change in source control system is the introduction of the “local workspaces”. A Workspace is a mapping between the server source control system and a local folder of a computer and until Tfs11 its state is managed by the server. One advantage of this approach is: when I ask for a “Get Latest”, the server knows the status of my workspace and can send me only the files that are changed. This has some disadvantage, all the files are readonly on disk, because you should explicitly do a “Check-Out” operation to begin editing a file, but there are also some annoying behavior: if you delete a file from the Windows explorer and you issue a Get Latest file, nothings get downloaded, because the server still believes that you have that file on your folder.

To solve problems that happens when you operate with files outside of the control of Team Explorer, you have the power tools command  **tfpt scorch** that helps you to realign the local version with the server version.

On the contrary other Source Control System, like subversion, uses a completely different model, where the local copy is the master of the mapping. Whenever you issue a  **svn update** command, the svn client check the situation of the local copy, does a confrontation with the server and detect the list of action to do. If you delete a file outside the control of svn client and then issue a  **svn update** , the file is downloaded again from the server, because the client simply verifies that the file exists on the server but does not exist on the local copy, so it must be downloaded. The downside of this approach is performance, I have a big project where we have thousands of source controlled files, and in a pc with standard 7200 rpm disks, issuing a  **svn update** of the trunk requires 60 seconds of wait with the disk queue completely full, before the client understand the list of file to downloaded.

But clearly in small solution the approach of svn is winning, because you do not have readonly files, you can simply issue a Get Latest without worrying if you did some modification to the local copy outside the control of TFS. The local workspace is the equivalent of the subversion workspace model, and they are the default type of workspace.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image13.png)

 ***Figure 1***: *You can choose to use server version of workspace, but Local is the new default.*

After you create a Local workspace, you can try now to delete some files from windows explorer, then issue a get latest and you will see that those file you deleted will be downloaded again. But how this new mode works? Like subversion it creates in the local workspace some hidden folders that keeps tracks of what is happened in the folder.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image14.png)

 ***Figure 2***: *The $tf folder is used by TFS to store information about the local operations done in the workspace.*

Another interesting operation you can do is the following one: disconnect the network, so you pc is not able anymore to connect to the Tfs, now add a simple hello.txt file on a workspace folder, write something on it, then open the solution and modify some file. This will simulate working offline, as you can verify all the files are not read-only and you can work as if you were online, you can do every modification you want to each file in the solution.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image15.png)

 ***Figure 3***: *Even if I’m offline, editing a class shows the check-out icon*

Now reattach the network cable, refresh the pending changes windows and you will see pending operations :)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image16.png)

 ***Figure 4***: *When I come back online Team Explorer detects all the changes.*

As you can see I’ve modified three files, but the really important stuff is that I have one item on “Detected changes”; it basically means that something is changed in the local copy on a file or folder that is actually not under source control, now you should simply click on it to verify what is really happened.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image17.png)

 ***Figure 5***: *The Promote Candidate Changes dialog*

This entirely new dialog shows you what was added and deleted in the workspace, and permits you to choose various actions. The obvious one is “promote” that will actually Add (or delete if you are in the Detected Deletes) the file to the source control, but you can also ignore this specific local item, or ignore by extension or file name. As an example, if you usually put.txt files in your workspace but you do not want them to pollute your *promote candidate changes* window you can simply ignore by extension and the game is done, no \*.txt will ever reappear in your *Promote Candidate Changes* window again.

The exclusion filter is global, and if you want to remove a filter, you actually should do it manually editing the file located in C:\Users\Me\AppData\Local\Microsoft\Team Foundation\4.0\Configuration\VersionControl\LocalItemExclusions.config that has a UserExclusion part as shown in  **Figure 6** [![27-09-2011 10-53-50](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/27-09-2011-10-53-50_thumb.jpg "27-09-2011 10-53-50")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/27-09-2011-10-53-50.jpg)

 ***Figure 6***: *The exclusion list, it is a simple XML file*

Now you can Change/Remove element in this simple XML file and configure it for your needs. Remember that the exclusion file is used only by the Promote Candidate Changes, if you press the add button on the source control explorer, the hello.txt file got listed as available to be added.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image18.png)

 ***Figure 7***: *Explicitly pressing the add item button in Source Explorer shows all file*

I’m sure that the introduction of Local Workspace will improve a lot the overall experience users have with TFS Source Control System.

Gian Maria.
