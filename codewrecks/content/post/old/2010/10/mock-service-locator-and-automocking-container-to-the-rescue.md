---
title: "Mock Service Locator and Automocking Container to the rescue"
description: ""
date: 2010-10-18T15:00:37+02:00
draft: false
tags: [Architecture,Testing]
categories: [Testing]
---
In a [previous post](http://www.codewrecks.com/blog/index.php/2010/10/16/mock-service-locator-automocking-container-and-the-hard-life-of-testers/) I dealt on how to write an AutoMockingContainer that is able to resolve a mock for unregistered objects. The goal was to be able to circumvent the problem of service locator.

[![SNAGHTML1e24939](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1e24939_thumb.png "SNAGHTML1e24939")](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1e24939.png)

 ***Figure 1***: *During a test, the real container of the service locator is substituted with an AutoMocking container.*

This is a standard way to work when you have to test classes that depends from Service Locator, override the Service Locator for the test, making it returns stub. Clearly you should design your class with Dependency Injection in mind, and reduce at minimum the Service Locator usage.

Now consider a better version of the class to test

[![SNAGHTML1f30b02](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1f30b02_thumb.png "SNAGHTML1f30b02")](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1f30b02.png)

 ***Figure 2***: *A better way to structure the class, it does not use service locator, instead declares a non-optional dependency on the constructor*

In  **Figure 2** BetterObjAnInterface class declares a non-optional dependency from ILogger, now to test that \_logger.Debug() method gets called during the invocation of DoTest() method, you can write this code.

[![SNAGHTML1f6549e](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1f6549e_thumb.png "SNAGHTML1f6549e")](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1f6549e.png)

 ***Figure 3***: *Testing the interaction of a class with a dependent service.*

Test in Figure 3 is really better that overriding the container of Service Locator but suffers from some problems. First, if someone changes the BetterObjAnInterface, make it depending from another interface, all the tests are broken, because you should modify them to create the other stubs to pass in the constructor. Another problem is: if the SUT declares a lot of dependency, test code is full of MockRepository.GenerateStub() call to satisfy all non optional dependencies and the test become harder to read.

The solution is again in the AutoMockingcontainer object. Thanks to Castle Windsor Extendibility, you can write a SubDependencyResolver that actually creates a mock whenever an object ask for a Dependency. You can in fact write this test:

[![SNAGHTML1fd38a6](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1fd38a6_thumb.png "SNAGHTML1fd38a6")](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML1fd38a6.png)

 ***Figure 4***: *A test with AutoMockingContainer to resolve dependency with Mocks.*

With this test, if you add more dependency in the constructor of BetterObjAnInterface, you does not suffer problems because each added dependency will be resolved with mocks automtically. With a little bit of helpers you can simplify more and write this test:

[![SNAGHTML2006ffb](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML2006ffb_thumb.png "SNAGHTML2006ffb")](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML2006ffb.png)

 ***Figure 5***: *A little helper to make using the AutomockingContainer trasparent to the test*

This test is marked with the UseAutoMockingContainer helper, that accepts an array of types to register for the test. The test is now three lines long, one line to create the object, another one to exercise it, ant the final one to make an assertion on the ILogger mock that was automatically created by the AutoMockingContainer because BetterObjAnInterface declares a depencency on it.

Testing object designed with DI in mind is really easy ![Smile](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/wlEmoticonsmile.png) so get rid of your service locator ![Smile with tongue out](http://www.codewrecks.com/blog/wp-content/uploads/2010/10/wlEmoticonsmilewithtongueout.png)

alk.
