---
title: "Pin GitHub action SHA to avoid security risk"
description: "If you are using third party actions in your GitHub Action you should use SHA security pinning to mitigate the risk of attack on action repository"
date: 2025-03-16T08:00:00+02:00
draft: false
tags: ["security", "GitHub actions"]
categories: ["github"]
---

# The problem

When you author GitHub action pipelines, you usually use third party actions, that can be easily referenced in your workflow with simple syntax.

Usually you refer to a github action in your workflow with the following syntax

{{< highlight yml "linenos=table,linenostart=1" >}}
- name: Setup Hugo
  uses: peaceiris/actions-hugo@v2
  with:
    hugo-version: '0.128.0'
    extended: true
{{< /highlight >}}

This is the **standard way to use a third party action inside your workflow**, you specify the name of the repository in the uses part of the step, and then specify parameters.

This expose you to attaks, because **there is the possibility that someone get access to the original repository and change the step to something malicious**.

There are tons of malicious things that a compromised action can do, but usually **dumping credentials is a common task**. This is not a theoretical attack, [it already happened](https://semgrep.dev/blog/2025/popular-github-action-tj-actionschanged-files-is-compromised/)

# How to solve the problem

Here is an extract from the [security hardening guide of GitHub](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)

## Pin actions to a full length commit SHA

Pinning an action to a full length commit SHA is currently the only way to use an action as an immutable release. Pinning to a particular SHA helps mitigate the risk of a bad actor adding a backdoor to the action's repository, as they would need to generate a SHA-1 collision for a valid Git object payload. When selecting a SHA, you should verify it is from the action's repository and not a repository fork.

Basically when you use an action, the part after the @ sign, it is the version you are using. In the previous example **the version I was using is the version 2**. Choosing a version allows for the author to **introduce breaking changes changing major version or generally speaking following the rules of [semantic versioning](https://semver.org/)**.

Instead of using a version, you can specify a specific commit. You just **go to the repository that contains the action, choose the tag corresponding to your version, and uses the full tag instead of version.**

{{< highlight yml "linenos=table,linenostart=1" >}}
- name: Setup Hugo
  uses: peaceiris/actions-hugo@16361eb4acea8698b220b76c0d4e84e1fd22c61d
  with:
    hugo-version: '0.128.0'
    extended: true
{{< /highlight >}}

That solves the problem because now, an attacker cannot create a commit with the same id, so the problem is gone. 

Sadly enough this is a practice that is **not well know and I must admit that I uses only for sensitive projects**. 

Another good practice is using action where the author **enabled [vigilante mode](https://docs.github.com/en/authentication/managing-commit-signature-verification/displaying-verification-statuses-for-all-of-your-commits)** but that does not prevent the attack, because no one prevents a malicious author to sign their commits, or to get some reputation on GitHub before launching the attack.

So, basically, you should refrain to use lots of third party actions if you work with sensitive project, and then, read the above GitHub guide to learn how to avoid storing secret in your repository on in your GitHub Actions.

# Azure DevOps pipeline

Azure DevOps pipelines does not have the ability to pin to a SHA because **it uses a marketplace where you need to be enabled before pushing tasks**. This makes the marketplace a more controlled places.

But even in azure devops Pipeline you can pin the number to a very specific version like

{{< highlight yml "linenos=table,linenostart=1" >}}
- task: XplatGenerateReleaseNotes@4.6.2
{{< /highlight >}}

Basically this is the same of SHA pinning of GitHub.

## Other advantages

Another advantage is being sure that a change in the action / task does not impact your pipelines. Even if the author carefully checks change in code **there is always the possibility that a minor change will impact your pipelines**.

If the action / task works well, you can still use the very same version without worrying too much. The only thing you need to check are vulnerabilities, but usually actions are simple and thanks to GitHub security features, it is simple to know if a specific version has a vulnerability.

Also you can schedule **periodic upgrades** where you can pin another version, maybe not the latest so **people have the time to report security issue**. If you choose a version of some month ago, probably you are pretty sure that it is safe. 

# What you lose with SHA pinning 

Actually if the author find bug in the action, usually bugs are fixed changing only the patch version of semver, thus **allowing your action workflow to use the most correct and up to date version of the action if you only specify major version** 

If you pin the action (or specify full version in Azure DevOps) you should periodically check the action and update to a new SHA that contains a new version if bugs were found. 

# Conclusion

Security in CI/CD pipelines is often overlooked, yet it's a critical aspect of your overall security posture. Using SHA pinning for GitHub Actions is an essential practice that offers a strong security benefit with minimal drawbacks:

The main trade-off is the manual effort required to periodically update your pinned SHAs **to incorporate bug fixes and security updates.** For many organizations, especially those working with sensitive information or in regulated industries, **this extra maintenance effort is well worth the security benefits.**

Gian Maria


