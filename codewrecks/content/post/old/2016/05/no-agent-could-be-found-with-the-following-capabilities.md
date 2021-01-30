---
title: "No agent could be found with the following capabilities"
description: ""
date: 2016-05-07T07:00:37+02:00
draft: false
tags: [build,sonarqube]
categories: [Team Foundation Server]
---
In TFS 2015 / VSTS new build system **each task contains a series of requirements that needs to be matched by agents capabilities for the task to run**. Usually you install Visual Studio in the machine with the build agent and you can schedule standard.NET builds without problem, but what happens when the build starts to evolve?

When you start creating more complex build, you can find that your agent does not meets requirements because it miss some of the required capabilities. As an example,  **in TFS 2015 Build I’ve added task to run Sonar Qube Analysis on my code**.

[![Build definition with Sonar Qube analysis enabled](https://www.codewrecks.com/blog/wp-content/uploads/2016/05/image_thumb.png "Build definition with Sonar Qube analysis enabled")](https://www.codewrecks.com/blog/wp-content/uploads/2016/05/image.png)

 ***Figure 1***: *A build with SonarQube analysis enabled*

Now if I queue a build manually, TFS warned me that it is not able to find a suitable agent, and if you ignore that warning and queue the build here is the result.

[![The build failed because no agent with required capabilities was found in the pool.](https://www.codewrecks.com/blog/wp-content/uploads/2016/05/image_thumb-1.png "Build failure output")](https://www.codewrecks.com/blog/wp-content/uploads/2016/05/image-1.png)

 ***Figure 2***: *Build failed because no suitable agent was find*

The build failed because there are no agent capable to run it. Now you should go to the Project Collection administration page and verify all the agents.

[![Thanks to Capabilities tab in the administration page I can see a complete list of all agent capability.](https://www.codewrecks.com/blog/wp-content/uploads/2016/05/image_thumb-2.png "View agents capabilities in administration page")](https://www.codewrecks.com/blog/wp-content/uploads/2016/05/image-2.png)

 **figure 3:** *View agents capabilities in administration page*

From that picture I verified  **that the only agent I’ve configured missed the Java capability, so I simply remote desktop to the server, installed java on the machine and then restart the agent service (VSO-Agemt-TFS2013Preview).** After agent is restarted the build rans just fine.

*Thanks to the new build system, TFS Build Agents can automatically determines some known capabilities (such as Java installed) and this is atuomatically matched with all the requirements that are contained in tasks you use in the build, so TFS can choose to run the build only in the agent that satisfies requirements, and if no agent is found it warns you with a clear error.*

Gian Maria.
