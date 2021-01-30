---
title: "Unable to use Android Emulator error ADBVENDORKEY"
description: ""
date: 2019-09-19T10:00:37+02:00
draft: false
tags: [EverydayLife]
categories: [EverydayLife]
---
I’m working with Xamarin, but in my workstation, where my user has no administrative right, I’m not capable of running the emulator, even if I start everything with administrative user.

> Device unauthorieze ADB\_VENDOR\_KEY is not set

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-23.png)

 ***Figure 1***: *Error running the emulator.*

I have a really similar identical setup on another computer, where the user is admin of the machine and everythign work. I’ve found some solution on the internet, but nothing worked, until I found some clue on the fact that, this error is somewhat related to google store.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-24.png)

 ***Figure 2***: *Removing play store from emulator settings* ** ** First step was removing the Google Play Store from emulator configuration, then I needed also to force a Cold boot, because for some reason, it just don’t work on my system.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-25.png)

 ***Figure 3***: *Disable fast boot and force a cold boot*

On a decent developer machine, ColdBoot is fast, so actualy it is absolute not a problem for me. Now I’m able to use the emulator in Xamarin.

Gian MAria.
