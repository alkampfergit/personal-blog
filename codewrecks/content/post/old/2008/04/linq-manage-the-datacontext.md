---
title: "LINQ Manage the DataContext"
description: ""
date: 2008-04-22T23:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
One of the most important stuff, when dealing with an orm, is to manage the lifecycle of the Context, call it Session in NHibernate or DataContext in Linq, the problem is the same. One of the most obvious solution is to store the Context in CallContext of System.Runtime.Remoting.Messaging object. This object permits to store object related to the current flow of execution, it is similar to store objects in thread local storage, but is not the same, it is in fact used to manage HttpContext in asp.net application, that is a multithread environment.

One approach that I like is to build an object called UnitOfWork that internally stores a Context and takes care to create, manage transacion, and dispose the Context, then With a UnitOfWork manager I manage to store the current UnitOfWork in CallContext, and with a UnitOfWorkWeakReference I solve the question

> When I should dispose the UnitOfWork?

The structure was explained in a [previous post](http://www.codewrecks.com/blog/?p=100) and it is useful because you can ask to UOWManager for current context, and when you finished with it you can simply dispose it. If the caller at higher level in the stack has begin a UOWContext, than you have a UOWWeakReference, so when you call dispose, nothing gets really disposed.

This can be used to solve a problem discussed in [old post](http://www.codewrecks.com/blog/?p=208) about retrieving data from a stored in linq to sql using a method of a business object, here is the improved version.

{{< highlight xml "linenos=table,linenostart=1" >}}
public IEnumerable<Order> GetOrderBiggerThan(Int32 amount) {
   using (UnitOfWork<Northwind1DataContext> uow 
      = UnitOfWorkManager<Northwind1DataContext>.GetUnitOfWork()) {
      return uow.Context.ExecuteQuery<Order>(
      "EXEC dbo.GetBigOrdersForCustomer {0}, {1}", amount, this.CustomerID);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see there is not the need to pass the context to the GetOrderBiggerThan method, inside the method the object grab a reference to the current context thanks to the method GetUnitOfWork() of the UnitOfWorkManager object. The important thing is that this cose use a using block so the current unit of work gets disposed at the end of the method. If noone has begin a Context, than he retrieve a new UnitOfWork and dispose it, but if some function high on stak has call UnitOfWorkManager.BeginContext() then he receve a UnitOfWorkWeakReference, that does nothing in the Dispose(). With this Trick you can call dispose whenever you want, but the real lifetime is chosen by the UnitOfWorkmanager.

Surely a better strategy is to use some IoC container such as Spring or Castle.

[Download the sample.](http://www.nablasoft.com/Alkampfer/Storage/blogexamples.zip)

Alk.

Tags: [Linq To Sql](http://technorati.com/tag/Linq%20To%20Sql) [Unit Of Work](http://technorati.com/tag/Unit%20Of%20Work)
