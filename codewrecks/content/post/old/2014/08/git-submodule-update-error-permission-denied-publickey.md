---
title: "Git submodule update error Permission Denied Publickey"
description: ""
date: 2014-08-10T07:00:37+02:00
draft: false
tags: [Git,ssh]
categories: [Git]
---
It could happens when you clone a Git Repository with submodules, issuing a * **git submodule update** *command, you are prompted with this error error.

> Cloning into ‘src/xxxx’…  
>  Warning: Permanently added the RSA host key for IP address xxx.xxx.xxx.xxx to the list of known hosts.  
>  Permission denied (publickey).  
>  fatal: Could not read from remote repository.

If you search in the internet for the cause of errors, you can find  **some people suggesting that the url specified in.gitmodules file is wrong** and should be changed, here is my.gitmodule

> [submodule “src/CQRS”]  
>      path = src/CQRS  
>      url = [git@github.com:xxxxxx/cqrs.git](mailto:git@github.com:xxxxxx/cqrs.git)  
>      branch = master

 **You could change the url configuration to https url and everything works** , but this is not the perfect solution, because the address [git@github.com](mailto:git@github.com) is perfectly valid, but probably there is some problem with your RSA keys stored in Github (or you never configured RSA Keys for your account). In my situation, my RSA Keys had some problem and I needed to recreate another one. If you do not know what a RSA key is and how to create a RSA Key to connect to github I strongly suggest you reading the guide: [Generating SSH Keys.](https://help.github.com/articles/generating-ssh-keys)

Once you configure a valid certificate in github your submodule should word without problem.

Gian Maria.
