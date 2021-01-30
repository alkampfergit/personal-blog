---
title: "Extend BindingList with filter functionality"
description: ""
date: 2008-11-22T05:00:37+02:00
draft: false
tags: [Languages,LINQ,Software Architecture]
categories: [Languages,LINQ,Software Architecture]
---
If you still work with windows forms and cannot move all of your projects to WPF, you probably gets annoyed by the limitation of the standard BindingList&lt;T&gt; included in the framework. In an [old post](http://www.codewrecks.com/blog/index.php/2007/10/12/bindinglistfind-and-notimplementedexception/) I showed how can you create a specialized BindingList&lt;T&gt; to support generic Find() thanks to reflection, but this is not enough.

Another annoying limitation is that BindingList does not support IBindingListView. For those that does not knows this interface, it is the one used by the windows forms binding engine to support filtering and advanced sorting. I think that filtering is a real basic functionality needed by the binding engine, and in fact WPF support for filtering, sorting and grouping, make these operations really a breeze. But BindingList does not offers such a functionality.

My question is: *is it possible to inherits from BindingList&lt;T&gt; adding generic filtering support as for the DataView component*?. The answer is yes, here is a simple implementation.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public string Filter
{
    get
    {
        return filterClause;
    }
    set
    {
        if (filterClause == value) return;
        filterClause = value;
        DoFilter();
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is really simple, I implement the FIlter property with a simple check, if the filterClause changes, I call the DoFilter function.

{{< highlight xml "linenos=table,linenostart=1" >}}
private Func<T, Boolean> filterPredicate;
private List<T> original = new List<T>();
private void DoFilter()
{
    if (String.IsNullOrEmpty(filterClause))
    {
        Items.Clear();
        original.ForEach(e => Items.Add(e));
    }
    else
    {
        original.Clear();
        original.AddRange(Items);
        Items.Clear();
        filterPredicate = DynamicLinq.ParseToFunction<T, Boolean>(filterClause);
        foreach (T element in original.Where(filterPredicate))
           Items.Add(element);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The implementation is based on this standard trick, if a filter is applied I copy all the elements in a temp list, then clear the base.Items list and add again only the elements that satisfies the filter. The big work is done in DynamicLinq.ParseToFunction that takes a string and dynamically compiles a function with that criteria. Here is a simple test showing this class in action.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void TestLogicAnd()
{
    Func<Customer, Boolean> f = DynamicLinq.ParseToFunction<Customer, Boolean>("Name == 'Gian Maria' && Age > 5");
    Assert.That(f(aCustomer), Is.True);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Actually I use three main component, a tokenizer that takes a string and separates into token, then I pass the tokenized expression (is a List&lt;String&gt;) to another component that convert the infix form in postfix form ([reverse Polish](http://en.wikipedia.org/wiki/Reverse_Polish_notation)), finally I create an expression from the reverse Polish form, creates a LambdaExpression on it and finally call compile() to make dynamic generation happens. The result is a dynamic generator of LINQ expression from a string. It still misses a lot, you cannot express condition on nested properties and parameter support is still experimental, but the basic is there.

The code is still under development, if you are curios you can check out the repository at [http://dotnetmarcheproject.googlecode.com/svn/trunk](http://dotnetmarcheproject.googlecode.com/svn/trunk "http://dotnetmarcheproject.googlecode.com/svn/trunk") the code is still in rough form, but if you like it you can give it a shot. The class is the BindingListExt&lt;T&gt;

Alk.

Tags: [BindingList](http://technorati.com/tag/BindingList) [IBindingView](http://technorati.com/tag/IBindingView) [Dynamic Expression Parser](http://technorati.com/tag/Dynamic%20Expression%20Parser)
