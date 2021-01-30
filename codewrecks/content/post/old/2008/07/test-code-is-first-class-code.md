---
title: "Test code is quotFirst class codequot"
description: ""
date: 2008-07-02T01:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
In an hypothetical “ten Commandments” of the Unit Test probably the first is

> Test code is First Class Code

I believe that one of the worst mistake a developer can do when writing Unit Tests is to consider unit test “second class code”, in the end the test code does not goes into production (pay attention to the smell [test logic in production)](http://xunitpatterns.com/Test%20Logic%20in%20Production.html) so it does not worth to spend too much time with Test Code.

This is absolutely false. If you really want to gain the maximum advantage from Unit Testing practices, you need to consider with great care your Test Code. Test code should be refactored often, it should be organized with [well known patterns](http://xunitpatterns.com/), and it should adhere to whatever convention or ruleset you use for your production code. Failing to do so quite often will produce [fragile tests](http://xunitpatterns.com/Fragile%20Test.html) and when a developer that change 10 lines of code in a class sees that 20 tests are failing due to excessive fragility it tends to ignore test errors, or worse, he removes the test from the suite. In such a situation you need to stop a little bit, look at the test code, and refactor to reduce fragility. Since there are a well [know](http://xunitpatterns.com/Creation%20Method.html) set of [pattern](http://xunitpatterns.com/Delta%20Assertion.html) to find and reduce this problem, it really worth to spent time to have stronger test code.

Test code should be simple, if test code is too complex who can assert that the logic of the test is good? Maybe the test is failing because the test has a bug. To avoid this you need to refactor test to achieve simple test, try to look in your test code for [Conditional Test Logic](http://xunitpatterns.com/Conditional%20Test%20Logic.html) smell, and immediately remove the condition, you will obtain better test.

Use SandBox for Database or other resource, this will reduce test race, and it helps you to run test in new machine with less effort. It is frustrating when you run tests and they fail because another programmer is exercising the same database. Create Scripts to setup all the sandbox, make test autoconsistent. As an example, to test a database you can create a routine that verify if an instance of SQLEXPRESS exists on the machine, try to login with Integrated Security, generate a RandomDatabase Name and store it into a file, then create a database, create all the structures to run the test. As an alternative include a complete script in the test to recreate a local test database. All these practices will require you time, but they will pay in the future :D

Alk.

Tags: [Unit Testing](http://technorati.com/tag/Unit%20Testing)

<!--dotnetkickit-->
