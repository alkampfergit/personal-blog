---
title: "GitHub actions improvements"
description: ""
date: 2020-03-12T17:00:37+02:00
draft: false
tags: [GitHub]
categories: [GitHub]
---
GitHub actions is really new kid on the block and even if I still prefer Azure DevOps pipelines, because they are really more production ready, GitHub actions is rapidly evolving.

[![SNAGHTML3961c2](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/SNAGHTML3961c2_thumb.png "SNAGHTML3961c2")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/SNAGHTML3961c2.png)

 **Figure 1** : *GitHub actions now has a dedicated editor for actions to quickly include actions*

As you can see in  **Figure 1** , when you edit workflow file in GitHub online editor  **you can simply browse all available actions**. Choosing a specific action reveal the snippet of text you should enter to use that action without the need to search around.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-4.png)

 ***Figure 2***: *Detail of the action with a nice button to copy action text in the clipboard.*

 **This feature suggests that it is better to use GitHub online editor to create and edit your workflow files** , even if they are simply text files that can be edited from your favorite code editor.

> If you need to author a GitHub action file, always prefer online editor than a simple offline editor.

If you edit your workflow directly in GitHub you have also syntax checking to avoid errors, as you can see in  **Figure 3.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-3.png)

 ***Figure 3***: *Syntax checking during editing online*

Syntax checking is not only available to check some classic YAML errors, like in  **Figure 3** where the editor spotted a basic error in indentation, but it can also check semantic errors based on action schema, so you can guide the user during editing.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-6.png)

 ***Figure 4***: *Syntax highlighting during editing that can suggests syntax to author action*

You have also diff online, so you can check what you really changed during editing session.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-7.png)

 ***Figure 5***: *Diff on actions to verify what you changed in action file during editing session.*

As you can see online editor is quite powerful and allows you to quick edit action definition directly on web editor.

Gian Maria.
