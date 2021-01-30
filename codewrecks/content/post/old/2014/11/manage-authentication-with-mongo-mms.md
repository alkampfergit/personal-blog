---
title: "Manage authentication with Mongo MMS"
description: ""
date: 2014-11-20T18:00:37+02:00
draft: false
tags: [mms,MongoDb]
categories: [NoSql]
---
In an [old post](http://www.codewrecks.com/blog/index.php/2014/11/01/deploy-mongo-easily-with-mms/) I’ve shown how to easily deploy mongo thanks to [MMS online services](https://mms.mongodb.com).  **Mms is not only useful to deploy mongo instances, but it is exceptional also for monitoring and configuring**. One of the most interesting features is managing users easily from mms web interface. Suppose you had installed mongo on an Azure Virtual Machine and you do not want everyone being able to access your instance. A possible solution is enabling authentication.

Thanks to mms you can simply go to Deployment / Authentication & Users and enable authentication. With the green Add User button you can add how many user you want and you can give them permission using roles.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image6.png)

 ***Figure 1***: *Manage mongodb users through mms web interface.*

 **Once everything is configured, mms will deploy changes to all of your instances that belong to the same group** , so every database shares the same sets of users. Wait a little bit and then try to authenticate to your instance, ex with robomongo.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image7.png)

 ***Figure 2***: *Test auth from Robomongo*

Et voilà, with few clicks you have now authentication enabled on your mongo databases of that group, it could not be easier than this :).

Gian Maria.
