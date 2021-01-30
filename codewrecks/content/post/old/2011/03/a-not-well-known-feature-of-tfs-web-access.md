---
title: "A not well known feature of TFS web access"
description: ""
date: 2011-03-19T10:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
For those of you thinking that TFS Web Access is only another interface for TFS, I want to signal a couple of interesting feature that are available only in the web interface. When you open a bug for editing, you have a tools menu with an interesting command called *State Diagram.*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image5.png)

 ***Figure 1***: *Menu command to visualize the State Diagram for the Work Item type*

This command will show a diagram showing the *state diagram of the Work Item* type, and it is really cool to have a graphical idea on how a Bug or other Work Item is handled by this project template. Here is an example;

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image6.png)

 ***Figure 2***: *The state diagram for a Bug in my test project*

From this diagram you can visualize all the state and transitions available to the Bug, but you can do the same for Requirements or any other Work Item type. At the bottom of the Work Item edit page you can also find the history of the Status of the Work Item with a little graphical image

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image7.png)

 ***Figure 3***: *Graphical state transition diagram in the web interface*

This picture clearly shows bug lifecycle and can immediately give you an idea of what it happened during its life. This representation could be really useful especially for Bugs, where the state plays an important role.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image8.png)

 ***Figure 4***: *State diagram of a reopened bug*

From the state diagram you canverify if a bug was reopened, and for what reason. In Figure 4 we could see that the bug was reopened because of Test Failed.

Alk.
