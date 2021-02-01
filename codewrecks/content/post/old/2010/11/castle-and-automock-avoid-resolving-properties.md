---
title: "Castle and Automock avoid resolving properties"
description: ""
date: 2010-11-30T14:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle,Testing]
---
I use [AutoMockingContainer](http://www.codewrecks.com/blog/index.php/2010/10/18/mock-service-locator-and-automocking-container-to-the-rescue/) extensively in my test projects, and I â€˜ve build over time an automocking container that satisfy all of my needs. Thanks to Castle Windsor, using complex logic with the AutomockingContainer is a breeze. Suppose you have this ViewModel

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image8.png)

 ***Figure 1***: *ViewModel under test*

The only aspect I'm interested in is the SelectedLinkResult public property, that have a lot of logic in the set part, this is needed to react on user selection change in the UI. Now when I use AutoMockingContainer to automock this view model I have a big problem, I need to setup a lot of expectations to make the setter logic to work, this because when I try to resolve with automock, my AutoMockingContainer try to resolve each dependency, even properties. To avoid this I need to be able to tell my container

1. Avoid to resolve any property
2. Avoid to resolve dependencies with specific name

The second one is needed if I want some properties to be resolved and some other to be excluded, so I needs to extend my container with a couple of properties.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public List<String> DependencyToIgnore { get; set; }
 
public Boolean  ResolveProperties { get; set; }
 
public Boolean CanSatisfyDependencyKey(String dependencyKey)
{
return !DependencyToIgnore.Contains(dependencyKey);
}
{{< / highlight >}}

I've added a List of property name to ignore, a property that specify if I want properties to be resolved, and finally a simple function that tells if a specific property needs to be resolved. Thanks to Castle, I can use these properties from the subresolver used by the container.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public bool CanResolve(
CreationContext context,
ISubDependencyResolver parentResolver,
ComponentModel model,
DependencyModel dependency)
{
bool shouldResolveDependencyKey =
dependency.DependencyType == DependencyType.Service &&
_relatedRepository.CanSatisfyDependencyKey(dependency.DependencyKey);
 
Boolean resolveIfProperty =
!dependency.IsOptional ||
_relatedRepository.ResolveProperties;
 
return shouldResolveDependencyKey && resolveIfProperty;
}
{{< / highlight >}}

First of all I check if the dependencyType is Service and calls the CAnSatisfyDependencyKey of the subresolver, then if the the dependency is optional (a property) and the ResolveProperties is false, I skip resolution. Now I can write a unit test header like this one:

{{< highlight csharp "linenos=table,linenostart=1" >}}
[TestFixture]
[UseAutoMockingContainer(
new[] { typeof(TreeNavigatorViewModel) },
ResolveProperties = false)]
public class TreeNavigatorViewModelFixture : BaseTestFixtureWithHelper
{{< / highlight >}}

This to avoid completely Property resolving during the test, the following one is used if I want only the SelectedLinkResult property not to be resolved with a Mock.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[TestFixture]
[UseAutoMockingContainer(
new[] { typeof(TreeNavigatorViewModel) },
IgnoreDependencies =
new string[]
{
"SelectedLinkResult"
})]
public class TreeNavigatorViewModelFixture : BaseTestFixtureWithHelper
{{< / highlight >}}

This makes my tests really simple and simple to write.

alk.
