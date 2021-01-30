---
title: "Linq and Domain Model"
description: ""
date: 2008-02-04T12:00:37+02:00
draft: false
tags: [Frameworks]
categories: [Frameworks]
---
For those loving the Domain Model approach, LINQ could be the most interesting features of VS2008. Here is a stupid example. When you have to transfer data to the UI, usually you do not want to pass to the UI the real object of the domain, but it is better to use some DTO. Converting a list of domain object into DTO can be a boring issue, but with linq it is really simple. Here is a simple domain with a *Customer*object and *Address*object. The Customer object has a collection of address, because a people can have more than one address, but I need to show into the UI only two main information, the fullname and the address expressed as string, so I created a CustomerDto

![](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/020408-1837-linqanddoma1.png)

Now how can I transform a list of Customer into a list of CustomerDto? First of all I created a function to assemble a CustomerDto from a Customer object.

![](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/020408-1837-linqanddoma2.png)

Now I can execute simple LINQ query to transform the list of Customer object to a list of CustomerDto object

![](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/020408-1837-linqanddoma3.png)

If you want you can use the more compact syntax of LINQ, the result is the same.

![](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/020408-1837-linqanddoma4.png)

Clearly you can use the full power of linq, such as restricing the query with where, suppose you want to transfer only the Customer that have at least one address.

![](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/020408-1837-linqanddoma5.png)

As you can see with LINQ you can issue a query against a list of object, filtering with a condition, and transforming into DTO, all in one pass.

Alk.
