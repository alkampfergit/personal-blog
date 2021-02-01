---
title: "Creating a build with Tfs"
description: ""
date: 2009-06-22T08:00:37+02:00
draft: false
tags: [NET framework,Team Foundation Server]
categories: [NET framework,Team Foundation Server]
---
I worked for long time with NANT + CC.net as continuous integration tools. I used subversion as Source Control System and use Mantis or Redmine for issue tracking.

The main disadvantage of using such a configuration is the need to make each tool communicate with others, the good part is that these tools are open source. Team Foundation Server on the other side is a Commercial tool, so you have to pay it, but it gives you a lot of features in a single unified tool, and this is Great. Let's see as an example how to set up a continuous integration server for a simple project.

Leveraging the power of a Continuos Integration machine with open source tool is not difficult, but you need to do some work, in CC.net you have to create a NANT or MSbuild script, configure cc.net with ccnet.config and so on. The good part of Team Foundation Server is that creating a build is a matter of a right click on the builds node

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image20.png)

The â€œNew Build Definitionâ€ shows you a wizard that helps you in creating the build, the first time you run it tells you that it does not find any build file in the source code, so it suggest you to use a wizard to create one.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image21.png)

The wizard is really simple, first of all it asks you the list of solutions to build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image22.png)

In this test project I have only one solution so I select it. Then you select the configuration (Debug/Release/Etc). You can forget any option for now. When you click finish you will return to the original wizard, now you can decide how many result you want to mantain

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image23.png)

This is a great option, because it permits you to avoid keeping too many data, as example for failing builds. The next step asks you the build agent to use, since it is my first build, I create an agent for the first time

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image24.png)

I've installed the Build Engine on the same machine where the Tfs runs, so I create an agent named *StandardBuildAgent,* then specify the name of the computer *TFSALKAMPFER* , when you press OK you can use that agent to run the build, now you must specify network share where to put the result

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image25.png)

In the last step you simply decide when to trigger a build, and since I want really continuos integration I specify a build at each check-in-

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image26.png)

Now the build is created, you can right click and schedule a new build (this is the equivalent to Force a build in CC.net). The result gives you a lot of informations on what is happened.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb27.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image27.png)

This build have some errors, if you scroll down the result of the build you can find detailed error, stored in file Debug.txt. This file contains the error output of the msBuild engine so you can understand what goes wrong. The good news is that, if the build goes ok, you can find a lot of information in the shared folder you specified during build definition.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb28.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image28.png)

And if you click into the Debug folder you can find all the artifacts produced by the build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb29.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image29.png)

Respect to CC.Ner, Team Foundation Server is really simpler, with few clicks you can create a Build Definition that is triggered at each check-in, gives you a lot of detailed information, and copies all artifacts in a network share. I really care about Continuous Integration Machine, and the ability to directly manage it inside Visual Studio with few clicks is really a great feature respect CC.net.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
