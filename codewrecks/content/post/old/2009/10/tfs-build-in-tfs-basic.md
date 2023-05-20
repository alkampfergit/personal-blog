---
title: "Tfs Build in Tfs basic"
description: ""
date: 2009-10-26T10:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
In [this post](http://www.codewrecks.com/blog/index.php/2009/10/24/installing-tfs2010-beta2-first-try/) I dealt with the easy of installation of tfs basic. But tfs basic is much more than simply source control, if you open the TFS Administration Console, you can configure Team Build (Suppose you have installed it as I showed in previous post).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image20.png)

Even in this wizard you can immediately see some warning

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image21.png)

The wizard is telling you that you should not install TFS Build on the same machine of Team Foundation Server, this because building projects can impact performances. Another reason for not installing TFS build is on machine with very important and sensitive data, since the tfs build can execute arbitrary code (Custom msbuild action as example). The only configuration we need to specify is the Team project collection that the build machine must build,

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image22.png)

Pressing Browse we are presented with a list of configured TFS, if our server is not listed, press *Servers* button and add the server that contains the Team Project Collection you want to build. In this dialog remember to specify the machine name of the TFS, and not IP Address, because with IP Address the installer can fail to configure the service.

Once you have choosed the collection, the wizard tells you how many other build controllers are configured for it.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image23.png)

Then you are asked to specify the number of build agent, this setting is important, because if you have a multicore machine you can configure a number of build agents equals to the number of core. Finally you need to specify the user credential to install the build service. It is good practice not to use administrator account, the best option is to create a specific user

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image24.png)

In this example I created a TfsBuildAgent account, I've installed tfs outside a domain, so tfsBuildAgent is a simple windows user. If you press *Test* the wizard verifies that everything is ok. Now you can press *configure* and your build server is configured, simple isn't it?

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
