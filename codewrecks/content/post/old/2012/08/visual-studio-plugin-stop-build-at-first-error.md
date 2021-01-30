---
title: "Visual Studio Plugin stop build at first error"
description: ""
date: 2012-08-29T18:00:37+02:00
draft: false
tags: [Plugin,Visual Studio]
categories: [Visual Studio]
---
When it is time to work with big solutions composed by many projects, it is useful to have the ability to stop the build at the very first build error. There are several reason to do this, first of all  **probably many of the subsequent error can be caused by the fact that a base project does not compile, or simply the build process takes a long time that it is not useful to continue the build when a project does not build** , (quite often we are interested only in build the whole solution, so there is no point in waiting for all the other project to compile, because at the end everything we want to do is fixing the project that does not compile and try again to rebuild).

Implementing this logic in a plugin is super easy, first of all I create a simple class that contains all the code needed by the plugin, and  **in constructor I register handlers for a couple of Visual Studio Events**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


Boolean _enabled = false;
private Boolean _alreadyStopped = false;
public StopBuildAtFirstError(DTE2 dte)
{
    _dte = dte;
    dte.Events.BuildEvents.OnBuildProjConfigDone += OnBuildProjConfigDone;
    dte.Events.BuildEvents.OnBuildBegin += (sender, e) => _alreadyStopped = false;
}

{{< / highlight >}}

As you can verify,  **once you have a reference to a DTE2 object you can simply access Events property that contains all useful events raised by Visual Studio, grouped by categories** ; in my plugin I’m interested to be notified when the build starts (OnBuildBegin) and when a project finishes compiling (OmBuildProjConfigDone). I use a simply *private boolean field to verify if I already stopped the build, this is needed if the build goes in parallel so I can have two concurrent project that failed building, but I need to issue only one command to stop the build*. Here is the logic to stop the build if a project fails.

{{< highlight csharp "linenos=table,linenostart=1" >}}


private void OnBuildProjConfigDone(string project, string projectConfig, string platform, string solutionConfig, bool success)
{
    if (_alreadyStopped || success || !_enabled) return;
    _alreadyStopped = true;
    _dte.ExecuteCommand("Build.Cancel");
    var pane = _dte.ToolWindows.OutputWindow.OutputWindowPanes
                               .Cast<OutputWindowPane>()
                               .SingleOrDefault(x => x.Guid.Equals(AlkampferVsix2012.Utils.Constants.BuildOutput, StringComparison.OrdinalIgnoreCase));
    if (pane != null)
    {
        Int32 lastSlashIndex = project.LastIndexOf('\\');
        String projectFileName = project.Substring(lastSlashIndex + 1, project.LastIndexOf('.') - lastSlashIndex - 1);
        var message = string.Format("INFO: Build stopped because project {0} failed to build.\n", projectFileName);
        pane.OutputString(message);
        pane.Activate();
    }
}

{{< / highlight >}}

Super Easy isn’t it?  **To know if the build of the project succeeded you can simply check a parameter called success; to stop the build you can simply send a Build.Cancel command to DTE2 object**. The ExecuteCommand method is really useful, because you can check every command available in VS directly from the menu Tools-&gt;Customize press the button Keyboard to add shortcut to command, and you can browse to every command that is available in the system. Once you find the command you want to raise from a plugin you can simply use the ExecuteMethod of DTE2 object passing command string as single argument and you are done.

The rest of the handler simply grab a reference to the Build OutputWindow and add a message telling that the build was stopped because the specific project failed to build. Now you can simply press F5 and debug your plugin in Visual Studio experimental Hive.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image7.png)

 ***Figure 1***: *New menu option created by the plugin*

This plugin will create a couple of new Menu Items under Tools menu, the first one is the “Attach to IIS” discussed previously, the second one is the “Stop Build on 1st error” that is disabled by default, you can enable simply clicking on it.  **Now if you build a solution and a project failed to build you will receive a message like this one**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image8.png)

 ***Figure 2***: *Here is error message of the build and the subsequent info that tells you that the build was stopped*

The coloration of the build output is another feature of the same plugin that helps me to immediately hilight in red all lines that contains the word error and in blue everything that starts with INFO: (informational message of the plugin itself).

[Code of the plugin can be found here (file AlkampferVsix2.zip)](http://sdrv.ms/PPJQCL)

Alk.
