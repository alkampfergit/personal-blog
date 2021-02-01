---
title: "On SetUp and TearDown in Nunit"
description: ""
date: 2008-12-06T03:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
[SetUp](http://www.nunit.org/index.php?p=setup&amp;r=2.4.8) and [TearDown](http://www.nunit.org/index.php?p=teardown&amp;r=2.4.8) are two attributes used to mark two methods as prologue and epilogue for each test of a fixture. Here is a typical use in test based on Rhino Mock:

{{< highlight csharp "linenos=table,linenostart=1" >}}
private MockRepository mrepo;

[SetUp]
public void SetUp()
{
    mrepo = new MockRepository();
}

[TearDown]
public void TearDown()
{
    mrepo.VerifyAll();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With these two attributes you can automate the creation and verification of MockRepository, but it is so good? Let's run a couple of tests.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void BasicMockTest1()
{
    MockRepository mrepo1 = new MockRepository();
    IBetterPage mock = mrepo1.CreateMock<IBetterPage>();
    Expect.Call(() => mock.SetMessage("TEST"));
    mrepo1.ReplayAll();
    mock.SetMessage("IPPPO");
    mrepo1.VerifyAll();
}

[Test]
public void BasicMockTest()
{
    IBetterPage mock = mrepo.CreateMock<IBetterPage>();
    Expect.Call(() => mock.SetMessage("TEST"));
    mrepo.ReplayAll();
    mock.SetMessage("IPPPO");
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Both the test will fail, but the first creates the mockrepository and verify the expectations in the code, the other is based on setup and teardown. The first test fail with this message (Removed the stack trace)

{{< highlight csharp "linenos=table,linenostart=1" >}}
TestCase 'Tests.BetterPageTest1.BasicMockTest1'
failed: Rhino.Mocks.Exceptions.ExpectationViolationException : IBetterPage.SetMessage("IPPPO"); Expected #0, Actual #1.
IBetterPage.SetMessage("TEST"); Expected #1, Actual #0.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The second with this message

{{< highlight csharp "linenos=table,linenostart=1" >}}
TestCase 'Tests.BetterPageTest1.BasicMockTest'
failed: Rhino.Mocks.Exceptions.ExpectationViolationException : IBetterPage.SetMessage("IPPPO"); Expected #0, Actual #1.
IBetterPage.SetMessage("TEST"); Expected #1, Actual #0.
TearDown : System.Reflection.TargetInvocationException : Exception has been thrown by the target of an invocation.
  ----> Rhino.Mocks.Exceptions.ExpectationViolationException : IBetterPage.SetMessage("IPPPO"); Expected #0, Actual #1.
IBetterPage.SetMessage("TEST"); Expected #1, Actual #0.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Well, since the exception occurred inside the teardown, the message is less clear because NUNit signal a failure in teardown code. But the worst is about to come, here it is another couple of tests.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void BasicMockTest3()
{
    MockRepository mrepo1 = new MockRepository();
    IBetterPage mock = mrepo1.CreateMock<IBetterPage>();
    Expect.Call(() => mock.SetMessage("TEST"));
    mrepo1.ReplayAll();
    throw new System.Exception("EXCEPTION");
}

[Test]
public void BasicMockTest4()
{
    IBetterPage mock = mrepo.CreateMock<IBetterPage>();
    Expect.Call(() => mock.SetMessage("TEST"));
    mrepo.ReplayAll();
    throw new System.Exception("EXCEPTION");
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

These ones fails because a component throws some exception during the execution of the test, the first test fail with this message:

{{< highlight csharp "linenos=table,linenostart=1" >}}
TestCase 'Tests.BetterPageTest1.BasicMockTest3' failed: System.Exception : EXCEPTION{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is extremely clear, an exception has been thrown, but the second one gives this error:

{{< highlight csharp "linenos=table,linenostart=1" >}}
TestCase 'Tests.BetterPageTest1.BasicMockTest4'
failed: System.Exception : EXCEPTION
TearDown : System.Reflection.TargetInvocationException : Exception has been thrown by the target of an invocation.
  ----> Rhino.Mocks.Exceptions.ExpectationViolationException : IBetterPage.SetMessage("TEST"); Expected #1, Actual #0.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The problem is that in teardown the code is still trying to verify the repository, but this should be avoided because the test exited with an exception.

I must admit that I write such a test quite often, but recently I gets very annoyed when a test fail and I'm not immediatly able to understand what is gone wrong. As a rule of thumb you should use the SetUp and TearDown attribute only to setup and clean per text fixture and you should not insert any test logic.

Alk.

Tags: [NUnit](http://technorati.com/tag/NUnit) [Unit Testing](http://technorati.com/tag/Unit%20Testing) [Fixture](http://technorati.com/tag/Fixture)
