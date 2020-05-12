---
title: "Double T shaped professional"
description: "Security is often considered a vertical skill, nothing is far more from the truth"
date: 2020-08-10T18:40:00+02:00
draft: false
tags: ["security"]
categories: ["general"]
---

The term T-Shaped Professional or T-Shaped Skills is widely used to identify a person that has a good deep knowledge in a specific area and a broad knowledge on other areas.

This kind of professional **is perfect to fit into DevOps culture, because it can collaborate better with others in the team**. As an example, a front-end Developer usually has the leg of his T in web technologies (angular, Typescript, HTML, etc.) but he should also have a little bit of knowledge on backend development, networking and others. The same happens for other roles in the team, a Network Engineer has a deep knowledge of network infrastructure, but he/she should have some knowledge on Database, Development and web framework to communicate better with others.

> Having a small knowledge of everything that regards the project will maximize communication and it is perfect in DevOps cultures, where good communication is paramount.

One of the benefit of this approach is that **every person of the team knows a little bit of everything**, this usually avoid misunderstanding. This is especially true for developers when they learn how to maintain a production environment. When you face the problems of having everything up and running 24/7 he/she will probably make better decision in own area of expertise. This **does not means that a developer has the entire skill set to maintain a production server, but he/she needs to know at least the basics**.

Usually the typical example regards logs. How many times poor ops, when something does not works, starts examining big logfiles just to find nothing useful inside. **When a developer instead uses logs everyday to diagnose problems during developing, life of ops will be easier.** 

In such scenario there is something that has a special place: Security. At first you can be tempted to say that **Security is just another leg of the T**, a security expert have the leg of his/her T in security, while having a little bit of knowledge on other areas, **but in my opinion this is an oversimplification**.

> Security is not a distinct area of expertise, it is a mindset supported by deep knowledge in own fields of competence.

Security involves the whole process and impacts everyone and everything, from requirement to programming to maintain software in production, from dev to ops and project managers. In my idea **security is another T that just overlap basic T and is a T that everyone should have**. If you are a frontend developer, you must have the leg of your Security T on frontend security, while having a little bit of knowledge of security in other areas. In other words, **you should have a deep knowledge of security in the area you spend most of your work time**.

> Security is something that impact every decision and activity in a software process, a good security knowledge is a prerequisite for everyone in the team.

![Security Red T is a Shadow of main T](../images/double-t-shaped.png)

***Figure 1***: *Security Red T is a Shadow of main T.*

Sadly enough **security is often underestimated and, in 2020, we still have injection as OWASP top security risk**, can you believe it? This is why you should try to focus your security knowledge on the same sector of your main experience. If you are a back end developer who wrote code that access SQL database, you **MUST be aware of risk of Injection in parameters and write code that will prevent them.**; if you design an API layer, you should take great care of **good validation of parameters** and so on.

I usually call security T the “Shadow T” because it should supports you in everyday decision, it is behind every piece of code or every network infrastructure decision you take. The real risk is simple: **if you do not keep security constantly into your workflow, you will realize your mistake when it is too late, often after a data breach**. In a perfect world, every decision you take in your current project should be evaluated with the Shadow T.

After years still we find MongoDb or ElasticSearch exposed in internet without authentication, this means that whoever put those machines in production did not place enough attention to security implications and this is simply unacceptable. A good developer that uses MongoDb will put in place security check to avoid this, such as **refusing to start software if supplied MongoDb connection string has no password.**

If you manage teams, you should check if every member of the team has the Shadow T and, if not, you should made him/her use some work time to close this gap.

Gian Maria.