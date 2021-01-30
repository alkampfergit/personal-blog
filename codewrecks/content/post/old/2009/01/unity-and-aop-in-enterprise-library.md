---
title: "Unity and AOP in enterprise library"
description: ""
date: 2009-01-31T02:00:37+02:00
draft: false
tags: [NET framework,Enterprise Library]
categories: [NET framework,Enterprise Library]
---
[Part 1 – Basic of IoC unity container](http://www.codewrecks.com/blog/index.php/2009/01/16/first-steps-with-unity/)  
[Part 2 – Basic of resolving dependencies and configure objects.](http://www.codewrecks.com/blog/index.php/2009/01/17/other-experiments-with-unity/)  
[Part 3 – AOP with Policy Injection Application Block](http://www.codewrecks.com/blog/index.php/2009/01/17/unity-policy-injection-application-block-and-aop/)  
[Part 4 – Custom Handler to use with Policy Injection Application Block](http://www.codewrecks.com/blog/index.php/2009/01/18/custom-handler-to-use-with-policy-injection-application-block/)  
<u><font color="#acb613"><a href="http://www.codewrecks.com/blog/index.php/2009/01/26/combine-policy-injection-application-block-with-unity/">Part 5 &#8211; Combine policy Injection Application Block with Unity</a></font></u>

In last post I showed how Policy Injection Application Block is now only a tiny wrapper around Unity. So Unity is the enterprise library section that does both AOP and Dependency Injection, this make me a little bit confused :) so I decided to forget about PIAB, just to avoid confusion.

To use AOP with unity without PIAB one of the possible solution is using custom attributes, suppose you write an handler called MyLogHandler, you can just create this attribute.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class MyLogHandlerAttribute : HandlerAttribute
{
   public override ICallHandler CreateHandler(IUnityContainer container)
   {
      return new MyLogHandler();
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This one is a particular attribute because it inherit from [HandlerAttribute](http://msdn.microsoft.com/en-us/library/dd203240.aspx) and it needs only to override the CreateHandler method and returns an instance of the handler you want to use. You can apply this attribute to every class or method you want to intercept, if you apply it to a class every method will be intercepted, if you apply it to a single method you will intercept only that method. Here is an example.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[MyLogHandler]
interface ILogger
{ 
   void Log(String message);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is not enough to make interception happens, Unity should be instructed that you want the ILogger interface to be intercepted and you must also specify the type of interception.

{{< highlight xml "linenos=table,linenostart=1" >}}
container.Configure<Interception>().SetDefaultInterceptorFor<ILogger>(new TransparentProxyInterceptor());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can call Set **Default** InterceptorFor or simply SetInterceptorFor; the first one tells unity container to apply interception every time that a specific type is resolved: when the user calls  **Resolve&lt;T&gt;** or when the type is resolved for some dependency. In the [example](http://www.codewrecks.com/blog/storage/unitex2.7z) , this means that when you resolve TestB class, since is has a dependency to ILogger, the Ilogger object that will get resolved will be intercepted. (this is the configuration section for the TestB object)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb17.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image17.png)

When unity resolve the object named  **OtherTest** it resolves also the dependency to the ILogger interface and creates the SuperLogger, but since I asked to set a  **default** interceptor for the ILogger interface it gets intercepted and wrapped.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb18.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image18.png)

If you change the code and call SetInterceptorFor instead of Set **Default** InterceptorFor, the situation is different.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb19.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image19.png)

As you can verify the logger variable contains a transparent proxy because it gets resolved directly, the Logger property of the TestB object is not intercepted because it is resolved for a dependency. Keep in mind this distinction because it is one of the most important in the unity interception structure.

I do not like the code+attributes approach to AOP, because if I need to intercept some other methods I need to modify code and recompile, in a AOP world I want to use only configuration files to specify everything, let’s see how to do it. First of all I set up some alias to make the configuration more readable

{{< highlight xml "linenos=table,linenostart=1" >}}
<typeAliases>
   <typeAlias alias="singleton"
              type="Microsoft.Practices.Unity.ContainerControlledLifetimeManager, Microsoft.Practices.Unity" />
   <typeAlias alias="transparentProxy"
              type="Microsoft.Practices.Unity.InterceptionExtension.TransparentProxyInterceptor, Microsoft.Practices.Unity.Interception" />
   <typeAlias alias="typeMatchingRule"
              type="Microsoft.Practices.Unity.InterceptionExtension.TypeMatchingRule, Microsoft.Practices.Unity.Interception"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

These aliases permits me to use shorter name in the config. Here is the first part of the config

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb20.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image20.png)

Container configuration has an extension node that permits to add extensions, then you add the corresponding [extensionConfig](http://msdn.microsoft.com/en-us/library/dd139966.aspx) to configure specific extension you’ve added. For interceptors you add a series of &lt;interceptor&gt; node. Each interceptor node must have a type attribute that specify the type of interceptor to use, then you must add a series of*&lt;key&gt;* or *&lt;default&gt;* nodes to specify the types to intercept. Each &lt;key&gt; elements will call the SetInterceptorFor, each &lt;default&gt; element calls a Set **Default** ConfigurationFor.

Now that interception is configured you need to specify types or methods that should be intercepted, this is done with the Policy element. Each policy element is composed by a series of matching rules that are used to identify methods to be intercepted and a list of handlers to use, here is an example.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb21.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image21.png)

Unity gives you some basic matching rules, in this example I’ve used a typeMatchingRule (look to the aliases section to verify the exact type). This class permits you to specify a Name of a class that will be intercepted. To specify the name of the class in code you must pass a string to the constructor of the matching rule, in configuration file you can obtain the same result with an *&lt;injection&gt;* node.

The resulting config file is really verbose, and I must admit that is not so readable, compare it with code configuration

{{< highlight xml "linenos=table,linenostart=1" >}}
container.Configure<Interception>()
  .SetDefaultInterceptorFor<ILogger>(new TransparentProxyInterceptor())
  .AddPolicy("LogMethod")
  .AddMatchingRule(new TypeMatchingRule("ILogger"))
  .AddCallHandler(typeof(MyLogHandler));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Configuration API for Unity permits you to use a simple fluent syntax to configure interception, this kind of configuration is more readable, more manteniable and less error prone. To set interception I needs only five lines, the XML file is really longer an more complex. If you want to use interception in your project, you could configure everything in code and accept to recompile when the configuration change or you can use dynamic compilation to configure container at runtime using code files.

[Code for the example can be found here.](https://1drv.ms/u/s!AvPVMcA4v48okoUHPSvc6BAWhDV_Tg)

alk.

Tags: [Unity](http://technorati.com/tag/Unity) [AOP](http://technorati.com/tag/AOP) [Enterprise Library](http://technorati.com/tag/Enterprise%20Library) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
