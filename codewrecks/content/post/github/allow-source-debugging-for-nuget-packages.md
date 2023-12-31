---
title: "Allow easy source debugging for Nuget Packages and GitHub"
description: "Thanks to Source Link it is super-easy to enable symbols indexing and source debugging of your public Nuget packages where the code is hosted in GitHub or other supported repository. All you need is a little modification of your C# project file."
date: 2023-12-31T08:00:00+02:00
draft: false
tags: ["GitHub", "Codespaces"]
categories: ["github"]
---

In my previous blog posts, I've extensively discussed how to **publish symbol libraries for .NET in Azure DevOps / Team Foundation Server**. Azure DevOps has supported symbol server functionalities for a considerable time, making it straightforward to add steps in your build process for indexing your source code. This capability enables you to **publish your .NET libraries to either an internal or public NuGet feed and facilitates stepping into the original source code for debugging directly within Visual Studio.**

> Publishing symbols for nuget packages in Azure DevOps was supported since the Team Foundation Server era.

When your code is open source and hosted on GitHub, publishing it on a public NuGet feed becomes more impactful. **Including symbols in your package feed enhances the usability of your library.** Symbols allow users to seamlessly debug your source code and better understand / diagnose problems. This feature is invaluable in various scenarios. For instance, I recently encountered an issue in production due to an updated MongoDB driver. **Being able to press F11 in Visual Studio and step into the original source code used to build the DLL was crucial for quick problem-solving.**

Integrating this functionality into your project is straightforward, requiring only a few modifications in your project file and the **inclusion of a dedicated NuGet package.** Enabling source code publishing not only simplifies the development process but also significantly enhances the user experience for your library consumers and since it is now a very few-steps operation, you have no excuse to not enabling in your code.

First of all include the Microsoft.SourceLink.Common in your project

![Libraries you need to include in project reference to enable symbol indexing](../images/markdown-external-image.png)

***Figure 1:*** *Libraries you need to include in project reference to enable symbol indexing*

Then simply modify the .csproj file **specifying in project properties that you want to publish also symbols**. This will generate a symbol package called .snupkg during publish.

{{< highlight xml "linenos=table,linenostart=1" >}}
    <!-- Generate symbol packages (.snupkg) -->
    <!-- You must publish both packages, the package that contains the DLL (.nupkg) and the one that contains the symbols (.snupkg) -->
    <IncludeSymbols>true</IncludeSymbols>
    <SymbolPackageFormat>snupkg</SymbolPackageFormat>
{{< /highlight >}}

Now just use dotnet pack to create packages and verify that indeed you have **also symbols package generated**.

![nuget with symbols package generated after a dotnet pack](../images/snupkg.png)

***Figure 2:*** *nuget with symbols package generated after a dotnet pack.*


![Verify in Nuget.Org that indeed your pacakge has now symbols](../images/symbols-and-package.png)

***Figure 3:*** *Verify in Nuget.Org that indeed your pacakge has now symbols.*

> With few lines in your project you can enable sourcelink support greatly enhancing user experience for consumer of your nuget packages.

Now, if you want to verify that everything is ok, you can simply use 7zip or any zip utilities to unpack your snupkg file and test the pdb. **You just need to install source link utility with `dotnet tool install --global sourcelink` and then simply **check the pdb with the instruction: `sourcelink print-json yourfile.pdb` **. The result should be something like this one.

{{< highlight json "linenos=table,linenostart=1" >}}
   {
      "documents": {
         "C:\\develop\\github\\DotNetCoreCryptography\\*": "https://raw.githubusercontent.com/alkampfergit/DotNetCoreCryptography/04177d0e07a9ee8633fde65c0ae553bc2c38b7b6/*"
      }
   }
{{< /highlight >}}

You can also use `sourcelink test yourfile.pdb` to try to check ALL the files that are specified inside the PDB file, **this will ensure that all files are indeed reachable from sourcelink and they can be used to debug your source**.

This approach effectively counters a common objection to **decomposing larger solutions into smaller, more manageable libraries with NuGet.** A typical concern is the believe that debugging code from external libraries is a difficult if not impossible operation. With symbols, you can debug the original source code used to build any version of the DLL. Visual Studio can examine symbols and **locates the exact source code version corresponding to the DLL version in the NuGet feed** offering a comprehensive debugging experience.**

> Azure DevOps still has its reason to exists

If you're dealing with private code and prefer to keep it inaccessible to the public, you can read my old blog post on the subject.

[Streamline library debugging in Azure DevOps](https://www.codewrecks.com/post/azdo/pipeline/streamline-library-debugging/)

In conclusion, the integration of symbol publishing in your .NET projects, whether for public or private use, significantly enhances the development and debugging experience. It's a practice that reaps immense benefits with minimal effort.


Gian Maria.




