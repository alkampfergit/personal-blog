---
title: "Using PAT to authenticate your tools"
description: ""
date: 2016-10-15T08:00:37+02:00
draft: false
tags: [Security,VSTS]
categories: [Tfs]
---
 **One of the strength point of VSTS / TFS is the extensibility through API** , and now that we have a really nice set of REST API, it is quite normal to write little tools that interacts with your VSTS / TFS instances.

 **Whenever you write tools that interact with VSTS / TFS you need to decide how to authenticate to the server.** While for TFS is quite simple because you can simply run the tool with Active Directory user and use AD integration, in VSTS integrating with your AD requires more work and it is not always a feasible solution.

> Actually the best alternative is to use Personal Access Tokens to access your server even if you are using TFS and you could use AD authentication.

## PAT acts on behalf of a real user

You can generate Personal Access Token from security section of your user profile, and this gives you immediately idea that the token is related to a specific account.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-11.png)

 ***Figure 1***: *Accessing security information for your profile*

From *Personal access tokens* section of your profile you can generate tokens to  **access server on behalf of your user.** This means that the token cannot have more rights that your user have. This is interesting because if you revoke access to a user, all PATs related to that user are automatically disabled, also, whatever restriction you assign to the user (ex deny access to some code path), it is inerently applied to the token.

## PAT expires in time

You can see from  **point 1 of Figure 2** that the PAT has an expiration (maximum value is 1 year) and this imply that  **you have no risk of forgetting some tool authenticated somewhere during years.** [![This image shows how to create a PAT, and point out that the token expires, is bound to a specific account and you can restrict permission of the PAT to given area.](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image_thumb-12.png "PAT Creation page in VSTS")](https://www.codewrecks.com/blog/wp-content/uploads/2016/10/image-12.png)

 ***Figure 2***: *PAT Creation page in VSTS*

A tipical security problem happens when you create in your TFS / VSTS a user to run tools, such as TFSTool or similar one. Then you use that user in every tool that need to do unattended access your TFS instance and after some years you have no idea how many tools are deployed that have access to your server.

 **Thanks to PAT you can create a different PAT for each tool that need to unattendely authenticate to your server** , after one year maximum the tool will lose authentication and it need to have a new Token. This will automatically prevent  the risk of having old tools that after year still have access to your data even if they are not actively used anymore.

For VSTS (point 2) you should also specify the account that the PAT is able to access if your user have rights to access more than one account.

## PAT Scope can be reduced

In Figure 2 the point 3 highlight that  **you can restrict permission of PAT based on TFS / VSTS area**. If your tool need to manipulate work items and does not need to access code or other area of TFS, it is a best practice to create the token and give access only to Work Items. This means that, even if the user can read and write code, the token can have access only to Work Item.

Another really important aspect is that  **many areas have the option to specify access in read-only mode.** As an example, if your tool needs only to access Work Items to create some reports, you can give PAT only Work Item (read) access, so the tool will be able to access only Work Item in read-only way.

> The ability to reduce the surface of data that can be accessed by a PAT  is probably the number one reason to use PAT instead of  AD authentication for on-premise TFS.

## 

## PAT can be revoked

 **Any PAT can be revoked any time with a single click**. This means that if you use the pattern of *one PAT for each tool* you can selectively revoke authentication to any tool revoking associated PAT. This capability is really interesting for on-premise TFS, because if you want to selectively revoke access to specific tool without PAT, you need to use a different user for each different tool and disable that specific user.

## Conclusion

Using PAT is not only useful if you want to create token used by tools that need to do an unattended authentication to the server, but you can use PAT even for tools that you use, if you want to be sure that the tool will not have access to certain part of your account (you can use a PAT that can only access code to use with Git tools), or if the tool does not support MSA or AAD authentication.
