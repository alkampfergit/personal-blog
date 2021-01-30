---
title: "Managing tags with Tag Admin for VS 2013"
description: ""
date: 2015-07-21T19:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
Tags management in Team Foundation Server is a really good way to add custom information to Work Items without the need to customize process template. The downside of this approach, is that  **every person is able to add whatever tag to work items with the risk of misspelling and duplication**.

As an example if the team is doing T-Shirt sizing for User Stories, we can have people using tag S to identify a Small Story, then people decides to change to SIZE\_S to better indicate the purpose of the tag. Now you have some User Story with S and other one with SIZE\_S. Mispelling is another typical problem, even if TFS is suggesting you tags in edit with drop down, there is always the risk that someone write a slightly different tag.

An optimal solution to cope with these problem is installing an extension of Visual Studio that allows you to manage tags

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/07/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/07/image3.png)

 ***Figure 1***: *Tag Admin For Visual Studio 2013 in Visual Studio Gallery*

This extension adds a nice link in your team explorer to manage your tags. If you open it, you are immediately  **prompted with a complete list of all of your tags** , with a counter that identify how many work items are associated with each tag.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/07/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/07/image4.png)

 ***Figure 2***: *List of tags of team project.*

If some tags are not associated to any work item and you wonder why they are listed there (you see 0 as work item count) the reason is that TFS Still not cleared the Tag from the tag cache.  **After a tag is not used by any work item for some days, TFS decides that the tag should not be available anymore for suggestion**.

In this example I have a misspelling problem between delighter and deligter so I can click mispelled tag, and a nice Action buttons appears in the UI allowing for some actions.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/07/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/07/image5.png)

 ***Figure 3***: *Available actions for tag*

You can view a list of work items that contains that tags, you can delete that tags, effectively removing that tags from any Work Item and you can also Rename Tag. The actual version of the tool does not allow to rename a tag giving a name that already exists, and this prevent us to effectively using the tool to “merge” mispelled tag into a single tag, but it is still really useful because **it allow an administrator to immediately spot mispelled tag, that can be fixed manually**.

Actually you can simply click “View Linked Workitem” and then from the standard web interface apply the fix changing tags accordingly.

Gian Maria.
