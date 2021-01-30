---
title: "Migrating from TFS On Premise to TF Service With Integration Platform some advices"
description: ""
date: 2013-01-21T20:00:37+02:00
draft: false
tags: [Visual Studio ALM]
categories: [Team Foundation Server]
---
When it is time to migrate from an On Premise version of TFS to TF Service ( [http://tfs.visualstudio.com](http://tfs.visualstudio.com) )  **actually** [**Integration Platform**](http://visualstudiogallery.msdn.microsoft.com/eb77e739-c98c-4e36-9ead-fa115b27fefe) **is the only viable solution**. I just want to give you a couple of hint to avoid problem in the migration. The account you are using to perform the migration should be in the Team Project Collection Service account because it need special permissions. Suppose you are using the Brian Keller’s Virtual Machine, you decide to perform the migration with Adam Barr,  **you need to be sure that the user is part of the Team Project Collection Service account** Unfortunately when is time to add a user in that group, you will find that the UI does not allow you to do this, so you need to add the group to the user, not the user to the group, here is the sequence of operations that accomplish this operation.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image.png)

 ***Figure 1***: *Administer the security of the project collection that contains the Team Project you want to migrate.*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image1.png)

 ***Figure 2***: *Go to  **Users tab** , choose the user you are using for the migration  **and click Member Of** , then you can press  **Join Group** *

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image2.png)

 ***Figure 3***: *You can now  **add Adam Barr to the Project Collection Service Accounts** *

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image3.png)

 ***Figure 4***: *The user is now in the Team foundation Service Accounts group*

Now when it is time to perform the migration, the account you will use to connect to the destination TF Service should be also in the Service account, you can  **just follow the same instructions of Figure 1-4 to add your current user of TF Service to Team Collection Service Accounts** in your TF Service account.

[![SNAGHTML6a8e9a](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/SNAGHTML6a8e9a_thumb.png "SNAGHTML6a8e9a")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/SNAGHTML6a8e9a.png)

 ***Figure 6***: *My account of TF Service was added temporary to the Project Collection Service Accounts in my TF Service instance*

If you want to perform a one way migration you can configure it as usual, just a suggestion, since the destination Team Project surely contains the folder BuildProcessTemplates, map all the toplevel folder one by one, this will avoid a conflict in the BuildProcessTemplates when you run the migration. (this is a simple stuff because usually you have only two or three top level folder: trunk/main, branches, releases)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image5.png)

 ***Figure 7***: *You can now map all the folders one by one, avoiding the BuildProcessTemplates*

Now you should be able to run your migration without any conflict and any problems.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/01/image6.png)

 ***Figure 7***: *Migration in progress*

Even if you do not create any user map, all your Work Items and your code should be now correctly migrated to TF Service.

 **DO NOT FORGET TO REMOVE THE TWO ACCOUNT USED FROM THE TEAM PROJECT COLLECTION SERVICE ACCOUNT AFTER THE MIGRATION IS FINISHED!!!** Gian Maria.
