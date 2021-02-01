---
title: "Again on Expression Tree vs Reflection"
description: ""
date: 2008-10-09T01:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In last post [Expression Tree vs Reflection](http://www.nablasoft.com/Alkampfer/index.php/2008/10/04/expression-tree-vs-reflection) I showed how to use Expression Tree to dynamically build a function object at runtime  that you can use to invoke methods of unknown objects. This is a peculiar use of Expression Tree, but you can obtain the same result with Lightweight Code Generation (as some people commented in the post). Moreover the LCG approach is probably faster because the expression tree uses LCG in the Compile method, so if you directly generate your code in IL, there is no need of intermediate Expression Tree object. (You have also full control on IL). Remember that when I say that LCG is faster, I'm speaking about the time needed to build the dynamic function, and not the real time needed to invoke the function. To compare the two techniques here is an example, I want to be able to write code like this.

{{< highlight xml "linenos=table,linenostart=1" >}}
Func<Object, Int32> func = ExpressionTreeReflection.ReflectFunction<Int32>(suType, "AMethod");
Assert.That(func(suInstance), Is.EqualTo(1));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I have a type that is unknown at compile time, I know that it has a method called AMethod, and I want to create a Func&lt;Object, Int32&gt; object to dynamically invoke that method instead of invoking it with plane reflection. Here it is a possible implementation of ReflectFunction with Expression Tree:

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 1 public static Func<Object, T> ReflectFunction<T>(Type objType, String methodName)
 2 {
 3     MethodInfo minfo = objType.GetMethod(
 4         methodName,
 5         BindingFlags.Instance | BindingFlags.Public,
 6         null,
 7         CallingConventions.Any,
 8         new Type[] { },
 9         null);
10     ParameterExpression param = Expression.Parameter(typeof(Object), "object");
11     Expression convertedParamo = Expression.Convert(param, objType);
12     Expression invoke = Expression.Call(convertedParamo, minfo);
13     LambdaExpression lambda = Expression.Lambda(invoke, param);
14     Expression<Func<Object, T>> dynamicSetterExpression = (Expression<Func<Object, T>>)lambda;
15     return dynamicSetterExpression.Compile();
16 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is really straightforward to write, first of all get the MethodInfo object for the method you want to invoke, then create a parameter of type Object, then a conversion parameter to cast the object to the correct type (line 11) and finally the expression representing the call to the method. To obtain a Func&lt;Object, T&gt; object I need to create a lambda expression, cast it to the appropriate type, and finally call its Compile method. With LCG the code to obtain the same result is the following.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 1 public static Func<Object, T> ReflectFunction<T>(Type objType, String methodName)
 2 {
 3     MethodInfo minfo = objType.GetMethod(
 4         methodName,
 5         BindingFlags.Instance | BindingFlags.Public,
 6         null,
 7         CallingConventions.Any,
 8         new Type[] { },
 9         null);
10     DynamicMethod retmethod = new DynamicMethod(
11         objType.FullName + methodName,
12         typeof (T),
13         new [] {typeof(Object)});
14     ILGenerator ilgen = retmethod.GetILGenerator();
15     ilgen.Emit(OpCodes.Ldarg_0);
16     ilgen.Emit(OpCodes.Castclass, objType);
17     ilgen.Emit(OpCodes.Callvirt, minfo);
18     ilgen.Emit(OpCodes.Ret);
19     return (Func<Object, T>) retmethod.CreateDelegate(typeof(Func<Object, T>));
20 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is not complex, but we need to know IL to make it works.  After I grab the MethodInfo object I create a DynamicMethod with the constructor that accepts the name of the method, the return type and the list of parameters types. Then you can call the *GetILGenerator* method, and you will obtain a ILGenerator object that you can use to write IL code into the new method body. The IL code is really simple, since the dynamic method will be generated as is a static method (check the documentation to see how to dynamically create an instance method) the first argument is the object passed to the function, so I use Ldarg\_0 to push on the stack, then a Castclass to be sure that the caller passed an object of the correct type, and finally the Callvirt to actually invoke the right method, now the return value is on the stack, so you can call Ret. The final touch is calling *CreateDelegate* method of the DynamicMethod specifying the signature of the function, and the game is done.

For those interested in performance, here is a simple test

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test, Explicit]
public void TestPerformanceGain()
{
    Func<Object, Int32> func = ExpressionTreeReflection.ReflectFunction<Int32>(suType, "AMethod");
    Func<Object, Int32> lcgfunc = LCGReflection.ReflectFunction<Int32>(suType, "AMethod");
    MethodInfo minfo = suType.GetMethod("AMethod", BindingFlags.Public | BindingFlags.Instance);
    Double RefDuration = With.PerformanceCounter(() => { for (Int32 I = 0; I < 100000; ++I) minfo.Invoke(suInstance, new Object[] { }); });
    Double ExpDuration = With.PerformanceCounter(() => { for (Int32 I = 0; I < 100000; ++I) func(suInstance); });
    Double LcgDuration = With.PerformanceCounter(() => { for (Int32 I = 0; I < 100000; ++I) lcgfunc(suInstance); });
    Console.WriteLine("Reflection = {0} Expression Tree {1} LCG {2}", RefDuration, ExpDuration, LcgDuration);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And the corresponding output.

Reflection = 0.892017037086468 Expression Tree 0.012591549690529 LCG 0.0127834533958392

As you can see the Expression Tree method seems to be a little faster, but the timing is quite the same. The real thing to notice is that both techniques are really faster than invoking the method through the MethodInfo object.

alk.

Tags: [.NET Framework](http://technorati.com/tag/.NET%20Framework) [Lightweight Code Generation](http://technorati.com/tag/Lightweight%20Code%20Generation) [Expression Tree](http://technorati.com/tag/Expression%20Tree)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/09/again-on-expression-tree-vs-reflection/';</script><script type="text/javascript">var dzone_title = 'Again on Expression Tree vs Reflection';</script><script type="text/javascript">var dzone_blurb = 'Again on Expression Tree vs Reflection';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/09/again-on-expression-tree-vs-reflection/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/09/again-on-expression-tree-vs-reflection/)
