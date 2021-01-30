---
title: "Use latest OS image tag in GitHub actions"
description: ""
date: 2020-03-08T09:00:37+02:00
draft: false
tags: [GitHub]
categories: [GitHub]
---
I have a nice GH action that runs some build and test on my project, now I noticed that some of the latest runs have some problem.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image.png)

 ***Figure 1***: *My action that ran only one of the matrix combination*

Action has two distinct run because it has a matrix, actually I want to run it against Linux and Windows operating systems, but it seems that it does not run anymore on Windows.

> GitHub actions can run the very same worfklow for a different combination of parameters, the most common setup is running on different operating systems.

 **A quick check reveals that the image I’m using is not available anymore.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-1.png)

 ***Figure 2***: *Warning telling me that the image does not exists.*

Actually I do not know why this is a simple warning and not a real error, but the reason is clear, the image windows-2016 is now removed so the corresponding matrix entry is invalid.

 **When you write your actions, it is probably better not to stick to a specific version of the image, but instead using the xxx-latest one to avoid similar problem**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-2.png)

 ***Figure 3***: *If you can you should use latest version of all images.*

The reason why I choose windows-2016 is that I have no 2019 container image for some of the image I’m using, so I forced older image version. Clearly now it is time for me to update my Docker Images (something I’ve already done if you read latest post) and move to windows-latest.

> As a rule of thumb, if you do not have specific requirements, it is preferrable to choose xxxx-latest version of images to avoid such a problem

Gian Maria.
