---
title: "Linking VSO with third party tools"
description: ""
date: 2014-10-13T18:00:37+02:00
draft: false
tags: [Rest APIs,VSO]
categories: [Team Foundation Server]
---
One of the most interesting news of VSO in last months  **are** [**service hooks**](http://www.visualstudio.com/integrating-with-service-hooks-vs) **and REST API to integrate VSO with** [**third party tools**](http://www.visualstudio.com/integrating-with-service-hooks-vs). This capability is a key for success because ALM is really a complicated subject and rarely you can manage all of your applications with a single tools.

VSO and TFS are no exception to this rule, they are more a set of suites and tools glued together under a single brand. TFS is composed by a Work Item Store plus Two options for source control (TFVC/Git) plus a Continuous Integration service (Build service) and a Release Management Tool for release, it integrates with SCOM to keep Ops and Devs in contact, plus much more.

But no tool can cover all of the need of every possible user, and VSO solves this problem giving full access to every data through Managed and Java API and now even with a REST interface.  **In this article I’ll tell you how you can integrate with** [**Trello**](https://trello.com/), a widely used online tool to manage Kanban boards. VSO has support for Kanban, but is still rough and many people around the world are using Trello to manage Kanban Cards. If you like VSO but really prefer using Trello for your Kanban you can follow this guide to [link your VSO account to Trello](http://www.visualstudio.com/en-us/trello-and-vso-vs.aspx).

Possibilities are infinte, as an example I can configure VSO to create a particular card in trello whenever a PBI is created in my project

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/10/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/10/image.png)

 ***Figure 1***: *Automatic creation of card upon creation of PBI in VSO*

If you start adding PBI in VSO

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/10/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/10/image1.png)

 ***Figure 2***: *Create PBI in VSO account*

You will find corresponding card in Trello automatically created.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/10/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/10/image2.png)

 ***Figure 3***: *Card are automatically created with a Link to the corresponding PBI*

Actually the integration is still rough, because I’ve no way to keep the two synchronized, but the direction is promising.

Gian Maria.
