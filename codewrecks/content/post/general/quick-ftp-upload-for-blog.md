---
title: "Quick ftp upload of multiple files"
description: "Since I'm deploying my blog with ftp, upload time is increasing too much with standard ftp"
date: 2021-02-06T08:00:00+02:00
draft: false
tags: ["hugo"]
categories: ["General"]
---

After conversion of all of my blog posts, I have more than 1000 page to upload, and even if I left old image in original location **my publish time increased a lot as you can see from Figure 1**.

![Upload time is becoming unbearable](../images/upload-time-really-high.png)

***Figure 1***: *Upload time is becoming unbearable*

I've scheduled automatic publish with GitHub Actions, but using a standard ftp action I've found in the marketplace, my build time increased **from 5 minutes to more than one hour**. Clearly this is annoying, not because I need to wait 1 hour before new post will appears in the site, but because I **need to wait 1 hour to understand if something went wrong**.

> When you need to upload lots of small files with ftp, usually lftp is the preferred solution

Thanks to flexibility of GitHub actions, you can run apt-get to install additional tools needed by your plugin, **this allowed me to install lftp and use it instead of ftp action I've found in marketplace**.

{{< highlight yaml "linenos=table" >}}
- name: Install lftp
	run: sudo apt-get install lftp -y

- name: Upload ftp
	run: lftp -e "set ftp:ssl-allow no; mirror --parallel=100 -R codewrecks/public /codewrecks.com/wwwroot" -u ${{ secrets.FtpUserName }},${{ secrets.ftpPassword }} ${{ secrets.FtpHostName }}

{{< / highlight >}}

One of the **most useful feature of lftp is mirroring**, that allows me to mirror a local folder that after a correct hugo publis is *codewrecks/public* to the remote folder codewrecks/public/wwwroot using **100 parallel connection if possible**. Thanks to this high degree of parallelism, and lftp ability to understand what is really changed, here is the new publish time of the blog.

![Now the action runs in under 2 minutes](../images/improved-hugo-publish-time.png)

***Figure 2***: *Now the action runs in under 2 minutes*

Even if GitHub action is actually inferior in term of capabilities than Azure DevOps pipeline, **simplicity of use is a win in these scenarios where you just need a bunch of command to execute**. The ability to install on-the-fly tools you need is also a welcomed feature.

Gian Maria.
