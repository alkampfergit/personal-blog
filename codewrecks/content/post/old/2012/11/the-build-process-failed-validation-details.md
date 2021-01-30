---
title: "The build process failed validation Details "
description: ""
date: 2012-11-16T13:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
When it is time to customize TFS build you need to deal with Workflow Foundation, and  **you need to double check warning in the workflow if you want to have a successful build**. As an example after a configuration of a new process template I got this during build run

> The build process failed validation. Details:        
> Validation Error: The private implementation of activity ‘1: DynamicActivity’ has the following validation error:   Value for a required activity argument ‘Workspace’ was not supplied.        
> Validation Error: The private implementation of activity ‘1: DynamicActivity’ has the following validation error:   Value for a required activity argument ‘BuildSettings’ was not supplied.

Such an error is  **simply due to an invalid workflow** and this is entirely my fault, because the designer correctly shows me that there is some error, but I still try to submit the new workflow to upgrade a build, and clearly… it fails :)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image2.png)

 **figure 1:** *Errors in the workflow are correctly shown in the designer.*

The designer shows an informational icon on each action that has “something wrong” in its configuration, even if it is not a big red X that tells you that something is really, really wrong,  **this error prevent running a build based on this workflow** even if it shows as a little blue icon :).

The rule is, the workflows should never show issue in the designer.

Alk.
