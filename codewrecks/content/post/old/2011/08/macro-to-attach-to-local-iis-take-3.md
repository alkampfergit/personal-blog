---
title: "Macro to attach to local IIS take 3"
description: ""
date: 2011-08-17T13:00:37+02:00
draft: false
tags: [Macro,Visual Studio]
categories: [Visual Studio]
---
This is the third post on the [series](http://www.codewrecks.com/blog/index.php/2011/08/10/visual-studio-macroattach-to-local-iis/) â€œcreate a macro to [Attach to Local IIS](http://www.codewrecks.com/blog/index.php/2011/08/16/attach-to-local-iis-macro-evolution/)â€. The last modification I want to implement is the ability to list all the w3wp.exe active processes, if more than one process is present, I want it to show a list of all IIS processes and let the user choose the list of processes to attach to. Clearly if I have no w3wp.exe active processes, or I have only one, there is no need to bother the user to choose the single available process.

Since I need to show a â€œuser interfaceâ€ from a macro and Iâ€™m not allowed to insert form into Visual Studio Macros Editor, I should create a Windows Forms programmatically. This is quite annoying, but creating simple interfaces without a designer is quite simple, so it is the right approach to maintain the code in a simple macro. First of all I find all IIS processes and add info about these processes inside a ListView.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Dim dbg2 As EnvDTE80.Debugger2 = DTE.Debugger
Dim trans As EnvDTE80.Transport = dbg2.Transports.Item("Default")
Dim processes As EnvDTE.Processes = dbg2.GetProcesses(trans, "")
Dim lvProcesses As New ListView
For Each proc As EnvDTE80.Process2 In processes
If (proc.Name.EndsWith("w3wp.exe")) Then
Dim lvi As New ListViewItem
lvi.Tag = proc
Dim engineList As String
lvi.Text = proc.ProcessID
lvi.SubItems.Add(proc.UserName)
lvProcesses.Items.Add(lvi)
End If
Next
{{< / highlight >}}

To keep a reference to the original [EnvDTE80.Process2](http://msdn.microsoft.com/en-us/library/envdte80.process2.aspx) object I add the reference to the Tag property of the ListViewItem. Now that I have a ListView populated with all IIS processes, I need to do some check to verify if we have processes available.

{{< highlight csharp "linenos=table,linenostart=1" >}}
If lvProcesses.Items.Count = 0 Then
Return
End If
 
If lvProcesses.Items.Count = 1 Then
Dim proc As EnvDTE80.Process2 = lvProcesses.Items(0).Tag
proc.Attach2()
Return
End If
{{< / highlight >}}

As you can see the code is really simple, if I have no valid worker process, I simply return, but if I have a single IIS worker process available, Iâ€™ll attach the debugger to it without requiring user input. If I have more than one worker process available I need the user to select the list of the processes he want to attach to.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Dim frm As New Form
Dim btn As New Button
btn.Text = "OK"
btn.DialogResult = DialogResult.OK
frm.Controls.Add(btn)
frm.Width = 700
frm.Text = "Choose IIS worker process to debug"
btn.Dock = DockStyle.Bottom
frm.Controls.Add(lvProcesses)
lvProcesses.Dock = DockStyle.Fill
lvProcesses.View = View.Details
lvProcesses.Columns.Add("ProcessId", 100, HorizontalAlignment.Left)
lvProcesses.Columns.Add("User", 300, HorizontalAlignment.Left)
'lvProcesses.Columns.Add("Type", 300, HorizontalAlignment.Left)
lvProcesses.FullRowSelect = True
 
If frm.ShowDialog() = DialogResult.OK Then
For Each fitem As ListViewItem In lvProcesses.SelectedItems
Dim proc As EnvDTE80.Process2 = fitem.Tag
proc.Attach2()
Next
End If
{{< / highlight >}}

The code is really simple, because it is used only to create a valid Windows Forms interface to show the ListView with Processes info and an OK Button at the bottom to permit to the user to confirm the selection. Now you can start multiple IIS worker process, press the shortcut assigned to this macro and here is the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/image1.png)

 ***Figure 1***: *The list of all available IIS processes*

The User Interface is minimal, I show the process Id and the user that is actually running the process; this last information is really important, because I usually use a different user for each different product Iâ€™m working to, so if I need to attach to all IIS processes of a certain product, I immediately can identify all IIS processes that are running with that credential and attach the debugger to the right list of processes.

When the user press OK button, I can iterate through all selected items of the ListView, cast the Tag property to EnvDTE80.Process2 and attach the debugger to the process. As you can see I use the overload version of the Attach2() process that accepts no parameter; this permits me to avoid to specify if I want to debug asp.net 2.0 or 4.0 code, and I can let the debugger choose the right one. Remember that you cannot debug at the same time ASP.NET 4.0 and earlier version, so you could not choose two worker process that are running two different version of the framework.

This post shows clearly that Visual Studio Macro are powerful, yet very simple to use and they can save you huge amount of time automating recurring operations.

Alk.

A file with the complete macro can be downloaded from here. ([http://www.codewrecks.com/files/attachtoiis.txt](http://www.codewrecks.com/files/attachtoiis.txt))
