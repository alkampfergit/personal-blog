---
title: "Unity policy injection application block and AOP"
description: ""
date: 2009-01-17T04:00:37+02:00
draft: false
tags: [NET framework,Frameworks]
categories: [NET framework,Frameworks]
---
This is the third on a series of post I’m doing while exploring the Unity IoC container.

[Part 1 – Basic of IoC unity container](http://www.codewrecks.com/blog/index.php/2009/01/16/first-steps-with-unity/)  
[Part 2 – Basic of resolving dependencies and configure objects.](http://www.codewrecks.com/blog/index.php/2009/01/17/other-experiments-with-unity/)

Now it is time of [AOP](http://en.wikipedia.org/wiki/Aspect-oriented_programming) and using Policy Injection Application Block. [AOP](http://en.wikipedia.org/wiki/Aspect-oriented_programming) it is a very interesting technique, used to inject behavior on a class at runtime. To use AOP with Unity and policy injection application block you should *wrap* the instances returned by the Unity container as shown in this snippet.

{{< highlight xml "linenos=table,linenostart=1" >}}
ITest test1 = container.Resolve<ITest>("OtherTest");
ITest wrapped = Microsoft.Practices.EnterpriseLibrary.PolicyInjection.PolicyInjection.Wrap<ITest>(test1);
Console.WriteLine(wrapped.DoAnotherThing("TEST", 6));
Console.WriteLine(wrapped.DoSomething(2));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the Wrap function returns an object that implement the same interface of the original one, but the concrete type is a TransparentProxy that implements a sort of [decorator pattern](http://en.wikipedia.org/wiki/Decorator_pattern). This wrapper can inject behaviour into your classes. Since logging is one of the first thing that comes in mind when speaking about aop let’s add logging capabilities to the DoAnotherThing method of the ITest interface. The most important fact is that with AOP I will add logging capabilities to whatever class I configured with Unity. In this situation I’m only asking unity to resolve an object with name "OtherTest" and it implements the ITest interface, the real concrete class is defined in the configuration file.

First of all I opened configuration tool for enterprise library and add a policy injection block section and add a policy

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb6.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/01/image6.png)

This configuration have two section, the first is called *matching rules*, and is the place where you tells to the PJB where to inject some aspect, in the example I used the *member name matching rule*, that permits me to create a rule based on the name of the method. The Member Name Matching Rule has only a property called Matches, a collection of match rules. I created only one rule

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb7.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/01/image7.png)

I want this policy to be applied to every method that contains the string DoAnotherThing. The next step is configuring the handlers, the code you want to attach to the execution of all the methods that matches one of the Matching Rule. I inserted two handlers, the first is a custom handler (I’ll explain it in the next post of the series). The one I’m interested here is the *logging Handler*, an handler included into the enterprise library distribution, here is the configuration.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb8.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/01/image8.png)

The red property is related to the Enterprise application Logging block, You need to specify a list of Categories that the handler will use to log. The blue properties are the related to logging behavior. I’m asking not to include the stack trace, I want only to include the call time and the value of the parameters. Moreover I’m asking to the handler to run before and after the execution of the intercepted method.

Now I run the sample, and after the execution I see the logfile that contains

{{< highlight csharp "linenos=table,linenostart=1" >}}
----------------------------------------
Timestamp: 1/17/2009 10:35:41 AM
Message: 
Category: AOPLogging
Priority: -1
EventId: 0
Severity: Information
Title:Call Logging
Machine: GNOSI
Application Domain: PolicyInjection.exe
Process Id: 5528
Process Name: C:\Develop\SvnGianMaria\CodeCommon\trunk\Experiment\PolicyInjection\PolicyInjection\bin\Debug\PolicyInjection.exe
Win32 Thread Id: 4832
Thread Name: 
Extended Properties: test - TEST
parami - 6

----------------------------------------
----------------------------------------
Timestamp: 1/17/2009 10:35:41 AM
Message: 
Category: AOPLogging
Priority: -1
EventId: 0
Severity: Information
Title:Call Logging
Machine: GNOSI
Application Domain: PolicyInjection.exe
Process Id: 5528
Process Name: C:\Develop\SvnGianMaria\CodeCommon\trunk\Experiment\PolicyInjection\PolicyInjection\bin\Debug\PolicyInjection.exe
Win32 Thread Id: 4832
Thread Name: 
Extended Properties: test - TEST
parami - 6

----------------------------------------
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can verify I have two logs, one before the run of the method and the other after the run of the method. In extended properties of the log you can find all value for the parameters of the function, if you look at the beginning of this post you can verify that I called the method with [Console.WriteLine(wrapped.DoAnotherThing("TEST", 6));].

Enterprise library have other handler ready to use for handling exception, profiling, and you can write handler of your own if you like it. The only thing you need to do is to call PolicyInjection.Wrap()  on the instances returned from the Unity Container and setup handlers with enterprise library configuration tool.

alk.

Tags: [AOP](http://technorati.com/tag/AOP) [IoC](http://technorati.com/tag/IoC) [Unity](http://technorati.com/tag/Unity) [Policy Injection Application Block](http://technorati.com/tag/Policy%20Injection%20Application%20Block)
