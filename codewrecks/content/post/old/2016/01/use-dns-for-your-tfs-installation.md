---
title: "Use DNS for your TFS installation"
description: ""
date: 2016-01-14T18:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
When installing TFS one of the most important and often most forgotten step is  **using DNS to give TFS Friendly names**. The procedure is described in this [old post](http://www.edsquared.com/2011/01/03/Using+Friendly+DNS+Names+In+Your+TFS+Environment.aspx) by Ed Blankenship and details all the operations you need to do to use friendly DNS entries for all of machines included in a standard TFS Installation.

 **Using a DNS friendly name bring a lot of advantages** , but essentially it is necessary to mitigate the work needed if you need to migrate TFS to a new hardware / machine.

Instead of accessing your favorite TFS instance with [http://machinename:8080/tfs/projectcollection](http://machinename:8080/tfs/projectcollection) you simply create an alias in your DNS to access TFS to [http://tfs.yourcompany.local:8080/tfs/defaultcollection](http://tfs.yourcompany.local:8080/tfs/defaultcollection).  **With such a simple change you can move TFS to a new machine and the client will not notice anything (at most they will need to refresh cache)**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image3.png)

 ***Figure 1***: *DNS alias for the Application Tier in action*

 **It is also advisable to use DNS even for the Data Tier and even if the Data Tier is installed in the same machine of the Application Tier** (Single server installation). This will mitigate the work needed if you decide in the future to move Data Tier to a different machine. In a simple installation I have on my test domain I have those alias defined for my Main TFS Instance.

{{< highlight bash "linenos=table,linenostart=1" >}}


tfs.cyberpunk.local: the machine where TFS is installed
data.tfs.cyberpunk.local: the machine where the Sql Server used by TFS is installed
warehouse.tfs.cyberpunk.local: the machine with the Sql Server Analysis Service
reports.tfs.cyberpunk.local: the machine with Sql Server Reporting services installed

{{< / highlight >}}

Thanks to these aliases I configured my  Data Tier using DNS friendly names.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image4.png)

 ***Figure 2***: *Configuration for Data Tier is also done with friendly DNS names*

Even for the Reporting configuration I decided to use DNS aliases.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image5.png)

 ***Figure 3***: *Reporting configuration in TFS also uses friendly DNS names*

> Using friendly DNS name will greatly simplify changing topology of your TFS installation in the future

In my scenario all those 4 DNS entries are simple ALIAS to the very same machine, but if I will decide to split to a Two Machine installation or I decided to move to different hardware / Virtual machine, all the users and all the configurations will remain the very same, because I can simply change the DNS ALIAS to point to the new server.

 **There are also other part of TFS that will benefict of friendly names, one of the most notably examples is the Drop Folder for your build**. Instead of using the name of the machine or the NAS as drop location (something like [\\nas2\tfs\drops](//\\nas2\tfs\drops)) use a name like [\\drops.tfs.cyberpunk.local\\drops\\etcetc](//\\drops.tfs.cyberpunk.local\\drops\\etcetc). Sometimes, years after years, builds number will increase and you need to move drop folder on a bigger network share or into a different NAS. If you do not have friendly names, all of your old builds result will point to the old incorrect location and this is super-annoying.

The very same rules apply to symbol share and in general to any address you use in any TFS configuration (build, release, etc). Once you setup a friendly name with DNS you are not bound to the physical name of the machine and you will have a easier time changing TFS topology in the future.

> If you still have your TFS not configured with DNS Friendly names, please fix the situation as soon as possible, because it will be a great gain in the future.

Gian Maria.
