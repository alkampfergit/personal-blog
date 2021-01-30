---
title: "Unit test oriented mind"
description: ""
date: 2010-10-20T13:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
After a lot of years of developing with Unit Test in mind, you surely got a UnitTest Oriented Mind :), what I mean is that is quite simple to understand the pattern of code needed to test a specific feature.

One of my dear friend asked me this question, he needs to test a call of a service in the Data Access Layer to verify that it does eager fetching and does not suffers of [NHibernate N+1](http://ayende.com/Blog/archive/2006/05/02/CombatingTheSelectN1ProblemInNHibernate.aspx) problem. Can you spot out how you can test this requirement in a unit testing. He told me that probably this would be difficult, but the solution is indeed simple.

1) save some parents record along with some children

2) call the service function that returns the list of parents

3) dispose the session

4) access all children of each parent, if the service did not issue a eager fetch query, the test will throw an exception because the session is disposed.

This simple test can verify if the query issued by the service correctly does an eager fetch.

alk.
