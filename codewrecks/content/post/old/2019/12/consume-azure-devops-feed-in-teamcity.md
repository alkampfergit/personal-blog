---
title: "Consume Azure DevOps feed in TeamCity"
description: ""
date: 2019-12-04T18:00:37+02:00
draft: false
tags: [build]
categories: [Azure DevOps]
---
 **Azure DevOps has an integrated feed management you can use for nuget, npm, etc; the feed is private and only authorized users can download / upload packages.** Today I had a little problem setting up a build in Team City that uses a feed in Azure Devops, because it failed with 201 (unauthorized)

> The problem with Azure DevOps NuGet feeds, is how to authenticate other toolchain or build server.

This project still have some old build in TeamCity, but when it starts consuming packages published in Azure Devops, TeamCity builds start failing due 401 (unauthorized) error. The question is: How can I consume an Azure DevOps nuget feed from agent or tools that are not related to Azure Devops site itself?

I must admit that this information is scattered in various resources and Azure DevOps, simply tells you to add a nuget.config in your project and you are ready to go, but this is true only if we are using Visual Studio connected to the account.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image-1.png)

 ***Figure 1***: *Standard configuration for nuget config to point to the new feed*

 **Basic documentation forget to mention authentication, except from Get The Tool instruction, where you are suggested to download the Credential Provider if you do not have Visual Studio**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image-2.png)

 ***Figure 2***: *Instruction to get NuGet and Credential Provider*

Credential provider is useful, but is really not the solution, because I want a more Nuget Friendly solution, the goal is: when the agent in TeamCity is issuing a Nuget restore, it should just work.

 **A better alternative is to use standard NuGet authentication mechanism, where you simply add a source with both user and password.** Lets start from the basic, if I use NuGet command line to list packages for my private source I got prompted for a user.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image-3.png)

 ***Figure 3***: *NuGet asking for credential to access a feed*

Now, as for everything that involves Azure DevOps, when you are asked for credential,  **you can use anything for the username and provide an Access Token as a password.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image-4.png)

 ***Figure 4***: *Specifying anything for user and my accesstoken I can read the feed.*

This the easiest and more secure way to login in Azure DevOps with command line tools, especially because to access the feed I’ve generated a token that have a really reduced permission.

[![SNAGHTML2160fc9](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/SNAGHTML2160fc9_thumb.png "SNAGHTML2160fc9")](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/SNAGHTML2160fc9.png)

 ***Figure 5***: *Access token with only packaging read permission*

 **As you can see in Figure 5, I created a token that has only read access to packaging, if someone stoles it, he/she can only access packages and nothing more.** Now the question is: how can I made TeamCity agent to use that token? Actually TeamCity has some special section where you can specify username and password, or where you can add external feed, but I want a general way to solve for every external tool, not only for Team City. It is time to understand how nuget configuration is done.

> Nuget can be configured with nuget.config files placed in some special directories, to specify configuration for current user or for the entire computer

Standard [Microsoft documentation](https://docs.microsoft.com/en-us/nuget/consume-packages/configuring-nuget-behavior) states we **can have three levels of nuget.config for a solution** , one file located in the same directory as solution file, then another one with user scope and is located at %appdata%/Nuget/nuget.config, finally we can have settings for all operation for entire computer in %programfiles(x86)%/nuget/config/nuget.config.

 **You need to know also,** [**from the standard nuget.config reference documentation**](https://docs.microsoft.com/en-us/nuget/reference/nuget-config-file) **, that you can add credentials directly into nuget.config file** , because you can specify username and password for each package source. Now I can place, for each computer with an active TeamCity agent, a nuget.config at computer level to specify credential for my private package and the game is done. I created just a file and uploaded in all Team City computers with agents.

 **The real problem with this approach is that the token is included in clear form in config.file located in c:\program files (x86)/nuget/config.** At this point you can hit this issue [https://github.com/NuGet/Home/issues/3245](https://github.com/NuGet/Home/issues/3245 "https://github.com/NuGet/Home/issues/3245") if you include clear text password in nuget.config password field, you will get a strange “The parameter is incorrect” error, because clear text password should be specified in ClearTextPassword parameter. After all, who write a clear text password in an file?

This leads to the final and most secure solution, in your computer, download latest nuget version in a folder, then issue this command

{{< highlight powershell "linenos=table,linenostart=1" >}}


.\nuget.exe sources add -name proximo
  -source https://pkgs.dev.azure.com/xxxxx/_packaging/yyyyyy/nuget/v3/index.json 
  -username anything 
  -password  **myaccesstoken** {{< / highlight >}}

This command will add, for current user, a feed named proximo, that points to the correct source with username and password. After you added the source, you can simply go to %appdata%/nuget/ folder and open the nuget.config file.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image-6.png)

 ***Figure 6***: *Encrypted credentials stored inside nuget.config file.*

As you can see, in your user configuration nuget.exe stored an encrypted version of your token,  **if you issue again a nuget list –source xxxxx you can verify that nuget is able to automatically log without any problem because it is using credentials in config file.** The real problem of this approach is that  **credentials are encrypted only for the machine and the user that issued the command, you cannot reuse in different machine or in the same machine with a different user.** >  **Nuget password encryption cannot be shared between different users or different computers, making it works only for current user in current computer.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/12/image-7.png)

 ***Figure 7***: *Include clear text password in machine nuget.config to made every user being able to access that specific feed*

To conclude you have two options: you can generate a token and include in clear text in nuget.config and copy it to all of your TeamCity build servers. If you do not like clear text tokens **in files, have the agent runs under a specific build user , login in agent machine with that specific build user  and issue nuged add to have token being encrypted for that user.** In both cases you need to renew the configuration each year (token last for at maximum one year). (You can automate this process with a special build that calls nuget sources add).

Gian Maria.
