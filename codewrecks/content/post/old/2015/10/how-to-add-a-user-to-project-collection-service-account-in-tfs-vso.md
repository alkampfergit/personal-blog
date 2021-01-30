---
title: "How to add a user to Project Collection Service Account in TFS  VSO"
description: ""
date: 2015-10-07T15:00:37+02:00
draft: false
tags: [Security]
categories: [Team Foundation Server]
---
VSO and TFS have a special group called:  **Project Collection Service Account that has really powerful permission, and usually no user should be part of that group.** There are specific circumstances, like running TFS Integration platform to move code to TFS, where the account used to access VSO needs to be part of this group to temporary have special permission.

Sadly enough, **the UI does not allow you to directly add a user to that group** , because the add button is disabled if you select that group.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image4.png)

 ***Figure 1***: *You cannot add users or group to Project Collection Service Account Users directly from the ui.*

 **The reason behind this decition is security, adding a user to this group is not part of everyday operation** , users in that groups has really powerful permissions and you should add users to Service Accounts only in really specific situations and only when really required. This is the reason why you need to resort to Command Line.

{{< highlight bash "linenos=table,linenostart=1" >}}


tfssecurity /g+ "Project Collection Service Accounts" alkampfer@nablasoft.com /collection:https://gianmariaricci.visualstudio.com/DefaultCollection


{{< / highlight >}}

 **TfsSecurity.Exe command line utility can add whatever users to whatever group, bypassing limitation in the UI**. Remember than to remove the user from that group when he does not need anymore special permission; the commandline is the same as previous one just change /g+ to /g-

> As a rule of  thumb, users should only be added to Service Account group only if strictly required, and removed from that group immediately after the specific need ceased to exist.

In older version of VSO / TFS you could obtain the same result without command line in the UI. You just selected the user you want to add to Service Group, then go to the  **member of** section and then, pressing plus button, add the user to the group, but this is actually disabled in actual version.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image5.png)

 ***Figure 2***: *You cannot add anymore a user directly to a group.*

If you really want to avoid command line,  **you can still use the UI. Just create a standard TFS Group and then add the group to the Project Collection Service Accounts**. First step: create a group with a Really Explicit Name.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image6.png)

 ***Figure 3***: *This group has a specific name that immediately tells to the reader that it is a special group.*

Once the group is created, you can simply add it to the Project Collection Service Account group with few click.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image7.png)

 ***Figure 4***: *Add new group to the Project Collection Service Accounts group*

Now you can simply add and remove users to the “WARN – Service Account Users” group from the UI when you need to grant or remove Service Account Permission.

Gian Maria Ricci.
