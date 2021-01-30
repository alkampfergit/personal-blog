---
title: "Running powershell before Get Sources in VSTS  TFS Build"
description: ""
date: 2017-06-10T13:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
I have a VSTS build where I need to  **run a PowerShell scripts at the very beginning of the build, before the agent starts downloading the sources** , and it seems that this cannot be done with a simple task, because there is no way to place a task before the Get Sources default task of VSTS Build.

Luckily enough there is a way to solve this problem, because **each task can define a specific script that should be run when the build starts and before each task runs** , here is how. First of all create a new task with the usual TFX-Cli interface:

{{< highlight bash "linenos=table,linenostart=1" >}}


tfx build tasks create

{{< / highlight >}}

I’ve already explained how to create a build task in a [previous post](http://www.codewrecks.com/blog/index.php/2016/03/17/writing-a-custom-task-for-build-vnext/), but it is time to add some more context, because the build system is slightly changed and you need to do some more steps to be able to run the task. First of all you can incurr in the error

> ##[error]File not found: ‘C:\vso\\_work\\_tasks\LibreOfficeKiller\_9073fee0-4de5-11e7-925d-cb284842266e\0.1.0\ps\_modules\VstsTaskSdk\VstsTaskSdk.psd1’

This error is telling you that VstsTasksSdk is missing from the installation folder.  **New scripts uses a base library to interact with the build system, you can find all the** [**information here**](https://github.com/Microsoft/vsts-task-lib/blob/master/powershell/Docs/Consuming.md) **,** it is just a matter of cloning the [VSTS Task Lib](https://github.com/Microsoft/vsts-task-lib) in a folder of your disk, then locate  the PowerShell folder, that contains a folder called VstsTaskSdk, that should be copied in your task folder, under a folder ps\_modules.

> VSTS / TFS Build system is evolving rapidly, new versions have nice new capabilities, but this requires you to always read latest documentation.

 **After you copied the VstsTAskSdk.psd1 folder in the right place you should be able to run a build with your task.** Now there is the fun part, executing some script before the GetSouce phase of the build is run.

In this scenario I have a PowerShell scripts that kills every instance of LibreOffice that is running on the system. My build runs some integration tests that involves LibreOffice, but if, for some reason, a previous execution failed to kill properly running instances of LibreOffice, source folder in the agent cannot be clean, because soffice.exe process has open handle on source folder, thus, the GetSources task fails. The sympthom of this problem is the build failing with this error in the Get Sources:  The process cannot access the file ‘\\?\C:\vso\\_work\8\s\src\Jarvis.DocumentStore.Tests\bin\Debug’ because it is being used by another process.

With latest version of the tasks, I can use the prejobexecution and postjobexecution to ask the system to run scripts at the beginning and the end of the build.

[![Section of task.json file showing the use of prejobexecution.](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-1.png "Relevant section of the script that uses prejobexecution to execute a script before any task runs.")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-1.png)

 ***Figure 1***: *Relevant section of the script that uses prejobexecution to execute a script before any task runs.*

**Now in Figure 1 you can verify that I’m invoking the script KillLibreoffice.ps1 not only in the *execution* node, but also with a special node called prejobexecution and postjobexecution. **These two nodes allows you to specify a script to be called before the very first task of the build is executed. To verify that everything works, here is a super simple and stupid build that uses this task.

[![Simple buidl that uses a libreofficekiller task then build the solution](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-2.png "Task LibreOfficeKiller used in a sample build")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-2.png)** Figure 2: ***Task LibreOfficeKiller used in a sample build*

From the output of the build you can verify that the script that kills LibreOffice is run not only before the Get Source phase, but also after all tasks are completed.

[![Output of the build shows that kill libre office script is run three times, before any task, during task execution and finally after all tasks were run](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-3.png "Build output shows correct execution of scripts")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-3.png)

 ***Figure 3***: *Build output of the build with KillLibreOffice task.*

From  **Figure 3** you can verify that the LibreOfficeKiller is run three times, the first time (1) before the Get Sources phase, then during normal task execution (2) and finally after the last task executed (3). Now my build can run just fine, because I’m able to kill any instance of LibreOffice.exe before the GetSources tasks runs.

If you are interested in the whole task, [here is the code](https://1drv.ms/u/s!AvPVMcA4v48okvY_TAHc6HCw0MM8bg).

Happy building :).

Gian Maria.
