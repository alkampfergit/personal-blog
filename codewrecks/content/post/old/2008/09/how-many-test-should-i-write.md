---
title: "How many test should I write"
description: ""
date: 2008-09-25T00:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
One of my italian [Friend](http://dotnetumbria.org/blogs/cruciani/default.aspx) once asked me â€œwhat is the percentage of code coverage that you consider enough for your tests?â€. The answer is that probably there is not one.

If you write a project on your own you can set some limit (Es. 80% code coverage) but in my experience, in the real world, quite often you work in a team that does not use unit testing at all. Trying to introduce Unit Testing practices in a team it is a difficult stuff, we are always in a hurry, and the typical objection to testing is â€œI do not have time to write production code, how can I write test too?â€. In my experience you should try to introduce testing in more graceful way, surely not setting some code coverage limit.

Another problem is that we often work on legacy code, usually absolutely not written with testability in mind, so it is really difficult to write good unit tests, that are not fragile, or erratic, or interacting, etc..

A good point to start is bug correction, whenever a tester signal you a bug, the first operation is trying to reproduce it in predictable way, you can try to write a xUnit test for this operation, when you have the test you can begin to work at the correction. If you write a unit test for each bug, you are sure that bugs never reappear in the software. This is usually a good way to introduce testing.

Another good moment to write test is when you need to modify a pieces of code written by another member of the team. The code can be commented, written perfectly, but modifying otherâ€™s code is not an easy task to do. In this situation you should begin to understand how the code works, so you can begin to write tests to verify your assertion. The great benefit of this approach, is that at the end of the process you have a good understanding of the code, but also a number of tests that makes you feel more comfortable during the modification phase.

More tests you write, and more you will appreciate them, do not try to introduce difficult metrics (like high percentage of code coverage), because you will only make developers hating tests.

Alk.

Tags: [Unit Testing](http://technorati.com/tag/Unit%20Testing)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/09/25/how-many-test-should-i-write/';</script><script type="text/javascript">var dzone_title = 'How many test should I write?';</script><script type="text/javascript">var dzone_blurb = 'How many test should I write?';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/09/25/how-many-test-should-i-write/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/09/25/how-many-test-should-i-write/)
