---
title: "Hosting a WCF service based on MSMQ in IIS7"
description: ""
date: 2009-03-17T07:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Today I had a strange problem, I needed to host a MSMQ service in IIS7, I followed the instruction on [this post](http://dotnet.dzone.com/news/msmq-wcf-and-iis-getting-them-). Everything worked ok, I pumped some messages on the queue and the service received them with no problemâ€¦.at least initially. After a bit of time of inactivity, the server stopped to read message from the queue and I have no clue of what is happening. Messages are stored in the queue, but they never got processed.

Then I try to browse the service, calling the.svc file with Internet explorer, I verified that the service is up and *then the queue gets consumed again*. The problem was due to this specific scenario: after some minutes of inactivity the Worker process gets recycled, and the service gets no started again, until you browse to the.svc file. The act of browsing forces IIS to restart wcf host and service goes up and running again.

This problem is due to a bad configuration of a specific service called  **netmsmq activator**. This service peeks queues of the system, and if he find that a queue has messages, inform IIS to restart application if needed. If something is configured wrong, when the worker process gets recycled the service stops to read data from queue. To verify that everything works correctly you need to check these:

1. The service named net.msmq activator should be up and running
2. Check the user used to run the account of the point 1 (usually is the network service). That user must have permission to peek the queue. If it has no permission it cannot know if the queue has message
3. In workgroup environment I need to give to the queue the same name of the service.

Point 3 was the one that make me crazy, I used to test the service with the WcfServiceHost and used a queue with a name like  **MyQueue**. To host the queue in IIS I created a virtual application on default site, named it MyService and inserted a MyQueueService.svc file to host the service, then I point configuration file on MyQueue queue and everything works except the activator. I needed to change the name of the queue to  **MyService/MyQueueService.svc** , the same name I used to host the service in IIS(clearly I needed to change configuration on both clients and server), now everything works perfectly.

alk.

Tags: [.NET Framework](http://technorati.com/tag/.NET%20Framework) [MSMQ](http://technorati.com/tag/MSMQ) [WCF](http://technorati.com/tag/WCF) [WAS](http://technorati.com/tag/WAS)
