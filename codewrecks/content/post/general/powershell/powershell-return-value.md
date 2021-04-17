---
title: "Return value in PowerShell, a typical error"
description: "One thing that bother me most in PowerShell is that return keyword does not do the same thing a return keyword in a standard programming language :)"
date: 2021-04-17T08:00:00+02:00
draft: false
tags: ["PowerShell"]
categories: ["PowerShell"]
---

When you create a function in PowerShell you need to remember that if you write output, this will [be included in the returned value](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_return?view=powershell-7.1). This means that **if you end your function with return $something you would not get only the content of the variable $something but every output that you did in the function**. 

For this reason you need to be super careful not to use Write-Output, because all the output will be included in the returned value. 

Sometimes the error can be a little bit more subtle, I had this helper function I'm using in most of my builds:

{{< highlight powershell "linenos=table,hl_lines=19,linenostart=1" >}}
function Get-NunitTestsConsoleRunner
{
  Param
  (
  )
    $nunitLocation = "$env:TEMP\nunitrunners"
    $consoleRunner = ""
    if (Test-Path -Path $nunitLocation) {
      $consoleRunner = Get-ChildItem -Path $nunitLocation -Name nunit3-console.exe -Recurse 
      if ($consoleRunner -eq $null) {
          Write-Host "no runner found in folder $nunitLocation"
          Remove-Item $nunitLocation -Recurse
      }
    }

    if (!(Test-Path -Path $nunitLocation)) {
      $nugetLocation = Get-NugetLocation
      set-alias nugetinternal $nugetLocation
      nugetinternal install NUnit.Runners -OutputDirectory $nunitLocation 
    }

    #Now we need to locate the console runner
    $consoleRunner = Get-ChildItem -Path $nunitLocation -Name nunit3-console.exe -Recurse 
    Write-Host "Found nunit runner in $nunitLocation\$consoleRunner"
    return "$nunitLocation\$consoleRunner"
}
{{< / highlight >}}

This functions worked for me for a long time, but it **contains a subtle bug**. As you can see in line 19, if I do not find nunit runner in my Temp folder **I'm running nuget to restore the packages containing nunit runners**. This code simply does not work, but I never realized it because in all my build agent nunit was already downloaded.

> When you run an external executable, like nuget, all the output of that tool will be returned by the function

Running that code inside a GH actions works, but when I'm using the returning value I got this bad error.

{{< highlight bash "linenos=table,linenostart=1" >}}

Running nunit tests with console runner
Found nunit runner in C:\Users\RUNNER~1\AppData\Local\Temp\nunitrunners\NUnit.ConsoleRunner.3.12.0\tools\nunit3-console.exe
running nunit: D:\a\BasicAspNetForDeploy\BasicAspNetForDeploy\src\TestWebApp.Tests\Bin\release\TestWebApp.Tests.dll
The specified path, file name, or both are too long. The fully qualified file name must be less than 260 characters, 
and the directory name must be less than 248 characters.
{{< / highlight >}}

A rather obscure error, because **nunit runner was found in the correct location and my directory structure is so simple that there is NO WAY I exceeded the max length**. The problem is that the log "Found nunit runner " was done inside the function, and indeed shows the correct output, but **when I use the instruction *return "$nunitLocation\$consoleRunner"* I'm returning  all the output and then the needed value**.

If I dump the location of nunit executable in my main script, I can see that the value returned is not what I'm expecting.

{{< highlight bash "linenos=table,linenostart=1" >}}

Found nunit runner in C:\Users\RUNNER~1\AppData\Local\Temp\nunitrunners\NUnit.ConsoleRunner.3.12.0\tools\nunit3-console.exe
running nunit: Feeds used:   https://api.nuget.org/v3/index.json   C:\Program Files (x86)\Microsoft SDKs\NuGetPackages\  Installing package 'NUnit.Runners' to 'C:\Users\runneradmin\AppData\Local\Temp\nunitrunners'.   GET https://api.nuget.org/v3/registration5-gz-semver2/nunit.runners/index.json   OK https://api.nuget.org/v3/registration5-gz-semver2/nunit.runners/index.json 181ms   Attempting to gather dependency information for package 
{{< / highlight >}}

It is obvious that I'm looking at the output of Nuget.exe executables, and that was caused by missing of the nunit and nuget.exe tools in GH Action machine temp folder, so I **run nuget install inside the function**. The obvious solution is adding a Out-Null to avoid output to be returned


{{< highlight powershell "linenos=table,linenostart=1" >}}
    if (!(Test-Path -Path $nunitLocation)) {
      $nugetLocation = Get-NugetLocation
      set-alias nugetinternal $nugetLocation
      nugetinternal install NUnit.Runners -OutputDirectory $nunitLocation | Out-Null
    }
{{< / highlight >}}

It is of uttermost importance that you pay attention on **what goes in the output during a PowerShell function that is supposed to return something**, because you can end spending 20 minutes on trivial errors like this ones.

Gian Maria.