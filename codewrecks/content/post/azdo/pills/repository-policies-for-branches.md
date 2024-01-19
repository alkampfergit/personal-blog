---
title: "Pills: Do not miss repository policies in Azure DevOps"
description: "This post discusses the importance of properly setting Azure DevOps repository policies. These policies help maintain repository cleanliness, enforce naming conventions, and prevent issues in multi-operating system development environments."
date: 2024-01-19T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

If you use Azure DevOps, it's worth **checking in repository settings page all the settings related to the policies of the repository itself**. This is because often this type of setting is completely ignored, and you lose the opportunity to have very important controls on the repository itself.

As you can see in Figure 1, there are many interesting policies that can help your team to keep a nice and healty repository.

![Repository policies in Azure DevOps](../images/repo-policies-adzo.png)

***Figure 1***: *Repository policies in Azure DevOps*

The first one allows you to insert pattern for the emails that are used as the author. One of the most useful cases is **forcing all commits to have emails that belong to a domain**, for example, the company domain. This prevents developers from perhaps using personal emails that are mistakenly set globally in their operating system.

The second option: Blocking certain paths usually is less useful, but it becomes interesting if we want to reinforce certain naming conventions and especially to avoid **some names that you know can generate problems**.

But it's the third option, **case enforcement, that is actually particularly useful, especially in recent years when it's quite normal to have development teams alternating between Windows, Linux and Macintosh**. In this case, one of the problems is that the Linux file system is case sensitive, and I assure you that it's a particularly frustrating experience to have commits in which files are changed only at the casing level. In this case, the third option allows you to prevent a commit that changes the case of a file. This situation is particulary painful if someone on Linux change a path changing the case and then change some file inside that folder. I assure you that in Windows you will be sometimes even prevented to touch that file. `Case Enforcement` is the typical option I alwasy enable.

Blocking `Reserved Names` should always be kept active, because it simply **avoids the possibility of having `Reserved Names` in paths and file names that are not available in various operating systems**, always to avoid generating problems when working with mixed operating systems. Remember that the rules for valid paths are different between Linux and Windows, you can have `":"` in Linux file system, think what whould happen in Windows...

The maximum path length is also a great help because even if the NTFS system allows longer names than 248 characters, we know very well that in reality problems occur with various tools and then we are not able to access the files. Personally, I would also put a stricter restriction, for example, 220 characters, because we have to consider that developers don't clone at the root of a disk.

**Preventing files of more than a certain size is also very interesting** because in the past I encountered  repositories that have become very large because, by mistake, someone had inserted binary files, for example, log files. If you notice this problem late, then it's necessary to rewrite the entire history, an operation that is usually quite boring.

Clearly, it's also possible to set a **default that applies to all repositories.** This is very useful when some of these options need to be forcibly enabled for all repositories without having to enable them one by one. As I told you before, the `Case Enforcement` is a good candidate to be enabled for all repositories as well as `Reserved Names`.

Now it is time to examine policies at the branch level, and in this case, the meaning assumes a broader value.

![Branch policies in Azure DevOps](../images/azdo-branch-policies.png)

***Figure 2***: *Branch policies in Azure DevOps*

In this case, the policy represents a **contract that must be validated by a Pull Request.** This means that unless we bypass the policies, we must create a `pull request`before making a commit in the branch that is protected by these policies. I usually protect the develop branch, thus everyone is forced to create feature/bugfix branches and then he/she is forced to create a `pull request` to close on develop.

And so we can, for example, require a specific minimum number of reviewers. In this case, in Figure 2, we can see that we want a **minimum of two reviewers, but we can admit that the author of the `pull request`can also approve.** This is useful because maybe the person who opens it is not the only author and therefore his/her vote is still a valid vote. Actually I'm not a great fan of too restrictive policies.

![Approval status when new changes are pushed](../images/when-changed-are-pushed.png)

***Figure 3***: *Approval status when new changes are pushed*

The option `When new changes are pushed` is particularly important, because it **specify what happens when new commits are added to the branch under the Pull Request.** In fact, we can require that at least one new approval takes place. Reset all previous votes and therefore require all approvals again. And not reset the reset votes or wait or reject and reset the entire approval status of the `pull request`completely. We can also require that there is an approver for each iteration or simply to have an approval on the last iteration. This option is very interesting but delicate because **sometimes the author continues to make commits to correct the comments made by other person of the team**. In this scenario persons do not approve but set **wait for author**, then  the author fixes the comments and then ask for approval again. For that reason `When new changes are pushed` is not a policity that I use a lot.

Returning to the general policies of the branch, we can **require that a link to a Work Item is always present** or that **all comments made by reviewers have been correctly closed**, and more interestingly, we can also limit the types of merge. So, for example, in Figure 2, I configure policies to allow only rebase and avoid merge. 

As described in previous posts, **it's then possible to add pipelines that will run on the merge result with the target, which allow us to ensure that the code compiles, that all unit tests are green, etc.** We can also require that commits in certain particular paths of the repository automatically add a reviewer. As an example I put the name of a Pipeline expert in the path where we store build/release pipeline because that part is really sensitive.

In conclusion, Azure DevOps allows you to set policies for branches that help us keep the repository clean and, above all, avoid many problems that can occur, especially with development on multiple operating systems. Therefore, it is worth going to see the settings in your repositories and setting them in the most suitable way.

Gian Maria.

