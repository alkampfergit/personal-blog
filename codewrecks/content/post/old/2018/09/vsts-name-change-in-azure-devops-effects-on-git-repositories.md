---
title: "VSTS Name change in Azure DevOps effects on Git repositories"
description: ""
date: 2018-09-27T17:00:37+02:00
draft: false
tags: [build]
categories: [Azure DevOps]
---
As I blogged in the past, it is super easy to build a VSTS Build (Now Azure DevOps Pipeline) to [keep two repositories in sync](http://www.codewrecks.com/blog/index.php/2016/10/22/keep-git-repository-in-sync-between-vsts-tfs-and-git/). In that article one of the step is pushing the new code to the destination repositories with an url like: [https://$(token)@myaddress.visualstudio.com/DefaultCollection](https://$%28token%29@myaddress.visualstudio.com/DefaultCollection), to automatically include a token to authenticate in the destination repository.

 **Now some of my build started to fail due to timeout** and I immediately suspected the reason:  **the name change from VSTS to Azure DevOps changed the base url from accountname.visualstudio.com to dev.azure.com/accountname, and this in some way broke the bulid**.

> Due to rebranding of VSTS into Azure DevOps and change of Url you need to pay attention if some extension or build broke due to usage of the old url.

The solution is Super Simple, you need to go to the Repository page of your account using new dev.azure.com address and find the new address of the repository, something like: [https://accountname@dev.azure.com/accountname/teamproject/\_git/repositoryName.](https://accountname@dev.azure.com/accountname/teamproject/_git/repositoryName.)  **You just need to change adding a semicolon and valid auth token after the accountname** , so it is now like this: [https://organization:$(Token)/dev.azure](https://organization:$%28Token%29/dev.azure)…..

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image-1.png)

 ***Figure 1***: *New string format to push force to a destination repository*

Since I have many mirror build, I want a centralized way to securely store thetoken value to have all the build take this value from a centralized location; the obvious solution is a variable group linked to this build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image-2.png)

 ***Figure 2***: *Variable group linked to this build.*

In the variable group I have a single variable called Token, that is secure and it is used by many builds,  **so each time the token expire, I can change this and all the builds will use the new value**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image-3.png)

 ***Figure 1***: *A simple variable group that contains a single secure variable.*

That’s all.

Gian Maria.
