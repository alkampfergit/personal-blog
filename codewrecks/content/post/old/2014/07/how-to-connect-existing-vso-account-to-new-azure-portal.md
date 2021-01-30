---
title: "How to connect existing VSO Account to new azure portal"
description: ""
date: 2014-07-23T10:00:37+02:00
draft: false
tags: [Azure,VSO]
categories: [Team Foundation Server]
---
With the [new deploy of Visual Studio Online](http://www.visualstudio.com/news/2014-jul-21-vso) you can link your existing VSO accounts to your azure subscription so they will be available on new Azure portal [http://portal.azure.com](http://portal.azure.com). You just need to  **connect to standard management portal (** [**http://manage.windowsazure.com**](http://manage.windowsazure.com) **) and then add an existing VSO account to the list of available ones**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image21.png)

 ***Figure 1***: *Use the New button in azure portal to add existing VSO account to new azure portal.*

Your account is now connected to your azure account, now you should connect the account to your Azure Directory. This is not an automatic operation, you need to go to account details page and then ask to connect the account to your directory. After some time your account should be connected to Azure Directory

[![image_thumb8](https://www.codewrecks.com/blog/wp-content/uploads/2014/08/image_thumb8_thumb.png "image_thumb8")](https://www.codewrecks.com/blog/wp-content/uploads/2014/08/image_thumb8.png)

 ***Figure 2***: *Your VSO account is now connected to My Default Directory*

You should be now able to view your account in new portal [http://portal.azure.com](http://portal.azure.com)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/08/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/08/image.png)

 ***Figure 3***: *My existing VSO account is now available in the new azure portal.*

This is an important change for your account, because now all the users are taken from the Default Directory and existing users are not able to access anymore your service until you do not add them to your directory. This step is needed also to be able to connect to VSO with your corporate credentials, if your Azure Directory is synchronized with your Active Directory.

I strongy suggest you to read this fantastic post by Mitch Denny and also some interesting link to better understand how this works.

- [Federated identity in Visual Studio Online.](http://blog.mitchdenny.com/2014/05/23/federated-identity-in-visual-studio-online/)
- [Azure Active Directory Identity Fatigue](http://blog.mitchdenny.com/2011/08/10/identity-fatigue/)

Gian Maria
