---
title: "Aop With castle Part 1"
description: ""
date: 2010-06-01T10:00:37+02:00
draft: false
tags: [Aop,Castle]
categories: [Castle]
---
I made a session about Aop with castle in a Italian workshop oranized by our association DotNetMarche, and some of the attendee asked me to publish the material in my blog. So I decided to start to publish all material in english language.

#### <font color="#004080"><strong>Introduction</strong></font>

If you look at canonical terms of [aop](http://en.wikipedia.org/wiki/Aspect-oriented_programming) you can recognize standard ones such as Aspect, JointPoint, PointCut , but if you look at castle infrastructure you could not find any of these. This does not means that castle does not supports AOP, but is a clue that Castle handles AOP with different point of view respect to other frameworks.

AOP is based on the concept of Weaving, and castle does this with the excellent Castle.DynamicProxy2 library, that is used by Castle Windsor to manage crosscutting concerns with the concept of Interceptors and the interface IInterceptor. The basic of castle is the ability to create a component that is able to intercept every calls to methods and or properties of an interface, and deciding with Windsor configuration where to apply this interceptor. At the most basic level, let consider this simple interface and its implementation.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public interface ISomething
{
Int32 Augment(Int32 input);
void DoSomething(String input);
Int32 Property { get; set; }
}
 
class Something : ISomething
{
#region ISomething Members
 
public int Augment(int input)
{
return input + 1;
}
 
public void DoSomething(string input)
{
Console.WriteLine("I'm doing something: " + input);
}
 
public int Property
{
get;
set;
}
 
#endregion
}
{{< / highlight >}}

Now I want to be able to intercept every call and log it; the solution in castle is to create an interceptor like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class DumpInterceptor : IInterceptor
{
#region IInterceptor Members
public void Intercept(IInvocation invocation)
{
Console.WriteLine("DumpInterceptorCalled on method " + invocation.Method.Name);
invocation.Proceed();
if (invocation.Method.ReturnType == typeof(Int32))
{
invocation.ReturnValue = (Int32)invocation.ReturnValue + 1;
}
Console.WriteLine("DumpInterceptor returnvalue is " + (invocation.ReturnValue ?? "NULL"));
}
#endregion
}
{{< / highlight >}}

As you can see, the IInterceptor interface has only a method, called Intercept, that gets called whenever a function or property of the wrapped interface is called. Now we need only to instruct castle to intercept an object with this interceptor, here is the solution with standard XML config files.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<component id="BasicElement"
service="TheBasicOfAopWithCastle.TestClasses.ISomething, TheBasicOfAopWithCastle"
type="TheBasicOfAopWithCastle.TestClasses.Something, TheBasicOfAopWithCastle"
lifestyle="singleton">
<interceptors>
<interceptor>${DumpInterceptor}</interceptor>
</interceptors>
</component>
<component id="DumpInterceptor"
service="Castle.Core.Interceptor.IInterceptor, Castle.Core"
type="TheBasicOfAopWithCastle.Interceptors.DumpInterceptor, TheBasicOfAopWithCastle"
lifestyle="singleton">
</component>
{{< / highlight >}}

As you can verify you simply need to register the interceptor as any other component, telling castle that it implement the IInterceptor interface; once one or more interceptors are configured, you can refer to them in the &lt;interceptors&gt; part of other component registration. In the above example I simply registered a concrete implementation for the ISomething class, and I specify that I want to apply the ${DumpInterceptor} registered interceptor to it. Now if you run the following code:

{{< highlight csharp "linenos=table,linenostart=1" >}}
Console.WriteLine("Run 1 - configuration with xml file");
using (WindsorContainer container = new WindsorContainer("castle.config"))
{
ISomething something = container.Resolve<ISomething>();
something.DoSomething("");
Console.WriteLine("Augment 10 returns " + something.Augment(10));
}
{{< / highlight >}}

You got this output

{{< highlight csharp "linenos=table,linenostart=1" >}}
Run 1 - configuration with xml file
DumpInterceptorCalled on method DoSomething
I'm doing something:
DumpInterceptor returnvalue is NULL
DumpInterceptorCalled on method Augment
DumpInterceptor returnvalue is 12
Augment 10 returns 12
{{< / highlight >}}

This certifies a couple of interesting things, the first is that every call to the resolved ISomething object is correctly intercepted by the interceptor, the other one is that the interceptor is able to modify the return value. As you can see, the original class implements the Augment methods with a simple addition of the value one to its argument, but passing 10 as parameters returns us the value 12, because the interceptors was able to modify it transparently from the real called method.

The conclusion is that Castle is able to do AOP, even if it donâ€™t support standard concepts, but this is usually not a big problem, you just need to shift a little bit the AOP paradigm to the concept of interceptor.

Clearly the same can be done using fluent interface, here is the code to register an object with an interceptor:

{{< highlight csharp "linenos=table,linenostart=1" >}}
Console.WriteLine("Run 2 - configuration fluent");
using (WindsorContainer container = new WindsorContainer())
{
container.Register(
Component.For<IInterceptor>()
.ImplementedBy<DumpInterceptor>()
.Named("myinterceptor"));
container.Register(
Component.For<ISomething>()
.ImplementedBy<Something>()
.Interceptors(InterceptorReference.ForKey("myinterceptor")).Anywhere);
ISomething something = container.Resolve<ISomething>();
something.DoSomething("");
Console.WriteLine("Augment 10 returns " + something.Augment(10));
}
{{< / highlight >}}

Fluent interface has the *Interceptors()* method that you can use to list a series of reference to registered interceptors, and you can verify that the output of this snippet is exactly the same of the previous example.

Alk.
