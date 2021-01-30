---
title: "Set new Azure DevOps url for your account"
description: ""
date: 2018-11-20T08:00:37+02:00
draft: false
tags: [Azure Devops]
categories: [Azure DevOps]
---
Due to switching from the old url format organization.visualstudio.com to dev.azure.com/organization it  **is a good practice to start transition to the new url as soon as possible**. The old url will continue to function for a long time, but the new official domain is going to become the default.

Every user can still use both the new or old domain name, but there is a settings in the general setting page of the account that globally enable the new url.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-7.png)

 ***Figure 1***: *New url format enabled in global settings.*

Actually there are small parts of the site that does not work perfectly if you browse Azure DevOps with the url not configured in that settings.  **This is often due to security restriction especially for Cross Site Origin**. As an example I got problem with the new url in the release page, because some of the script will be still served with organization.visualstudio.com and they got blocked due to CORS

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/11/image-8.png)

 ***Figure 2***: *Cross origin request blocked due to security plugin.*

This will prevent me to correctly use the new address. After you switch to the new url with the settings shown in  ***Figure 1***: The problem is gone.

This setting will also made a redirect to the new url, whenever one is typing organization.visualstudio.com they will be redirected to the new url, thus enforcing the usage of the new url automatically.

Gian Maria.
