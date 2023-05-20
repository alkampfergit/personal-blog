---
title: "Use credential manager to use TFS shell extension in a workgroup or outside a domain"
description: ""
date: 2011-03-09T14:00:37+02:00
draft: false
tags: [Tfs,Tfs Power Tools]
categories: [Tfs]
---
Yesterday I've blogged about TFS Power tools Shell Extension, and today my friend [Michele](http://dotnetcampania.org/blogs/michele/) told me that he has a problem, the extension always told him to Reconnect to server and he is not able to use them.

[![image_thumb\[2\]](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb2_thumb.png "image_thumb[2]")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb21.png)

This is probably due to an authentication request, so you can try to open Team Explorer, and if it asks for credential on connecting to TFS this is the reason. Shell extension are not able to ask for different user, so if you are outside the TFS domain or if you are in workgroup the only solution is going to Control Panel and fire the Credential Manager.

[![image_thumb\[5\]](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb5_thumb.png "image_thumb[5]")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb5.png)

Credential manager permits you to specify credential to use with computer around the network, so you can simply choose to *Add a Windows Credential*

[![image_thumb\[8\]](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb8_thumb.png "image_thumb[8]")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb8.png)

Now insert the credential using domain\username as the user name, if you are in workgroup you should use machinename\username, where machinename is the name of the machine running tfs.

[![image_thumb\[11\]](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb11_thumb.png "image_thumb[11]")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb11.png)

This is my configuration for a test machine in my network.

[![image_thumb\[14\]](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb14_thumb.png "image_thumb[14]")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb14.png)

Now open team explorer again, this time it should not ask for credential, if it still asks you for credentials probably you have entered them wrong in the Credential Manager. Once everything works, try to reconnect from the shell extension, wait a little bit and everything should work.

Alk.
