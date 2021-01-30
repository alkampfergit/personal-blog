---
title: "Faster invoke method of unknown objects with Expression tree part2"
description: ""
date: 2008-10-06T08:00:37+02:00
draft: false
tags: [NET framework,Experiences,LINQ]
categories: [NET framework,Experiences,LINQ]
---
In the [last post](http://www.codewrecks.com/blog/index.php/2008/10/04/expression-tree-vs-reflection/) I described a technique that uses Expression Tree to invoke dynamically methods of objects of types unknown at compile time. You can use this technique to build the [ExpressionTreeReflection](https://www.codewrecks.com/blog/wp-content/uploads/2008/10/expressiontreereflection.zip) class.

You can now write code like this

{{< highlight xml "linenos=table,linenostart=1" >}}
private static readonly Type suType = Type.GetType("DotNetMarche.Common.Test.AuxClasses.SimpleUnknown, DotNetMarche.Common.Test");
private static readonly Object suInstance = Activator.CreateInstance(Type.GetType("DotNetMarche.Common.Test.AuxClasses.SimpleUnknown, DotNetMarche.Common.Test"));
[Test]
public void TestFuncNoArgInt32()
{ 
    Func<Object, Int32> func = ExpressionTreeReflection.ReflectFunction<Int32>(suType, "AMethod");
    Assert.That(func(suInstance), Is.EqualTo(1));
}    {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You load a type unknown at compile time, the only information you know is the signature of one of its method, in the example is called AMethod and accepts no parameters and returns an Int32. The ReflectFunction() method of ExpressionTreeReflection helps you to build a Func&lt;Object, Int32&gt; you can use to call the method. This function accepts as first argument an instance of the object that contain the method to invoke, then all needed parameters. The first advantage is that you have a more strongly typed way to dynamically invoke the function instead of using reflection. Here is the code that invoke a function that need a string parameter.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void TestFuncOneArgInt32Overload()
{
   Func<Object, String, Int32> func = 
      ExpressionTreeReflection.ReflectFunction<String, Int32>(suType, "BMethod");
   Assert.That(func(suInstance, "test"), Is.EqualTo(8));
}    {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Using the func object is really simpler than using a MethodInfo, but the real power is showed by this little test

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test, Explicit]
public void TestPerformanceGain()
{
    Func<Object, Int32> func = ExpressionTreeReflection.ReflectFunction<Int32>(suType, "AMethod");
    MethodInfo minfo = suType.GetMethod("AMethod", BindingFlags.Public | BindingFlags.Instance);
    Double RefDuration = With.PerformanceCounter(() => { for (Int32 I = 0; I < 100000; ++I) minfo.Invoke(suInstance, new Object[] { }); });
    Double ExpDuration = With.PerformanceCounter(() => { for (Int32 I = 0; I < 100000; ++I) func(suInstance); });
    Console.WriteLine("Reflection = {0} Expression Tree {1}", RefDuration, ExpDuration);
}    {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The timing is output in seconds and the result is.

Reflection = 0.112139753757862 Expression Tree 0.00207625064646903

You can check that with expression tree you can invoke method of unknown object faster than standard reflection.

alk.

Tags: [.NET Framework](http://technorati.com/tag/.NET%20Framework) [Expression Tree](http://technorati.com/tag/Expression%20Tree)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/06/faster-invoke-method-of-unknown-objects-with-expression-tree-part2/';</script><script type="text/javascript">var dzone_title = 'Faster invoke method of unknown objects with Expression tree part2';</script><script type="text/javascript">var dzone_blurb = 'Faster invoke method of unknown objects with Expression tree part2';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/?p=449&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/?p=449)
