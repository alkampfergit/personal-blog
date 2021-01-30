---
title: "Run test code often"
description: ""
date: 2008-07-11T09:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Some days ago [I was thinking](http://www.codewrecks.com/blog/index.php/2008/07/02/test-code-is-first-class-code/) about the good practices of testing. Immediately after the first commandment “test code is First Class code” it comes the “Run test code really often”.

If you run the test code often, you immediately know when you have broke something. Think to the following scenario, you write 200 lines of new code, then you decide to write tests for them, but you discovered that a large amount of old tests are broken; now it is difficult to say where did you introduce bugs, and you need to spent time to find the cause of the error.

Now think to a little different scenario, you keep nunit open, you configure nunit to: automatically reload test assembly and run test again. Then you write some lines of code, then press CTRL+SHIFT+B, your code gets compiled and nunit immediately runs the tests. Now imagine that you compile often, you change very few lines of code, compile and… whenever you see red, you really have to inspect only few lines to understand where and why the code is broken.

At the other end of the spectrum you find situation like the following. Developer A had finished a 5 hours session where he implemented a lot of new features for the project, now he run old tests but a lot of them failed. After 15 minutes most of the tests are working again but there are still some of them that are red….  and the developer really do not understand why, after all he really wrote a lot of new code. Since he want to test the new features, the old tests that fail are simply commented out or made [Explicit] with the excuse “I’ll fix them later”….with the risk that noone will fix them again.

This lead to the [original post](http://www.codewrecks.com/blog/index.php/2008/07/02/test-code-is-first-class-code/), you always need to take care of test code, make sure that he has good quality, run tests as often as you can, and refactor them often to remove fragility.

alk.

Tags: [Unit Testing](http://technorati.com/tag/Unit%20Testing)

<!--dotnetkickit-->
