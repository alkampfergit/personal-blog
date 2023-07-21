---
title: "Resolving Credential Conflicts in Git"
description: "A guide to solving issues with multiple GitHub accounts in the Windows credential manager."
date: 2023-07-21T08:10:42+02:00
draft: false
categories: ["GitHub"]
tags: ["GitHub", "Pull Requests", "Programming"]
---

Have you ever found yourself being asked to **select a GitHub account every time you make a push**? This is often due to multiple access tokens being stored in your Windows credential manager.

The Git Credential Manager can become confused when it doesn't know which account to use. It's only option in these situations is to ask you which of the stored credentials it should utilize.

![Command line interface suddenly opens a window asking you to select accounts](../images/command-line-interface.png)

***Figure 1:*** *Command line interface suddenly opens a window asking you to select accounts.*

When you make a push or a pull from GitHub, two components handle authentication. The **first is the GitHub credential manager**, a tool that gets installed in your Windows with your Git distribution. It caches your login information, sparing you the need to input credentials every time you interact with GitHub.

These credentials are stored in the **second component, called Windows credential manager**, a system service that allows software and programs to securely store credentials.

![Windows Credentials manager allows you to manage stored windows credentials](../images/windows-credentials-manager.png)

***Figure 2:*** *Windows Credentials manager allows you to manage stored windows credentials.*

If you are presented with the account selection dialog or have trouble logging in from the command line, the solution is usually to open the Windows credential manager and look for the GitHub credentials.

![Multiple Github credentials stored in the Windows Credentials Manager](../images/github-credentials.png)

***Figure 3:*** *Multiple Github credentials stored in the Windows Credentials Manager.*

As illustrated in **Figure 3**, there can be more than one GitHub credential listed. When the command line attempts to log in to GitHub, **it uses the Windows credential manager, which retrieves both credentials**. As it doesn't know which one to use, it presents you with the account selection dialog.

The solution is simple: delete all the credentials that are not the correct one. **The correct credential usually starts with 'git:' and contains your GitHub username**. The others are likely access tokens saved by other tools. Once you delete these entries and leave only the correct one, you should no longer be presented with the account selection dialog, and you can push without any issues.

Gian Maria
