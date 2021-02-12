---
title: "Set verbosity of logging during Tfs 2010 build"
description: ""
date: 2010-01-18T10:00:37+02:00
draft: false
tags: [TFS Build,workflow]
categories: [Team Foundation Server]
---
To test a little bit how you can log information during a TFS 2010 build you can create a simple activity , this activity simply has a Message property and log three messages, at different BuildMessageImportance level

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image16.png)

The utility function is the following one

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image17.png)

Really simple isn't it? :). Now you need to insert this custom action inside a standard tfs build definition file, to make this happens I need to remind you that you need to include the xaml build definition file in a project included in a solution where your custom action is defined, if not you cannot use the designer and you need to manually edit xaml file.

To easy this process I branched directly the build definition file, with this simple trick, I edit the definition file in my test project, do a check-in and when I want to update the real build definition I do a simple merge. Then I insert my action in the build process. So I created a new build definition from the default template, configure it, then branched into my test project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image18.png)

I highlighted the two important facts: 1) the file is included in the project DotNetMarche.Activities.Workflow.Test, 2) The project with the action is included in the solution, now I can drop the LogSample action into the build definition file using the graphical editor, check-in, merge and launch the build with the new definition (I remember you that you need to deploy also the custom activity [as described here](http://www.codewrecks.com/blog/index.php/2009/12/07/custom-activities-in-tfs2010/)), here is the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image19.png)

As you can verify, only the message with BuildMessageImportance.High is showed, this because the entire build process has an argument that determines the level of log verbosity. Now try to change this value to Detailed. You should click the *Arguments* and locate the Verbosity argument.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image20.png)

Now change it to Detailed, check-in, merge ;) and launch the build again to verify the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image21.png)

Now you can see that in *Detailed* level of verbosity, the workflow logs even the Normal level. The morale is that in your custom activity you should use BuildMessageImportance with great care. Really important messages must be showed with High importance, detailed with Normal, and you should use Low for really verbose messages. But remember, always do a verbose log, because if something gets wrong in the build, you can always change the BuildVerbosity level and verify in detail what is really gone wrong in your custom action.

Alk.

Tags: [tfs](http://technorati.com/tag/tfs)
