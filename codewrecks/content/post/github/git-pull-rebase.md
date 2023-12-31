---
title: "Always use rebase when you pull in Git"
description: "I always suggests people to use rebase as standard merge strategy, now it is becoming mainstream."
date: 2023-12-31T06:00:00+00:00
draft: false
tags: ["GitHub"]
categories: ["security"]
---

I have always suggested people to only use rebates when you pull changes from the branch you are working on in git. And this because, actually, using merge will make your repository history a mess.

For a lot of years, this kind of suggestion was not so common. I've always looked at the teams happily used merge and then complain about how difficult is to read the story of the repository. At a certain moment, get added a nice option that changed the default strategy of reconciled modification when you pull. And instead of using standard merge, you can configure to use rebase.

I had a pleasant Surprise in a new machine when I. simply get pull from a remote repository and I didn't configure the pull.rebase option But get stopped the merge and actually gives me a nice warning that I didn't configure anything. So I just need to configure what I want to do when pulling changes from a remote repository.



As you can see from the picture. when kid determined that I have some changes that need to be reconciled with the remote changes, it simply stopped and asked me to explicitly configure the strategy so I can simply do a get config pull.rebase true. 

Actually, this is a configuration I'm doing on all my new machine, but the fact that get prompt you explicitly for doing this choice brings the attention to the user that probably the default strategy of merge used for years is not probably the best one, and you just need to be aware that probably using a different strategy is better. And at least you need to do an informed choiche.

In my experience, I've always advocated for using `git rebase` over `git merge` when incorporating changes from different branches. This approach helps maintain a cleaner and more linear history in your git repository. 

Initially, this advice wasn't widely accepted. I observed many teams defaulting to `git merge`, only to later complain about too complex history of the repository. However, a pivotal change came with Git introducing a new default strategy for integrating changes during a pull operation. This feature allows users to configure `git` to prefer rebase over the standard merge. **This simple configuration is called pull.rebase but is not so well known in the wild.**

Today I worked with a new Virtual Machine where I forgot to set pull.rebase to true, but after executing a simple `git pull` from a remote repository, Git halted the operation. **It displayed a helpful warning, indicating that I hadn't specified a preferred strategy for integrating changes.**

![Warning telling me that I need to choose the strategy for pulling changes](../images/gitrebase.png)

***Figure 1:*** *Warning telling me that I need to choose the strategy for pulling changes*

As depicted in the screenshot, when Git detected changes in the remote repository, but I didn't choose a strategy, it stopped the operation and **prompted me to explicitly set the integration strategy.** 

This is a really welcomed feature in my opinion, because it is suggesting that the default merge strategy might not always be the most effective one. For years suggesting to set pull.rebase to true was **judget some advanced or niche setting, because if we have merge since the beginning, that would be the preferred option.** With this function users are encouraged to consider alternative strategies like rebase for a more streamlined and comprehensible history. Ultimately, it's about making an informed decision that best suits your workflow.

Gian Maria.

