---
title: "Hyper-V and Windows AutoLogon"
description: ""
date: 2017-07-18T19:00:37+02:00
draft: false
tags: [VSTS]
categories: [Team Foundation Server]
---
When you configure build agents and especially when you configure Release Agents for VSTS, it is quite normal to have some installations where you want to use AutoLogon.  **This is needed whenever you want to run integration tests that needs to interact with the UI.** Having autologon enabled avoid the need to manually login and start the agent when the machine is rebooted, because you always have a user session opened that runs the agent.

There are lots of articles[, like this one](https://www.top-password.com/blog/set-up-windows-to-auto-login-to-domain-account/) that explain how to configure everything, but last Saturday I had a problem, because I had a Windows Server 2016 where that technique does not work. I rebooted the machine, but the hyper-v console shows me the login pane and I was really puzzled.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-6.png)

 ***Figure 1***: *Login screen in Hyper-V console.*

As you can see from Figure 1, the Hyper-V console shows the login page, so I incorrectly believed that the autologon did not work. I said incorrectly because trying to troubleshoot the problem, a friend told me to check the Hyper-V manager console, and here is what I see

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-7.png)

 ***Figure 2***: *Small Thumbnail of the VM in Hyper-V snap-in.*

From Figure 2 you can see that the Thumbnail of the VM does not show the login page, but it shows a user session logged into the machine.  **A quick check confirmed me that the agent was online, so the Automatic Logon worked, but my Virtual Machine console still shows me the logon screen.** The reason is in the Enhanced session feature, available in the View menu of the Virtual Machine console. The Enhanced session is used to allow windows resizing, clipboard transfer and so on and uses Remote Desktop under the hood. If you turn off Enhanced Session you use the basic Hyper-V console, that shows you that a user is really connected to the system.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-8.png)

 ***Figure 3***: *The console in basic session mode correctly shows the logged user*

It turns out that, with enhanced mode, you are not able to see the session that is started automatically, but the session is active. If you really want to verify what is happening, you can simply switch to basic mode.

Gian Maria.
