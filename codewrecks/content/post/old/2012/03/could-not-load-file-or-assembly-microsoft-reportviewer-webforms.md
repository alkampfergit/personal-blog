---
title: "Could not load file or assembly MicrosoftReportViewerWebForms"
description: ""
date: 2012-03-21T18:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
This error: * **Could not load file or assembly Microsoft.ReportViewer.WebForms** *sometimes shows up when you start working with old projects and you have only the latest version of Visual Studio installed, or when you deploy a web site or program and forget to include all dependencies.

In a project I’m working to I’m using Visual Studio 11 Beta in a Virtual Machine,  I opened a project that actually uses VS2010 but was created originally with VS2005, I rebuild every project, but I got the above error when I started one of sites included in the solution inside IIS. The reason is clear, the old site still uses old assemblies of Report Viewer, but in my machine only VS11 beta is installed so I need to reinstall the runtime of  **Report Viewer** to make it work. For any other person that is incurred in this problem, you can find the [Report Viewer installer of VS2008 at this address](http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=6576) but if you have a really old site that uses [Visual Studio 2005 Report Viewer this is the link](http://www.microsoft.com/download/en/details.aspx?id=4016), finally [this is the link for 2010 version](http://www.microsoft.com/download/en/details.aspx?id=6442).

If you want to know the exact version you need you should look at the version,  **Version=8.0.0.0** is Visual Studio 2005 version,  **Version=9.0.0.0** is Visual studio 2008 and finally  **Version=10.0.0.0** is Visual Studio 2010 Version. In my example the exact error is

> Could not load file or assembly ‘Microsoft.ReportViewer.WebForms, Version=8.0.0.0, Culture=neutral

This means that I need Report Viewer of Visual Studio 2005 installed to make it work.

Gian Maria.
