---
title: "Check pull request with build without enforcing pull request"
description: ""
date: 2017-05-20T07:00:37+02:00
draft: false
tags: [build,Git]
categories: [Team Foundation Server]
---
With TFS / VSTS Build system it is possible to configure Git to require that a  **specific branch is protected, and you need to use Pull Requests to push code into it, and the pull request can be accepted only if a specific build is green**. Here is the typical configuration you can do in admin page for your Git repositories.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-3.png)

 ***Figure 1***: *Branch policies in VSTS/TFS*

In  **Figure 1** it is represented the configuration for branch policies; in this specific configuration I require a specific build to run whenever a member create a pull request against develop branch. The effect is:  **if a developer try to directly push to develop branch, the push is rejected**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-4.png)

 ***Figure 2***: *Push was rejected because Branch Policies are defined for develop branch.*

 **Branch Policies are used to force using pull requests to reintegrate code to specific branches, and sometimes it could be too restrictive.** For small teams, it could be perfectly reasonable to avoid always forcing pull request and letting the owner of the feature branch to decide if the code needs a review. Such relaxed policies is also used when you start introducing Pull Request to the team, instead of telling everyone that they will be completely unable to push against a branch except from a Pull Request, **you can gradually introduce Pull Request concept doing Pull Request only for some of the branches, so the team can be familiar with the tool**.

> Always be gentle when introducing new procedure in your process, being too restrictive usually creates resistance, unless the new procedure is enforced and requested by all  members of the team

Luckily enough it is simple to obtain such result, in  **Figure 1** you should see an option “Block Pull Requests Completion unless there is a valid build”. Simply unchecking that checkbox will allows you to normally push on develop branch, but if you create a pull request, you will have a build that verify the correctness of the code.

Gian Maria.
