---
title: "Managing Multiple TFS Build Agents with tag"
description: ""
date: 2010-06-14T16:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Team Foundation Server]
---
In last post I explain [how to run code coverage during a Tfs Build](http://www.codewrecks.com/blog/index.php/2010/06/14/running-code-coverage-in-tfs2010-builds/) and I mentioned the fact that to run code coverage you need to have Visual Studio premium or ultimate in the build machine. But what happens when you have multiple configured test agent, and only some of them have VS installed?

The solution to such a problem is using [tags with the build agents](http://msdn.microsoft.com/en-us/library/bb399135.aspx#assign_tags). Basically a tag is a string that gets assigned to a build agent, and identify some capabilities of the Agent Itself. In our example, we can define a tag called *VSUltimate* that is used for each build agent that runs on a machine with Visual Studio Ultimate installed. Adding a tag is just a matter of going to the Agent Configuration

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb27.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image27.png)

One good aspect of tagging, is that TFS remembers all inserted tags, so when it is time to configure tagging on another build agent, you got a list of all tags already used. You can verify from the above picture that this agent has the VSUltimate tag, but not the Windows7 one.

Now you can simply choose in the build definition the tag you require for the build. In our example, since our build should collect code coverage result, I want it to be executed from an agent that has Visual Studio Ultimate installed.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image29.png)

Thanks to the tag system you can simply specify in the build the feature you need to run the build itself.

alk.
