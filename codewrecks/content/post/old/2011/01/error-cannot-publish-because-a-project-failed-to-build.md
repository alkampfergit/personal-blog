---
title: "Error Cannot publish because a project failed to build"
description: ""
date: 2011-01-17T10:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Today I got this strange error when I tried to publish a project with clickonce, what I do not understand it is why it is telling me that a project failed to build when

1. If I build all solution every project builds ok
2. It did not give me any clue on what is wrong.

This is due to a bug in MSBuild system, and you can [read the details here](http://connect.microsoft.com/VisualStudio/feedback/details/551674/vs-2010-rtm-returns-error-cannot-publish-because-a-project-failed-to-build-even-though-solution-builds-fine), but there is a simple workaround, instead of publishing from the project properties, you should right click on the project and then choose publish. When publish operation begins from the right click on project file, it works without problem.

alk.
