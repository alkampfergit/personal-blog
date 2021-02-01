---
title: "Writing windows services smoke test form"
description: ""
date: 2009-12-16T17:00:37+02:00
draft: false
tags: [Architecture]
categories: [Software Architecture]
---
I work often with windows services, and one of the most painfully experience is that you do not have an UI and quite often they have to do some scheduled task at certain time, so whenever you have a deploy you can find yourself in this situation.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image15.png)

The question mark means that you are not sure if your new deploy is really ok, because maybe some of the scheduled tasks will fail for misconfiguration or something else. Usually production machine are different to developement ones, you can miss components, point to a wrong db, forget to update configuration, etc, etc. To avoid this situation you need a series of smoke checks, I usually proceed in this way.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class TestResult
{
    public Boolean Result { get; set; }
    public String Comment { get; set; }

    public static readonly TestResult Ok = new TestResult() {Result = true};
}

interface ITest
{
    TestResult Execute();
    String Name { get; }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the interface of the a component that is able to do a test, I can now write stuff like this

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class ResolveIoCTest: ITest
{
    #region ITest Members

    public TestResult Execute()
    {
        IoC.Resolve<IMYInterface>("xxxxx");
        return TestResult.Ok;
    }

    public string Name
    {
        get { return "ResolveIoCTest"; }
    }

    #endregion 
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Just to verify that I'm able to resolve a specific interface or a specific component, but you can actually verify every stuff you like, then I write a simple form with a button and a ritch text box.

The next step is finding in the assembly all test classes

{{< highlight csharp "linenos=table,linenostart=1" >}}
Type testInterfaceType = typeof(ITest);
IoC.FluentRegistration(
    AllTypes.Pick()
   .FromAssembly(
        Assembly.GetExecutingAssembly())
   .If(testInterfaceType.IsAssignableFrom)
   .Configure(reg => reg.LifeStyle.Transient)
   .WithService.FirstInterface());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to fluent registration it is easy to autoregister all test classes, now the test form simply call IoC.ResolveAll&lt;ITest&gt; and for each test execute it in a Try catch, and here is a typical result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image16.png)

Some exception occurred.

Now each time I write a component that needs verification, I write a simple test, then each time I deploy I runs this form and verify that I do not miss anything. This saves me pain, because I know that at least a set of smoke tests are passing correctly.

alk.

Tags: [Software Architecture](http://technorati.com/tag/Software%20Architecture)
