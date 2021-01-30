---
title: "Keep Git repository in sync between VSTS  TFS and Git"
description: ""
date: 2016-10-22T08:00:37+02:00
draft: false
tags: [Git,VSTS]
categories: [Team Foundation Server]
---
> Scenario: you have a repository in Git, both open source or in private repository and you want to keep a synchronized mirror in VSTS / TFS.

There are some legitimate reason to have a mirrored repository between Github or some external provider and an instance of VSTS / TFS, probably the most common one is **keeping all development of a repository private and publish in open source only certain branches.** Another reason is having all the code in Github completely in open source, but internally use VSTS Work Item to manage work with all the advanced tooling VSTS has to offer.

The solution to this problem is really simple,  **just use a build in VSTS that push new commits from GitHub to VSTS or the opposite.** Lets suppose that you have a GitHub repository and you want it to be mirrored in VSTS.

#### 

## Step 1 – install extension to manipulate variables

Before creating the build you should install [Variable Toolbox](https://marketplace.visualstudio.com/items?itemName=jessehouwing.jessehouwing-vsts-variable-tasks) extension from the marketplace. This extension allows you to manipulate build variable and it is necessary if you use GitFlow.

From the [list of Build Variables available in the build system](https://www.visualstudio.com/ru-RU/docs/build/define/variables#predefined-variables) there are two variables that contains information about the branch that is to be build. They are  called Build.SourceBranch and Build.SourceBranchName, but noone of them contains the real name of the branch.  **The SourceBranch contains the full name refs/heads/branchname while SourceBranchName contains the last path segment in the ref.** If you use gitflow and have a branch called hotfix/1.2.3 the full name of the branch is refs/heads/hotfix/1.2.3 and the variable SourceBranchName contains the value 1.2.3 …. not really useful.

Thanks to the Variable Toolbox Extension you can simple configure the task to replace the refs/heads part with null string, so you can have a simple way to have a variable that contains the real name of the build even if it contains a slash character.

## Step 2 – configure the build

The entire build is composed by three simple task, the very first is a Transform Value task (from [Variable Toolbox](https://marketplace.visualstudio.com/items?itemName=jessehouwing.jessehouwing-vsts-variable-tasks) ) followed by two simple command line.

[![SNAGHTML3a85c0](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/SNAGHTML3a85c0_thumb.png "SNAGHTML3a85c0")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/SNAGHTML3a85c0.png)

 ***Figure 1***: *The entire build is three simple tasks.*

 **The first task is used to remove the refs/heads/ part from the $(Build.SourceBranch) and copy the result to the GitBranchName variable** (you should have it defined in the variables tab).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-13.png)

 ***Figure 2***: *Transformation variable configured to remove refs/heads*

Now we need a first command line task that checkout the directory, because the build does not issue a checkout in git, but it simple works in detatched HEAD.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-14.png)

 ***Figure 3***: *Checkout git through commandline*

As you can see in Figure 3 this operation is really simple,**you can invoke git in command line, issuing the command *checkout $(GitBranchName)* created in precedent step, finally you should specify that this command should be executed in $(Build.SourcesDirectory) **.

The last command line pushes the branch to a local VSTS Repository.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-15.png)** Figure 4: ***Git command line to push everything on VSTS*

The configuration is really simple, I decided to push to address [https://$(token)@myaddress.visualstudio.com](https://$%28token%29@myaddress.visualstudio.com). Token variable (2) is a custom secret variable where I store a valid Personal Access Token that has right to access the code. To push on remote repository the syntax $(GitBranchName):$(GitBranchName) to push local branch on remote repository with –force option to allow forcing the push.

Do not forget to make your token variable as a secret variable and configure the continuous integration to keep syncronized only the branch you are interested to.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-16.png)

 ***Figure 5***: *Configure branches you want to keep syncronized*

If you need also to keep tags syncronized between builds you can just add another command line git invokation that pushes all tags with the push –tags option.

## The result

> Thanks to this simple build, whenever we push something on GitHub, a build starts that automatically replicate that branch in VSTS without any user intervention.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-17.png)

 ***Figure 5***: *Build result that shows command line in action during a build.*

Thanks to the free build minutes on the hosted build, we have a complete copy in VSTS of a GitHub repository with automatic sync running in few minutes.

 **The very same configuration can be reversed to automatically push to GitHub some branches of your VSTS account** , useful if you want to publish only some branches in open source, automatically.

Gian Maria.
