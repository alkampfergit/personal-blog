---
title: "Upgrade your agents and instances with Mms"
description: ""
date: 2014-11-21T14:00:37+02:00
draft: false
tags: [mms,Mongo]
categories: [NoSql]
---
Another big advantages of using MMS to manage your mongo deployments is the ability to  **automatic upgrade agents and instances**. For agents you can simply open the deployment area of a group and select edit mode. If some agent is outdated, the interface will immediately warn you with an alert on the top of the page as you can see in  **Figure 1**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image8.png)

 ***Figure 1***: *Mms is telling you that agents are out of date*

If you choose to upgrade agents pressing the  **update** link at the top of the pages, you should see some unpublished changes appears in the Ui.

[![SNAGHTML167b66d](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/SNAGHTML167b66d_thumb.png "SNAGHTML167b66d")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/SNAGHTML167b66d.png)

 ***Figure 2***: *Upgrading agents is a simple modification of the deploy* ** ** Remember that  **each modification you do through mms will be downloaded by all the agents and should be reviewed and confirmed for deploy**. Pressing Review & Deploy will show pending operations:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image9.png)

 ***Figure 3***: *Pending modification to deploy*

When you press confirm and deploy, mms will confirm all modifications and the next time that the agents will poll the site, the new deploy instructions will be downloaded and applied from the various automation agents.

Upgrading automation and monitoring agents is not the only upgrade you can do from the web interface,  **the real killer feature is  upgrading the version of mongo that your instances are running**. In  **Figure 4** you can see that mongo mms shows my current version as red, because is not the latest one available.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image10.png)

 ***Figure 4***: *Mms interfaces shows mongo version in red because is not the latest one available.*

If you come back to edit mode you can edit any monitored instance, in this example I want to edit configuration for the entire replica set, upgrading mongo to the latest version.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image11.png)

 ***Figure 5***: *In edit mode you can change configuration of your mongo deployment*

Now you can simply  **edit the configuration and choose whatever version you like to install**. You can install newer version, but you can also install older version if you want to rollback your environment to previous version.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image12.png)

 ***Figure 6***: *Editing of configuration of your replica set.*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image13.png)

 ***Figure 7***: *From edit panel you can change version to whatever version you like.*

Once you have done your changes and pressed Apply button, you should review your modification and confirm as for agent upgrade.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image14.png)

 ***Figure 8***: *Changes of your replica set ready to be deployed, version will be upgraded from 2.6.2 to 2.6.5*

As usual mms interface starts showing what is happening to your machines, in  **Figure 9** you can verify that the three machines of the replica set are downloading the new version of mongo.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image15.png)

 ***Figure 9***: *Environment is upgrading to new version*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image16.png)

 ***Figure 10***: *Not all the machine have same speed, rs1-red is already in goal state, while the other are still installing new version*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/11/image17.png)

 ***Figure 11***: *Replica set was upgraded to latest version, primary has changed*

After a little bit, all of your machines are upgraded to the latest version. Thanks to Mongo MMS you can manage upgrade or downgrade of your instances with few mouse clicks, because automation agents will take care of all operations needed to upgrade your servers.

Gian Maria.
