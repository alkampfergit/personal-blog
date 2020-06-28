---
title: "Publish PowerShell functions to PowerShell Gallery"
description: "Take your PowerShell utilities functions to the next level, publish them to PowerShell gallery to make them always available"
date: 2020-06-28T08:00:00+02:00
draft: false
tags: ["PowerShell"]
categories: ["DevOps"]
---

I'm a great fan of PowerShell script for build and release, even if Azure DevOps, GitHub Actions, TeamCity or Jenkins have pre-made task for common operations (zipping, file handling, etc). I always like using PowerShell scripts to do most of the job and the reason is simple: **PowerShell scripts are easy to test, easy to understand and are not bound to a specific CI/CD engine**.

Since I'm not a real PowerShell expert, during the years I've made some functions I reuse across projects, but I didn't organize them, leading to some confusion over the years.

In a first moment I simply included all basic functions module in all repositories, everything is local, no problem, little effort. The drawback of this approach is that **if I found bug or I create another useful function I need to update all projects**. Over the years I have the very same functions copied over and over leading to confusion.

This leas to the obvious solution of developing PowerShell modules in a separate repository, then use that repository as submodule in real projects. This situation is far better, but it still not really optimal. As an example, it does not work if your project does not uses Git.

The real solution is **using a git repository to evolve your modules, then publish them to the official  [PowerShell Gallery site](https://www.powershellgallery.com/)**. There are a lot of reasons to use PowerShell Gallery: the obvious one is that is free and available almost everywhere, then it is a good way to contribute to open source and finally it forces you to manage versioning and evolution of your functions.

This is perfect if you can open source your functions, but if they contain information that cannot be disclosed, you have always the option to publish in a private repository, so this approach is still valid.

Since I'm not a PowerShell expert I've started looking to some tutorial on the subject, but I had some problem setting up everything, so **I decided to write this post as a reminder and an helper to those one that want to publish their code to PowerShell Gallery**.

Basically you are expected to create a psm1 file with all the functions you want to publish, then add a psd1 file to describe the module and finally publish NuGet package to PowerShell gallery with the command

{{< highlight powershell "linenos=table,linenostart=1" >}}
Publish-Module -Path C:\develop\GitHub\powershell-build-utils\src\build-utils  -NuGetApiKey your_api_key_here -Verbose
{{< / highlight >}}

Indeed it was a journey longer than I expected.

## Error 1: using a .nuspec file to publish the module

I've found some blog posts that explain how to create a .psd1 file (module definition) and a .nuspec file (NuGet definition file) to publish your module. While this worked like a charm to publish module to MyGet or other NuGet repositories, I've failed having it to work with PowerShell Gallery.

The solution was **to follow the advice of [this nice GitHub repository](https://github.com/anpur/powershellget-module) that contains a working sample** on how you should organize the repository to publish everything to PowerShell gallery. From that sample I found that .nuspec file should be avoided letting Publish-Module PowerShell command to do everything.

## Error 2: TLS 1.2 and connection error

My second problem is a cryptic error "The underling connection was closed". This can be caused to PowerShell Gallery drop of TLS 1.0 and 1.1, but forcing TLS 1.2 did not solved my problem.

![PowerShell connection closed](../images/powershell-connection-closed.png)
***Figure 1***: *PowerShell Publish-Module failed with a Connection Closed error

Thanks to my Friend Leone Randazzo and the magic team of iCubed composed by: Leone Randazzo, Aaron Toro Araya and Corrado Mollica I was able to solve that problem.

You can force TLS 1.2 using this instruction before interacting with PowerShell Gallery, (or you can put it in your profile to have TLS 1.2 available for all connections)

{{< highlight powershell "linenos=table,linenostart=1" >}}
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor [System.Net.SecurityProtocolType]::Tls12
{{< / highlight >}}

But this does not worked in my situation, so Aaron pointed me to a issue due to incomplete Internet Explorer configuration when it was first started. **He gave me some registry Key to solve both the TLS 1.2 problem and incomplete IE configuration.**

{{< highlight powershell "linenos=table,linenostart=1" >}}
Set-ItemProperty
    -Path "HKLM:\Software\Microsoft\.NetFramework\<TargetVersion>"
    -Name "SchUseStrongCrypto"
    -Value "1"
    -Type DWord
    -Force

Set-ItemProperty
    -Path "HKLM:\Software\Wow6432Node\Microsoft\.NetFramework\<TargetVersion>"
    -Name "SchUseStrongCrypto"
    -Value "1"
    -Type DWord
    -Force

# Ie problem
Set-ItemProperty
    -Path "HKLM:\ Software\Policies\Microsoft\Internet Explorer\Main"
    -Name " DisableFirstRunCustomize "
    -Value "1"
    -Type DWord
    -Force
{{< / highlight >}}

Now connection error is gone, but I was presented with another error.

## Error 3: Index was outside the bound of the array

After TLS 1.2 was set, I start having this error, a strange error that happened also when I created nuget packages manually with nuget pack command. I suspected that it was probably a problem in psd1 file, but a check with **Test-ModuleManifest -Path .\BuildUtils.psd1** gives no error.

Nevertheless I took the psd1 example file from [https://github.com/anpur/powershellget-module](https://github.com/anpur/powershellget-module) and modified it to match my need and gotcha,  error is gone.

But I was presented with another error.

## Error 4: Failed To Generate Compressed file

I need to tell you that at this point I was pretty frustrated, because now I was left in the dark with another cryptic error that did not give me any clue on what was wrong.

![Unable to compress file error](../images/unable-to-compress-file.png)
***Figure 2***: *PowerShell Publish-Module failed with a Unable to compress file*

>This final error "Failed to generate the compressed file for module" really drove me mad.

I had really no idea on what is going on so I've **first checked that I really have the last version of PowershellGet and Package provider.**

{{< highlight powershell "linenos=table,linenostart=1" >}}
Get-Module -Name PowerShellGet -ListAvailable | Select-Object -Property Name,Version,Path
Get-PackageProvider -Name NuGet
{{< / highlight >}}

Then I've found **various articles on Internet that related this error to NuGet version** used. After upgrading every nuget.exe file I've found on my disk the error was still there.

Then I've found some clue that the error can be indeed due to the fact that I've installed .NET Core 5 preview, but even that road lead me nowhere.

Finally, I've got really frustrated so I decided to **publish the code of the original sample** found at [https://github.com/anpur/powershellget-module](https://github.com/anpur/powershellget-module) to verify that I've no problem in my machine and Bingo: it worked.

Clearly my module has something wrong but what?? I've then started removing functions, until I had the code in module with the very same content from the sample. Still it did not work.

> At that point I was convinced that then only difference between my module and the sample is in file names.

So I found that the problem was indeed pascalCase of module name. **When I changed the name of my module from build-utils to BuildUtils everything started working.**

So if you got this error please be sure to check that

1. You have your script named in CamelCase, like BuildUtils.psm1 and BuildUtils.psd1
2. Ensure that both of these files are in a folder with the same name of the module (BuildUtils)

You can find [my module in GitHub](https://github.com/AlkampferOpenSource/powershell-build-utils) if you want to verify how it was done.

Finally I had my module published and it is ready to be used inside my build and release scripts.

![Build utils finally published](../images/build-utils-module.png)
***Figure 3***: *Build utils finally published*

![Build utils is available for install](../images/buidl-utils-installed.png)
***Figure 4***: *Build utils is available for install*

Now you can simply run Install-Module BuildUtils to install your utility functions. This approach is really nice because you **have a single repository with all of your PowerShell utilities** and you can use them from any script with zer problem. 

Gian Maria.
