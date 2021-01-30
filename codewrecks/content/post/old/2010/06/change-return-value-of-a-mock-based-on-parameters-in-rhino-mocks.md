---
title: "Change return value of a mock based on parameters in Rhino mocks"
description: ""
date: 2010-06-30T13:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing,Tools and library]
---
Sometimes there is the need to change the return value of an expectation to a Mock with a value based on parameters used in the call. Suppose you need to create a mock, and want to verify that the method DoInt() gets called with a value greater than 42 and it should return the value augmented by one, how you can setup the expectation?

The secret is in the WhenCalled method exposed by the mock, that permits you to access the full MethodInvocation object that gets generated during the real invocation. Here is the solution.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public interface IDo
{
Int32 DoInt(Int32 param);
}
 
[Test]
public void Name()
{
IDo mock = MockRepository.GenerateStub<IDo>();
mock.Expect(m => m.DoInt(Arg<Int32>.Matches(param => param > 42)))
.WhenCalled(mi => { mi.ReturnValue = (Int32) mi.Arguments[0] + 1; })
.Return(99);
Int32 retint = mock.DoInt(432);
Assert.That(retint, Is.EqualTo(433));
}
{{< / highlight >}}

As you can see in the WhenCalled Method I can modify the ReturnValue using the value of a parameter, so if I call mock.DoInt(900) it will return 901. This technique is really powerful, because in WhenCalled you specify a delegate that gets called at each invocation, so you can write code like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
IDo mock = MockRepository.GenerateStub<IDo>();
Int32 valueToIncrement = 2;
mock.Expect(m => m.DoInt(Arg<Int32>.Matches(param => param > 42)))
.WhenCalled(mi => { mi.ReturnValue = (Int32)mi.Arguments[0] + valueToIncrement; })
.Repeat.Any()
.Return(99);
Int32 retint = mock.DoInt(432);
Assert.That(retint, Is.EqualTo(434));
valueToIncrement = 100;
retint = mock.DoInt(432);
Assert.That(retint, Is.EqualTo(532));
{{< / highlight >}}

I use a local variable to hold the quantity used to increment argument value, if I change the value between invocations, I can change returned value, showing that I can have full dynamic control on the value returned by an expectation on a Mock.

alk.
