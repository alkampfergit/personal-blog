---
title: "Creating a Wiki with code in VSTS"
description: ""
date: 2018-08-02T17:00:37+02:00
draft: false
tags: [VSTS]
categories: [Azure DevOps,Team Foundation Server]
---
Information spread is one of the key of success for Agile Teams, the ability to quick find information about a project, definition of UBIQUITOUS LANGUAGE and everything that can be related to the project should be prominent for each member of the project. In this scenario, **the information should also be *near* where it need to be, but at the same time it should be widely available to every member of the team **.

There are some concepts, like UBIQUITOUS LANGUAGE that should be near the code (name of classes should adhere to the UBIQUITOUS LANGUAGE) but at the same time we want that kind of information to be widely available. There are also other type of information that should be near to code, like guidelines, instruction on how to start working with a project etc, but that kind of information should be available even outside the code.

> Where to place information is a really though decision, putting information in Code made it near to where it need to be used, but it can be less discoverable and usable

Luckily enough VSTS has a really good solution for this scenario,** Wiki that are stored inside a repository **. You can in fact use any folder of any Git Repository and starting creating a Wiki in Markdown, commit files, and then have VSTS render them as Wiki in the appropriate section. This has the double advantage of having information** into the code **, but at the same time the information is available via web wiki.

Yes, you could browse markdonw files directly from code repository since long time in the past, but having it converted to wiki is a major advantage, because readers does not need to know how to browse code. Here is an example how a readme.md looks like in the code repository

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/08/image.png)** Image 1: ***Browsing of Markdown file directly in code browser*

As you can see, markdown files inside code repository can be rendered without problem inside VSTS Code browsing. This is ok, but the  **information is not discoverable and it is not 100% friendly**.

> Forcing people to find information browsing in the Code section of VSTS is acceptable for developers, but not for other member of the team

Here are the problem: first you need to go to Code Browsing, then you need to choose a repository, know that the wiki is in a specific path (ok if you use wiki folder it is obvious :) ) and lastly you  **are browsing information in the context of a repository (you have the tree at the left etc**. Another annoying problem is that you should understand which branch to use to browse the most up-to-date and correct version of the wiki, Ex: is the Master or Develop branch that contains the most correct and reviewed version of the wiki?

If you go on the Overview section of the team project and navigate in the Wiki Section you have the option of publishing code as wiki. As you can see in  **Figure 2** , it is just a matter of specifying to VSTS repository, branch, path and name of the wiki.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-1.png)

 ***Figure 2***: *Publish part of a repository as wiki*

Once the wiki is published it is more discoverable, because it is listed in the apposite section of the menu and it has a specific name, that is not related to the repository.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-2.png)

 ***Figure 3***: *Code published as wiki*

As you can see from  **Figure 3** , you have several advantages, first of all  **everyone can simply open Wiki section and find the information, wiki is rendered outside the context of a code browsing, and you can list all the wiki available for this project with a simple selector (2).** The most interesting fact is that the real wiki is implemented as code in a folder of a Git Repository and can evolve with the same pace of the code.

If you really care about your documentation, you can also use branching to modify a wiki and create a pull request to validate those modification before they are public for everyone.

Gian Maria Ricci.
