---
title: "Git for windows getting Invalid username or password with Wincred"
description: ""
date: 2015-06-23T06:00:37+02:00
draft: false
tags: [Git,Github]
categories: [Git]
---
If you use Https to communicate with your git repository, Es, Github or VisualStudioOnline, you usually  **setup credential manager to avoid entering credential for each command that contact the server**. With latest versions of git you can configure wincred with this simple command.

{{< highlight bash "linenos=table,linenostart=1" >}}

git config --global credential.helper wincred

{{< / highlight >}}

This morning I start getting error while I’m trying to push some commits to GitHub.

{{< highlight bash "linenos=table,linenostart=1" >}}

$ git push
remote: Invalid username or password.
fatal: Authentication failed for 'https://github.com/ProximoSrl/Jarvis.DocumentS
tore.git/'

{{< / highlight >}}

If I remove credential helper (git config –global credential.helper unset) everything works, git ask me for user name and password and I’m able to do everything, but as soon as I re-enable credential helper, the error returned.  **This problem is probably originated by some corruption of stored credentials** , and usually you can simply clear stored credentials and at the next operation you will be prompted for credentials and everything starts worked again. The question is, where are stored credential for wincred?

> If you use wincred for credential.helper, git is storing your credentials in standard windows Credential Manager

You can simple open credential manager on your computer,

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image17.png)

 **Figrue 1:** *Credential manager in your Control Panel settings*

Opening Credential manager you can manage windows and web credentials. Now simply have a look to both web credentials and windows credentials, and delete everything related to GitHub or the server you are using. The next time you issue a git command that requires authentication, you will be prompted for credentials again and the credentials will be stored again in the store.

Gian Maria.
