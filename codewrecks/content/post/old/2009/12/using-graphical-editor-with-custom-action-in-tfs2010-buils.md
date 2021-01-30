---
title: "Using graphical editor with custom action in tfs2010 buils"
description: ""
date: 2009-12-08T17:00:37+02:00
draft: false
tags: [Tfs,TFS Build,workflow]
categories: [Team Foundation Server]
---
In [last post I](http://www.codewrecks.com/blog/index.php/2009/12/07/custom-activities-in-tfs2010/) showed how to build a custom code activity to customize tfsbuild for beta2 of tfs2010. In that post I inserted custom action manually in the xaml file of the build definition, and I know that this can be a pain, if you want to insert a custom action in a specific part of the workflow.

A simple trick is the following, copy the build definition into a test project that belong to the solution where your custom action belong, then add to the project, and you will see that your custom action magically appears into the toolbox. You can verify this in the picture above.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image4.png)

To make this happens, you really need to include the build definition into a project of the solution.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image5.png)

Ok, now you can delete the tweet action from the very beginning of the build, and simply change the workflow, to tweet an alert if a build is broken. First of all you need to scroll down the build definition to find the part where the compilation takes place.[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image6.png)

Now if the build fails, exception gets executed, so you need to customize the exception part of the compilation sequence. Then simply drop your tweet action in the build process, then configure it specifying username, password and message. For the message is useful to access build information from the BuildDetail variable to specify in the tweet the build number related to the failing build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image7.png)

Now you can save the modified build definition, and copy back to the BuildProcessTemplates folder of source control, to replace old build definition, then simply broke the code inserting some not compiling stuff in the build, commit everything and fire a build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image8.png)

Everything is ok. In this way you can edit the workflow in a really better way, instead of editing the xaml manually, you can fully use the designer with no problem.

alk.

Tags: [team foundation server](http://technorati.com/tag/team%20foundation%20server)
