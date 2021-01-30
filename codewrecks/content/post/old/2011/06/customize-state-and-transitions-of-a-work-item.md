---
title: "Customize State and Transitions of a Work Item"
description: ""
date: 2011-06-30T06:00:37+02:00
draft: false
tags: [Process Template,Tfs]
categories: [Team Foundation Server]
---
1 – [Customize Tfs Process Template](http://www.codewrecks.com/blog/index.php/2011/06/22/customize-tfs-process-template/)  
2 – [Basic of TFS Process Template Customization](http://www.codewrecks.com/blog/index.php/2011/06/23/basic-of-tfs-process-template-customization/)  
3 – [Adding Field to a Work Item Definition](http://www.codewrecks.com/blog/index.php/2011/06/24/customization-of-tfs-process-template-adding-field-to-a-work-item-definition/)  
4 – [Customize Work Item Fields with Rules](http://www.codewrecks.com/blog/index.php/2011/06/25/customize-work-items-fields-with-rules/)  
5 – [Interesting rules to customize work items.](http://www.codewrecks.com/blog/index.php/2011/06/27/interesting-rules-to-customize-work-items/)

Now that we know how to add information to a Work Item definition, it is time to deal with “state” management. Each Work Item has a field called * **Status** *that is completely different from any other field, because has an associated workflow that manages transactions from various allowed status values. Having a workflow to manage State of a Work Item is a really powerful concept, because permits a more accurate modeling of your process. As an example suppose that in your process each bug enter the system in a status called *[Triage](http://en.wikipedia.org/wiki/Bug_triage#Bug_management),*because is new and need to be examined by someone before a developer could actually work to its resolution.

This concept comes from Emergency Room in hospitals, all people that comes in ER are set to a Triage status and someone determines priority code, do understand witch of the patients need to be examined first by a doctor. For bugs the situation is the very same, usually the bug moves from Triage to Active (Someone should fix it) but we can also choose not to fix for various reason; as an example we are not able to reproduce the bug, or simply it is too complex to fix and it is really not so important that we can postpone the fix in the next release. We can have tons of reason to immediately close the bug bypassing the Active state and surely one of the most important is *The bug is duplicated*. Having a duplicate bug is cause of a lot of problem so it is perfectly legal that a bug never reach the Active status. If our bug definition has no Triage concept we can customize the process template to adapt it to our way to work, thanks to concept of *[State and Transitions](http://msdn.microsoft.com/en-us/library/ms194981%28v=VS.100%29.aspx).*

 **States** represent logical states of a Work Item and is simply a list of various status string, each one identifying a valid state for the Workflow. A  **Transition** permits to move from one state to another and we can change status only if there is a valid transition in the workflow definition. All these information can be edited with the Process Template Editor that has a good graphical editor to give us a visual image of States and Transitions.

In  **Figure 1** we can see the graph related to the Msf For Agile bug definition

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb33.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image33.png)

 ***Figure 1***: *State and transition of Bug definition of the MSF For agile process.*

To add a new valid state we need to drag and drop a new state from the toolbox to the diagram, in  **Figure 2** I simply dragged a new state and changed its name in *Triage.*

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_thumb_1.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_4.png)

 ***Figure 2***: *A new state called Triage was added to the workflow.*

Since this will be our new initial status, you should change the default transition. To do this simply right click on the transition, choose the “Open Details” menu item and you will see the Transition editor form ( **Figure 3** ), now you should simply change the *To*field that identify the destination of the transition.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_thumb_2.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_6.png)

 ***Figure 3***: *The form to edit a transition, as you can see you can simply choose from and to state with a combo.*

As you can see the *From*value is null, to identify this as the default transition so Triage will be the new default initial status of a Bug. The second tab called *Reason* contains the reasons that could move the bug from the original status to the destination status and contains also the list of *valid reasons* (enlisted in the *reasons*tab of the editor). This is a powerful concept, because you can always look at the Reason field an have a clue of the reason why the Work Item is in this status. In  **Figure 4** you can see the list of reasons associated to Bug insertion in the system.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_thumb_3.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_8.png)

 ***Figure 4***: *Reasons associated to this transition.*

For the initial status the reason represents *why the bug is in the system*, I decided to have three reason, the default one is *signaled by tester* and identify the standard bug source, a tester found a bug and inserts it into the system. But we can have bug signaled by the build system when a build fails and finally we can have bug signaled by customers (usually they have higher priority for triaging).

Now I can close the Transition editor form, right-click on the editor and choose “validate” to validate my new workflow. Actually it is not valid, and the error is:

* **State Active cannot be reached from the start Transition.** *

This happens because the default transition now points to Triage and the Active state is unreachable. You should now drag Transition objects from the toolbox to the workflow to add transition between Triage to the Active and Closed state, finally you should reach the situation of  **Figure 5**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb34.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image34.png)

 ***Figure 5***: *Iâ€™ve added transition from Triage to other status, now the workflow is valid again.*

After this new workflow is saved, when we create a new bug we can only specify the Triage state and one of the Three allowed reason for the default Transition ( **Figure 6** ). As you can verify the default reason is “signaled by tester”

[![SNAGHTML73c1ca](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/SNAGHTML73c1ca_thumb.png "SNAGHTML73c1ca")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/SNAGHTML73c1ca.png)

 ***Figure 6***: *The new workflow permits only the Triage status on inserting.*

When you save the bug, the field Reason become Read-Only, because this field can be changed only during a change of state. Since the bug is now in the Triage status, we can change status to Active or Closed; if you choose Closed as a new status, the Reason combo become active again and shows the available reasons associated to this transition. ( **Figure 4** and  **Figure 7** ). If you change the new status to Active the Reason combo immediately changes to enlist the valid reason of the transition from Triage to Active.

[![image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_thumb_5.png "image")](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Stati-e-transizioni_5CF3/image_12.png)

 ***Figure 7***: *Changing the status to Closed activate again the Reason field that shows only the reasons associated to the transition from the current status (Active) to the new status (Closed).*

State and transition are powerful concepts that permit to implement complex workflow to model the lifecycle of various types of Work Items. I strongly suggest you to adapt the definition of your template of choice to your current process, especially for Bug and Requirement types of Work Item.

Alk.

Tags: [TFS](http://technorati.com/tag/TFS) [ALM](http://technorati.com/tag/ALM)
