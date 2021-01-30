---
title: "Monitor if your branch will generate merge conflicts with TFS Build"
description: ""
date: 2014-11-15T15:00:37+02:00
draft: false
tags: [Git,TFS Build]
categories: [Team Foundation Server]
---
One of the  **greatest advantage in using Git over a centralized Version Control System is branching system**. It is quite common for developers to start branching whenever they need to add a new feature, work on that branch and finally merge back to mainline when the feature is finished. One of the most famous workflow is called [GitFlow](http://nvie.com/posts/a-successful-git-branching-model/), a way to work in Git that is implemented even in some GUI tool like [SourceTree](https://www.atlassian.com/software/sourcetree/overview?_mid=2fbd5293e6446891fb55a371fd05daeb&amp;gclid=Cj0KEQiAkJyjBRClorTki_7Zx8QBEiQAcqwGMVF9nzHt6HSZgIswbcYiWI4InUXsU_25Nq8vajSR7mIaAofw8P8HAQ).

One of the main problem when you heavily use feature branches is the moment you merge back to mainline. One of the technique to easy the pain is  **periodically do a forward integration from mainline to feature branch** , because it is usually easier doing several little merge than doing a big merge when the feature is complete.

Assuming that the mainline contains only stable code, because all feature branch merge to mainline only when they are stable, it is usually safe to periodically merge from mainline to branch to avoid a big merge at the end. In this scenario the question usually is: how frequently I have to merge? One possible solution is to  **take advantage of your Continuous Integration system to warn you when a modification you did on a branch introduces problem because** :

- *Does not merge automatically with mainline but it generates conflicts*
- *Even if the branch merge automatically the code wont compile.*
- *Even if the branch merge automatically and the code compile, some tests where broken.*

With TFS Build you can achieve this result quite simply, first of all configure a build with a trigger for each push, then in the Source Settings specify that  **this build should be triggered whenever any branch that starts with feat got any push**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image3.png)

 ***Figure 1***: *Source code configuration, only build when a branch that starts with feat got a code increment*

This build is intended to monitor the status of all feature branches. All you need to do is including a PowerShell script in source code that will be run pre-build.  **This script basically merge with master with command line git** (Build Agent where that build runs should have git installed and available in PATH environment variable). This is a possible PowerShell script to accomplish the merge

{{< highlight powershell "linenos=table,linenostart=1" >}}


$teststring = $env:TF_BUILD_SOURCEGETVERSION

$branchName = ""
$teststring | where { $_ -match "/(?[^/]*?):" } |
    foreach { $branchName = $Matches["bname"] }

Write-Host "BranchName = $branchName"
$rootDir = "$env:TF_BUILD_BUILDDIRECTORY\src"
Write-Host "Source folder is $rootDir"

#be sure to checkout the right branch 
$ps = new-object System.Diagnostics.Process
$ps.StartInfo.Filename = "git"
$ps.StartInfo.WorkingDirectory = $rootDir
$ps.StartInfo.Arguments = "checkout $branchName"
$ps.StartInfo.RedirectStandardOutput = $True
$ps.StartInfo.RedirectStandardError = $True
$ps.StartInfo.UseShellExecute = $false
$ps.start()

[string] $Out = $ps.StandardOutput.ReadToEnd();
[string] $ErrOut = $ps.StandardError.ReadToEnd();
Write-Host "Output git checkout $branchName is:" $Out
Write-Host "Return value: " $ps.ExitCode
if ($ps.ExitCode -ne 0) 
{
    $Host.ui.WriteErrorLine("Branch cannot be checked out")
}

#try to merge
$ps = new-object System.Diagnostics.Process
$ps.StartInfo.Filename = "git"
$ps.StartInfo.WorkingDirectory = $rootDir
$ps.StartInfo.Arguments = " merge master"
$ps.StartInfo.RedirectStandardOutput = $True
$ps.StartInfo.RedirectStandardError = $True
$ps.StartInfo.UseShellExecute = $false
$ps.start()

[string] $Out = $ps.StandardOutput.ReadToEnd();
[string] $ErrOut = $ps.StandardError.ReadToEnd();
Write-Host "Output git merge master:" $Out
Write-Host "Return value: " $ps.ExitCode

if ($ps.ExitCode -ne 0) 
{
    $Host.ui.WriteErrorLine("Branch does not merge correctly")
}

{{< / highlight >}}

This is really a first tentative in this direction, there probably better way to do it, but it solves the problem without any great complexity. It just  **uses a regular expression to find branch name from the environment variable** [**TF\_BUILD\_SOURCEGETVERSION**](http://msdn.microsoft.com/en-us/library/hh850448.aspx). Once you have name of the branch just checkout it and  **then try to “git merge master” to merge the branch with master**. Quite all git command return 0 if the operation is successful, so if the ExitCode of “git merge master” command is different from 0 it means that the merge operation did not complete correctly (conflicts occurred). If the merge is unsuccessful the script use UI.WriteErrorLine to write error on the UI and this has two effects: first the message will be reported on the Build Summary, then then build will be marked as partially failed.

Now even if your branch compile correctly and every test is green, after you push to TFS your Build Server will try to merge and run the build, if the branch does not automatically merge with master the build will partially fail and you got this:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image4.png)

 ***Figure 2***: *Code does not automatically merge after the latest push.*

This is a signal that is time to do a forward integration from mainline to your branch, because the amount of conflicts will be probably small.  **Another advantage is that you can merge the code while your modification is fresh in your mind. Nothing is more painfully than merge code you have written a month ago**.

If the merge is successfully it does not mean that the code is in good health. Suppose you rename a method in your branch, but in the mainline another one has pushed an increment with another class that uses that method. This is the perfect example of code that gave no merge conflicts, but it does not even compile. Since the script actually does the merge before the build, the rest of the build works on the code result of the merge, now the build fails.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image5.png)

 ***Figure 3***: *Merge was successfully, but the result of the merge does not compile*

In this situation you surely have a standard build that simply works on the feature branch that is green, but the Build System can run for you this another special build that runs on the result of the merge with mainline that is Red. This means:  **In your branch code everything is green, but when you will merge to mainline you will have problem, so it is probably better to look at that problems now!.** The very same happens if the result of the merge breaks some unit test.  **In conclusion, thanks to few PowerShell lines, you can instruct your TFS build to automatically try to merge each increment of code in your feature branches and then compile, run test and do whatever any operation you usually do on your build on the result of the merge between the feature branch and mainline**. Thanks to this you can immediately merge from mainline to your branch to fix the problem as soon as you have introduced it.

This approach has some disadvantages. First of all a PowerShell script cannot make the build fails, so if the code does not merge, usually you will have a failing build because the build system try to build source code during a merge and find invalid characters in source code. Second, this special build runs only when there is a push on some feature branch, but nothing happens if someone pushes in the mainline. In that case you should run this special build for every feature branch you have in your repository.

Gian Maria.
