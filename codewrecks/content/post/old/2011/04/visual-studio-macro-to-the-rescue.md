---
title: "Visual studio Macro to the rescue"
description: ""
date: 2011-04-07T13:00:37+02:00
draft: false
tags: [Addin,Macro,Visual Studio]
categories: [Visual Studio]
---
If you heavily work with branches, one of the most frustrating error you can do is modify the wrong branch. I have a project composed by several solution each one containing different UI Projects, each one using WCF as back end but released as separate software. Whenever we do a release of a new version of one of the UI we create a branch, so we can support hotfix, SP, etc.

![](http://farm2.static.flickr.com/1088/3169788471_e372d6b617.jpg)

 ***Figure 1***: *A branching strategy taken from the [branchingguidance](http://tfsbranchingguideiii.codeplex.com/)*

With this scenario Iâ€™m prone to this error:

Someone call me telling to create an hotfix for the UI XYZ, I open the solution from Branch\Releases\XYZ\R3\_0 to open the third (is the latest) release of the XYZ UI, I do the hotfix, test it, run all the test etc etc, then other people of the team call me asking for modification in other part, so I open the same solution from a different branch (say the trunk or the Feature BLABLA) and do some modification. Now I have two Visual Studio opened, with the very same solution, sometimes I got confused and I modify the wrong line of codeâ€¦ too bad, because this can cause a really bad problem. The problem arise from having more than one instance of Visual Studio opened with solutions of same name, just from different branch ![Sad smile](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/wlEmoticon-sadsmile.png) and you can become confused.

![](http://www.whimsys-menagerie.com/17066-Orange-Man-Carrying-A-Large-Yellow-Question-Mark-Over-His-Shoulder-Symbolizing-Curiousity-Uncertainty-Or-Confusion-Clipart-Illustration.jpg)

This is expecially true when you use HG or subversion or any other VCS tools that are not integrated in Visual Studio.

A simple solution is creating a [Visual Studio Macro](http://www.helixoft.com/blog/archives/32) that uses a Regex to parse the fullpath of the solution file, searching for a specific folder structure that identify a Branch. Here is the full code

{{< highlight csharp "linenos=table,linenostart=1" >}}
Declare Auto Function SetWindowText Lib "user32" (ByVal hWnd As System.IntPtr, _
ByVal lpstring As String) As Boolean
 
 
Private Sub showTitle(ByVal title As String)
SetWindowText(New System.IntPtr(DTE.MainWindow.HWnd), title & " - " & DTE.Name)
End Sub
 
 
Private Sub SolutionEvents_Opened() Handles SolutionEvents.Opened
Dim m As Match = Regex.Match( _
DTE.Solution.FullName, _
"Branch.*\\(?<project>.*)\\(?<branch>.*)\\(?<sln>.*)\.sln", _
RegexOptions.IgnoreCase)
If (m.Success) Then
Dim project As String = m.Groups("project").Value
Dim version As String = m.Groups("branch").Value
Dim sln As String = m.Groups("sln").Value
showTitle(String.Format("BRANCH [{0}] - Project {1} - {2}", _
version, project, sln))
 
End If
End Sub
{{< / highlight >}}

You need to paste this code in the Macros editor, opened from Tools â€“&gt; Macros â€“&gt; Macros IDE

[![SNAGHTML1889083](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/SNAGHTML1889083_thumb.png "SNAGHTML1889083")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/SNAGHTML1889083.png)

 ***Figure 2***: *Open the Macro editor*

From the opened editor you just double click on MyMacros, expand the EnvironmentEvents, and you can add your code to every handler supported from Visual Studio.

[![SNAGHTML18c25a1](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/SNAGHTML18c25a1_thumb.png "SNAGHTML18c25a1")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/SNAGHTML18c25a1.png)

 ***Figure 3***: *You can handle standard events from the IDE, such as when a solution is opened.*

If you look at the code, Iâ€™ve simply put a regex that permits me to parse the typical branch path structure I have on my projects, where I have Branch\someothertext\nameoftheproject\branchnumber\solutionfile.sln. When I open the trunk version I got only the solution name on the title bar.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image1.png)

 **Figure 4** : *the solution is opened from the trunk (main) because only the name of the solution is shown in title bar*

Iâ€™ve opened the same solution from a release of a specific UI and I got

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image2.png)

 ***Figure 5***: *The same solution is opened from a branch folder, now title bar shows me that Iâ€™m working on branch*

I immediately visualize that this solution is a branch, the version number is R3\_0 (Release three point zero), the project released is ZZZZManager that resides on the XXXXXWeb-Vs2010 solution ;) now it is really difficult for me and other people to write code on a wrong branch, because all the informations I need are on the title bar.

Using title of the windows gives also the exceptional advantage of having these information in Windows 7 tray bar

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image3.png)

 ***Figure 6***: *Using the title bar, I got the very same information when I need to maximize a windows from Windows 7 tray bar*

So you can immediately know witch is the right windows to use. Moreover developing such a macro is a matter of minutes, because you can simply add the handler and some code inside the macro editor, Then save the macro, close and reopen visual studio, open again the macro editor and activate the debugger

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/image4.png)

 ***Figure 7***: *I can even debug the macro, an invaluable option when you are experimenting on your code.*

Now you can put breakpoint around the code, and debugging your macro to tune it.

Alk.
