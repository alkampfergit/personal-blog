---
title: "TFSBuild 2010 some news"
description: ""
date: 2009-11-02T09:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
When you create a new build in tfs2010, you can immediately notice some changes during the definition. In the basic configuration there are more options devoted to testing.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image.png)

As you can see it is possible to specify now if a test failure must fail the entire build, it is possible to specify command line aguments, priority etc etc. Another set of new options is contained in Advanced section.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image1.png)

It is possible to decide to copy outputs to drop folder, if you want a work item automatically created when the build fails, if tests must be disabled. Another really good option is the ability to choose witch version to get with the â€œGet Versionâ€ parameter. It seems that some basic task, that in 2008 version must be performed by MsBuild custom actions, are now part of the basic bunch of settings.

For customization, you can still use MsBuildExtension, but if you look at source control folders, you miss the old folder TeamBuildTypes that contains the msbuild project file that contains all build steps. In TFSBuild2010 there is a great improvement on how to configure the build, instead of manually editing a msbuild file, you can specify a workflow

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image2.png)

Now you can simply press the â€œnewâ€ button and a dialog will appear.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image3.png)

Now you can choose an existing xaml file, or you can simply copy the already existing DefaultTemplate with a new Name, in this example CustomBuild.xaml. After you created new build definition, just do a get latest and double click on it and you can open the build process in a graphical workflow designer, really cool.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image4.png)

Alk.

Tags: [Team Build](http://technorati.com/tag/Team%20Build)
