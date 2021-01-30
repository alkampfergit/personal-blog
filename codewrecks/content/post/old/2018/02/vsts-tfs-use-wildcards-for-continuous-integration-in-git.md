---
title: "VSTS  TFS use Wildcards for continuous integration in Git"
description: ""
date: 2018-02-20T18:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Azure DevOps,Team Foundation Server]
---
If you setup a build in VSTS / TFS against a git repository, you can choose to trigger the build when some specific branch changed.  **You can press plus button and a nice combobox appears to select the branch you want to monitor**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-3.png)

 ***Figure 1***: *Adding a branch as trigger in VSTS / TFS Build*

This means that if you add feature/1312\_languageSelector, each time a new commit will be pushed on that branch, a new build will trigger. Actually if you use GitFlow you are interested in building each feature branch, so you do not want to add every feature branch in the list of monitored branches.

If you look closely, it turns out that the combo you use to choose branches admit wildcards. If you look at  **Figure 2** , you can verify that, pressing the add button, a new line is added and you have a textbox that allow you to “Filter my branches”.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-4.png)

 ***Figure 2***: *Filter branch text*

Actually the name is misleading, because **you can simply write *feature/\ **and press enter, to instruct VSTS to monitor each branch that starts with feature/.** > Using wildcards in trigger list allows you to trigger a build for every feature branch.

For people not used to VSTS, this feature goes often unnoticed, because they think that the textbox can be used only to filter one branch. With this technique you can trigger a build for each change in each standard branch in GitFlow process.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-5.png)

 ***Figure 3***: *Trigger with wildcards*

As you can see in  **Figure 3** , I instructed TFS / VSTS to build develop, master and all hotfix, feature or release branches.

Gian Maria
