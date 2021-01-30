---
title: "Brian Harry programming practices"
description: ""
date: 2010-03-16T10:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences,Programming]
---
Iâ€™m exited on Brian Harryâ€™s plan to do a series of posts regarding programming practices in his blog. The main reason is that Brian had really wrote tons of good code and it is really interesting knowing how he organize his projects. From this [first post](http://blogs.msdn.com/bharry/archive/2010/03/09/programming-practices-part-1-watching-from-a-distance.aspx) I strongly agree with a couple of concepts, the first is having a clean code at regular interval, no longer than few hours.

I made mistake in the past, and sometimes in the present, I begin coding a super new feature, with a lot of code, and after some hours I have nothing working because Iâ€™m still doing infrastructure code, etc etc. This is sometimes due to the fact that Iâ€™d like to start with beautiful and well architected code, but the risk is getting lost in development. Quite often it is better to start with some â€œquick and dirtyâ€ functional prototype, that gets you straight into the point, then refactor to a more clean solution if the prototype is going well. This avoid you the risk to work for a couple of days just to find that you took the wrong solution path. Proceeding step by step is the best way to reach a working solution.

This means that sometimes a â€œsimilar TDDâ€ is my choice to develop some brand new piece of code I do not know anything about. I like TDD, but I do not take as a religious way of writing software, so I agree in part with [Brianâ€™s post about TDD](http://blogs.msdn.com/bharry/archive/2010/03/10/programming-practices-part-2-thoughts-on-tdd.aspx). One of the point I agree most is the time spent on test refactoring while you are refactoring code. If you test every method and every single property of each class, when you refactor you need to spent time refactoring tests, or removing them :(. This is why I tend not to write too granular test, and this means that Iâ€™m not doing a full TDD :). Another risk of TDD is that sometimes lead to â€œBad Codeâ€ because the only goal for the developer is having all tests green, and sometimes it lead to a lot of special cases.

So I resort to do similar TDD only on little part of my projects, and mainly when :

- I need to use API I never used before
- Iâ€™m working on complex algorithm
- Iâ€™m depending on external data, and I know in advance that data will be dirty

Iâ€™ve other situations where I like to write TDD, but these three are the most important ones. Using TDD in the first is a way to gain confidence with the new API while testing how they are working. In the second scenario I can tackle algorithm complexity some piece at a time, and having a good test suite helps me to gain confidence with the code. In the third situation I need to have a lot of testing to verify external data that is flowing to my software, I had experiences where I sent a XSD schema to specify how Iâ€™m expecting data, and I have back pieces of data that does not validate and sometimes is not valid XMLâ€¦ and worst I need to make correction because I cannot rely on other to correct this. Having a test suite that helps me to face one problem at a time is invaluable.

But clearly Brianâ€™s sentence I most agree with is that one â€œ **Step through everything in the debugger** â€. I really step at least once every line in the debugger, just to verify that code I wrote is behaving the way I think it need to work :) (often the two does not coincide ). Believing that TDD avoid you going into the debugger is mainly a Myth. Surely TDD and unit testing reduce the time you need to spent into the debugger, but they cannot avoid it.

alk.

Tags: [programming](http://technorati.com/tag/programming)
