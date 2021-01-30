---
title: "Troubleshoot YAML Build first run"
description: ""
date: 2019-04-13T08:00:37+02:00
draft: false
tags: [Azure Devops,build]
categories: [Azure DevOps]
---
 **Scenario** : You create a branch in your git repository to start with a new shiny YAML Build definition for Azure Devops, you create a yaml file, push the branch in Azure Devops and Create a new Build based on that YAML definition. Everything seems ok, but when you press the run button you got and error

> Could not find a pool with name Default. The pool does not exist or has not been authorized for use. For authorization details, refer to [https://aka.ms/yamlauthz](https://aka.ms/yamlauthz).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image.png)

 ***Figure 1***: *Error running your new shiny pipeline*

Ok this is frustrating and following the link gives you little clue on what really happened. The problem is that, with the new editor experience, when you navigate to the pipeline page, all you see is the editor of YAML build and nothing more.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image-1.png)

 ***Figure 2***: *New Editor page of YAML pipeline, advanced editor and nothing more.*

[The new editor is fantastic](http://www.codewrecks.com/blog/index.php/2019/03/16/yaml-build-in-azure-devops/), but it somewhat hides standard configuration parameters page, where the default branch can be set. As you can see from  **Figure 2**  **you can specify pool name (default) and triggers directly in YAML build so you think that this is everything you need, but there is more**. Clicking on the three buttons in the right upper corner you can click on the trigger menu to open the old editor.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image-2.png)

 ***Figure 3***: *Clicking on the Triggers menu item will bring on the old UI*

This is where the YAML pipeline experience still needs some love, you are surely puzzled why you need to click triggers menu item if you already specified triggers directly in the YAML definition, but the reason is simple, it will open the old pipeline editor page.

> The new editor page with YAML editor is fantastic, but you should not forget that there are still some parameters, like default branch, that are editable from the old interface

Trigger page is not really useful, it only gives you the ability to override the YAML configuration, but  **the important aspect is that we can now access the first tab of the YAML configuration to change default branch**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image-3.png)

 ***Figure 4***: *Trigger page is not useful, but now we can access default configuration for the pipeline.*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/04/image-4.png)

 ***Figure 5***: *Default configuration tab where you can edit default branch*

In  **Figure 5** you can now understand what went wrong, the wizard created my pipeline using master as default branch, but clearly my buid YAML file does not exists in master, but exists only in my feature branch. Yust change the default build to the branch that contains your build definition file, save and queue again; now everything should word again.

This trick works also when you got errors not being authorized to use endpoints, like sonar endpoint, nuget endpoint etc.

Happy YAML Building experience.

Gian Maria.
