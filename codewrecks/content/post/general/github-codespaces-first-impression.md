---
title: "GitHub Codespaces first impression"
description: "First impression on using GitHub codespaces for my blog authored in Hugo"
date: 2020-09-06T08:00:00+02:00
draft: false
tags: ["blogging"]
categories: ["general"]
---

# What is GitHub codespaces

Visual Studio Code is becoming one of the most used and productive editors in all operating system and it is used by most developers. During these years Visual Studio Code introduced lots of interesting features, like the **ability to connect to Linux or Docker Container and develop inside that container**. This means that your machine can run Windows / Linux / MacOS or whatever, but you can connect to a Linux machine or Linux Docker instance and **develop inside that container**

Since the product is based on electron, the next step is GitHub Codespaces (We already have Visual Studio Codespaces on azure), a **Full Visual Studio Code experience in your browser**

> Given the web nature of Visual Studio Code, GitHub codespaces can allow a full developing experience right into your browser

Lets starts, if you roll for the public beta and you are inserted in beta users, you can find a new menu in your repositories.

![Codespaces enabled for your repository](../images/codespaces-start.png)
***Figure 1***: *Codespaces enabled for your repository*

You then proceed to the creation of a new Codespaces and basically you **will be redirected to a Visual Studio Code instance running inside the browser". If you open a terminal you can verify **that you are actually connected to a docker instance based on Debian distribution**.

![Codespaces is running inside a Debian Based container](../images/codesspace-container-info.png)
***Figure 1***: *Codespaces is running inside a Debian Based container*

# Trying to write this post in GH Codespaces

Since I'm running inside a normal container **I proceeded to install hugo with standard debian package** then I **configured some standard extension inside Codespaces instances of Visual Studio Code and immediately tried to create this new post directly from the browser**.

The very first feature I tried is the ability to run "hugo server -D" to process my blog and have it rendered like I do locally. After hugo started it told me to connect to localhost:1313 to view the site, but if I right click on the link **I got redirected to another link that automatically connected me to port 1313 of the container running codespaces**.

![proxying the port](../images/gh-codespaces-connect-to-remote-port.png)
![Thanks to proxy port I can view locally site built in hugo in the remote container](../images/proxy-port-in-gh-codespaces.png)
***Figure 3***: *Thanks to proxy port I can view locally site built in hugo in the remote container*

The only thing that actually is not working is a plugin I'm using to directly **paste image in Visual Studio Code**, because when I paste an image it keep telling me that there is no image in the clipboard. This is surely a problem of the Addin **thas was not supposed to run in an instance of a browser**, but apart this minor annoyance, I was able to edit my post, get my preview and use all my favorite Visual Studio Addin directly from my browser.

> The overall experience is great, I can now author a post directly from browser without any pre-requisite on my machine

Apart from this problem everything run just fine, **I'm able to write post directly in my browser and I can preview the site like I'm working locally**. This is a really nice capability I now have.

# Is it really useful?

This is a nice question, I'm asking myself if using Codespaces **is a real advantage respect using a standard local version of Visual Studio Code to edit my blog**. Actually the only annoying part is image plugin not working, but apart this, everything works really well, because I can now edit my blog from any pc and I do not need any prerequisites **my GitHub codespaces contains everything I need to develop my blog, nothing less.** 

For the image problem the solution is quite simple, I only need to **save my image in local disk then simply drag and drop on folder tree. The image will be automatically uploaded**. This is a minor annoyance, Paste Image plugin is nice because it can simply upload the image from the clipboard, but the extra step of saving locally then drag and drop is a price **that I'm paying for being able to edit my blog directly from any browser**.

> Apart some plugin that probably needs to be updated, I can drag drop files from my local disk to remote instance without any problem.

This is only a simple experiment, because authoring a post in hugo is not a real coding experience, but nevertheless GH Codespaces is **really useful even in this simple scenario**.

If you are interested you can [request an early access](https://github.com/features/codespaces/signup) to try codespaces for yourself.

Gian Maria.

## P.S. Note for Command line Git User

In GH Codespaces git is installed by default, but when I issued a rebase -i command I got an error, so I decided to configure vim as the editor of choiche

```bash
git config --global core.editor "vim"
```

This is needed if you want to use Git directly in your Codespaces terminal with **your inline editor of choice, mine is vim**.