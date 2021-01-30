---
title: "Manage Environment Variables during a TFS  VSTS Build"
description: ""
date: 2016-08-06T07:00:37+02:00
draft: false
tags: [build,Testing]
categories: [Team Foundation Server]
---
To avoid creating unnecessary build definition, it is  **a best practice to allow for parameter overriding in every task that can be executed from a build**. I’ve dealt on how to [parametrize tests](http://www.codewrecks.com/blog/index.php/2016/06/25/create-parametrized-test-to-allow-for-simpler-builds/) to use a different connection string when tests are executed during the build and I’ve used Environment variables for a lot of reasons.

Environment variables are not source controlled, this allows every developer to override settings in own machine without disturbing other developers. If I do not have a MongoDb in my machine I can simply choose to use some other instance in my network.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-16.png)

 ***Figure 1***: *Overriding settings with environment variables.*

Noone in the team is affected by this settings, and  **everyone has the freedom of changing this value to whatever he/she like**. This is important because you can have different version of MongoDb installed in your network, with various different configuration (MMapV1 or Wired Tiger) and you want the freedom to choose the instance you want to use.

Another interesting aspect of Environment variables, is that  **they can be set during a VSTS/TFS build directly from build definition**. This is possible because Variables defined for a build were set as environment variables when the build runs.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image.png)

 ***Figure 2***: *Specifing environment variables directly from Variables tab of a bulid*

If you allow this value to be allowed at Queue Time, you can set the value when you manually queue a build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image-1.png)

 ***Figure 3***: *Specifying variables value at Queue Time*

If you look at Figure 3, you can verify that I’m able to change the value at queue time, but also, I can simply press “Add variable” to add any variable, even if it is not included in build definition. In this specific situation I can trigger a build and have my tests run against a specific MongoDb instance.

Remember that the value specified in the build definition  **overrides any value that is set on environment variables on build machine.** This imply that, once you set a value in the Build definition, you are not able to change the value for a specific build agent.

It you want to be able to choose a different value for each build agent machine you can simply avoid setting the value on the Variables tab and instead define the variable on each build machine to have a different value for each agent. Another alternate approach is using two Environment variables, Es: TEST\_MONGODB and TEST\_MONGODB\_OVERRIDE, and configure your tests to use TEST\_MONGODB\_OVERRIDE if present, if not present use TEST\_MONGODB. This allows you to use TEST\_MONGODB on build definition, but if you set TEST\_MONGODB\_OVERRIDE for a specific test agent, that agent will use that value.

 **Another interesting aspect of Environment Variable is that they are included in agent capabilities, as you can see** from Figure 4.

[![SNAGHTMLd39383](http://www.codewrecks.com/blog/wp-content/uploads/2016/06/SNAGHTMLd39383_thumb.png "SNAGHTMLd39383")](http://www.codewrecks.com/blog/wp-content/uploads/2016/06/SNAGHTMLd39383.png)

 ***Figure 4***: *All environment variables are part of agent Capabilities*

This is an important aspect because if you want that variable to be set in the agent, you can avoid to include in Variables tab, and  **you can require this build to be run on an agent that has TEST\_MONGODB environment variable specified**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-18.png)

 ***Figure 5***: *Add a demand for a specific Environment Variable to be defined in Agent Machine*

Setting the demands is not always necessary, in my example if the TEST\_MONGODB variable is not definied, tests are executed against local MongDb instance. It is always a good strategy to use a reasonable default if some setting is not present in Environment Variables.

Gian Maria.
