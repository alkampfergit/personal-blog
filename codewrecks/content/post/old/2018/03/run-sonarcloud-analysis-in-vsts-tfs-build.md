---
title: "Run SonarCloud analysis in VSTS  TFS Build"
description: ""
date: 2018-03-25T16:00:37+02:00
draft: false
tags: [build,sonarqube]
categories: [Azure DevOps,Team Foundation Server]
---
Running a SonarQube analysis for TFS or VSTS is really easy because we can use a pre-made build tasks that requires few parameters and the game is done.  **If you have open source project it made lot of sense to use a public account in SonarCloud** , so you do not need to maintain a sonar server on-premise and you can also share your public account with the community.

> For open source projects, SonarCloud is available for you with zero effort and thanks to VSTS and TFS you can automate the analysis with few steps.

The first step is creating an organization in Sonar Cloud, if you prefer you can just login with your GitHub account and everything is ready. After the  **creation of the organization, you should create new project and generate a key to send analysis to SonarCloud server** , everything is made with a simple wizard and it takes only a bunch of seconds to have your project created and ready to be used.

Once you have your project key and token  you need to add the endpoint of SonarCloud to the list of available endpoints.  **You only need to give the connection a name, specify** [**https://sonarcloud.it**](https://sonarcloud.it) **as Server Url and add the token generated during project creation.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/03/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/03/image-1.png)

 ***Figure 1***: *Configuration of sonar cloud endpoint*

Now you can configure build to perform the analysis, the first task is the “prepare analysis Task”, as you can see in  **Figure 2**. You should select the Endpoint created in previous step, fill the project key and project name, but you need also to specify a couple of properties in the advanced section. The first one is sonar.organization and * **it is required or the analysis will fail** *. This is the only difference from on-premise SonarQube server, where you do not need to add organization name.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/03/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/03/image-2.png)

 ***Figure 2***: *Configuration of the prepare analysis task.*

 **The other setting to be specified in Additional Properties is the sonar.branch.name, to perform branch based analysis, a feature that is available in sonarcloud** and it is available on-premise only with enterprise version. You can simply use the $(Build.SourceBranchName) to use the current branch if you are using Git.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/03/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/03/image-3.png)

 ***Figure 3***: *Analysis performed on NStore project with branch analysis enabled.*

The cool part of the process is that, SonarCloud require zero installation time and less than one minute to create the first project and thanks to the VSTS / TFS build engine you can automate the analysis in less than 2 minutes.

Gian Maria.
