---
title: "LINQ SingleOrDefault and NullObject"
description: ""
date: 2008-08-20T03:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
Suppose you have this simple class (has no business meaning is valid only as example)

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class MyObject
{
    public static MyObject NullValue = new MyObject() { Value = -100, Name = String.Empty };
    public Int32 Value { get; set; }
    public String Name { get; set; }
    public string Greet()
    {
        return "Hey!! My value is " + Value;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is a simple class with two properties and a method Greet(). It use the [null object](http://en.wikipedia.org/wiki/Null_Object_pattern) pattern, because it defines an object with Value=-100 and Name=String.Empty as the NullValue. But how this object works with LINQ? Try this code:

{{< highlight CSharp "linenos=table,linenostart=1" >}}
IEnumerable<MyObject> samples = new MyObject[]
{
    new MyObject() {Value = 10, Name = "alkampfer"},
    new MyObject() {Value = 11, Name = "guardian"}
};
Console.WriteLine(
    samples.Where(o => o.Name == "alkampfer").SingleOrDefault().Greet());
Console.WriteLine(
    samples.Where(o => o.Name == "someother").SingleOrDefault().Greet());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ooopps, this raise a NullReferenceException, because the second LINQ query searches for an object called “someother”, it does not find any object that satisfy the query, then the SingleOrDefault() returns null, and here it is the exception. The question is, “is there a way to make SingleOrDefault returns my null object instead of null?”. The answer is straightforward

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static class MyLinqExtension
{
    public static MyObject SingleOrDefault(this IEnumerable<MyObject> source)
    {
        return System.Linq.Enumerable.SingleOrDefault(source) ?? MyObject.NullValue;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This extension method is more specific than the generic SingleOrDefault&lt;TSource&gt;(this IEnumerable&lt;TSource&gt; ) defined in the System.Linq.Enumerable extension class, so it gets called instead of the default one when the source contains MyObject and not general objects. The method use the base implementation of the SingleOrDefault, but with the use of the ?? operator, it changes null into your null object instance. Now if you run the sample again you will obtain.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Hey!! My value is 10
Hey!! My value is -100{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And you can see that now the null object Greet() function is called.

alk.

