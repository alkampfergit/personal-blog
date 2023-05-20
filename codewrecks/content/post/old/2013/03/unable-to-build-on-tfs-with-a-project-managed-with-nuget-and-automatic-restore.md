---
title: "Unable to build on TFS with a project managed with Nuget and automatic restore"
description: ""
date: 2013-03-08T18:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server,Visual Studio]
---
To reduce the size of the repository and to easy dependencies management, nuget is a good solution, and when is time to create a build in TFS you can simply [Enable Nuget Package Restore](http://docs.nuget.org/docs/workflows/using-nuget-without-committing-packages) and let the build machine download the dependency for you. This works perfectly even on TF Service (tfs.visualstudio.com) because the  **Elastic Build is configured to restore packages during build.** This is really cool, until your build start to fail for missing references. If you look at detailed build log you can find error like this one.

> warning MSB3245: Could not resolve this reference.  **Could not locate the assembly “EntityFramework”**. Check to make sure the assembly exists on disk.

First of all you should verify if your build agent correctly restored nuget packages during the build. You should find messages like this in the build log.

> PrepareForBuild:  
>    Creating directory “obj\Debug\”.  
>  **RestorePackages** :  
>    “C:\a\src\src\.nuget\nuget.exe” install “C:\a\src\src\xxxx.Entities\packages.config” -source “”  -RequireConsent -o “C:\a\src\src\packages”  
>    **Successfully installed ‘EntityFramework 5.0.0’.** >  ResolveAssemblyReferences:  
>    Primary reference “EntityFramework”.

If packages are restored correctly, but TFS builds still fails, probably your projects are referencing packages from a wrong location (this can happen if  you moved your solution in different folder of your source control repository). Do not worry, the solution usually is a simple reinstallation and reconfiguration of all packages; go to Package Manager console and type

> PM&gt;  **Update-Package -Reinstall** Now if you check-in your code again, after nuget reinstalled and reconfigured everything, build should be fine.

Gian Maria.
