---
title: "The importance of good communication"
description: ""
date: 2008-06-23T05:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
In a team, communication between members is of great importance. I found that a lot of bug or mistakes in software development, quite often derive from incomplete or not well conducted analysis.

I’m not an expert of software analysis, but I found that a quite good analysis, even an informal one, can give great benefit to whole software development process. It is not important to conduct *perfect analysis*, or that it covers all details, but there are some aspects that are really more important than anothers.

One of the key part of an analysis is terminology and the right use of words. The analysis should create a jargon specific to the project, and all the team members should agree on th terms used in the analysis documents. Poor terminology lead to great problems, and greatly reduce communication between members. As an example, someone told you that there is a bug in the data layer related to “Channel” part of project XYZ.You are responsible of the Data Layer but never heard of “channels”. The problem arised because in the first analysis of the project there is a entity called “Theme Category”, but during developing, the UI gui decide that the term is not good to present to the user, and he decides to change the name in the UI to “Channel”. After some time this decision gets lost among other ones, so the UI guy and the user of the software speaks in terms of “Channels” but you as the Data Layer Guy, speak of  “Theme Category”. It is of great frustration when the user told you “The channels section has a bug” and your first answer is “What the hell is a Channel??? I’ve never heard of it!!!”.

To avoid this problem you can create a dictionary of the most important terms of a project. This dictionary can be a document shared with the Source Control System in the root of the project, together with the source code. With such a document we can track situation like the one described above simply creating two entry, the first during the analysis, the other created by the UI guy when he decides to change the name of a entity presented to the user..

Theme Category: Categorization of a XXXX YYY ZZZ.  
Channels: See Theme Category (Alias used in the UI part of the software to refer to Theme Category Entity)

Keeping such a dictionary up to date it is fundamental, especially for new person that gets added to the project.

Alk.

Tags: [Software Analysis](http://technorati.com/tag/Software%20Analysis)

<!--dotnetkickit-->
