---
title: "Upgrading ReplicaSet with MMS"
description: ""
date: 2015-02-07T10:00:37+02:00
draft: false
tags: [mms,Mongo]
categories: [NoSql]
---
My RS of three mongo instances is running mongo 2.6.6 and now I want to upgrade to the latest version. Thanks to [mms](https://mms.mongodb.com)  **I can simply start the upgrade process directly from a web page, without needing to have an access to my real servers**. The real good stuff is that the upgrade process is completely managed by mms for me, and the upgrade is done without stopping my Replica Set.

Since this is a test/dev environment running in my home server, my bandwidth is not so high and it is not unfrequent that one of the node finished downloading latest mongo version before the others. **The nice stuff is that mms takes care of everything, and starts upgrade my secondary instances**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/02/image.png)

 ***Figure 1***: *One of the server is upgrading, while the others are still running old version.*

The super-nice feature is that one of the server upgraded to the new version, the others still are running the old version, and the Replica-Set version is mixed because I have node with different versions. I can connect to it with robomongo and workd as usual.  At a certain moment the primary node is upgraded, now we are in a state where we have only secondary nodes, in this moment users cannot write to Replica Set:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/02/image1.png)

 ***Figure 2***: *Status is 2, indicating that that a member in secondary is replicating, now all node are SECONDARY*

As soon as the primary node starts the new mongo process with the new version, replica set is fully operative again. The downtime is really small and you upgraded everything with few clicks, letting mms agents take care of everything.

Gian Maria.
