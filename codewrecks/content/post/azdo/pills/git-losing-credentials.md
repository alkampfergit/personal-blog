---
title: "Pills: Git command line failed to authenticate against Azure DevOps"
description: "How to avoid being stuck in Authentication Failed against Azure DevOps in Git command line"
date: 2022-08-27T07:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

Sometimes it just happens, you issue some Git command and you found that Azure DevOps deny Authentication, and it does not prompt for new credentials, so you are **just stuck not being able to access your account anymore**.

![Git authentication failure](../images/git-authentication-failed.png)

***Figure 1***: *Git authentication failure*

As you can see in Figure 1, you got an Authenticaiton Failed error, and you are not prompted for new credentials. **Azure DevOps uses Personal Access Token to give access to Git, and this is done with an automatic procedure triggered by command line**. In Figure 2 you can see Credential Manager Windows that appears the first time you are connecting to an Azure DevOps server.

![Git Credential Manager Authentication Window](../images/git-credential-manager-authentication.png)

***Figure 2***: *Git Credential Manager Authentication Window*

This Windows basically makes you authenticate in a browser, then use API to get a Personal Access Token. You can verify that **after login you will have a new Personal Access Token generated**.

![Git Credential Manager generated Personal Access Token](../images/git-credential-manager-token.png)

***Figure 3***: *Git Credential Manager generated Personal Access Token*

> With Azure DevOps, Git Credential Manager generates a new Personal Access Account for your user

Now, given this fact, the question is, where Git Credential Manager **stores this Personal Access Token to avoid generating a new Token at each access?**. This is the main purpose of Git Credential Manager, **managing credentials**.

In Windows the answer is simple and it is called **Credential Manager**. Just Search for Credential Manager and you should be able to open credential manager.

![Git Credentials in Credential Manager](../images/credential-manager-git.png)

***Figure 4***: *Git Credentials in Credential Manager*

As you can see in Figure 4 you have the **Windows Credential section that contains lots of information, and you should be able to find entries for git:https://dev.azure.com**; that specific entry contains Personal Access Token for that specific server. You can simply Delete that entry and the next time you issue a Git command that involves contacting the server **will trigger again the authentication procedure so you can get another token**.

> If you got Authentication errors in Git and you feel stuck, just go to Credential Manager and delete the entry for the server you are trying to access.

The reason why a token is not working anymore can be: Token is expired or token is revoked, and usually Credential Manager **detects this situation and automatically triggers new authentication procedure**, but if automatic detect of invalid token fails, you now know how to fix it.

Gian Maria.