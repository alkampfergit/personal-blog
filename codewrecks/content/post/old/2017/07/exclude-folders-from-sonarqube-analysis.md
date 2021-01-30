---
title: "Exclude Folders from SonarQube analysis"
description: ""
date: 2017-07-22T08:00:37+02:00
draft: false
tags: [sonarqube]
categories: [Tools and library]
---
Creating a build that is capable of perform a SonarQube analysis on a VSTS /  TFS is a really simple task, thanks to the two tasks that are present out-of-the box.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-9.png)

 ***Figure 1***: *Build that uses Sonarqube tasks to perform analysis*

The problem in a project that was alive for more than a couple of years is that  **you usually have a really bad report when you do your first analysis.** This happens because, without a constant analysis, the code have surely some smells.

Sometimes you get really discouraged, because the number of issue is really high, but before losing any hope, check if the errors are really part of your code. In a project where I’m working, we got really bad numbers and I was 100% sure that it is not a problem of our code.

> When you analyze your project for the first time, sometimes the number of issue is so high that you really are discouraged. Before giving up, check if the errors are really part of your code.

To diagnostic the problem, simply login to the project, then go to Code view (something like [http://build:9000/code/?id=projectName](http://build:9000/code/?id=projectName)), then you will see a summary of all the bugs, but unfortunately you cannot order for the number of the bug, so Just scroll down to see the part of the code with the most errors.

[![SNAGHTML139609](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML139609_thumb.png "SNAGHTML139609")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML139609.png)

 ***Figure 2***: *185 bugs are located in scripts folder*

In this situation, we have 185 bugs signaled by the javascript analyzer under the scripts folder,  **but in that folder we have our code but also third party code.** This is not the very first analysis, because the first analysis shows a folder where there are more than 3k of errors and it was the folder that stores all third party javascript libraries.

 **If you do not use npm it is quite normal to have third party javascript code in your source code and if you are using SonarQube you absolutely need to configure it to exclude that directories.** Just go to the administration page of the project and in the Analysis Scope you find the Source File Exclusions section that allows you to exclude some directories from the analysis.

[![SNAGHTML16d611](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML16d611_thumb.png "SNAGHTML16d611")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML16d611.png)

 ***Figure 3***: *Exclude folder for analysis*

In your situation the vast majority of errors comes from the angular library, from all the script of the skin we use and for third party libraries stored under the /app/scripts/lib folder.  **After exclusion, the number of bugs dropped from almost 7k to 500.** If you add Sonarqube analysis to existsting project that have third party javascript code in source code repository, please always check where the errors are and exclude folder accordingly.

Gian Maria.
