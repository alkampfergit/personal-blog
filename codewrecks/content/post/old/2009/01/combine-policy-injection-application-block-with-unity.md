---
title: "Combine Policy Injection Application Block with Unity"
description: ""
date: 2009-01-26T02:00:37+02:00
draft: false
tags: [NET framework,Enterprise Library,Frameworks]
categories: [NET framework,Enterprise Library,Frameworks]
---
[Part 1 – Basic of IoC unity container](http://www.codewrecks.com/blog/index.php/2009/01/16/first-steps-with-unity/)  
[Part 2 – Basic of resolving dependencies and configure objects.](http://www.codewrecks.com/blog/index.php/2009/01/17/other-experiments-with-unity/)  
[Part 3 – AOP with Policy Injection Application Block](http://www.codewrecks.com/blog/index.php/2009/01/17/unity-policy-injection-application-block-and-aop/)  
[Part 4 – Custom Handler to use with Policy Injection Application Block](http://www.codewrecks.com/blog/index.php/2009/01/18/custom-handler-to-use-with-policy-injection-application-block/)

In previous parts I showed how to configure unity container and how to create a custom handler for policy injection application block, now it is time to speak about integration between PIAB and Unity container.

First of all you should read [this thread](http://www.codeplex.com/unity/Thread/View.aspx?ThreadId=38040) that deal about this issue, and you can get disappointed to know that the integration is not so tight. The problem is that PIAB is now superseded by unity, it does means that you does not need to use PIAB to do AOP but you can use directly unity container.

If you look at the source of PIAB you can see something interesting, If you follow the Wrap method of PIAB you find this function

{{< highlight xml "linenos=table,linenostart=1" >}}
private object DoWrap(object instance, Type typeToReturn)
{
    container.Configure<Interception>().SetDefaultInterceptorFor(typeToReturn, injector);

    return container.BuildUp(typeToReturn, instance);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the variable container is a IUnityContainer, this means that the real work is done by Unity and PIAB is now just a way to access AOP functionality of Unity in different way. Let’s see how you can make this two interact. This is the Class Diagram of a TestB class

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb15.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image15.png)

As you can see it implements the ITest interface and internally uses an ILogger object. The Logger property is defined in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Dependency]
public ILogger Logger { get; set; }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now when you resolve the ITest interface with unity container how can you make unity do AOP for the property Logger of class TestB? Remember that PIAB works calling explicitly  **PolicyInjection.Wrap()** method on a target object, but the ILogger object that will be assigned to Logger property of TestB class gets automatically resolved by unity container. The question is "How can you make the unity container aware of policies defined for PIAB". The solution was explained in [this thread](http://www.codeplex.com/unity/Thread/View.aspx?ThreadId=38040).

If you configure the PIAB to intercept the interface ILogger you gets disappointed because when you resolve TestB with unity, Logger property does not contains a proxy, but the concrete class defined in the config file. This means that calls to ILogger methods are not intercepted because unity ignore configuration of the PIAB. To solve this problem you should use the following code.

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 //Gets the PIAB configuration part
 2 IConfigurationSource configSource = ConfigurationSourceFactory.Create();
 3 PolicyInjectionSettings settings = (PolicyInjectionSettings)configSource.GetSection(PolicyInjectionSettings.SectionName);
 4 
 5 // Apply PIAB settings, if any, to the container
 6 if (settings != null)
 7 {
 8    settings.ConfigureContainer(container, configSource);
 9 }
10 container.Configure<Interception>().SetInterceptorFor((typeof(ILogger)), new TransparentProxyInterceptor());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In line 2 you use the ConfigurationSourceFactory class of enterprise library to load the actual configuration, then in line 3 you gets the section that relates to PIAB. If a setting is present you can use its  **ConfigureContainer()** method to apply PIAB configuration to the unity container. Now the container is aware of the policies defined for PIAB. This is not enough, because you need to explicitly tells unity to set interception for the ILogger interface, and you should also specify the type of interception, in this situation the  **TransparentProxyInterceptor()**.

Now unity is aware of the PIAB configuration and know that it should intercept the ILogger interface. Let’s see what is happening when you resolve the object.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb16.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image16.png)

As you can see the Logger property gets assigned a TransparentProxy, et voilà.

Since PIAB is using a container to do its works, it is not clear why it is still a separated block in the enterprise library. Since all the AOP functionalities are exposed by the Unity block it seem superfluous to keep the PIAB alive, because now PIAB seems to me just a different way to configure a unity container, and does not deserve a complete block on its own in Enteprise library.

alk.

Tags: [Policy Injection Application Block](http://technorati.com/tag/Policy%20Injection%20Application%20Block) [Unity](http://technorati.com/tag/Unity) [Enterprise Library](http://technorati.com/tag/Enterprise%20Library)
