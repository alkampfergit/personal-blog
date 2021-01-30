---
title: "Implement InotifyPropertyChanged with CastleDynamicProxy"
description: ""
date: 2008-08-04T09:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2008/08/04/implement-inotifypropertychanged-with-dynamic-code-generation/), I simply show how to dynamically generate a class that inherits from a given class, and implement INotifyPropertyChanged for all virtual properties of the object. The example used Reflection.Emit, and I must admit that for people not acquainted with MSIL, the code can be really hard to write. Thanks to [Castle project](http://www.castleproject.org/) we can also use the DynamicProxy library to obtain the same result, but with really less code and less effort.

Here is the whole class that generate proxy with INotifyPropertyChanged for me

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class CastleDM
{
    public Customer CreateProxy(Type parent)
    {
        ProxyGenerator generator = new ProxyGenerator();
        return (Customer)generator.CreateClassProxy(
            parent, new Type[] { typeof(INotifyPropertyChanged) },
            new INotifyPropertyChangedInterceptor(), new Object[] { });
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see this is a very simple class, I simple use the CreateClassProxy to generate a subclass of the Customer object that implements also the INotifyPropertyChanged, all the work is done by the class INotifyPropertyChangedInterceptor

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class INotifyPropertyChangedInterceptor : StandardInterceptor
{
    private PropertyChangedEventHandler handler;
    public override object Intercept(IInvocation invocation, params object[] args)
    {
        if (invocation.Method.Name == "add_PropertyChanged")
        {
            return handler = (PropertyChangedEventHandler)Delegate.Combine(handler, (Delegate)args[0]);
        }
        else if (invocation.Method.Name == "remove_PropertyChanged")
        {
            return handler = (PropertyChangedEventHandler)Delegate.Remove(handler, (Delegate)args[0]);
        }
        else if (invocation.Method.Name.StartsWith("set_"))
        {
            if (handler != null) handler(invocation.Proxy, new PropertyChangedEventArgs(invocation.Method.Name.Substring("set_".Length)));
        }
        return base.Intercept(invocation, args);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a very greedy implementation, I simply use an internal variable of type PropertyChangedEventHandler where I store the real handler that external code add to the PropertyChanged event. Then I intercept the invocation of each property that begin with “set\_” and raise the PropertyChanged event, passing the Proxy as the first object and a good PropertyChangedEventArgs as second argument.

With this class I can write this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
CastleDM emitter = new CastleDM();
Object instance = (Customer)emitter.CreateProxy(typeof(Customer));

Customer c = (Customer)instance;
c.Property = "TEST";

INotifyPropertyChanged inpc = (INotifyPropertyChanged)instance;
inpc.PropertyChanged += delegate(Object sender, PropertyChangedEventArgs args)
{ Console.WriteLine("PropertyChanged:" + args.PropertyName + " sender is equal to proxy:" + object.ReferenceEquals(sender, c)); };
c.Property = "TEST3";
c.AnotherProp = 22;
Console.WriteLine("Property=" + c.Property);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the object returned from the CreateProxy function is a Customer, but it implements also the INotifyPropertyChanged, and if you run the code you will obtain this output.

This actually shows me that the PropertyChanged is launched correctly, and that the sender is equal to the proxy object. The result is very similar to the one you can obtain with Reflection.Emit, but with really less code.

alk.

Tags: [DynamicProxy](http://technorati.com/tag/DynamicProxy) [Dynamic code generation](http://technorati.com/tag/Dynamic%20code%20generation)

<!--dotnetkickit-->
