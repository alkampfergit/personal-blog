---
title: "GitHub Actions permission settings"
description: "In a GitHub repository you can fine tuning which actions can run in your workflow"
date: 2021-11-27T06:00:00+00:00
draft: false
tags: ["github"]
categories: ["security"]
---

Continuous integration is absolutely vital for a healthy software project, but in many situation **people gave little attention to security**. If you are running CI workflows in your machine where **you control the code that is build and every script that is run by CI engine, you are pretty fine**. In that scenario an attacker should take control of your code to run some malicious script during a CI run, but if you are using a third party task/extension/action, the situation is different.

## Risk of runninng code made by others

Each time you author a Continuous Integration pipeline, with latest tool you usually use building blocks written by people outside your organization and **outside your control**. As an example, this is a part of the GitHub action workflow that runs on commit to publish this blog.

{{< highlight yaml "linenos=table,linenostart=1" >}}

    - name: Deploy
    uses: peaceiris/actions-gh-pages@v3
    if: github.ref == 'refs/heads/master'
    with:
        deploy_key: ${{ secrets.DEPLOYKEY }}
        publish_dir: ./codewrecks/public
        external_repository: alkampfergit/alkampfergit.github.io
        publish_branch: master 
        keep_files: true

{{< /highlight >}}

As you can verify, I'm using an action made by peaceiris, another GitHub user that created this fantastic extension that I'm using to publish the blog on my GitHub page. **Looking at the code you are specifying only major version (names ended with @v3)**, this will imply that whenever the original developer will publish a new version of the action leaving the major version intact, my workflows will run the new version of the action.

> Using GitHub Actions outside your repository means that you are running code outside your control during your Actions

This will pose some question about security. I'm not implying that other users are malicious, but what happens if **another developer GitHub credential is stolen and some malicious user pushes another version of the action with a malicous content?**. As usual you should have an appropriate threat model to asses the situation, but ignoring it completely is not a wise thing to do.

When you asses security of your CI infrastructure there are many things to take into account, but basically you need starting answering some basic question.

> Where is the action executed

If your workflow is executed on a machine managed by GitHub or Azure DevOps or generally speaking managed by other, **there is little risk on compromise the machine itself, it will be destroyed after the execution of the action ended**. But on the contrary, if you are using a machine that is inside one of your network, a compromise machine can and will be a problem. Simply starting a reverse TCP shell on your workflow can give an attacker control of the machine and a foot in your network.

> How sensitive is the code you are compiling

Even if the machine is handled by someone else and it is destroyed upon script completion, **if the attacker can manipulate what is executed it can simply compress the code and send to a remote server for later inspection**.

> Machine time

This is an attack that is real, people started **abusing CI infrastructure to mine cryptocurrencies, like monero**, stealing cycle times from CI agents.

Luckily for us, GitHub has an integrated way to **restrict actions that can be run inside a workflow for each repository**. Just navigate into repository settings and you will see a nice Actions Tab that allows you to configure Action/Workflow permissions. A first section allows you to restrict Actions.

![Actions permission in GitHub repository](../images/actions-permissions.png)

***Figure 1***: *Actions permission in GitHub repository*

As you can see in Figure 1 you have a great deal of options, you can disable Action completely, allow only actions that comes from one of your repository, allow only official GitHub actions, actions created by [Verified Creators](https://github.com/marketplace?type=actions&verification=verified_creator) and finally you can also specify **a list of allowed account/actions using wildcards**.

Default settings is Allow All Actions, a perfect choice for a public repository, but for **a private repository you should check if that settings is ok for you**. Basically, if you are not using GitHub Actions, you should disable them completely. If you use Actions, you should check what action you are using and configure the most strict option you can.

## Code outside your control

The situation can be **made worse by Pull Requests**, basically when someone made a pull request, if you have Actions configured to run upon Pull Requests, you are basically **allowing other people to start a workflow in your repository with full control of the code**. 

Even if you configured your CI infrastructure to run only scripts that are inside the repository, **a malicious user can create a PR with a modified version of those script**, ending in running malicious code during CI. For this scenario, you should check PR permission in the Action configuration tab.

![Pull requests permission in GitHub repository](../images/actions-pr-permissions.png)

***Figure 2***: *Pull requests permission in GitHub repository*

Since this is a really serious risk, default option is to require approval for **first-time contributors**. If another user creates a PR on your repository, at the first PR that user **must be authorized, subsequent PR will trigger actions normally**. As you can see, default option prevent anyone that has no contribution to the project to create a PR.

A less restrictive check is allowing any GitHub user that is not recently created (people that opens a GH account to abuse the system). And a third most strict check will require an approval every time a PR **is created by a collaborator that is outside the organization/account**. This setting is really important, because allowing anyone to run Action upon a PR could be a really risky scenario.

Finally you can choose if the token used in GitHub action has write or only read permission to repository.

![Token permission](../images/actions-write-permission.png)

***Figure 3***: *Token permission*

Thanks to these settings, you can restrict what runs in your CI infrastructure, **be sure to review that settings accordingly for each situation**.

Gian Maria.

