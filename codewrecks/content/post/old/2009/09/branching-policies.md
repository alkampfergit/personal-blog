---
title: "Branching policies"
description: ""
date: 2009-09-15T10:00:37+02:00
draft: false
tags: [Continuous Integration]
categories: [Software Architecture]
---
I just read [this post](http://martinfowler.com/bliki/FeatureBranch.html) of [Martin Fowler](http://martinfowler.com), and I found it very interesting. In my opinion, even small projects will greatly benefit from [Continuous Integration](http://martinfowler.com/articles/continuousIntegration.html). Despite of the Branching policies that you choose, having a machine for CI is vital during the lifetime of a project.

Usually I do not like very much [CherryPicking](http://chestofbooks.com/computers/revision-control/subversion-svn/Cherrypicking-Branchmerge-Cherrypicking.html) even if sometimes it cannot be avoided. In the Promiscuous Integration model, people are doing CherryPicking from other branches and this scares me. The purpose of a branch is to keep changes isolated until they are ready to be moved in the trunk, or to keep copies of specific version of the software, and usually merging between branches can be problematic. Some Source control system do not permit to merge changes between branches that are not contiguous.

In the example made by Fowler, with Promiscuous Integragion, DrPlum and Reverend Green works together in two different branches, but since they have great communication, they periodically merge from one branches to another, but this scheme is a little confused in my opinion.

A better strategy could be this one. Since DrPlum and Reverend Green have great communication, it can be possible to work in different way. Say DrPlum decide to create a new big feature, so he creates a branch and starts to work on that branch. Suppose he do not want to integrate in the trunk until it is completely finished, so he do not use CI.  He ask to other members of the team if someone is working on a branch, all people say no, so he create a new branch and start working on it.

After some time Reverend Green want also to create a new big feature, he ask to the team, and DrPlum says him that he is also working on a feature that have some code in common with the new feature of REverend Green. At this time both Reverend Green and Dr Plum create another branch from the original branch of DrPlum. The situation is the following, we have the trunk, then we have the first branch of DRplum (call it  **B1** ), from this branch we have two other branches, one for Reverend Green ( **B2G** ), and the other for DrPlum ( **B2P** ). Now we can configure a Continuos Integration Machine to integrate  **B1.** Now both DrPlum and Reverend green are working on isolated branches, but they merge changes often with  **B1** , so they never need a big merge. In this scheme  **B1** acts like a trunk for both developers. As bugfix or changes are made in the trunk, one of them bring those changes in B1, verify that all tests are good, and when  **B1** is stable again, each one propagates changes from  **B1** to his own branch.

With such a scheme, two developers can work together on new feature that have code in common, without the risk of big merge, using Continuos Integration, but avoiding put stuff in the trunk until the work is finished. Say Reverend Green has finished his feature, he first integrate all trunk changes in  **B1** , verify that everything is ok, then merge changes from  **B1** to  **B2G** , when everything is ok he merge remaining changes from  **B2G** to  **B1 (** in the meanwhile DrPlum could have changed  **B1** ), then from  **B1** to the  **trunk** , and the game is done. The same is done from DrPlum when he finished.

I admit that I never used such a complex scheme, because I prefer to have developers continuously merge in the trunk, and thanks to CC.net integration problems are mitigated.

Alk.

Tags: [Continuous Integration](http://technorati.com/tag/Continuous%20Integration) [Source Control](http://technorati.com/tag/Source%20Control)
