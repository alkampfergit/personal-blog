
---
title: "Using GitHub Command Line Tool to View Pull Request Info"
description: "A quick guide on how to use the GitHub Command Line Tool to view Pull Requests information directly from the terminal."
date: 2023-07-20T08:10:42+02:00
draft: false
categories: ["GitHub"]
tags: ["GitHub", "Pull Requests", "Programming"]
---

For people like me who prefer using Git in the command line, there are times when I need to retrieve information about pull requests or other GitHub related tasks. For example, suppose **I need to share a link to a pull request that is under review with one of my colleagues for them to comment on**. Sure, I could navigate to the GitHub website, locate the repository, navigate to the pull request page and get the link. But, since I'm already in the command line, I'd prefer a faster way.

If you have the GitHub command line tools installed, you can simply use the `pr list` command:

![GitHub command line tool in action](../images/gh_command_line_tool_image1.png)

***Figure 1:*** *GitHub command line tool in action*

As you can see, it provides a simple list of all open pull requests in the current repository. Now, **using the `view` command, you can view detailed information about a specific pull request**:

![GitHub command line shows pull request details](../images/gh_command_line_tool_image2.png)

***Figure 1:*** *GitHub command line shows pull request details*

With this command, I can confirm that all the checks are passing, view comments on my request, and even get the link I can share with my colleague. This link will direct them straight to the pull request under review.

**For those of us who love the command line, the GitHub Command Line Tool is an invaluable companion**. It allows us to perform a range of operations related to GitHub directly from the command line, eliminating the need to open the web interface.

If you're a fan of the command line like me, I strongly suggest giving the GitHub Command Line Tool a try.

Gian Maria.
