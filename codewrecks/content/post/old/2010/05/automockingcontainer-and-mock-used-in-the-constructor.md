---
title: "AutoMockingContainer and mock used in the constructor"
description: ""
date: 2010-05-06T09:00:37+02:00
draft: false
tags: [RhinoMock,Testing]
categories: [Testing]
---
I use a custom version of AutoMockingContainer based on the class used in [this blog](http://blog.eleutian.com/CommentView,guid,762249da-e25a-4503-8f20-c6d59b1a69bc.aspx). The standard approach does not work for object that depends on some interface in the constructor, but actually uses that interface in the constructor and you need to set expectation on it.

Basically you need a way to intercept the generation of mock and configure before the constructor of the dependant object is created. This is achieved with a simple trick, first of all the AutoMockingContainer implemnts a specific interface

{{< highlight csharp "linenos=table,linenostart=1" >}}
public interface IAutoMockingRepository : IWindsorContainer
{
MockingStrategy GetStrategyFor(DependencyModel model);
void AddStrategy(Type serviceType, MockingStrategy strategy);
void OnMockCreated(Object mock, String dependencyName);
}
{{< / highlight >}}

The OnMockCreated is called by the [ISubDependencyResolver](http://www.castleproject.org/container/documentation/v21/manual/mktypedocs/Generated_ISubDependencyResolver.html) object when the strategy requires to create a new mock with [Rhino.mocks](http://www.ayende.com/projects/rhino-mocks.aspx) and the AutoMockingContainer is able to use this data to make possible to intercept mock creation.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void OnMockCreated(Object mock, String dependencyName)
{
if (!_mocks.ContainsKey(mock.GetType()))
{
_mocks.Add(mock.GetType(), new List<object>());
}
_mocks[mock.GetType()].Add(mock);
EventHandler<MockCreatedEventArgs> temp = MockCreated;
if (temp != null)
{
temp(this, new MockCreatedEventArgs(mock, dependencyName));
}
}
{{< / highlight >}}

The container simply uses a Dictionary&lt;Type, List&lt;Object&gt;&gt; to keep track of object creation subdivided by type, but for each created mock he also raise an event with the mock and the dependency name. Now I have a LoginViewModel that depends on a ICustomerService with a customerService constructor parameters, and uses it in the constructor to query a list of customers. Here is the method that configures the AutoMockingContainer to make the test works.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void ConfigureAutoMockForStandardViewModel(AutoMockingContainer autoMockingContainer)
{
autoMockingContainer.Register(Component.For<LoginViewModel>());
autoMockingContainer.MockCreated += (sender, e) =>
{
if (e.DependencyName.Equals("CustomerService", StringComparison.InvariantCultureIgnoreCase) )
{
e.Get<ICustomerService>().Expect(s => s.GetAllClient()).Return(new List<Client>());
}
};
}
{{< / highlight >}}

I scan creation of all mocks, and when mock for CustomerService dependency is created I simply setup an expectation. Simple and coincise.

Alk.
