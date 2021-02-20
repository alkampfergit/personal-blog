---
title: "Enable new Work Item Form in TFS '15'"
description: ""
date: 2016-11-05T09:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
If you installed TFS 15 Preview, one  **of the news you expected to see is the new Work Item Layout (already available in VSTS).** You could get disappointed that actually your existing Work Items still are shown with the old interface, as you can see in Figure 1

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image.png)

 ***Figure 1***: *After upgrade TFS still shows the old Work Item Form*

The new Work Item Form is installed with an opt-in method so it is disabled by default. To enable it you should navigate to the Project Collection administration page. From here you should see that this feature is actually disabled ( **Figure 2** ), but you have the link to Enable it.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image-1.png)

 ***Figure 2***: *New Work Item form is disabled by default after upgrade*

If you click the “Enable the new work item form” link, you are informed that this operation will create a new layout for the Work Item, but  **you can choose, after the creation of the new layout, if you want to use the new model** , and the opt-in model, as you can see in Figure 3.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image-2.png)

 ***Figure 3***: *Enabling the new Work Item layout starts with the creation of the new Layout.*

> Thanks to the opt-in method, you are not forced to use the new layout, but you can activate it only if you want to use it

 **After the creation of the Layout you should configure the Opt-in model** , or you can disable entirely the new Work Item Form.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image-3.png)

 ***Figure 4***: *Options to enable the new Work Item form with the opt-in model*

The opt-in model basically allows you to decide who can view the new Work Item form layout. You have three options, as shown in Figure 5,  **you can give the ability to use the new layout only to administrators, to all user, or you can force everyone to use the new Layout** , disabling the old layout entirely.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image-4.png)

 ***Figure 5***: *Opt-in model options to enable the new Layout form*

> Opt-in model for the new Layout Form is really flexible because you can leave the decision up to each single user.

The central option is usually the less impacting, because  **each member of the team can choose to evaluate the new layout or stick with the old one**. A new link appears on the head of the Work Item Form, in the far right part, as you can see in Figure 6.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/image-5.png)

 ***Figure 6***: *Opt in model allows each user to choose to evaluate the new form.*

If the user choose to preview the new form, the page refresh and the Work Item is rendered with the new layout. The user has the option to return to the old form if he do not like the new form, giving the whole team the time to evaluate the feature and decide if using it or not.

[![SNAGHTML7928e8](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/SNAGHTML7928e8_thumb.png "SNAGHTML7928e8")](https://www.codewrecks.com/blog/wp-content/uploads/2016/11/SNAGHTML7928e8.png)

 ***Figure 8***: *New form is active and the user can back to old form if the do not like it.*

This settings is “per collection” so you can decide different opt-in model for each collection of your TFS.

Gian Maria.
