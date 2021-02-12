---
title: "Lab management TF267042 and dns configuration"
description: ""
date: 2010-06-15T11:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Lab Management]
---
Today I configured an environment in lab management, when it finishes the deploy phase I see that the machine has testing capabilities *Error* and the details of the error is

[![Capture](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/Capture_thumb.png "Capture")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/Capture.png)

The real error is the [TF267055](http://blogs.msdn.com/b/lab_management/archive/2009/10/26/troubleshooting.aspx#e3_10)

he machine is not ready to run tests because of the following error: Unable to connect to the controller on labrtmhost.tfslab.nablasoft.com:6901′. Reason: A connection attempt failed because the connected party did not properly respond after a period of timeâ€¦â€¦ host has failed to respond 10.0.0.110:6901

This is the configuration of this test machine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb30.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image30.png)

Physical machine has a wirless in 10.0.0.110 IP, that communicates with my office network, then it has the 10.10.1.3 ip on a Internal Virtual Network of Hyper-V where the lab manager environment is running. Since the error states that the agent is trying to contact the controller on 10.0.0.110 ip it is clear that configuration fails, because the lab machine has only the ip 10.10.1.100 and has no way to connect to the 10.0.0.x network.

If I connect to the lab Machine and did a ping labrtmhost  I got a correct answer from the ip 10.10.1.3, but the problem happened during configuration of test controller. To solve this problem first of all you need to check the Active Directory DNS, and I verified that for labrtmhost machine both ip are recorded. Since the Active Directory is active only on the 10.10.1.x subnetwork there is no need to have other ip registered, so I deleted from the dns. This is not enough, because I needed to go to labrtmhost, open the configuration of the wireless network card (the one with 10.0.0.110 ip) and prevent it to register ip into the dns.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb31.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image31.png)

Then I verified that from all machine in the network if I try to resolve labrtmhost with nslookup it gives me only the address 10.10.1.3. Now I reopened the *TEst Controller Configuration Tool* and configured again the test controller from the labrtmhost machine, this time it got registered in tfs with the correct Ip. Now I repair testing capabilities on the lab management deployed machine and everything is now ok.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb32.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image32.png)

So, wenever you got a [TF267055](http://blogs.msdn.com/b/lab_management/archive/2009/10/26/troubleshooting.aspx#e3_10) error, always check the dns and dns registration and verify that the test controller is registered with the correct ip.

Alk.
