---
title: "How to add reference to MicrosoftVisualStudioDesignerInterfaces"
description: ""
date: 2007-09-12T13:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I need to create a project and add references to Microsoft.VisualStuidio.Designer.Interfaces, since it does not get listed on the standard reference pane I resort editing the csproj manually adding the references.

&lt;Reference Include=”Microsoft.VisualStudio.Designer.Interfaces, Version=1.0.5000.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a”&gt;

&lt;SpecificVersion&gt;False&lt;/SpecificVersion&gt;

&lt;HintPath&gt;D:\Program Files\Microsoft Visual Studio 8\Common7\IDE\Microsoft.VisualStudio.Designer.Interfaces.DLL&lt;/HintPath&gt;

&lt;/Reference&gt;

Someone could suggest a better and less hardcore way?

Alk.
