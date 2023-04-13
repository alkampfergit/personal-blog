---
title: "Troubleshooting GitHub Codespaces PGP Signing Problems"
description: "In a GitHub repository you can fine tuning which actions can run in your workflow"
date: 2023-04-13T06:00:00+00:00
draft: false
tags: ["GitHub", "PGP"]
categories: ["security"]
---

If you use **GPG keys** to verify your commits, you'll be glad to know that in **GitHub Codespaces**, signing is done automatically. All you need to do is **configure the settings** in your account, and a key will be injected into your Codespaces. As a result, every commit you make in your Codespace will be automatically signed and verified.

![Configure PGP in codespace](../images/pgp-codespace.png)

***Figure 1***: *Configure PGP in codespace*

However, I recently encountered a problem. After enabling the setting for a while, it suddenly started failing with an error message indicating that the author was invalid.

{{< highlight bash "linenos=table,hl_lines=5,linenostart=1" >}}
error signing commit: error making request: 403 | Author is invalid
error making request: 403 | Author is invalid
{{< / highlight >}}

This error message was somewhat misleading, as I couldn't understand why the signing was no longer working. I consulted the [official documentation](https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-gpg-verification-for-github-codespaces) that explains the most common errors you can encounter when trying to enable automatic GPG commit signing in your Codespaces. Even after following the suggestions in the documentation, I was still puzzled because everything seemed to be set up correctly.

With the help of a friend, I eventually discovered that I had changed my name in my **GitHub account**, and it now ended with a **trailing space**. The problem was that when you open a Codespace, that space is trimmed. **As a result, when the code in the Codespace tries to add a signature to my commit, it cannot verify the author because it is different.** The author in the Codespace does not end with the trailing whitespace, while the author in the GitHub configuration does.

![Avoid trailing whitespace in your public profile name](../images/trailing-whitespace.png)

***Figure 2***: *Avoid trailing whitespace in your public profile name*

Fortunately, the solution was simple. I just needed to remove the trailing space in my name. So, remember, if you change your name in your public profile, always avoid ending it with a whitespace to prevent signing problems in Codespaces.

![Now commit is correctly signed](../images/correct-pgp-signature.png)

***Figure 3***: *Now commit is correctly signed*

As you can see from Figure 3, the commit is now correctly signed. I hope this post will help you avoid the same problem.

If you look at verification section in the commit, you can **verify that the key used is not your key, but an internal one from GitHub**. This happens because you do not need to **put your private GPG key in codespace**, because GitHub knows that you are the user using that codespace and can verify your commits without your private key.

![Commit is verified with GitHub internal PGP signature](../images/github-signature.png)

***Figure 4***: *Commit is verified with GitHub internal PGP signature*

The process is, you are logged to GitHub, you open a codespace, and GitHub can sign all commit done inside the workspace as done by you, because **it already verifies the login**.

Gian Maria.

