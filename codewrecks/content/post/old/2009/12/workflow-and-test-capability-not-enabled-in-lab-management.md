---
title: "Workflow and test capability not enabled in lab management"
description: ""
date: 2009-12-24T09:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Team Foundation Server]
---
I deployed my first machine with lab management, but when the deploy finished I verify that workflow capability and test capability are not enabled in the machine. This is how you should see deployed machine

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb20.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image20.png)

If the hilighted icons have a red cross instead of the play button you have a problem. Quite always the problem rely on permissions, so the best way to solve it is to connect to the machine and take a look at event viewer.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb21.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image21.png)

Unable to connect to the controller on xxxx permisssion deniedâ€¦ this operation can only be performed by members of TeamTestAgentService.

This problem is related to test controller, to solve it you first need to verify the user that is configured to run the â€œVisual Studio Test Agentâ€ service, usually is network service. Then you need to log on the machine where the test contoller was installed, and manage local groups, you need to verify that in TeamTestAgentService group the name of the computer deployed is in the TeamTestAgentService group.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb22.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image22.png)

For the build agent the situation is similar, but you need to connect to the machine where the TFS is installed, goes to the project collection, then choose â€œAdminister Group Membershipâ€ and click properties for the â€œProject Collection Build Service Accountsâ€. Now verify that the virtual machine deployed is added to this group.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb23.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image23.png)

When you verified those two security settings, simply restart both the service in the virtual machine, then click on the icon and choose â€œRepair Testing Capabilityâ€ and the same for the workflow.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb24.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image24.png)

Now everything should work as expected

Alk.

Technorati Tags: [Lab Management](http://technorati.com/tags/Lab+Management)
