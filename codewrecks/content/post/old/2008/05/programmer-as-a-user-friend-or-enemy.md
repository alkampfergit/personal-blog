---
title: "Programmer as a user friend or enemy"
description: ""
date: 2008-05-30T22:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
In a project I’m working to, there is a point where the user is supposed to enter a series of word separated by space. A user call you telling that the routine does not work, you check the data and see that the object contains such a string

“key1, key2, key3,key4”

What you will do as the programmer that write that part of the software.

1) Complain with the user, how he dare to call it a bug when he inserted data in the wrong format? The specification does not speak of comma separated values, moreover sometimes there is a space, sometimes no.

2) silently goes into the code, make a quick patch, and verify that the string can be split even with this format. Tell the user that the bug is gone.

3) Tell the user that actually he inserted data in wrong format, tell him that this is not a problem, because you can modify the routine to be more “user proof” with little effort, open the project, write some test to cover this new situation, then make modification to the code and check that all is green again.

Situation 1 is when the programmer considers users as enemy, they are evil being that are driving you crazy with weird request, you have to fight them

Situation 2 is when the programmer is the slave of the user, that consider it simply a tool to get computer works as they desire, you have to silently do whatever they told you to do.

Situation 3 is when the programmer and users are friends, the user tells the programmer the problems he has with the software, the programmer helps the user to use the software better, and at the same time drive the program toward the needs of the user. In this situation the user can ask for modification, and the programmer can accept or reject with no panic, driving the most from the cooperation between the team that build the software and the persons that software is built for.

Situation 3 is most common in agile development, where the user and the programmers are all part of the same team, and they reach a great degree of collaboration and communication.

alk.

Tags: [Agile programming](http://technorati.com/tag/Agile%20programming)

<!--dotnetkickit-->

 <script type="text/javascript"><!--
digg_bodytext = 'In a project I'm working to, there is&nbsp;a point where the user is supposed to enter a series of word separated by space. A user call you telling that the routine does not work, you check the data and see that the object contains such a string';
digg_skin = 'compact';
//--></script> <script src="http://digg.com/tools/diggthis.js" type="text/javascript"></script> 
