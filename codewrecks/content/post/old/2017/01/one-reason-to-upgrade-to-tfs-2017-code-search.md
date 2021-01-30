---
title: "One reason to upgrade to TFS 2017 Code search"
description: ""
date: 2017-01-17T17:00:37+02:00
draft: false
tags: [Upgrade]
categories: [Team Foundation Server]
---
I always suggest teams to use VSTS instead of on-premise TFS. The main reason is avoiding any issue with administration or upgrades. In these years,  **one of the main risk of having TFS on-premise is not planning for upgrade and keeping the first version installed for years**. As a result, it is not uncommon to have teams that still uses TFS 2013 even if version 2017 is out.

For small teams usually there is not a dedicated TFS administrator; in this situation is it strongly advisable  **not to skip one entire major upgrade, to minimize the risk of a big bang upgrade**. Suppose you have TFS 2015, I strongly suggest you to upgrade to TFS 2017, before another major version is out. This will prevent to have to upgrade 2 or more major version, with the risk of long upgrade times and too many changed that could makes the user upset.

> As a general rule, if you need to use on-premise TFS, you should upgrade as frequently as possible and never skip one major upgrade.

If you are not sure that upgrading to TFS 2017 worths the time needed to plan an perform the upgrade, I’d like to share with you some of the new exciting new features.

> My favorite feature of TFS 2017 is Code Search, that allows to perform semantic searches within code.

Every developer loves experimenting new libraries, new patterns etc, and in the long run Hard Disks of people in the team is full of small little projects.  **One day you remember that someone wrote a Proof of concepts to test bulk load with ElasticSearch but you do not know how to find the code**. The obvious solution is storing everything inside your TFS (VSTS), using Git or TFVC, then search code with this new exciting functionality.

In TFS 2017 you have the “Search code” textbox, in the left upper part of the Web UI, and if you start typing a nice help allows you to view the syntax you can use.

[![clip_image001](http://www.codewrecks.com/blog/wp-content/uploads/2017/01/clip_image001_thumb.png "clip_image001")](http://www.codewrecks.com/blog/wp-content/uploads/2017/01/clip_image001.png)

 ***Figure 1***: *All the syntax used to search inside code with the new Search Code Functionality*

As you can see  **you can search text inside name of a class, comment, constructor, etc, and you can also use AND OR NOT.** This gives you a tremendous flexibility and usually in few seconds you can can find the code you need. Results are presented in a nice way, and you can immediately jump to the code to verify if the result is really what you are searching for.

[![clip_image002](http://www.codewrecks.com/blog/wp-content/uploads/2017/01/clip_image002_thumb.png "clip_image002")](http://www.codewrecks.com/blog/wp-content/uploads/2017/01/clip_image002.png)

 ***Figure 2***: *Results allows you to immediately browse the file with the match within the Web Ui*

If you still are in TFS 2015 or earlier version, I strongly suggest you to plan for an upgrade to 2017, to use this new exciting feature.

Gian Maria.
