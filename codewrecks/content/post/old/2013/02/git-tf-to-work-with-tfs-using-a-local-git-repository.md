---
title: "Git-TF to work with TFS using a local Git repository"
description: ""
date: 2013-02-05T19:00:37+02:00
draft: false
tags: [git-tf]
categories: [Team Foundation Server]
---
Now that TF Service officially supports Git, many people ask themselves if  **standard TFS VCS is dead?. The answer is clearly no** , because a distributed source control is not suitable for all teams / scenario. Anoter reason why standard TFS VCS is not dead is the presence of git-tf ([http://gittf.codeplex.com/](http://gittf.codeplex.com/ "http://gittf.codeplex.com/")), a java based tool by Microsoft that permits you to use a TFS VCS but work with Git locally.

Distributed VCS are clearly far superior when:

- *One or more member of the team works together in remote offices where there is no internet connection or it is not possible to reach the central server (Es. develop in a factory in some remote region of the World).*
- *You want to work on a feature, you want to sync with the central server only when you are ready, but you can commit to local repo instable versions.*
- *You work offline often so you need to have the ability to do local check-in waiting to reach a connected site again*

Thanks to git-tf you can simply use standard TFS VCS as usual, but if a developer prefer to use Git or when he is offline, he can benefit of Git locally even if the VCS used is centralized.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image6.png)

With git-tf  **not every member of the team is forced to use git** , if you want you can simply map TFS source control with a standard workspace and work as usual, *while other members of the team are using git*. Each member of the team can choose the tool that best suites to him.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image7.png)

 **A single developer can have both of them in a single machine** , as an example when you work connected with your TFS, you can simply work with standard TFS workspaces; when it is time to go on remote site, where connection is not available, you can sync a git repository you have in another folder, and then work with the git repository while you are offline.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image8.png)

Thanks to the ability to manage mixed VCS and DVCS with git-tf you can really have the best of both world.

Gian Maria.
