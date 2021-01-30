---
title: "Welcome Azure DevOps"
description: ""
date: 2018-09-11T16:00:37+02:00
draft: false
tags: [Azure,Azure Devops]
categories: [Visual Studio ALM]
---
 **Yesterday Microsoft announced a change in naming for VSTS, now branded as Azure DevOps.** You can read most of the details in [this blog post](https://azure.microsoft.com/en-us/blog/introducing-azure-devops/) and if you are using VSTS right now you will not have a big impact in the future. Event is this is just a rebranding of the service, there are a couple of suggestion I’d like to give you to have a smoother transition.

> Visual  Studio Team Services was rebranded in Azure DevOps, this will not impact your existing VSTS projects, but it is wise to start planning for a smooth transition.

First of all, if you still don’t use the new navigation, I strongly suggests to enable it, because  **it will become the default navigation in the future** ,  **and it is best to gain familiarity with it, before it will become the only UI available.** [![SNAGHTML63aa86](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/SNAGHTML63aa86_thumb.png "SNAGHTML63aa86")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/SNAGHTML63aa86.png)

 ***Figure 1***: *Enable the new navigation for the account*

 **The nice aspect is that you can enable new navigation only for your account, then enable for all accounts in the instance**. This will make the transition smoother, you can find key member of your teams that wants to try new features, let them explore it and after some time let everyone use the new interface, knowing that at least some core members of the team are well used to it. Planning for a smooth transition instead of having big bang day when everyone can only use the new UI it is a wise approach.

Another suggestion is  **starting to use the new links right now** , if your account is [https://nablasoft.visualstudio.com](https://nablasoft.visualstudio.com), your new URI will be [https://dev.azure.com/nablasoft](https://dev.azure.com/nablasoft "https://dev.azure.com/nablasoft")  **and it is already available for all of your account** s. You can expect that the old URI will work for a really long time, but it is better starting to use the new URI as soon as possible, to avoid having link in the old format that maybe will cease to work some years from now.

 **Another part of the service that is affected by change of uri is remote address of git repositories**. Microsoft assures that the old url will remain valid for a long time, but it is good to spend 1 minute updating remotes to never worrying that some day in the future remotes uri can break.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/image.png)

 ***Figure 2***: *Change the url of origin to adapt to the new uri of Azure DevOps Repositories.*

>  **Updating git remote address is a good practice to immediately start using the new and official link.** **Thanks to git, the only thing you need to do is grab the new link using the new UI, and use the command *git remote set-url origin newlink* to update uri of the remote to the new one**, and you can continue work as ever (the first time you will be prompted by a login because you never authenticated git to dev.azure.com domain).

Happy VSTS oops :) Happy Azure Devops

Gian Maria.
