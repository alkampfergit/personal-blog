---
title: "Again on INotifyPropertyChanged and POCO object"
description: ""
date: 2008-08-07T04:00:37+02:00
draft: false
tags: [Frameworks]
categories: [Frameworks]
---
In [this post](http://blogs.ugidotnet.org/bmatte/archive/2008/08/06/mixin-poco-e-inotifypropertychanged-mito-o-realtagrave.aspx) [Matteo](http://blogs.ugidotnet.org/bmatte) shows that if you build a dynamic object to create a proxy that implements INotifyPropertyChanged this does not works with BindingList&lt;T&gt;.

First of all I want to say that my previous [two post](http://www.codewrecks.com/blog/index.php/2008/08/04/implement-inotifypropertychanged-with-castledynamicproxy/) were made only to show how to create a proxy, I really believe that using Dynamic Code Generation to implement Interfaces like INotifyPropertyChanged is not a good idea.

The greatest problem with dynamic objects is that the *type is known only at run time, and not at compile time,*this means that at compile time you cannot make any supposition on the proxy itself. In such a scenario, if you create a proxy that implements an interface, the only way to use it, is to check at runtime if the interface is implemented. With Generics, things become more complicated, because if you build a BindingList&lt;T&gt;, the code of that class assumes that you put object of type T in it, and since T does not implement INotifyPropertyChanged, the ListChanged is not raised.

The only way to use a DynamicType with BindingList is creating the right BindingList with reflection.

{{< highlight xml "linenos=table,linenostart=1" >}}
Type bl = typeof (BindingList<>);
Type reallist = bl.MakeGenericType(generated);
IBindingList GoodList = (IBindingList) Activator.CreateInstance(reallist);
GoodList.ListChanged += test_ListChanged;
GoodList.Add(c);
c.Property = "CHANGED";{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But this is not even close to be usable code, because you had to cast the BindingList to a IBindingList, and you cannot use the generic methods, because you cannot tells the compiler the real type T used to instantiate the object. Using a Dynamic Type in this way can be a reflection nightmare.

Dynamic types are useful when you do not need to know anything about the real type, Lazy Load is one of the pattern that greatly benefit from dynamic types, this because you ask for a Customer, and the ORM gives you a CustomerProxy, but you never need to interact with the proxy part, you only need that it *is-a* Customer.

So I want to tell you again: using a Dynamic Type to add some behavior to a real type is quite often not the good thing to do.

But before I close this post I want to do a consideration on BindingList&lt;T&gt;.

This is the implementation of InsertItem() method, the list check if raiseItemChangedEvents  is true, this means that in the constructor it found that the type T implements the INotifyPropertyChanged

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/08/image-thumb.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/08/image.png)

But when you check the HookPropertyChanged you see this code..

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/08/image-thumb1.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/08/image1.png)

For each object that gets added you want to handle PropertyChanged event, this method try to cast the object to INotifyPropertyChanged, if the cast is ok then the event is hooked. Now my question is, “why  is the code still trying to cast the item with the *as* operator, if we can call this method only when the raiseItemChangedEvents is true, and this means that type T implements INotifyPropertyChanged?? “

It would be a better strategy not to use raiseItemChangedEvents field, because you can simply call the HookPropertyChanged for each object that being inserted.

Alk.

<!--dotnetkickit-->

Tags: [Dynamic Code Generation](http://technorati.com/tag/Dynamic%20Code%20Generation)
