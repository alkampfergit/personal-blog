---
title: "Completely remove Lab Management configuration in TFS"
description: ""
date: 2015-09-04T15:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Team Foundation Server]
---
If you want to  **completely remove Lab Management configuration from your TFS instance, you probably know** [**TfsConfig lab /Delete**](https://msdn.microsoft.com/en-us/library/Ee712732.aspx) **command, used to remove association between one Project Collection and SCVMM**. The reasons behind the need to completely remove Lab Management configuration could be various, one of the most common is: you created a cloned copy of your TFS environment for testing purpose, and you want to be 100% sure that your cloned instance does not contact SCVMM, or you can simply have multiple Test TFS Instance and you need to move lab management from one instance to another.

[![Actual configuration, with PreviewCollection with Lab Management features enabled.](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb.png "Actual configuration")](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image.png)

 ***Figure 1***: *PreviewCollection has Lab Management configured.*

In the above picture you can see that my PreviewCollection has Lab Management feature enabled, so I can simply run the command *TfsConfig lab /Delete /CollectionName:PreviewCollection* to remove this association.

[![TfsConfig lab /delete command in action](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb1.png "TfsConfig lab /delete command in action")](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image1.png)

 ***Figure 2***: *TfsConfig command in action.*

When command completes you can verify that the collection has not Lab Management feature enabled anymore.

[![Project collection now have lab management feature disabled](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb2.png "project collection with lab management feature disabled.")](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image2.png)

 ***Figure 3***: *PreviewCollection now has Lab Management feature disabled.*

After running that command for all your Lab Management enabled Team Project Collections  **you can be disappointed because you still see SCVMM host configured in TFS Console**.

[![Even if none of the team projection collection is configure, scvmm host is still listed](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb3.png "Scvmm host is still listed")](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image3.png)

 ***Figure 4***: *Even if none of the team projection collection is configure, scvmm host is still listed*

This is usually not a big problem, but if you want to be 100% sure that your TFS installation does not maintain any connection to the SCVMM instance used to manage your Lab,  **you can use a simple PowerShell script you can find on this** [**Blog Post**](http://blogs.msdn.com/b/tfssetup/archive/2013/12/20/removing-lab-management-information-from-tfs-2010.aspx). That post is related to TFS 2010, but the script it is still valid for newer TFS releases. To write this blog post I’ve used a TFS 2015 instance and everything went good.

In that post you have an alternative solution of directly updating Tfs\_Configuration database, but I strongly discourage you to use that solution because you can end with a broken installation. Never manipulate Tfs databases  directly.

[![Lab Management is completely removed from your TFS instance](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb4.png "Final result")](https://www.codewrecks.com/blog/wp-content/uploads/2015/09/image4.png)

 ***Figure 5***: *Lab Management is completely removed from your TFS instance*

 **Now lab management configuration is completely removed from your TFS instance.** Gian Maria.
