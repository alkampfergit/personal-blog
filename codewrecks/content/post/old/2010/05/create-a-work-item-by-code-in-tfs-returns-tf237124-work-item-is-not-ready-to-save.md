---
title: "Create a Work Item By code in TFS returns TF237124 Work Item is not ready to save"
description: ""
date: 2010-05-10T09:00:37+02:00
draft: false
tags: [Team Foundation Server,TfsAPI]
categories: [Team Foundation Server]
---
Today my dear friend [Matteo](http://blogs.ugidotnet.org/j3r/Default.aspx) asked me some help with a snippet of code to insert a WIT into a TFS. The snippet was the following one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Dim tfs As New TeamFoundationServer("http://tfs2010test:8080/tfs/defaultcollection",
New NetworkCredential("Administrator", "xxxxxxxx"))
Dim wis As WorkItemStore = DirectCast(tfs.GetService(GetType(WorkItemStore)), WorkItemStore)
Dim teamProject As Project = wis.Projects(0)
Dim witype As WorkItemType = teamProject.WorkItemTypes("Task")
If witype IsNot Nothing Then
Console.WriteLine("Adding new task to Team Project {0}", teamProject.Name)
Dim wi As New WorkItem(witype)
wi.Title = "You have a Task! [Ding]"
wi.State = "Active"
wi.Save()
Console.WriteLine("Added Work Item # {0} created by {1}", wi.Id, wi.CreatedBy)
{{< / highlight >}}

He is having problem because the Save throws exception.

TF237124: Work Item is not ready to save

And he was wondering what the cause is. Whenever you want to save a Work Item you need to know that there are a lot of rules that can be violated, as an example the team project I'm trying to save the WIT into, has a customized workflow for the item *Task.*The right path to do is to **validate the WorkItem prior to save** , and looking at errors you can simply understand what prevents the WIT from saving, the code is really simple.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Dim result = wi.Validate()
For Each item In result
Console.WriteLine(item)
Next
{{< / highlight >}}

Just call [Validate()](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.workitemtracking.client.workitem.validate%28VS.90%29.aspx) method of the WIT and verify each errors returned in an ArrayList object. Let's look at what is returned in my situation inside the Arraylist returned by validate.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image9.png)

As you can see there is an error in the field â€œSystem.Stateâ€ (look at the property ReferenceName), and the error can be found in the field Status that list â€œInvalidListValueâ€. The good stuff is that a list of Allowed Values can be found in this item, thus permitting you to look at the possible values. In my situation the only valid initial state is â€œProposedâ€, so I need to add this line to the preceding snippet.

{{< highlight csharp "linenos=table,linenostart=1" >}}
wi.Fields("System.State").Value = "Proposed"
{{< / highlight >}}

And the insert work good. So if you ever encounter a TF237124 and whenever you need to save a Work Item do not forget to check errors returned by the Validate() method.

alk.
