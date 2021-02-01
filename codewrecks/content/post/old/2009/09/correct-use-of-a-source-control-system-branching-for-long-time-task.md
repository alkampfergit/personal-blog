---
title: "Correct use of a Source Control System branching for long time task"
description: ""
date: 2009-09-30T00:00:37+02:00
draft: false
tags: [Branch,Tfs]
categories: [Team Foundation Server,Visual Studio]
---
Source control system is probably developer's best friend, but quite often people use only a small percentage of its functionalities. One of the most missed feature is a correct use of a branch. Let's make a concrete example. Suppose that developer A needs to implement a big feature, it estimates a week to complete it, and while he is working at this feature he needs also to modify some basic part of the system. The problem is: *until the developer has finished the new feature the code is in not in stable condition, and it can even not compile correctly.*

A standard way to proceed is the following one.

1. dev A issue a get latest
2. dev A begins to modify code in local copy
3. dev A periodically executes a Get Latest and merge changes made by others with the code in the working copy.
4. dev A finished the new feature, executes a final Get Latest, verify that everything is ok and finally commits all modifications.

What is wrong with this process?

- until A commits everything in the trunk, new code is only in his hard disk, if it fails dev A losts everything.
- if the new feature needs to be developed by more than a single developer, say A and B and C it is impossible to work this way.
- if A wants another developer to review his code, he needs to send all modification to other dev for review, maybe zipping local folder.

This situation can be solved with a branch in a more efficient way. A branch is nothing than a special copy of a file or folder located in source control. I said special because Source Control System keeps track of the original source of the copy, and files are not really copied until someone makes a modification to the copied file. This permits to minimize the impact on the size of source control system but at the same time the [SCM](http://en.wikipedia.org/wiki/Revision_control) knows that a file is related to its original counterpart. To create a branch in TFS simply go to the source control view, right click a folder and choose Branch. You got this window

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image18.png)

In this example I'm branching the entire src folder to a folder called Branches/TestBranch, and I'm branching from the latest version. After you commit the branch, you will find that a complete copy of the src folder is now present in the branch folder

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image19.png)

Ok, you can now open the solution in the branch and begin working to the new feature, even if the code is not compiling, you can check-in with no problem. In my example I've modified a file to make solution not compile, then I look at the pending changes.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image20.png)

I can commit with no problem because modified file will be checked-in only to the branch. Other developers can continue to work in the trunk without being disturbed by my modification. Now suppose that another developer modify the same file I've modified in the branch. Periodically you need to verify if someone has modified the trunk to keep your branch in sync. Remember that you need to merge quite often, because in this way you always merge a little bit of code, if you wait for your work to be finished you will have to do a Huge merge, and it can become a pain. Now I simply click on the src folder and choose compare

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image21.png)

And I decided to compare it with the server version that I've commited to the branch version of the project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image22.png)

This shows me all differences between the two folders.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image23.png)

Ok two files are different, now you need to understand what to merge, since I know that I've modified AssertBaseTest it is normal that is different, but the ConstraintBaseTest is surely being modified by someone else. If you need information you can right click the file and view history, you have the possibility to look for history in the source (left side) or the target (right side). In this situation the source is the trunk, while target is my branch. Let's see the history of the AssertBaseTest.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image24.png)

Red one is the history for the source, you can see that in changeset 142 guardian modified a test. In blue one you see modification made in the branch, in changeset 140 there is the branch, while in 141 I changed a file to make it not compile. Since other people modified the file I need to do a merge. So I return to the code view, find the file in the source I want to merge and right-click and choose merge.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image25.png)

Since Tfs knows that I branched this file it presents me this windows

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image26.png)

You can verify that it permits me to choose only right target branch, I choose to branch all changeset, or you can even choose to merge to a specific changeset. Now when I merge the file a conflict is raised, because modifications are incompatible (me and other dev modified the same file), so you can simply edit conflicts in the standard merge tool. After merge is complete you can verify that file was really merged looking at his history.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb27.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image27.png)

If you merge now ConstraintBaseTest.cs that was modified in the trunk no conflict happens and modification in the trunk are ported in the branch. Clearly in real situation you will do a merge of the entire src folder, and not file by file :) this is only to show you the details.

When you finished your new feature you can simply do a final merge of all the trunk, verify that everything is ok and now you are ready to reintegrate the branch into the trunk.

Merge operation is a very specific operation that assures to SCM that all modification of the trunk are moved and merged in the branch. After the last merge, you verify that everything in the branch is OK, and now you are ready to reintegrate the branch to the trunk. To reintegrate you simply right click the branch folder in source control view, and choose merge, and merge again with the original src directory. Now you will get conflicts for each file that was modified in the branch and in the trunk, but since you already merge changes from the trunk, and verified that everything is ok, you can now overwrite trunk version with merge version.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb28.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image28.png)

Now the trunk contains your new feature, but without being disturbed during its developement. This way to proceed has the following advantages.

- More than one developer can work at new feature working in the branch
- The branch is under SCM, so you get history, conflict handling, and it is backup with other source.
- You have full history of the branch, so you can track back every modification made by source code in the branch to create new feature.
- You can associate check-in of branches with team foundation work item.
- If you need someone review your code you can simply tell him to download the branch and do a review.

Alk.

Tags: [SCM](http://technorati.com/tag/SCM) [Branch](http://technorati.com/tag/Branch)
