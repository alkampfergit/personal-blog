---
title: "Who moved my chees but now it is in a better place"
description: ""
date: 2018-08-13T17:00:37+02:00
draft: false
tags: [VSTS]
categories: [Azure DevOps]
---
I’m not a great fan when software I used everyday change position of stuffs, especially when main menu / navigation system changes. This is a problem generally known as “who moved my cheese” and lead to small frustration because you need to find where your everyday options were moved.  **Recently VSTS changed navigation system, from an horizontal menu to a vertical menu** , rearranging the whole navigation, my cheese was moved, but this time for better.

I need to admit that new navigation is really better and even if you need time to become familiar with it, everything seems more rationally placed. As an example it finally overcome one of the main pain point of the older navigation system, configuration for area and iteration between Team Project and Teams.

> In the classic navigation system of VSTS, it is not so easy to understand where you need to click to configure Area and Iteration for Project and Teams.

 **One of the main pain point was that you need to create iteration and areas in Team Configuration, then you need to assign to each Team**. Novice users quite often get lost in the menu system and needs to be guided where the things are. So lets start exploring how you manage team with the new vertical menu.

With the new navigation, **when you enter configuration for your Team Project, you have a nice node called Teams (1)** where you can immediately view the list of the Teams as well as the team that was tagged as default.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-6.png)

 ***Figure 1***: *Team Configuration menu in the new navigation system*

Details page are the same, but the new navigation system is more clear and team management is more prominent.

> In the new navigation system, team management is more discoverable.

 **Another source of confusion was configuration for Area and Iteration between the entire Team Project and single team**. In almost all the course I did, people gets a little lost with the old navigation system and needs some time to accomplish simple task, like creating new iteration in Team Project then add those iteration to team.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-7.png)

 ***Figure 2***: *Configuration of iterations and areas in new navigation system*

As you can see in  **Figure 2** , when you choose configuration for Work (1) you now have two clear choices, *Project configuration* or *Team Configuration*(2), finally all confusion is gone away. If you choose Project configuration you can manage iterations and areas for the entire team (3), this is the place where you  **creates iterations and areas for the project.** If you instead choose *Team Configuration* **(Figure 2)** , you have a top level breadcrumb (2) that can be used to switch between teams, and for each team you have the classic menu (3) used to configure General / Iterations / Areas / Templates.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-8.png)

 ***Figure 3***: *Configuration for Work related to teams*

This is really better than the old navigation menu, because you always know if you are configuring the entire project or single team and  **the ability to switch between team configuration directly with the breadcrumb is a really welcomed feature** , as shown in  **Figure 4**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-9.png)

 ***Figure 4***: *Changing team in configuration is now possible with the breadcrumb.*

If you are still using old menu,  **I strongly suggest you to enable this new feature with the usual “Preview features”** menu available in the personal menu (right upper part where your avatar is shown.

[![SNAGHTML1964fa](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/SNAGHTML1964fa_thumb.png "SNAGHTML1964fa")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/SNAGHTML1964fa.png)

 ***Figure 5***: *Use the Preview Features menu to enable the new navigation.*

> Even if the new navigation menu is in preview, I strongly suggest you to enable it, because it will simplify your everyday work in VSTS.

Gian Maria
