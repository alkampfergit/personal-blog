---
title: "Add a cache andhellip yoursquove created a security bug"
description: ""
date: 2011-01-25T16:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
This is the history of a nasty bug happened today. There is some service that has a method called GetCustomers() and this function is used from a web application and a Windows application. Since landing web page use this function to show all customers data, and since  Customers entity changes rarely we decide to put the result of this service call in Cache with 1 hour absolute expiration.

Web interface is made in WebForms, so we used an ObjectDataSource to communicate with the service, here is the code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
String cachekey = "34F56C51-1941-480A-9801-70C6B1E31DF0";
IList<CustomerDto> result;
if ((result = HttpContext.Current.Cache.Get(cachekey) as IList<CustomerDto>) == null)
{
//result isnot in cache, get from service and add to cache
result = ItemService.GetCustomers();
HttpContext.Current.Cache.Insert(cachekey, result, null, DateTime.Now.AddMinutes(60),Cache.NoSlidingExpiration );
}
{{< / highlight >}}

This code works ok, it uses an unique guid as cache key because the GetAllCustomers() has no parameters, so we simply check if the result is in cache, if not, call the service and put the result in the cache.

Everything seems okâ€¦ or not?

The question is: is it correct to store result in cache if we know that we can wait for one hour to see updated data?

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/01/image19.png)

The correct answer is: you cannot answer to this question if you do not know the implementation of GetAllCustomers() service function. What we need to know is that service method answers with the same result when we call it with the same parameters or the method depends from some other data of the environment.

This code works fine, until requirements changed. A new requirements introduced a new role in the system (called SimpleUser), and users belonging to this role are allowed to see only a subset of all Customers, and this subset is handled from Administrator roles. This functionality was implemented inside the GetAllCustomers() service function. If current user belongs to this new role, the service will issue a query on Customers object with a join to the AllowedCustomers table and the name of current user to show only allowed customersâ€¦ and this introduced a bug

![](http://www.mspmentor.net/wp-content/uploads/2010/01/symantec-endpoint-security-bug.jpg)

Do you spot the problem???

Suppose this scenario, an administrator enters in the system, data source issued the call to GetAllCustomers() service method and put data in cache. Now a SimpleUser logs to the system, data source object find the result of GetAllCustomers() in cache and simply returns it.. showing the result of all customersâ€¦. wow, now if the user choose an unassociated user the system chrashes with a securityException but worst of all, he see data from all Customers, even those he have not access toâ€¦.

The obvious solution is adding the name of the logged user to the cache key when the user belong to the SimpleUser Role, but this bug reminded me of how really difficult is creating a good cache strategy.

Alk.
