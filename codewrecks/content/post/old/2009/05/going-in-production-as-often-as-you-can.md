---
title: "Going in production as often as you can"
description: ""
date: 2009-05-29T02:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
I really care the concept of â€œ[going in production](http://www.codewrecks.com/blog/index.php/2009/05/09/good-programmers-put-code-in-production/)â€, because it is the moment when the software bring to life. Going in production can be sometimes a really difficult thing to do, and there are a lot of reasons behind it.

First of all we have the syndrome of â€œ **It works on my machine** â€. The software run perfectly in developerâ€™s machines, but when you move in production servers or into customers machines nothing work. If you ask developer, quite always you get this answer: â€œHAve You installed library XYZ? Then have you wrote into the registry the SuperSecretKey XYXCWKDSAF, after you done this you should run for a mile, turn yourself for three time with fingers on your nose, â€¦..â€ This is the sign that you need at least a  **document that explain how to deploy software,** or youâ€™re gonna kill your developers

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image-thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image8.png)

Then the software begin to work with real customer data, and you can see with horror that everything worked ok with test data, but when you import 10KK orders from the old system of your customer, the software stops working. But other problems can arise, maybe the customer works with order with negative amount and the software does not permits so. In the end, you find that test data were not representative, and now you are in trouble with a live system that is not capable to handle the data that the customer really needs. (youâ€™ll end with unsatisfied customer)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image-thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image9.png)

Maybe the software begin to crash, when you see the log it happens that users insert â€œHello Folks!â€ where the software expects a DateTime…Ok, it is not so simple, but it often happens that real user uses the software in a way we never thought that was possible, and this pattern lead to a crash.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image-thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image10.png)

You have your system in production, users begin to send feedback, after some time you have a new version ready, butâ€¦ you now have to update database, update client machines, make sure that older version can work with the new data. Another typical problem is that you cannot stop production server, but you need to make changes online.

Customer Calls you telling â€œThe system crashedâ€, if you ask more detail maybe you get â€œThe System crash when we are working on itâ€, please do not expect customer to be technical skilled, he can never tells you real details of the error, if you want to laugh just ask to the customer â€œCan you send me the stack trace?â€, the answer can range from â€œWHAT??â€ to â€œHey does not bother me with technical terms, the system chrased, NOW YOUâ€™LL FIX ITâ€. Then you can only go into production server and then you need to understand why, when, what part of the system crashedâ€¦. it sounds you need real careful logging system. Maybe you log everything in a file, butâ€¦. you have no access to production server because in the customer web farm, so you need to contact the IT manager, tell him you need log, typical answer is â€œin witch machine are those logâ€¦â€¦ this lead to pain and frustration

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image-thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image11.png)

I can continue but the real concept is that a system in production can generate an high number of problems that does not arise during developement stage. So what is the solution? It turns out that it can be as simple as the sentence

> â€œGo in production as often as you canâ€.

I only gives you a little scenario. Set up a CC.net or similar integration machine, create a test production server, at each check in the integration machine compiles code , runs tests and if everything is ok, it deploys the software in the test machine, let it be called  **preproduction machine**. Fill this machine with real data, and  **make it available to the customer**. Now you immediately faces all the problems of a system live in production, because  **you are actually developing against a software in production** , where you virtually go in production at each checkin ;).

1. You are forced to create deploy script that automates the task of deploying the software
2. You are forced to maintain data of the customer in the preproduction machine, so you need to find a way to manage software updates.
3. You immediately works with real data and real user, moreover you immediately have feedback on the software
4. Since software is in development stage, bug arises, and you need a quick way to correct them, so you will setup a good error handling system such as [elmah](http://www.raboof.com/projects/Elmah/), or maybe you can setup a log system that email or send all data to a bug tracking system where developer will automatically see details about the error, without the need to go into the production machine.

This means that you begin to  **face immediately typical problems of a live software, and you do not postpone solving them when you really are in production.** Solving a problem when you are really in production, can be really a pain, so you better work hard to make all possible problem arising during developement stage. Time spent to immediately start developing with a production environment can be difficult, but in the long run it really saves your life.

Alk.

Tags: [Production](http://technorati.com/tag/Production)
