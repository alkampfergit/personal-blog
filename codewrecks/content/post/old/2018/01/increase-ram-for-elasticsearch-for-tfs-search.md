---
title: "Increase RAM for ElasticSearch for TFS Search"
description: ""
date: 2018-01-20T11:00:37+02:00
draft: false
tags: [searching,Tfs]
categories: [Tfs]
---
If you are experiencing slow search in TFS with the new Search functionality based on ElasticSearch a typical suggestion is to give more RAM to the machine where ES is installed. Clearly you should use HQ or other tools to really pin down the root cause but  **most of the time the problem is not enough RAM, or slow disks**. The second cause can be easily solved moving data to an SSD disk, but giving more RAM to the machine, usually gives more space for OS File cache and can solve even the problem of slow disk.

> ElasticSearch greatly benefit from high amount of RAM, both for query cache and for operating system cache of Memory Mapped Files

There are really lots of resources in internet that explain perfectly how ElasticSearch uses memory and how you can fine tune memory usage, but I want to start with a  **quick suggestion for all people that absolutely does not know ES, because one typical mistake is giving to ES machine more RAM but leaving ES settings unaltered**.

Suppose I have my dedicated search machine with 4GB of RAM,  **the installation script of TFS configured ES instance to use a fixed memory HEAP of half of the available RAM**. This is the most typical settings that works well in most of the situations. Half the memory is dedicated to Java Heap and gives ES space for caching queries, while the other 2 GB of RAM will be used by operating system to cache File access and for standard OS processes.

Now suppose that the index is really big and the response time starts to be slow, so you decided to upgrade search machine to 16 GB of RAM. What happens to ES?

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/01/image_thumb-13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/01/image-13.png)

 ***Figure 1***: *Statistics on ES instance with HQ plugin shows that the instance is still using 2GB of heap.*

From  **Figure 1 y** ou can verify that ES is still using 2 GB of memory for the Heap, leaving 14 GB free for file system cache and OS. This is clearly not the perfect situation, because a better solution is to assign half the memory to java HEAP.

> ElasticSearch has a dedicated settings for JAVA Heap usage, do not forget to change that setting if you change the amount of RAM available to the machine.

The amount of HEAP memory that ES uses is ruled by the ES\_HEAP\_SIZE environment variable, so you can simply change the value to 8G if you want ES to use 8 GB of Heap memory.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/01/image_thumb-14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/01/image-14.png)

 ***Figure 2***: *Elastic search uses an environment variable to set the amount of memory devoted to HEAP*

But this is not enough,  **if you restart ElasticSearch windows service you will notice that ES still uses 1.9 GB of memory for the HEAP**. The reason is: when you install ES as service, the script that install and configure the service will take the variable from the environment variable and copy it to startup script. This means that even if you change the value, the service will use the old value.

To verify this assumption, just stop the ElasticSearch service, go to ES installation folder and manually starts ElasticSearch.bat. Once the engine started, check with HQ to verify that ES is really using use 8GB of ram ( **Figure 2** ).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/01/image_thumb-15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/01/image-15.png)

 ***Figure 3***: *ES now uses the correct amount of RAM.*

To solve this problem,  **open an administrator prompt in the bin directory of ElasticSearch, (you can find the location from the service as shown in** [**previous post**](http://www.codewrecks.com/blog/index.php/2018/01/09/monitor-tfs-search-data-usage/) **) and simply uninstall and reinstall the service**. First remove the service with the *service remove*command, then immediately reinstall again with the *service install*command. Now start the service and verify that ES is using correctly 8GB of RAM.

> When ElasticSearch is installed as a service, settings for Memory Heap Size are written to startup script, so you need to uninstall and reinstall the service again for ES\_HEAP\_SIZE to be taken in consideration

If you are interested in some more information about ES and RAM usage you can start reading some official article in ES site like: [https://www.elastic.co/guide/en/elasticsearch/guide/current/heap-sizing.html](https://www.elastic.co/guide/en/elasticsearch/guide/current/heap-sizing.html "https://www.elastic.co/guide/en/elasticsearch/guide/current/heap-sizing.html")

I finish with a simple tip, ES does not love virtual machine dynamic memory (it uses a Fixed HEAP size), thus it is better to give the machine a fixed amount of ram, and change HEAP size accordingly, instead of simply relying on Dynamic Memory.

Gian Maria.
