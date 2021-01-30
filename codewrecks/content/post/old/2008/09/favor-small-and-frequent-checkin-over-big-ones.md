---
title: "Favor small and frequent checkin over big ones"
description: ""
date: 2008-09-05T07:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
This is a rule that I try to adopt since long time in the past, and few days ago Jeff Atwood [enforces this concept in his blog](http://www.codinghorror.com/blog/archives/001165.html). I completely agree with him, code should be checked in often, especially when you have continuous integration server. Checking in often reduce the risk of conflicts, makes tests run often (you should have setup your continuous server to run all tests for each checkin) and makes integration simplier. Benefit of frequent checkins are

- Other developers are immediately aware of yours modifications, you can have immediate feedbacks
- As I said tests are run often with code of other developers (think to the scenario where you finally merge your changes and with pain you verify that a lot of tests are now failing)
- if some code path is gone wrong, you can simply revert local changes and begin again from a good starting point.

I usually follow the pattern of “implement something new, run all tests, update local files again to check for conflicts, resolve any conflict, then commit with a comment telling the reason of the commit”. When I correct bugs, I correct a single bug, then run the tests, update, resolve conflicts and commit with a comment that tells the number of the bug that was corrected.

But sometimes programmers are going into big changes of the code, they begin to change a lot of files, and tends not to checkin until the work is finished, this is wrong. One possible solution is creating a branch, you can checkin often without the risk to break the build, you can checkin incomplete code (the only condition is that it compiles), you can watch out the change on the corresponding files on the trunk, so you can merge often from the trunk to your branch, and finally when you are done with the change you can merge last stuff and move into the trunk the new code. The greatest advantage of this approach is that the other programmers are continuously aware of your work. Suppose programmer A find a bug in class Foo, he can correct the bug on the trunk and immediately make the same correction on all active branches.

Another approach can be taken when you use IoC in your application. Suppose that I need to radically refactor component Foo that implements the interface IFoo. I simply begin to create another component called Foo2 or FooBetter or whathever you like, I develop it, test it, and when I think that it is finished I simply change configuration file to use the new component. When everyone says that the new Foo is ok, then I can delete the old Foo. The good thing is that I can run all test suites regarding the old Foo class against the new one, until all the tests passes.

Both these approaches are better than keeping local changes for too long and doing a final big chekin. Remember the rule, favor small and frequent checkins over big and infrequent ones.

alk.

Tags: [SCS](http://technorati.com/tag/SCS) [Code CheckIn](http://technorati.com/tag/Code%20CheckIn) [Continuos Integration](http://technorati.com/tag/Continuos%20Integration)

<!--dotnetkickit-->
