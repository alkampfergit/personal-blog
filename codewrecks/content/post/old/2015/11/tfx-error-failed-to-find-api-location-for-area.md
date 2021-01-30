---
title: "Tfx error Failed to find api location for area"
description: ""
date: 2015-11-30T21:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
[Tfx-cli](https://github.com/Microsoft/tfs-cli) is a  **cross platform command line for TFS / VSTS** that can be used to accomplish various tasks. To connect to your favorite instance all you have to do is generate a Personal Access Token and use the command

{{< highlight bash "linenos=table,linenostart=1" >}}


tfx login

{{< / highlight >}}

You will be prompted for the URL of the server and your Personal Access Token to access the server. In  **Figure 1** I connected to my VSTS account.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/11/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/11/image.png)

 ***Figure 1***: *Perform login with tfx-cli utility*

Now if I perform a command, Es: tfx build list, it asks me the name of the Team Project to use and then I got this error: *Failed to find api location for area: build id: 0cd358e1-9217-4d94-8269-1c1ee6f93dcf*

 **The reason for the above error is a wrong specification of the URL of the service to use.** > When you login with tfx-cli you need to be sure to specify a valid Project Collection URL, not omitting the name of the Project Collection

In the example above, I’ve missed DefaultCollection from the Service URL, and this will generate the above error. The problem is:  **Tfx-cli routine returns you a Logged in Successfully result, because it is able to connect to the server, but then you are not able to execute commands, because the address is incorrect**.

To fix the situation you need to logout using *tfx logout* then issue a *tfx login* this time specifying the full URL to your collection Es: [https://gianmariaricci.visualstudio.com/DefaultCollection](https://gianmariaricci.visualstudio.com/DefaultCollection)

Gian Maria.
