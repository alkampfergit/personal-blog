---
title: "MVVM  Broker  Castle Interceptor  FUN"
description: ""
date: 2011-02-25T10:00:37+02:00
draft: false
tags: [MVVM,WPF]
categories: [WPF]
---
Scenario: have a WPF application based on custom MVVM + Broker + Castle, the users told us that some operations took long time to accomplish and they want a wait cursor on the application.

Resolution: Since all long operations are triggered with event handled by a Broker system, the obvious solution is an interceptor

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class WaitCursorInterceptor : IInterceptor
{
private IWpfSystem _wpfSystem;
 
public WaitCursorInterceptor(IWpfSystem wpfSystem)
{
_wpfSystem = wpfSystem;
}
 
public void Intercept(IInvocation invocation)
{
using (_wpfSystem.SetWaitCursor())
{
invocation.Proceed();
}
}
}
{{< / highlight >}}

This depends on the IWpfSystem interface that has this function to change the cursor of the application

{{< highlight csharp "linenos=table,linenostart=1" >}}
public DisposableAction SetWaitCursor()
{
Mouse.OverrideCursor = Cursors.Wait;
return new DisposableAction(() => Mouse.OverrideCursor = null);
}
{{< / highlight >}}

Now you only need to wire up everything adding the interceptor on the IBroker interface.

{{< highlight csharp "linenos=table,linenostart=1" >}}
ServiceLocator.FluentRegistration(
Component.For<WaitCursorInterceptor>());
 
ServiceLocator.FluentRegistration(
Component.For<IWpfSystem>()
.ImplementedBy<WpfSystem>());
 
ServiceLocator.FluentRegistration(
Component.For<IBroker>()
.ImplementedBy<Broker>()
.Interceptors(new InterceptorReference(typeof(WaitCursorInterceptor))).Anywhere);
{{< / highlight >}}

Now every call to broker function pass through the interceptor that automatically set the cursor to wait. Then users told us that some views take a long time to open and they want the cursor to appear when a new view waits to appear.

Since all view are created/managed by the navigator, you only need to write this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
ServiceLocator.FluentRegistration(
Component.For<INavigator>()
.ImplementedBy<MainNavigator>()
.Interceptors(new InterceptorReference(typeof(WaitCursorInterceptor))).Anywhere);
{{< / highlight >}}

Add the same interceptor on the INavigator interface, and the game is done.

alk.
