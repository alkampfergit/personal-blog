---
title: "Use GitHub codespaces to author blog post"
description: "Thanks to GitHub codespaces it is super easy to author blog post in hugo"
date: 2021-08-19T08:00:00+02:00
draft: false
tags: ["GitHub"]
categories: ["github"]
---

## The scenario

I played [a little bit with GitHub Codespaces](https://www.codewrecks.com/post/general/github-codespaces-first-impression/) when it was in preview, now it is time to try to use it real activities to **understand scenarios where it can be useful**.

To have a real test you need **to setup a goal to verify if the tool is capable of reaching that goal, and if it is an advantage over existing tool**. My first goal is being able to write Blog Post in hugo with GitHub Codespaces and being able to determine if it is more productive than running a standalone local version of Visual Studio code.

Following opinions are strictly based on my real usage of Codespace in the aforementioned scenario, writing blog post (I'm actually writing this post with Codespaces).

## Advantage: Productivity at one click distance

This is the real reason to use GitHub Codespaces, you login into your account then you can start working with a single click on your codespace, **no need to setup stuff on your machine**. This allow you to use whatever computer you have, just an internet connection, and you are ready to go (you could potentially use a tablet or a phone). 

![Just one click and you are ready to rock](../images/codespace-just-click.jpg)

***Figure 1:*** *Just one click and you are ready to rock*

## Advantage: Simple to configure

I know that there are a method to choose tools and packages for your codespace, **but once it starts the first time, you can simply start installing extensions and installing packages with apt**. Codespaces is running in an ubuntu based container, so you can install whatever you want, when you finish working codespace will deactivate and once you **reactivate again you will start from where you stopped**.

This mean that you do not need to learn anything new to use Codespaces, just start a new Codespace, install whatever you need (packages or addin) and start working.

Im my example I just installed hugo with npm, some plugin I'm using, and I'm ready to write.

## Advantage: it is your familiar Visual Studio Code, just in a browser

You do not need to learn a new tool, if you are already using Visual Studio Code, you just **will use it in a browser, from your operating system of choice**. 

## Disadvantage: running in a browser has some limitation

Since Codespaces runs in a browser, it has some limitation, as an example **one of the plugin I usually use, called Paste Image** does not work. I'm really used to capture the screen with Techsmith Snagit, then CTRL+C to copy the image, then simply use Paste Image plugin to have it paste the image in a subfolder called images and generates a markdown placeholder for me. 

With Codespaces I'm forced to save the file on my local file system, but **I verified that drag and drop from local filesystem onto codespaces works perfectly**, so the inability to use Paste Image is just a minor annoyance. **Remember to check if every plugin you need can run in the codespace version of Visual Studio Code**.

Another plugin that seems not to work is "Spell Right" that is useful to do a spell check in various language, you can install it but since it usually works with installed dictionary already present on the machine, it seems not to work in codespaces. **This is really not a problem because you can find other plugin that works just perfectly**

## Advantage: Forwarded ports

To have a preview of your post you need to use Hugo in server mode, it will usually **open port 1313 where it serves the current version of your site**. Thanks to Codespaces, if some program is opening a port (like hugo in this example) the infrastructure will create a forwarding port to allow accessing that port in the container from the outside.

![Forwarded port in action](../images/codespaces-forwarded-port.jpg)

***Figure 2:*** *Forwarded port in action*

Just clicking on the link **will open that port with a special link that will forward your browser to that specific port, and it is valid only for you**.

![Forwarded port in action](../images/forwarded-port-in-action.jpg)

***Figure 3:*** *Forwarded port in action*

If you try to open that link from another browser where you are not logged in, the link will just not work. Thus you can trust your port not to be forwarded publicly, but only for you.

## Advantage: Environment tailored for your scenario

I use Visual Studio code for lots of stuff: Azure, angular, docker, python, etc, and I usually have a huge number of plugin and tools installed on my dev machine **just to be ready to work in one of this scenario**. My visual studio code is FULL of plugins but I normally use few of them in each scenario. Thanks to GitHub codespaces, each codespace will have a personalized version of Visual Studio Code where I have **only the plugin and the tool I need to develop that specific project**.

## Advantage: Use Local version of Visual Studio Code

If you need to use a local version of Visual Studio Code (as an example you cannot live without Paste Images plugin), you can open a local instance of VsCode that is connected to your Codespace. This will allow you to continue using your container with everything you configured, but running Visual Studio Code locally.

## Conclusions

The overall experience is really good, I wrote several blog post with Codespaces and I need to admit that I'm still a little bit slower due to "Paste image" capability missing, I **really love the ability to just click and start from whatever computer I'm in**. 

Gian Maria.




