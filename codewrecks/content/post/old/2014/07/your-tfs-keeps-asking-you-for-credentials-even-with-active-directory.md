---
title: "Your TFS keeps asking you for credentials even with Active Directory"
description: ""
date: 2014-07-21T16:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
Sometimes, even if you are logged in as a domain user that has all the rights to access TFS,  **when you navigate to TFS you are prompted for password every time**. You simply re-enter your credentials and you access TFS, but each time you close and reopen the browser you need to manually reenter credentials. This problem happens because the browser does not understand that the url of TFS belongs to Intranet Sites and it does not send AD credentials for authenticating. Before resorting to manually handle authentication with Credential Manager to each client computer, consider fixing this once for all with Group Policy.

If you look at internet security Settings in your Internet Explorer, the  **default settings is having automatic logon enabled only in Intranet Zone**. If the url of your TFS is not recognized as belonging to Local Intranet, credentials are not sent and you will be prompted for password.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image13.png)

 ***Figure 1***: *Intranet zone is allowed for automatic logon.*

A simple solution is manually adding TFS url to the list of Intranet Site, but this is a manual operation that must be done for each computer. It is really better to  **propagate the list of url belonging to Intranet Site through Active Directory with Group Policies**. This will permits you to specify all the urls that should be considered Intranet (and/or trusted) in a central place and have this setting propagate applying the policy to the right Organizational Unit or to entire domain.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image14.png)

 ***Figure 2***: *Set list of intranet sites through AD Policies*

The exact path of this setting is represented in  ***Figure 3***: [![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image15.png)

 ***Figure 3***: *Path of the setting where you find the “Site to Zone Assignment List”*

The drawback of this approach is that people are not able anymore to change the list of sites, because now it is managed by the policy overriding local settings. But the net effect is that now every computer that has this policy applied can access TFS without re-entering the password each time.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image16.png)

 ***Figure 4***: *In computer belonging to the domain, the list of sites belonging to each area is now managed by AD Policy.*

Another option is using Policy option “Turn on automatic Detection of Intraned”, that enables each computer to guess if a site belongs to the intranet. This setting usually works good and it is less invasive for the user, but if it does not work, specifying the exact list is the best option you have.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image17.png)

 ***Figure 5***: *Automatic detection of zone in Intranet area*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image18.png)

 ***Figure 6***: *Automatic detection applied to a client computer.*

Gian Maria.
