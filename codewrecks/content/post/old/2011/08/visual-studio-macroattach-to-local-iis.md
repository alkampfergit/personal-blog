---
title: "Visual Studio Macro-Attach To Local IIS"
description: ""
date: 2011-08-10T14:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Visual Studio]
---
As I [stated previously](http://www.codewrecks.com/blog/index.php/2011/04/07/visual-studio-macro-to-the-rescue/), the capability of Visual Studio to use Macro is probably one of the less known feature and one of the coolest. Thanks to macro you can automate standard task you do in VS to speed-up your everyday coding experience. Since I work heavily with WCF services hosted in IIS and Web Application, quite often I need to attach the debugger to my local IIS instance.

[![Untitled](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled_thumb1.jpg "Untitled")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/Untitled1.jpg)

This requires me to navigate to Debug-&gt;Attach to process, show the list of processes, find the w3wp.exe process, attach, confirm the dialog, bla bla bla. It wouldn't be beautiful to attach to local IIS with the simple combination of keys? The solution is really simple, just select Tools-&gt;Macros-&gt;Record temporary macro, then attach to local IIS and stop macro recording. You will end up with a Macro that you can simply modify and add to some standard Macro module.

You can simply open macro editor (tools-&gt;Macros-&gt;Macros IDE), then create a new module (I've called StandardCustomMacro) and then paste the recorded macro to attach to IIS.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Sub AttachToIISProcess()
Try
Dim dbg2 As EnvDTE80.Debugger2 = DTE.Debugger
Dim trans As EnvDTE80.Transport = dbg2.Transports.Item("Default")
Dim dbgeng(2) As EnvDTE80.Engine
dbgeng(0) = trans.Engines.Item("T-SQL")
dbgeng(1) = trans.Engines.Item("Managed (v2.0, v1.1, v1.0)")
Dim proc2 As EnvDTE80.Process2 = dbg2.GetProcesses(trans, "").Item("w3wp.exe")
proc2.Attach2(dbgeng)
Catch ex As System.Exception
MsgBox(ex.Message)
End Try
End Sub
{{< / highlight >}}

As you can verify, attaching to a process is really a simple task, now I can simply customize the keyboard binding using Tools-&gt;Customize.

[![sdfasdfasdfasdf](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/sdfasdfasdfasdf_thumb.jpg "sdfasdfasdfasdf")](https://www.codewrecks.com/blog/wp-content/uploads/2011/08/sdfasdfasdfasdf.jpg)

 ***Figure 1***: *Just filter for macros, identify your new macro and assign some key binding like CTRL+SHIFT+ALT+I*

Now you can press the combination of buttons you setup in  **Figure 1** and you attach automatically to IIS.

Alk.
