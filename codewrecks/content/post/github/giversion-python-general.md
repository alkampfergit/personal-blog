---
title: "Determine version with GitVersion for a Python project"
description: "Dotnet based utilities can be used in GitHub actions for projects not based on .NET. As an example Gitversion is really useful to determine versioning"
date: 2021-09-04T08:00:00+02:00
draft: false
tags: ["Git"]
categories: ["Programming"]
--- 

Project used for this example can be found [in GitHub](https://github.com/alkampfergit/GitGraphAutomation).

In GitHub actions you can use .NET based tools, both in Windows and in Linux machines, to accomplish various tasks. I'm a great fan of GitVersion tool, used to determine a semantic versioning based on a Git repository that uses git-flow structure. Another nice aspect is that **GitHub action machines based on Linux comes with PowerShell core preinstalled, so I can use actions that comes from PowerShell gallery without any problems** ... errr.. almost.

> .NET tooling can be used in GitHub actions without any problems.

I simply run GitVersion using some helper modules I've [published on PowerShell Gallery](https://www.powershellgallery.com/packages/BuildUtils), just install them and Invoke GitVersion tool. Setting $DebugPreference to continue allows me to view **a verbose log of the execution**.

{{< highlight yaml "linenos=table,linenostart=1" >}}
    - name: GitVersion
      shell: pwsh
      run: |
        git fetch
        git branch -a
        Install-package BuildUtils -Confirm:$false -Scope CurrentUser -Force
        Import-Module BuildUtils
        
        $DebugPreference = 'Continue'
        $gitVersion = Invoke-Gitversion -ConfigurationFile ".config/GitVersion.yml"

        Write-Host "::group::GitVersion"
        Write-Host "AssemblyVersion=$($gitVersion.assemblyVersion)"
        Write-Host "FullSemversion=$($gitVersion.assemblyInformationalVersion)"
        Write-Host "::endgroup::"

        Write-Host "::set-output name=GITVERSION_ASSEMBLYSEMVER::$($gitVersion.assemblyVersion)"
        Write-Host "::set-output name=GITVERSION_ASSEMBLYSEMFILEVER::$($gitVersion.assemblyFileVersion)"
        Write-Host "::set-output name=GITVERSION_FULLSEMVER::$($gitVersion.assemblyInformationalVersion)"
        Write-Host "::set-output name=GITVERSION_NUGETVERSION::$($gitVersion.nugetVersion)"
{{< /highlight >}}

When I first run my Powershell step I got errors, and looking at the output immediately tells me the problem.

{{< highlight bash "linenos=table,linenostart=1" >}}
Import-Module: /home/runner/work/_temp/e7b55113-4755-47ff-bd3e-e9a9a6f34e9a.ps1:4
Line |
   4 |  Import-Module BuildUtils
     |  ~~~~~~~~~~~~~~~~~~~~~~~~
     | The module to process 'buildUtils.psm1', listed in field
     | 'ModuleToProcess/RootModule' of module manifest
     | '/home/runner/.local/share/powershell/Modules/BuildUtils/0.3.0/BuildUtils.psd1' was not processed because no valid module was found in any module directory.
{{< /highlight >}}

When you have some stuff that works in Windows (.NET or Powershell core) but it does not works in Linux, 95% of the time you **use wrong casing for files, it works for Windows that is not case sensitive, but does not work in Linux**. This time it is not an exception, I've specified file name with wrong casing in PowerShell definition manifest, but once fixed my module I got another error.

{{< highlight bash "linenos=table,linenostart=1" >}}
System.TypeInitializationException: The type initializer for 'LibGit2Sharp.Core.NativeMethods' threw an exception.
 ---> System.DllNotFoundException: Unable to load shared library 'git2-106a5f2' or one of its dependencies. In order to help diagnose loading problems, consider setting the LD_DEBUG environment variable: libgit2-106a5f2: cannot open shared object file: No such file or directory
   at LibGit2Sharp.Core.NativeMethods.git_libgit2_init()
   at LibGit2Sharp.Core.NativeMethods.InitializeNativeLibrary()
   at LibGit2Sharp.Core.NativeMethods..cctor()
   --- End of inner exception stack trace ---
   at LibGit2Sharp.Core.NativeMethods.git_buf_dispose(GitBuf buf)
   at LibGit2Sharp.Core.Proxy.git_buf_dispose(GitBuf buf)
   at LibGit2Sharp.Core.Handles.GitBuf.Dispose()
   at LibGit2Sharp.Core.Proxy.ConvertPath(Func`2 pathRetriever)
   at LibGit2Sharp.Core.Proxy.git_repository_discover(FilePath start_path)
   at LibGit2Sharp.Repository.Discover(String startingPath)
   at GitVersion.Extensions.ArgumentExtensions.GetProjectRootDirectory(Arguments arguments) ...
{{< /highlight >}}

It turns out that **probably the version of GitVersion I'm using does not work inside an Ubuntu machine**, but this is not a problem, because the best approach is **using multiple jobs in GitHub Action, each one running on preferred environment, doing a specific job, and setting output variable to be consumed on dependant jobs**. Once I moved the task on a Windows based machine, everything runs just fine.

![Custom section with output of Gitversion](../images/git-version-area-custom.png)
***Figure 1:*** *Custom section with output of Gitversion*

> Versioning of code (with GitVersion or other tools) is always a good strategy to keep track of code quality.

The main reason behind calculating a version is being able to track the evolution of code quality with some marker that can have business or technical meaning. Instead of telling that the **actual version is commit ec52a9c68d0cdb40de98cf28f8bb0890e84de4b0, it is much more useful to tell user that the version is 0.2.0-beta-000x**. 

If you analyze your code with SonarCloud, **it is also a good habit to send a version with the analysis**, this will help you to identify how the code quality in Sonar change between versions. In your linux task that runs SonarCloud I can use the variable exported by previous job.

{{< highlight yaml "linenos=table,linenostart=1" >}}
- name: SonarCloud Scan
uses: SonarSource/sonarcloud-github-action@master
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
  SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
with:
  args: >
    -Dsonar.projectVersion=${{ needs.gitversion.outputs.fileVersion }}
{{< /highlight >}}

Every SonarCloud property value that is dynamic (value can be known only inside the action) can be **directly passed from GitHub Action Task with the args syntax. All static parameters find a better place in sonar-project.properties file**. The syntax used in the above example references an output variable of another job as I described in [another post](https://www.codewrecks.com/post/github/choose-environment-from-branch/);

![Versioning is now active in SonarCloud](../images/sonar-qube-python-version.png)

***Figure 2:*** *Versioning is now active in SonarCloud*

As you can see, I'm now able to look at versioning in SonarCloud dashboard.

Gian Maria



