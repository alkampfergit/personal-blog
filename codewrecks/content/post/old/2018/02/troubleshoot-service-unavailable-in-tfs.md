---
title: "Troubleshoot ldquoservice unavailablerdquo in TFS"
description: ""
date: 2018-02-26T18:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
Yesterday I’ve started an old virtual machine with an old version of TFS and when I try to access the instance I got a “Service Unavailable” error.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-6.png)

 ***Figure 1***: *General Service Unavailable error for TFS Web interface*

This error happens most of the time if you have wrong user credentials in the worker process used by IIS to run the TFS Application. To verify this assumption, you can simply  **open IIS Manager console and verify the status of the worker process** that is used to run IIS ( **Figure 2** )

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-7.png)

 ***Figure 2***: *The application pool in IIS is stopped.*

As you can verify from  **Figure 2,** the IIS app pool used to run service is stopped, if I tried to start again the pool, it immediately stopped again. This is usually the symptom of  bad authentication, this means that the pool is running with wrong user credentials. You can verify this in Event Viewer log, but  **absolutely avoid messing with the setting of the Application Pools directly,** this is a task that should be demanded to the administration console.

> As a general rule, you should never manually edit the configuration used for TFS in your IIS instance, everything should be done through the correct command

To fix this error open the Admin console and verify the Service Account used to run your TFS Instance

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-8.png)

 ***Figure 3***: *Application tier configuration, you can view Service Account user.*

You can run Service Account with standard NETWORK SERVICE account, but **I prefer using specific domain account, because I have more control on how all TFS Services will authenticate on the other machine of the domain.** I changed the password of that account a couple of month ago, but that specific VM was never updated with the new credentials.

 **This is something that can happens in a domain, especially if you care about security and you force every account to change password every certain number of months**. In this scenario my TFS instance cannot start again because it was still configured with the old password, but you can fix it with a couple of clicks.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-9.png)

 ***Figure 4***: *Reapplying account can save your days when password of service user account of TFS was changed.*

If you look in  **figure 4** , the solution is really simple, because the Reapply Account command gives you the ability to re-enter the new password for the account, use the test function to verify that it is correct and once you press OK, the administration console takes care of everything.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-10.png)

 ***Figure 5***: *Result of re-applying the account.*

As you can see in Figure 5, the account is used not only in the application Tier, but also for Message Queue, TFSJobAgent and so on. This is the reason why I warned you not to fix the credential in IIS manually, doing this does not fix every place where wrong authentication are used.

Everything was green now green in the console, so I immediately tried to access the instance again, to verify that indeed everything is up and running again.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-11.png)

 ***Figure 6***: *Everything is up and running again.*

Gian Maria.
