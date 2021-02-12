---
title: "Mock Service Locator Automocking container and the hard life of testers"
description: ""
date: 2010-10-16T09:00:37+02:00
draft: false
tags: [Architecture,Castle,Testing]
categories: [Testing]
---
I know, [service locator](http://en.wikipedia.org/wiki/Service_locator_pattern) is an antipattern, but sometimes, when you begin to refactor existing code written with no IoC in mind, service locator can help you a little bit in restructuring your code. A service locator pattern work this way: you have some static or gloablly avaliable class named: ServiceLocator or IoC, and every object can query it for service implementation.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/image6.png)

 ***Figure 1***: *Simple schema of Service Locator Pattern, each object can query the SL asking for service*

When you write unit test, this kind of pattern is really bad, suppose you want to write a test that exercise a class, and verifies that, upon certain condition, a log is generated into the system. If the Class Under Test is getting the logger with a call to Service Locator, we have a problem, because we need to find a way to make the service locator generates a mock, and give us back that mock to verify expectation on it.

If you have a well structured program, you should not use Service Locator, and your object should declare optional or required dependency with the usual technique of [DI principle](http://en.wikipedia.org/wiki/Dependency_inversion_principle). In this scenario you do not have problem in using mocks or stub, because you can inject them from external code. To simplify both scenario the concept of [AutoMockingContainer](http://ayende.com/Blog/archive/2007/06/08/The-Auto-Mocking-Container.aspx) could help you. Basically an AutoMockingContainer is a IoC Container that work with these simple rules.

1) if the service is registered, resolve it and resolve all dependency with a specific MockStrategy

2) if the service is not registered, returns a mock.

3) make available to the caller all mocks that were created by the container, so the caller is able to issue expectation on them.

The basic tests for the container verify that resolving a registered object will resolve as usual, while when you ask for an unregistered object you got a mock.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void VerifyThatNotRegisteredComponentIsResolvedWithMock()
{
using (AutoMockingContainer.AutoMockingContainer container = CreateAutoMockingContainer())
{
IAnInterface res = container.Resolve<IAnInterface>();
res.Expect(t => t.DoTest()).Return(false);
Assert.That(res.GetType().FullName, Is.StringContaining("Proxy"));
}
}
 
[Test]
public void VerifyThatImAbleToGetResolvedMockObjects()
{
using (AutoMockingContainer.AutoMockingContainer container = CreateAutoMockingContainer())
{
IAnInterface res = container.Resolve<IAnInterface>();
var retrieved = container.GetFirstCreatedMock<IAnInterface>();
Assert.That(res, Is.EqualTo(retrieved));
}
}
{{< / highlight >}}

these simple two tests shows me that the AutoMockingContainer is able to resolve unregistered components as Mock Objects and this can helps me to solve the original problem: testing a class that internally uses the Service Locator to resolve something, like an ILogger. Suppose that this is the code of the class.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class ObjAnInterface : IAnInterface
{
#region IAnInterface Members
 
public ObjAnInterface()
{
_logger = IoC.Resolve<ILogger>();
}
 
private ILogger _logger;
 
public bool DoTest()
{
_logger.Debug("DoTestCalled");
return true;
}
 
#endregion
}
{{< / highlight >}}

The bad point is in the constructor, when the class asks to Service Locator for an ILogger. If we need to test this class and have a LOT of parts in the code where the class is created like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
var xxx = new ObjAnInterface()
{{< / highlight >}}

it could be feasible to keep the service locator, and get rid of it during some later refactoring. I do not want to question on *it worth spending time to get rid of Service Locator?*, I want only to solve the scenario when you have no choice, the Service Locator is there and you cannot remove it.

In my test I want to be able to verify that the ILogger.Debug method is called when I call the DoTest() method of the class. First of all we need our AutoMockingContainer to be able to pass this test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
IAnInterface res1 = container.Resolve<IAnInterface>();
IAnInterface res2 = container.Resolve<IAnInterface>();
IAnInterface res3 = container.Resolve<IAnInterface>();
var retrieved = container.GetFirstCreatedMock<IAnInterface>();
Assert.That(res1, Is.EqualTo(retrieved));
var list = container.GetMock<IAnInterface>();
Assert.That(list, Is.EquivalentTo(new[] {res1, res2, res3}));
{{< / highlight >}}

This simple test verifies that the container is able to resolve mocks, and the caller is able to get those mocks to setup expectation on them.

This is not enough, we need the Service Locator to declare an internal method that can be used to override the real Service Locator for testing purpose:

{{< highlight csharp "linenos=table,linenostart=1" >}}
internal static IDisposable OverrideInstance< T > ( T instance )
{
overrideInstances.Add ( typeof ( T ) , instance );
return new DisposableAction ( () => overrideInstances.Remove ( typeof ( T ) ) );
}
{{< / highlight >}}

Now it is possible for me writing code like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (AutoMockingContainer.AutoMockingContainer container = SetupIoCWithAutomock())
{
container.Register(Component.For<IAnInterface>()
.ImplementedBy<ObjAnInterface>());
IAnInterface res = container.Resolve<IAnInterface>();
res.DoTest();
var mock = container.GetFirstCreatedMock<ILogger>();
mock.AssertWasCalled(m => m.Debug(Arg<string>.Is.Anything));
}
{{< / highlight >}}

And the  **SetupIoCWithAutomock** function is where the hard part takes place, it creates an AutoMockingContainer, and use the override method to instruct Service Locator to use that container until the test is end.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private AutoMockingContainer.AutoMockingContainer SetupIoCWithAutomock()
{
IWindsorContainer windsorContainer =
new AutoMockingContainer.AutoMockingContainer();
DisposeAtTheEndOfTest(IoC.OverrideEngine(new CastleIoC(windsorContainer)));
return (AutoMockingContainer.AutoMockingContainer) windsorContainer;
}
{{< / highlight >}}

This example shows one of the reason why Service Locator is bad, it makes your tests complex because you have to take care of all these greedy details. With some infrastructure class you can improve the test in this way.

[![Untitled](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/Untitled_thumb1.png "Untitled")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/Untitled1.png)

 ***Figure 2***: *UseAutomockingCotnainer attribute permits you to automatically declare that this Test Fixture will use Automock in the Service Locator*

In  **Figure 2** you can see that with a simple attribute I'm able to declare that for this TestFixture the global Service Locator class should be overridden with an AutoMockingContainer, then with a simple extension method (called AutoMockingContainer()) I'm able to get the container for that specific test and ask for Mock autogenerated by the container to setup expectation on them.

This makes the code more readable.

Alk.
