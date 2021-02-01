---
title: "Castle MVC and verify Fluent Registration"
description: ""
date: 2010-08-06T13:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
I have a little application that has a custom MVP pattern implemented in Winform. Instead of using configuration file to register all the View (implemented by windows Forms) I decided to move towards fluent configuration to use a â€œconvention over configurationâ€. My convention is that all View lives in a specific namespace, and you can simply use this registration (I have a IoC static wrapper class that exposes fluent registration).

{{< highlight csharp "linenos=table,linenostart=1" >}}
IoC.FluentRegistration(
AllTypes
.Pick().FromAssembly(Assembly.GetExecutingAssembly())
.If(t => t.Namespace == "Myproject.Views")
.Configure(c => c.LifeStyle.Transient));
{{< / highlight >}}

But when I try to resolve a view interface like  **ILoginView** , I got an error because no component supporting ILoginView was registered. The error could not be clear, if you are not used to fluent configuration, the reason is: when you register multiple types with *Pick.Alltypes*, you are registering object with a service equal to their type. This means that  **LoginView form** gets registered for service LoginView and not ILoginView.

This is a fairly common problem using castle fluent configuration to register multiple types at once, because you do not know:

- What types are you registering
- Details of the registration

If you do not use some technique to dump detailed information for multiple registration, you will end in guessing why object are resolved in the wrong way. The solution is obvious: just dump this information with an helper method like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static void DumpRegistration()
{
ActualContainer.Kernel.ComponentRegistered += KernelComponentRegistered;
}
 
static void KernelComponentRegistered(string key, IHandler handler)
{
Debug.WriteLine(string.Format("Castle Registered component:\n\tKey:{0}\n\tService: {1}\n\tImplementation: {2}",
key, handler.Service, handler.ComponentModel.Implementation));
foreach (InterceptorReference interceptorReference in handler.ComponentModel.Interceptors)
{
Debug.WriteLine(string.Format("\tInterceptor: {0}", interceptorReference.ComponentKey));
}
}
{{< / highlight >}}

Method DupmRegistration is part of the IoC static class, and simply add an handler to the ComponentRegistered event of Windsor Container Kernel, the purpose of this handler is dumping details about each component registration. With this code you can rerun the registration code shown at the beginning of this post, and you will get log like this:

{{< highlight csharp "linenos=table,linenostart=1" >}}
Castle Registered component:
Key:Myproject.Views.Login
Service: Myproject.Views.Login
Implementation: Myproject.Views.Login
{{< / highlight >}}

That shows clearly that the registration is wrong, because I want Login form to be registered for service  **ILoginView** and not  **LoginView**. The solution is registering the type with the correct interface.

{{< highlight csharp "linenos=table,linenostart=1" >}}
IoC.FluentRegistration(
AllTypes
.Pick().FromAssembly(Assembly.GetExecutingAssembly())
.If(t => t.Namespace == "Myproject.Views")
.WithService.Select(Selector)
.Configure(
c => c.LifeStyle.Transient
.Named(c.ServiceType.Name)));
{{< / highlight >}}

The key is in the call  **WithService.Select(Selector)** , where Selector is a function able to select the right interface from type information.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static Type[] Selector(Type t1, Type t2)
{
IEnumerable<Type> interfaces = t1.GetInterfaces();
Type viewBase = null;
if (interfaces.Count() > 0)
{
viewBase = interfaces.FirstOrDefault(
i => i.GetInterface("IBaseView") != null);
}
 
if (viewBase == null)
{
return new[] { t1 };
}
return new[] { viewBase };
}
{{< / highlight >}}

The function is really simple, I get all the interfaces implemented by the concrete type and if it implements some interfaces I search fro the the first Interface that implements the *IBaseView* interface (the base interface for each specific view interface). Now I rerun the program again an I get:

{{< highlight csharp "linenos=table,linenostart=1" >}}
Castle Registered component:
Key:ILoginView
Service: Myproject.Interfaces.ILoginView
Implementation: Myproject.Views.Login
{{< / highlight >}}

Now Views are registered for correct interface, and I'm able to resolve the ILoginView with no problem.

The lesson is: whenever you work with multiple type registration with castle, always dump details about each registered components, this will save you time and give you an exact view of registered types.

alk.
