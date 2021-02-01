---
title: "I do not have time to write tests excuse"
description: ""
date: 2009-06-26T00:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I'm not a tests fanatic, but I use a lot of unit tests in during my development days. I do not aim to 100% coverage, and I do not believe that TDD can be used in every moment, and I use unit testing when it is necessary for me.

Sometimes it happens that someone calls me to solve a problem in code, and quite often i say â€œWrite a unit test that reproduce the problem, then begin to investigateâ€. Quite often one I got a reply of

> I'm in a hurry, I do not have time to write test, I must correct that bug as soon as possible
> 
> [![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb39.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image39.png)

I'm aware that writing a test consume time, but quite often in the end a test save you time. After that people told me that he do not have time, he shows me the problem, then fire a big web site from a.NET solution with 60 projects, we have to wait about 40 seconds for the app to start, then browse to a web page, enter data, and verify if the answer is correct.

The problem is that we are testing a function that use some stored procedures and some.net code, so if the problem is still there, we need to return to Management Studio, change the procedure or change the code. If we must change the code, we need to recompile, fire the app again (and wait for the app to reinitialize) bla bla bla.

For big application the startup time of the whole application is just too big to think that F5 approach is a feasible solution to verify if a bug is corrected. One day, for a very difficult bug, after a couple of hours I realized that more than half of the time was spent waiting the app to start and insert data to exercise the functionâ€¦â€¦. too bad. This means that we are developing slowly, and moreover it is frustrating to: â€œdo a modification and wait for one minute to see if it corrects the problemâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb40.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image40.png)

Working this way lead to this pattern

1. Write a modification
2. Fire the program with F5
3. Goes to facebook, twitter, waiting for the app to start
4. The app started but you are reading some blog

This is incredible inefficient way to develop software.

My suggestion is, whenever you need to correct bug, or verify some feature of a low level layer of your application, do not exercise it from the User Interface but write a test. It will save you time in the long run. Most of the problem is that writing test is not so simple, expecially in complex product, but when you are experienced in unit testing, writing a test is really a breeze. Most of the time you will end with a test infrastructure specific for your project, where creating a new test is a matter of seconds.

Alk.
