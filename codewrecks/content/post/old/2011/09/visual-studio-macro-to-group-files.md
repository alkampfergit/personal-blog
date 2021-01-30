---
title: "Visual Studio macro to group files"
description: ""
date: 2011-09-28T17:00:37+02:00
draft: false
tags: [Macro,Visual Studio]
categories: [Visual Studio]
---
Visual Studio has the concept of grouping files together a feature used mainly from code generation tools to groups generated files under the main file, but this feature can be used even for your class, as shown in  **Figure1**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image11.png)

 **Figure 1** : *Two code files nested inside program.cs*

There are a lot of reasons to group files togheter, you can use this technique for group partial classes definition or you can simply want to group logically related files, etc etc. The annoying stuff is that there is no menu in Visual Studio that permits you to obtain this result, but you can solve everything with a  macro. Just open the Visual Studio Macro IDE and insert the following macro.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Sub GroupFileTogether()
 
Dim lvProcesses As New ListView
For I As Int32 = 1 To DTE.SelectedItems.Count
Dim item As EnvDTE.SelectedItem = DTE.SelectedItems.Item(I)
Dim lvi As New ListViewItem
lvi.Tag = item
lvi.Text = item.Name
lvProcesses.Items.Add(lvi)
Next
 
If lvProcesses.Items.Count < 2 Then
Return
End If
 
 
Dim frm As New Form
Dim btn As New Button
btn.Text = "OK"
btn.DialogResult = DialogResult.OK
frm.Controls.Add(btn)
frm.Width = 300
frm.Text = "Choose the file to be used as root"
btn.Dock = DockStyle.Bottom
frm.Controls.Add(lvProcesses)
lvProcesses.Dock = DockStyle.Fill
lvProcesses.View = View.Details
lvProcesses.Columns.Add("Name", 300, HorizontalAlignment.Left)
lvProcesses.FullRowSelect = True
 
If frm.ShowDialog() = DialogResult.OK Then
Dim selected As EnvDTE.SelectedItem = lvProcesses.SelectedItems.Item(0).Tag
 
For I As Int32 = 0 To lvProcesses.Items.Count - 1
Dim item As EnvDTE.SelectedItem = lvProcesses.Items.Item(I).Tag
If item.Name <> selected.Name Then
selected.ProjectItem.ProjectItems.AddFromFile( _
item.ProjectItem.FileNames(0))
End If
Next
End If
End Sub
{{< / highlight >}}

This is far from being called production code ready, but it does its dirty work, just assign a shortcut to this macro from the Tools-&gt;Customize menu (I’ve used CTRL+G, CTRL+R), then you should select all the files you want to group together and press the shortcut, the macro will show you a dialog that permits you to choose which is the file to be used as root, as shown in  **Figure2** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/image12.png)

 **Figure 2** : *The macro is showing you the list of selected files to choose the root file*

Just select Program.cs and press ok and the files will be grouped together as shown in  **Figure1**.

Gian Maria
