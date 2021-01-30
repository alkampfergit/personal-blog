---
title: "VSTS agent on Ubuntu 1604 error in configuresh"
description: ""
date: 2017-08-22T16:00:37+02:00
draft: false
tags: [build,Ubuntu,VSTS]
categories: [Azure DevOps]
---
I’ve downloaded the build/release agent from VSTS page to install in my Ubuntu 16.04 system, but when I tried to run the configuration shell script I got the following error

* **Failed to initialize CoreCLR, HRESULT: 0x80131500** *

This happens because **I installed the version for Ubuntu 14.04 and not the one specifically compiled for Ubuntu 16.04**. In my situation the error happened because the download page of my VSTS account does not list the version for Ubuntu 16.04, but only for Ubuntu 14.04 and this incorrectly lead me to the false belief that it works for both versions. The page from where you download the agent is [https://myaccount.visualstudio.com/\_admin/\_AgentQueue](https://myaccount.visualstudio.com/_admin/_AgentQueue "https://prxm.visualstudio.com/_admin/_AgentQueue") and should also list the version for 16.04.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-22.png)

 ***Figure 1***: *Agent download page in your VSTS account.*

To avoid error the best way to download the agent  **is checking the official GitHub account page.** > The best place to download and to look for VSTS agent information is the official GitHub page.

As you can verify from  **Figure 2** , we have a two distinct compiled version for Ubuntu.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-23.png)

 ***Figure 2***: *Distinct builds for vsts agents (Ubuntu 14 and 16)*

 **To download the correct version, you can easily go to the release page (** [**https://github.com/Microsoft/vsts-agent/releases**](https://github.com/Microsoft/vsts-agent/releases "https://github.com/Microsoft/vsts-agent/releases") **)** where you can download all official versions for all supported operating system / version.

Gian Maria.
