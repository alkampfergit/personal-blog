﻿---
title: "Do you ORM"
description: ""
date: 2010-11-05T19:00:37+02:00
draft: false
tags: [Entity Framework,ORM]
categories: [Entity Framework]
---
I really believe that I could not live anymore without ORM, and this is one simple reason.

Suppose in NorthWind you should query for all Customers that have at least four orders where the total discount  is greater than 100.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image4.png)

 **Figure1:** *LINQ query to select all customers that have at least three orders with total discount greater than 100*

Doing this in EF with a LINQ query is really simple (Figure 1), because you can express it with condition on the object model, and you can use the Count() LINQ operator and calculate the discount with simple math. The most important part is that you could be a SQL newbie, but you are still able to create a complex query. Now suppose that you should also paginate this result server side.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image5.png)

 ***Figure 2***: *Server side pagination of a complex query thanks to Count(), Skip() and Take() operators*

This is SOOOOO SIMPLE, I can use Count() on the original query to take the total count of records that satisfy the query and then I can paginate with Skip() and Take() ignoring the complexity of the query. Now, verify with EF profiler what is issued to the database. This is the count part

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image6.png)

 ***Figure 3***: *The count part to paginate server side*

pretty scaring isn't it? And here is the query that retrieve a single page

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image7.png)

 ***Figure 4***: *The query generated to retrieve page number 2, you can verify how row\_number() is used to paginate server side*

Ok, now I can hear some DBA crying that this query is not optimized, and that probably a stored procedure with some temp table could perform faster, but consider that:

1. I wrote this query in few seconds, it was really simple to express that condition in LINQ
2. OK, I'm quite smart in SQL, but I could have wrote it without even know how to paginate with row\_number() OVER(... SQL instruction. The concept is that a programmer that knows LINQ could actually be a NOOB in SQL and still be able to express complex query.
3. I'm a really Oracle Newbie, I have not tried actually, but this query can be issued to an oracle database, and I completely ignore Oracle Syntax to paginate server side. The query is not bound to a specific database because it is generated by the provider. And this is probably the best reason to use an ORM.
4. Executing against a local Northwind database shows that it executes in milliseconds so it is not an overkill query (even if Northwind database is not so big)

[![SNAGHTMLdbad81](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLdbad81_thumb.png "SNAGHTMLdbad81")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLdbad81.png)

 ***Figure 5***: *Timing of the executed query.*

Try to do this without an ORM :).

alk.
