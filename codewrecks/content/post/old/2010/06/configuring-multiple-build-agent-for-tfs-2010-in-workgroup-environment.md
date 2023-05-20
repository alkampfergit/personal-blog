---
title: "Configuring multiple build agent for TFS 2010 in workgroup environment"
description: ""
date: 2010-06-12T07:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Tfs]
---
Even if you are in workgroup environment, without a domain, you can distribute your build agent in different machines. The key to achieve this is shadow accounts. I've installed as an example a build controller in the tfs machine, then I created an agent, and everything runs as BuildAgent account, created in the Tfs Server and added to the *Project collection Build Service account*.

The next step is creating a user called BuildAgent with the same password of the Tfs Server in another machine, suppose a Windows 7 one. Then I log into the Windows 7 machine as Administrator, install Tfs Build and proceed to configuration. When it is time to choose the project collection it asks for credentials, and you should login as BuildAgent, choose the ProjectCollection and then proceed on.

[![tfs_build_1](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/tfs_build_1_thumb.png "tfs_build_1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/tfs_build_1.png)

In the next screen you are asked if you want to scale out an existing build controller adding agents to it.

[![tfs_build_2](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/tfs_build_2_thumb.png "tfs_build_2")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/tfs_build_2.png)

When it is time to choose the user for the build service, simply specify the BuildAgent created in the first step. Since an identical user exists on the tfs machine, it is allowed to access TFS and building projects.

[![tfs_build_3](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/tfs_build_3_thumb.png "tfs_build_3")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/tfs_build_3.png)

Finally you can verify that the agent is configured correctly.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image19.png)

As you can see in the machine there is an agent configured for machine win-y4onzs094UP that is the tfs basic test machine I used for demo purpose. If you manage the build controller from Visual STudio Team Explorer you can verify that now you have two build agents to use

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image20.png)

Even without a domain tfs build environment is really flexible and scalable.

alk.
