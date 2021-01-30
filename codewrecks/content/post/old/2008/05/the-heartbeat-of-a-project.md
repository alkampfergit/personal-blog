---
title: "The heartbeat of a project"
description: ""
date: 2008-05-05T01:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
Continuous Integration is one of the most important part of a project, it gives the heartbeat of the code, when it is green the beat is ok, when it is red something wrong is occurred.

Setting up a good CI environment can be really challenging, but setting up a primitive CC.net is a relative simple task. I realized that even with basic functions, a CI can give you a valuable asset. I’m not a guru of CC.net or CI, but I usually set up a simple CI environment with only two task

1) compilation

2) Test run

These gives to me a lot of information, it tells me whenever peoples in the project broke the code, or when a change in code make some test fail. Even if I do not run code coverage, or some sort of advanced code metrics these simple two things bring me a lot of information. For Web Development, CI gives to my team another important thing, at each code change the CI environment redeploy the entire site in a test server. This operation permits to the team to be sure that the deploy script is ok, that it run smoothly and it permits to the tester to test against the latest version of the site. Having the green light on cc.net tray tells me that the project is in good condition and makes me confortable.

Alk.

Tags: [Continuous Integration](http://technorati.com/tag/Continuous%20Integration) [CI](http://technorati.com/tag/CI)
