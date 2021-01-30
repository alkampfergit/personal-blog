---
title: "TFS Pills merging conflicts during unshelve"
description: ""
date: 2011-12-02T15:00:37+02:00
draft: false
tags: [Power Tools,Team Foundation Server]
categories: [Team Foundation Server]
---
Shelvesets are a really useful concept in TFS, and you should be aware that thanks to Power Tools you can even do a Merge during an Unshelve in case of conflicts. As an example suppose this simple and stupid scenario, you have this code.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image8.png)

 **Figure 1** * **:** Original Code*

Now lets generate a conflict with Shelveset; simply typing some text.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image9.png)

 ***Figure 2***: *Modified code, insertion of a simple comment.*

I’ve simply typed some comment into the class, now Shelve the file without preserving pending changes, the file reverts to the code in Figure 1, now modify again the comment of the class as shown in Figure 3          
[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image10.png)

 ***Figure 3***: *Another modification done to the class, this modification conflicts with the version in Figure 2.*

Now check-in and commit this code (this simulates the situation when you need to suspend with shelve the work you are doing to accomplish higher priority task), then unshelve the previous shelveset, as you can verify the code revert to that one shown in Figure 2, and you lose the modification of the last check-in. This happens because the unshelve operation does not trigger a merge in case of conflicts. If you looks at the output windows you should find a message telling you that a newer version exists in source control as shown in Figure 4

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image11.png)

 ***Figure 4***: *A warning by the source control, a newer version of the file exists.*

Now you should simply reissue a Get Latest command and TFS will present you a list of all conflicts that originates from the unshelving operation.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image12.png)

 ***Figure 5***: *Issuing a Get Latest will trigger the conflict windows that shows each file that conflicted after the unshelve operation.*

This is a situation where you have a simple conflict when a file that got in the shelveset was modified and checked-in after the shelve operation, you can merge with the tool of choiche, accept both the comment and check-in, to proceed to the next example. The situation of the file is now represented in Figure 6 and this is the starting point of another example of merging shelvesets when a conflict happen between two users

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image13.png)

 ***Figure 6***: *Both comment where accepted during the merge.*

Another type of conflict arise from unshelving conflicting code from another developer. Suppose Dev A and Dev B start both from the code in figure 6, Dev A types a third line of comment telling “*third comment line*”  **and shelve the code**. At the very same time Dev B  **does a conflicting modification** , typing a third line of code that states “*conflicting third comment line*” and after this modification, she receives a call from Dev A that asks to review his shelveset. If Dev B try to unshelve the shelveset from Dev A she got the error in Figure 7

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image14.png)

 ***Figure 7***: *It is not possible to unshelve because of conflicts.*

This happens because the standard unshelve operation does not permits to handle conflicts, if Visual Studio unshelve a conflicting file from Dev A, all the modification pending from Dev B will be lost. This is an annoying situation that you can solve with Power Tools.

If Dev B want to merge the code in the shelve of Dev A with her current code, she should open a Visual Studio Command prompt, move to the workspace where the project resides, then issue a * **tfpt.exe unshelve** *command directly from command line. The command line utility will open the same UI to unshelve that you got in Visual Studio, but now, when she browse to the shelvesets of Dev A and try to unshelve, she got a nice windows that shows all conflicts.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image15.png)

 ***Figure 8***: *Tfpt.exe unshelve presents you a list of all conflicts that occurred during the unshelve operation*

Now you can try automerge, and if it fails, you can press the “Resolve” button (or you can directly go for the “resolve” button without try automerge if you do not like to automerge conflicts :)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image16.png)

 **Figure 9** *: Resolve conflict during unshelve.*

In Figure 9 you can see how to ask for a manual merge. Pressing OK Will open the standard tool for merging, you can now do a manual merge and save the result of the merging. Taaadaaaa, thanks to Power Tools you are able to unshelve conflicting shelvesets made by other developers.

Now what happens if Dev B want to revert to the original code she has before merging with the shelveset of Dev A? No problem, because the tfpt.exe unshelve command had created a backup shelveset with all the pending changes just before the merging operation, so if you want to dischard all the modification and revert to the same code that you have prior of the unshelve operation, you can issue another tfpt.exe unshelve operation, choose the backup shelveset (it has the same name of the unshelved shelveset with the string \_backup appended), and when the Resolve Unshelve Conflict windows appears (Figure 9) you can simply choose to undo my local changes and take the shelved changes, and you are done.

Happy shelving.

Gian Maria.
