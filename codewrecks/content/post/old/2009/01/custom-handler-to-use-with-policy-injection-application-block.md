---
title: "Custom Handler to use with Policy Injection Application Block"
description: ""
date: 2009-01-18T03:00:37+02:00
draft: false
tags: [NET framework,Enterprise Library]
categories: [NET framework,Enterprise Library]
---
Previous Posts:

[Part 1 – Basic of IoC unity container](http://www.codewrecks.com/blog/index.php/2009/01/16/first-steps-with-unity/)  
[Part 2 – Basic of resolving dependencies and configure objects.](http://www.codewrecks.com/blog/index.php/2009/01/17/other-experiments-with-unity/)  
[Part 3 – AOP with Policy Injection Application Block](http://www.codewrecks.com/blog/index.php/2009/01/17/unity-policy-injection-application-block-and-aop/)

In this fourth part I’ll examine how to build a simple custom handler that will be used with [Policy Injection Application Block](http://msdn.microsoft.com/en-us/library/dd139982.aspx). The purpose of the handler is simply dumping to console the name of the called method as well all the parameters with theirs values. Here is the class.

{{< highlight yaml "linenos=table,linenostart=1" >}}
[ConfigurationElementType(typeof(CustomCallHandlerData))]
public class MyLogHandler : ICallHandler
{
   public MyLogHandler(NameValueCollection parameters)
   {
      this.parameters = parameters;
   }
   private NameValueCollection parameters;

   public int Order { get; set; }

   public IMethodReturn Invoke(IMethodInvocation input, GetNextHandlerDelegate getNext)
   {
     // return input.CreateMethodReturn(null);
       
      Console.WriteLine("intercepted call to: {0}", input.MethodBase.Name);
      Console.WriteLine("Parameters:");
      for (int I = 0; I < input.Arguments.Count; I++)
      {
         Console.WriteLine("{0}: {1}", input.Arguments.ParameterName(I), input.Arguments[I]);
      }
      Console.WriteLine("Call original function");
      IMethodReturn retvalue = getNext()(input, getNext);
      return retvalue;
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Code is really simple, the only interesting method is the  **Invoke()** that gets called instead of the original method of the wrapped object. This method has two parameters, the first contains all the informations on the method invocation, like: name and value of all parameters; the second parameter is a delegate used to get the next handler delegate in the AOP chain. This is needed because you can add more than one handler to a single method, so you will end up with a chain of interceptors.

Now we need to configure PIAB to insert this handler wherever we need it

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb9.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image9.png)

I want to set a matching rule for an entire type (red), this type of matching rule has only one property called matches (Green) that will accepts a list of types to intercept, in this example I ask to add handlers only to the ITest interface (blue)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb10.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image10.png)

I need to specify a custom handler (red) as handler type, then configure the exact type in the type property of the handler (blue) the Order property can be left to 0 (automatic). You can use the order property to manually define the order in witch the handlers will be called.

Now I can simply fire this code

{{< highlight xml "linenos=table,linenostart=1" >}}
ITest test1 = container.Resolve<ITest>("OtherTest");
ITest wrapped = Microsoft.Practices.EnterpriseLibrary.PolicyInjection.PolicyInjection.Wrap<ITest>(test1);
Console.WriteLine(wrapped.DoAnotherThing("TEST", 6));
Console.WriteLine(wrapped.DoSomething(2));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And gets this output.

{{< highlight yaml "linenos=table,linenostart=1" >}}
intercepted call to: DoAnotherThing
Parameters:
test: TEST
parami: 6
Call original function
Prop = VAL Names = 2
intercepted call to: DoSomething
Parameters:
param: 2
Call original function
SUPER:DoSomething Called
1{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

From the output you can notice that *each invocation of methods belonging to ITest*, will result in a call to our custom handler.

Inside an handler you really have great control on what to do, you are not only limited to passive operation like inspecting parameters but you can actively modify the behavior of the function. Let’s show how to swallow all exceptions, and logging them to the console.

{{< highlight csharp "linenos=table,linenostart=1" >}}
IMethodReturn retvalue = getNext()(input, getNext);
if (retvalue.Exception != null)
{
   Console.WriteLine("Exception: {0}", retvalue.Exception);
   retvalue.Exception = null;
}
return retvalue;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this code the handler first verify if the invocation of the function have raised an exception, if yes it simply dumps the exception message to the console and clear the exception. Now if you add a throw statement in DoAnotherThing function the output will be:

{{< highlight yaml "linenos=table,linenostart=1" >}}
intercepted call to: DoAnotherThing
Parameters:
test: TEST
parami: 6
Call original function
Exception: System.Exception: TEST
   at PolicyInjection.TestB.DoAnotherThing(String test, Int32 parami) in C:\Deve
lop\SvnGianMaria\CodeCommon\trunk\Experiment\PolicyInjection\PolicyInjection\Tes
tB.cs:line 21

intercepted call to: DoSomething
Parameters:
param: 2
Call original function
SUPER:DoSomething Called{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the execution of the program was not stopped by the exception and the exception is dumped to the console.

In PIAB there is already a handler called *[Exception Handling Handler](http://msdn.microsoft.com/en-us/library/dd139899.aspx)* that is integrated with [Exception Handling Application Block](http://msdn.microsoft.com/en-us/library/dd203116.aspx), and is a good starting point in defining centralized rules to handle the exception of applications. But if you need some custom logic you can write your own.

[Download code](http://www.codewrecks.com/blog/storage/PolicyInjection4.zip).

alk.

Tags: [IoC](http://technorati.com/tag/IoC) [Policy Injection Application Block](http://technorati.com/tag/Policy%20Injection%20Application%20Block) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
