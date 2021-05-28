---
title: "Winget is finally a thing"
description: "Finally Windows has its own Package manager"
date: 2021-05-28T10:00:00+02:00
draft: false
tags: ["Windows"]
categories: ["General"]
---

After a really loooooong time, finally Windows has its own [Package Manager](https://devblogs.microsoft.com/commandline/windows-package-manager-1-0/) called Windows Package Manager 1.0. It was firstly announced last year at build, but **with 2021 build conference it was announced that it is now in version 1.0**. I do not want to do a full coverage of all the features, but simply share why this is a thing.

Linux users had package managers from almost the beginning, this imply that **to install all of your favorite tools, you can simply use command line to install everything**. Windows was an Operating System that was not born with Command Line in mind and this reflects negatively on the experience of "new machine configuration".

> Often people are scared of reinstalling Windows because they will need to reinstall everything.

The greatest pain is **opening a browser, search for the installer of all programs you need to install, download, install, all of this interactively**. This is usually a great loss of time, especially because you spend time to look for installers. In latest years, [**Chocolatey**](https://chocolatey.org/) solves most of the problems, but it has not the very same experience of a package manager.

## N°1 cool feature of winget: Listing everything installed

After installing Windows Package Manager, you can use it in a commandline with the Winget command. After I've installed on an old system, **I verified that it is able to detect all of supported installed programs, even if I installed them with chocolatey or manually**. This is really a killer feature because it allows you to start using Winget even in your old installation and not only in a new Windows installation.

![Winget recognized already installed packages](../images/winget-list-existing.png)
***Figure 1:*** *Winget recognized already installed packages*

Figure 1 refers to a 4 years old system where I installed lots of stuff. As you can see **Winget is able to recognize almost all of my installed software**.

![Winget search capabilities](../images/winget-list-search.png)
***Figure 2:*** *Winget search capabilities*

List command support searches, and you need to look at **Id column that states the id of the package**. As you can see from Figure2 only some of the installed software has an id packages while other has something like a Guid. All packages that have a guid are not supported by Winget. So you need to pay attention because a **winget list** command shows almost every program installed in your system, but this **does not imply that all of them are effectively managed by winget**.

## N°2 cool feature of winget: Upgrading everything

Calling winget upgrade gives you a list of the **supported programs that winget can upgrade and needs to be upgraded**

![Winget upgrade list](../images/winget-upgrade.png)
***Figure 3:*** *Winget upgrade list*

Now you can call winget upgrade --all and all supported already installed programs can be updated with a single line of code. **This simplify tremendously management of many machines, where you can update everything with a single instruction**. This feature is super useful for all developers like me that has lots of Virtual Machines, a situation where keeping everything up-to-date requires lots of effort. 

## N°3 cool feature of winget: Exporting / Importing

Thanks to Export command, you can simply **export all of your actually installed packages (supported by winget) in a simple json file.** A simple Winget export -o path-to-file.json and you have in a json file all installed packages. During file generation winget gives you a warning for each installed software that it is not able to manage, this immediately gives you an idea **on how many of your installed programs are currently unsupported**.

![Winget export list of installed software on a json file](../images/winget-export.png)
***Figure 3:*** *Winget export list of installed software on a json file*

It is worth to notice that some software, like 7zip in the above picture, is actually supported by Winget but was installed in a way that makes it incompatible with winget. I've installed 7zip lots of time ago with Chocolatey; so I tried to do a chocholatey uninstall then reinstall again 7zip with winget *(winget install 7.zip)*. After 7zip was installed with Winget I got it in my export list.

Here is a part of exported file.

{{< highlight json "linenos=table,linenostart=1" >}}
{
	"$schema" : "https://aka.ms/winget-packages.schema.2.0.json",
	"CreationDate" : "2021-05-28T18:36:59.486-00:00",
	"Sources" : 
	[
		{
			"Packages" : 
			[
				{
					"PackageIdentifier" : "Bitwarden.Bitwarden"
				},
				{
					"PackageIdentifier" : "Microsoft.VisualStudio.2019.Enterprise"
				},
				{
					"PackageIdentifier" : "Signal.Signal"
				},
				{
					"PackageIdentifier" : "Telerik.FiddlerEverywhere"
				},
{{< / highlight >}}

Clearly we have a corresponding Import command that allows you to install every software specified in a json export file. **This is probably the real killer feature, just export everything from a machine and reimport on another and you got everything installed**.

If you never heard of winget, I strongly suggest you to install it and give it a try.

Gian Maria.
