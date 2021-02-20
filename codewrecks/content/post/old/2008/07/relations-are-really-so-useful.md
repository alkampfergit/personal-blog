---
title: "Relations are really so useful"
description: ""
date: 2008-07-22T23:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
Today I was reading [this post](http://www.codemetropolis.com/archive/2008/07/22/domain-model-amp-aggregates-when-do-master-detail-associations-happen.aspx) from my friend [Marco](http://www.codemetropolis.com/), where he points out one of the most frequent problem in the design of domain Model: *too much use of relations*. The problem arises from the fact that an ORM like NHibernate, seems to solve all the problems because it handles all the complexities, but there are a lot of considerations to be done before establish a relation between entities. Let's have a brief look at the classical example of Customer-Orders

Since an order is related to a Customer, it is good to have relation from Order to Customer, it has business meaning since an order can live only when a customer places it with E-commerce site or in some other way. Lazy load minimize the hit to the database, issuing the select only when you access the data. If you want to associate an order with a Customer, you can avoid loading Customer data if you have CustomerId stored somewhere

{{< highlight xml "linenos=table,linenostart=1" >}}
Order.Customer = session.Load<Customer>(customerId);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This instruction uses ISession.Load(), that actually creates a proxy of the Customer Object, and since NHibernate needs only the Id of an object to set the relation, customer table never gets queried. This is good

Association between objects seems to make life easier, so one of the most frequent error is thinking that if an association is good, bidirectional association is two times good. With an ORM, lazy load, persistence by reachability, add associations between objects is a tempting strategy...but pay attention, this is the devil whispering to you hear, because bidirectional associations can be really dangerous.

To understand what is happening behind the scenes, suppose you decide to create an association from customer to order, with a simple property Orders of type IList&lt;Order&gt; in the Customer object. This is not a bidirectional association yet, but it is already problematic. First example: adding an order and a new Customer.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Customer gianMaria = new Customer("Gian Maria", "Ricci");
Order order1 = new Order(DateTime.Now, 10.00f);
gianMaria.Orders.Add(order1);
session.Save(gianMaria);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Here is the sql:

{{< highlight sql "linenos=table,linenostart=1" >}}
NHibernate: INSERT INTO CustomerOne (Name, Surname) VALUES (@p0, @p1); select SCOPE_IDENTITY(); @p0 = 'Gian Maria', @p1 = 'Ricci'
NHibernate: INSERT INTO Orders (Date, Total) VALUES (@p0, @p1); select SCOPE_IDENTITY(); @p0 = '7/22/2008 8:39:09 PM', @p1 = '10'
NHibernate: UPDATE Orders SET CustomerId = @p0 WHERE id = @p1; @p0 = '4', @p1 = '7'
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can see that the order is first inserted into the table with the customerId field equals to null, then the relation is setup with an Update, this means that two queries are needed to setup a relation, this is not scaring, but here is another example, adding an order to an existing customer.

{{< highlight xml "linenos=table,linenostart=1" >}}
Customer loaded = session.Get<Customer>(gianMaria.Id);
Order order2 = new Order(DateTime.Now, 10.00f);
loaded.Orders.Add(order2);
session.Flush();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code seems really simple, you load a customer knowing its id, then create a new order, and finally add the order to the inner collection of orders to setup the association, but if you knows how lazy load works you already expecting this SQL

{{< highlight sql "linenos=table,linenostart=1" >}}
NHibernate: SELECT customer0_.id as id1_0_, customer0_.Name as Name1_0_, customer0_.Surname as Surname1_0_ FROM CustomerOne customer0_ WHERE customer0_.id=@p0; @p0 = '4'
NHibernate: SELECT orders0_.CustomerId as CustomerId__1_, orders0_.id as id1_, orders0_.id as id0_0_, orders0_.Date as Date0_0_, orders0_.Total as Total0_0_ FROM Orders orders0_ WHERE orders0_.CustomerId=@p0; @p0 = '4'
NHibernate: INSERT INTO Orders (Date, Total) VALUES (@p0, @p1); select SCOPE_IDENTITY(); @p0 = '7/22/2008 8:48:53 PM', @p1 = '10'
NHibernate: UPDATE Orders SET CustomerId = @p0 WHERE id = @p1; @p0 = '4', @p1 = '6'{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

First of all, *even if you have the Id of the customer you need to load it entirely from db*, but the worst thing happens when you add the order to the orders collection, because nhibernate does lazy load, loading * **all the orders of the customer in memory** *, finally he generate the insert and update as before.

Think again to it **To add an order you have to load in memory  **all customer orders** **. What happens if the Customer have hundreds of orders??? Sounds bad, isn't it? Moreover you are wasting memory for nothing...you never access all the orders, you only want add new one.

Similar thing happens whenever you access Orders collection, if you access the first element *all the orders are loaded*, if you call Count *all orders gets loaded*. To avoid this you need to use ISession.CreateFilter() that permits you to issue a Count(\*) query without loading the elements or scan orders with pagination, but you can agree that this is not a good situation.

And with a bidirectional association things get worse, because you have also to keep the domain consistent, what happens if we add an Order in the collection of Customer1 and set the Customer property of the same order to Customer2?

The rule of thumb is that you need to set bag relations only when the containing object really needs the collection of child to have business meaning. If we have the FootballClub object it makes sense to have a collection of Players, after all, a Football Club without players has really little business meaning.

The whole problem originates when the developer use relations to reduce the explicit load operations from the database. Since ORM have lazy load, one can think to relate every object, in this way when you have an instance you can retrieve every other instance simply traversing the tree. But the domain *is a representation of our business done with objects*, and relations *are used to explain what concepts are related and how*, resists the temptation to use relations only as a way to navigate object tree, you should use repository for that.

When designing relations between object the aggregate pattern ([http://domaindrivendesign.org/discussion/messageboardarchive/Aggregates.html](http://domaindrivendesign.org/discussion/messageboardarchive/Aggregates.html)) is really useful, because a wise use can limit relations. The key concept is

> Allow external objects to hold references to root only.

This means that no relation can be done between two objects that are no root, but another important thing is

> Transient references to the internal members can be passed out for use within a single operation only.

Is the *root*that have complete control of the objects inside the aggregate, we create repositories only for Roots object limiting the way the user can access the domain.

Another concept that is of key importance is *[Value objects](http://domaindrivendesign.org/discussion/messageboardarchive/ValueObjects.html)*. Lets first point out that in DDD terminology, the term *value object*  **has nothing to do with the concept of.NET value object** they are completely different thing. A value object in DDD is an *object that has no identity and cannot live without a Entity object that contains it*. Here is the definition of Evans in Domain Driven Design

> An object that represents a descriptive aspect of the domain with no conceptual identity is called a VALUE OBJECT.

Sometimes is not simple to understand if an object is a value or entity and this distinction mainly depends from the domain. Lets do an example with an hypothetical Address object like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
Street: Loc Piano Di Frassineta 
Number: 1
City: Sassoferrato{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is my address ;), but it is a value or an entity object? In a software for an E-Commerce we can agree that having an address without a customer, or supplier or some other entity is really not useful, so the address is a good candidate to be a Value Object. The situation can be different for a software that need to calculate ICI (ICI is a tax on house in Italy), in such a software an address can be an entity, because the address identify the entity that has to be taxed. The key question that makes us distinguish between value and entity object is *This object can have a lifecycle of his own?*.

*A correct use of Value Objects leads to reduction of relations*, because relations from or to a Value Object is not permitted except from the object that contains it. Quite often the value object is stored in the same table as the owning object, it has no id and he share the lifecycle with containing object, so making a relation to it has really no sense.

Today Marco told me that he saw domains where we have object like Address, Street, Street Number, Zip code, all having bidirectional association between them. Rethinking such structure with Value objects greatly reduces problems.

Finally remember the [YAGNI](http://en.wikipedia.org/wiki/You_Ain't_Gonna_Need_It)  principle, avoid adding an association unless you really needs one and try to set up relations only when they have business meaning. I want to point out agaion that relations are not to be used for navigation because the purpose of retrieving object from the storage is duty of the repository. If we really want to access orders from customer object we can simply set up a method in Customer object called GetOrders(DateTime from, DateTime to) that internally access repository and gets order with a criteria.

Alk.

Tags: [Domain Driven Design](http://technorati.com/tag/Domain%20Driven%20Design) [Value Object](http://technorati.com/tag/Value%20Object) [Domain Relation](http://technorati.com/tag/Domain%20Relation)

<!--dotnetkickit-->
