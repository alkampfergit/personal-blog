---
title: "Edit properties of a Work Item with API"
description: ""
date: 2010-05-10T16:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
If you look at the [previous post,](http://www.codewrecks.com/blog/index.php/2010/05/10/create-a-work-item-by-code-in-tfs-returns-tf237124-work-item-is-not-ready-to-save/) I answered a little problem that can occur when saving a Work Item in TFS with API. A common question that arise from people when they begin to work with the WIT api is *how can I make possible for users of my application to edit a WIT?* A Work Item has a lot of fields and building an UI to permit editing capabilities to the user would be really difficult, but clearly Microsoft has made the standard one available to use within your program.

The answer is the * **Microsoft.TeamFoundation.WorkItemTracking.Controls.dll** *located into C:\Program Files (x86)\Microsoft Visual Studio 10.0\Common7\IDE\PrivateAssemblies folder. This dll contains common winform controls to edit workitem and it has everything you need to create an UI to edit a Work Item. First of all create a simple winform application, then right click into the Toolbox and choose *Choose Items* option, then browse to the aforementioned dll and include it in the toolbox. Now you should be able to see the controls inside the dll

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image10.png)

I highlighted the WorkItemFormControl, because you can use to edit a workitem, simply drop one instance into a simple form and write this code behind in the Form Load event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Private Sub Form1_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
Dim tfs As New TeamFoundationServer("http://tfs2010test:8080/tfs/defaultcollection",
New NetworkCredential("Administrator", "xxxxxxxxxxxxx"))
Dim wis As WorkItemStore = DirectCast(tfs.GetService(GetType(WorkItemStore)), WorkItemStore)
Dim teamProject As Project = wis.Projects(0)
Dim witype As WorkItemType = teamProject.WorkItemTypes("Task")
WorkItemFormControl1.Item = witype.NewWorkItem()
End Sub
{{< / highlight >}}

The code is really simple, connect to the server, create a new Work Item with the [NewWorkItem](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.workitemtracking.client.workitemtype.newworkitem%28VS.90%29.aspx) method of the WorkItemType object and assign it to the Item property of the [WorkItemFormControl](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.workitemtracking.controls.workitemformcontrol%28VS.80%29.aspx) windows control. Here is the form at run-time.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image11.png)

As you can see this is the standard form that you see in Visual Studio, and it is available to you with a very little effort.

Alk.
