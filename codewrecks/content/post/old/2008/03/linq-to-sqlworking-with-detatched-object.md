---
title: "Linq to Sqlworking with detached object 82308230"
description: ""
date: 2008-03-01T01:00:37+02:00
draft: false
tags: []
categories: [NET framework]
---
Linq to Sql is beautiful, but for people using NHibernate sometimes there are surprises. Suppose you load an entity, then you keep a reference in memory, dispose the original DataContext, and after some time you want to propagate to the database the value of the modified entity.

In NHibernate this is simple as calling SaveOrUpdate() method, in Linq2SQL you can call Attach() on the table you want to attach the object..but Huston..we have a problem, the Attach() method works well if you have the original value, or you can specify that the object is modified.

{{< highlight csharp "linenos=table,linenostart=1" >}}
northwind2.Customers.Attach(alfki, true);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

it turns out that this does not work, at least if we have optimistic concurrency on all the field not using a timestamp column. So another try is to grab again the entity from the new context.

{{< highlight sql "linenos=table,linenostart=1" >}}
NorthWindDataContext northwind = new NorthWindDataContext();
northwind.Log = Console.Out;
Customer alfki = (from c in northwind.Customers
                  where c.CustomerID == "ALFKI"
                  select c).Single<Customer>();
northwind.Dispose();
alfki.ContactName += "_";
NorthWindDataContext northwind2 = new NorthWindDataContext();
northwind2.Log = Console.Out;
Customer ori = (from c in northwind2.Customers
 where c == alfki
 select c).Single<Customer>();
northwind2.Customers.Attach(alfki, ori);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you see I first grab an object from a context, than I dispose original context, then I modify ContactName Property, create another context, grab again from the database the unmodified version of the object and finally pass to the Attach the detatched entity and the original value. the result is:

*An attempt has been made to Attach or Add an entity that is not new, perhaps having been loaded from another DataContext.  This is not supported.*

Then I stumble upon [this post](http://weblogs.asp.net/omarzabir/archive/2007/12/08/linq-to-sql-how-to-attach-object-to-a-different-data-context.aspx) that explain why this error is raised. So the solution seems to detach the Customer Object, ok I tried to write this code

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public partial class Customer
{
    public void Detatch() {
        this.PropertyChanged = null;
        this.PropertyChanging = null;
        this.Orders = new EntitySet<Order>();

    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now I detatch my object, then create another DataContext, then retrieve the original value, then call Attach() and now…..another exception

*Cannot add an entity with a key that is already in use.*

I was so frustrated :( but I’m not giving up, I create a clone method on the customer, and called it to store a copy of the entity before I modified the property

{{< highlight csharp "linenos=table,linenostart=1" >}}
alfki.Detatch();
northwind.Dispose();
Customer original = alfki.CloneMe();
alfki.ContactName += "_";
NorthWindDataContext northwind2 = new NorthWindDataContext();
northwind2.Customers.Attach(alfki, original);
northwind2.SubmitChanges();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It seems reasonably, I detatch from old DataContext, then clone the original values, then modify the disconnected object, and finally reattaching to a new DataContext. Ok now It works but why this had to be so damn difficult, I had to write code to detatch the object from the DataContext, moreover I have the duty to keeps track of changes….

Now the tale is not finished, what happens if I forget to clone the entity when I disconnected from the original session, what if I do not like to store original value somewhere? The solution could be, retrieve the original value with LINQ, then detatch and clone the value returned from database and use it.

{{< highlight sql "linenos=table,linenostart=1" >}}
NorthWindDataContext northwind2 = new NorthWindDataContext();
northwind2.Log = Console.Out;
Customer original = (from c in northwind2.Customers
                     where c == alfki
                     select c).Single<Customer>()
        .Detatch()
        .CloneMe();
northwind2.Customers.Attach(alfki, original1);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It does not work, because LINQ2SQL complains about reattaching an object with a key that is already in use, this is due to the fact that when DataContext retrieve the object original, it stores in its internal context, then I attach an entity from outside that has the same key………the only solution is to create a routine that copy all the property of the detatchedObject.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Customer Merge(Customer customer) {
    this.Address = customer.Address;
    this.ContactName = customer.ContactName;
    //.......
   return this;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Armed with this tedious method I can now write this code.

{{< highlight sql "linenos=table,linenostart=1" >}}
NorthWindDataContext northwind2 = new NorthWindDataContext();
northwind2.Log = Console.Out;
Customer original = (from c in northwind2.Customers
                     where c == alfki
                     select c).Single<Customer>()
        .Merge(alfki);
northwind2.SubmitChanges();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The advantage of this final solution is that with a Merge() method I does not need to write Detatch() or Clone() I simply retrieve with a query the orginal object in the datacontext and update his property with Merge(), the method is tedious to write but is the best and more elegant solution I found.

Ok, maybe it is better to continue to use NHibernate :D, LINQ to SQL is really exciting, but seems to be not so intuitive, this morning I have no more time to spent on LINQ2SQL so If someone have a better solution :D.

 **<font color="#ff0000">[Edit:]:</font>** Immediately after I publish this post, I browsed the properties of the DataContext and found a better solution

{{< highlight csharp "linenos=table,linenostart=1" >}}
northwind2.Customers.Attach(alfki);
northwind2.Refresh(RefreshMode.KeepCurrentValues, alfki);
northwind2.SubmitChanges();
northwind2.Dispose();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It turns out that the DataContext has a Refresh method that can be used to tell to DataContext “Hey the alfky object is really changed”, this maybe can represent the best solution. The Refresh method() is used to resolve optimistic concurrency, but the RefreshMode.KeepCurrentValues tells to the DataContext to *swap the original value with the values retrieved from the database* and this means ignore what is in the database, the object is the new version.

Maybe this concludes this tale :D

Alk.
