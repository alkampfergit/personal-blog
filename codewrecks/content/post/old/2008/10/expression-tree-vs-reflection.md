---
title: "Expression Tree vs reflection"
description: ""
date: 2008-10-04T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Everyone knows that invoking method through reflection is slower than direct invocation, here is a little test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Int32 iterations = 100000;
Stopwatch watch = new Stopwatch();
MyObject obj = new MyObject();
obj.Prop = 0;
watch.Start();
for (Int32 I = 0; I < iterations; ++I)
{
    obj.Prop = obj.Prop + 1;
}
watch.Stop();
Console.WriteLine("Direct invocation {0} iterations {1} ms",
    iterations, watch.ElapsedMilliseconds);

PropertyInfo pinfo = typeof(MyObject).GetProperty("Prop", BindingFlags.Public | BindingFlags.Instance);
obj.Prop = 0;
Object[] nullobj = new Object[] { };
watch.Reset();
watch.Start();
for (Int32 I = 0; I < iterations; ++I)
{
    pinfo.SetValue(
        obj,
        ((Int32)pinfo.GetValue(obj, nullobj)) + 1,
        nullobj);
}
watch.Stop();
Console.WriteLine("Reflection invocation {0} iterations {1} ms",
   iterations, watch.ElapsedMilliseconds);
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This snippet creates an object with an int property, then it make a simple increment of the property, the first time with standard code, the second time with reflection, every iteration needs two invocation through reflection, one to get the actual value, the other to set the new value, here is the output.

Direct invocation 100000 iterations 2 ms

Reflection invocation 100000 iterations 1307 ms

This simple example shows that reflection is really, really slower, but reflection makes possible to modify a property whose name is known only at runtime, so it is unavoidable in certain situation.

A simple alternative approach exists, it relay on using Expression Trees. For those who does not knows Expression Trees I suggest reading [this book](http://www.amazon.com/Programming-Microsoft%C2%AE-PRO-Developer-Paolo-Pialorsi/dp/0735624003/ref=pd_bbs_sr_1?ie=UTF8&amp;s=books&amp;qid=1223116217&amp;sr=8-1), in short an expression tree is simple a way to represent an expression through an object model. Now lets look at this code.

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 MethodInfo SetterMethodInfo = pinfo.GetSetMethod();
 2 ParameterExpression param = Expression.Parameter(typeof(MyObject), "param");
 3 Expression GetPropertyValueExp = Expression.Lambda(
 4     Expression.Property(param, "Prop"), param);
 5 Expression<Func<MyObject, Int32>> GetPropertyValueLambda =
 6     (Expression<Func<MyObject, Int32>>)GetPropertyValueExp;
 7 
 8 ParameterExpression paramo = Expression.Parameter(typeof(MyObject), "param");
 9 ParameterExpression parami = Expression.Parameter(typeof(Int32), "newvalue");
10 
11 MethodCallExpression MethodCallSetterOfProperty = Expression.Call(paramo, SetterMethodInfo, parami);
12 Expression SetPropertyValueExp =  Expression.Lambda(MethodCallSetterOfProperty, paramo, parami);
13 Expression<Action<MyObject, Int32>> SetPropertyValueLambda = (Expression<Action<MyObject, Int32>>)SetPropertyValueExp;
14 obj.Prop = 0;
15 Func<MyObject, Int32> Getter = GetPropertyValueLambda.Compile();
16 Action<MyObject, Int32> Setter = SetPropertyValueLambda.Compile();
17 watch.Reset();
18 watch.Start();
19 for (Int32 I = 0; I < iterations; ++I)
20 {
21     Setter(obj, Getter(obj) + 1);
22 }
23 watch.Stop();
24 Console.WriteLine("Reflection setter with expression getter {0} iterations {1} ms",
25    iterations, watch.ElapsedMilliseconds);
26 {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code seems really complicated but it is simple once you knows the structure of an expression tree. We need to represent the expression obj.Prop = obj.Prop + 1, but if you try to convert this into an expression you see that the compiler generates the error â€œAn expression tree may not contain an assignment operatorâ€, but this is not a problem, because obj.Prop = something means calling the setter method of the property. Armed with this knowledge I create two distinct expression, one for the Get part and the other for the Set part. The good thing of having an ExpressionTree is that he has a method called Compile(), that creates a code block that represents the expression. In line 15 16 I use this functionality to create two delegate.

Now the fun part, suppose you does not known the type at compile time (in the code included with this post I created a type on different assembly) you can still apply this technique.

{{< highlight xml "linenos=table,linenostart=1" >}}
1 Type otherType = Type.GetType("Other.OtherMyObject, Other");
2 PropertyInfo ISomePinfo = otherType.GetProperty("Prop", BindingFlags.Public | BindingFlags.Instance);
3 
4 param = Expression.Parameter(typeof(Object), "param");
5 Expression convertedParam = Expression.Convert(param, otherType);
6 GetPropertyValueExp = Expression.Lambda(Expression.Property(convertedParam, "Prop"), param);
7 Expression<Func<Object, Int32>> dynamicGetterExpression = (Expression<Func<Object, Int32>>)GetPropertyValueExp;
8 Func<Object, Int32> dynamicGetter = dynamicGetterExpression.Compile();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In line 1 I get the type through reflection, and in line 2 get the property Prop with reflection too. Now I begin to create the expression I need for the Getter. If I want to get a property from an object that I do not know at compile time, I need to create a function of type  **Func&lt;Object, Int32&gt;** , a function that gets an object and return an Int32 value, since the property is Int32. In line 4 I create the parameter for the expression of type object, then I create a Convert expression in line 5 (it is a cast) then I create the lambda that access the property. Finally I use the Compile method to obtain a Func&lt;Object, Int32&gt;.

This expression is the same of this instruction  **((OtherMyObject) obj).Prop** but since I does not know the type at compile time Expression Tree is the only way to write such a function. The setter part is similar, you can check on the source code. The fun part is that now I can write this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Object otherObj = Activator.CreateInstance(otherType);
for (Int32 I = 0; I < iterations; ++I)
{
    Int32 actualValue = dynamicGetter(otherObj);
    dynamicSetter(otherObj, actualValue + 1);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The instance is created with Activator.CreateInstance because I really does not know the type at compile time, but I can use dynamicGetter and dynamicSetter with no problem. Here is the output of the timing.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Direct invocation 100000 iterations 1 ms
Reflection invocation 100000 iterations 616 ms
Expression Tree getter 100000 iterations 1 ms
Expression tree with unknown object getter 100000 iterations 2 ms{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can see that the using this technique permits to completely bypass performance penalties that you have with reflection.

Source code [can be found here](http://www.codewrecks.com/blog/storage/expTreeSample.zip).

alk.

Tags: [Expression Tree](http://technorati.com/tag/Expression%20Tree) [.NET Framework](http://technorati.com/tag/.NET%20Framework)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/04/expression-tree-vs-reflection/';</script><script type="text/javascript">var dzone_title = 'Expression Tree vs reflection';</script><script type="text/javascript">var dzone_blurb = 'Expression Tree vs reflection';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/04/expression-tree-vs-reflection/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/04/expression-tree-vs-reflection/)
