---
title: "Entity Framework a super dataset"
description: ""
date: 2011-06-09T07:00:37+02:00
draft: false
tags: [Entity Framework,Nhibernate,ORM]
categories: [Entity Framework,Nhibernate]
---
Entity Framework is quite a good product, but in my opinion still misses some point to be called an ORM. I must admit that I never used the 4.1 Code first in real project, but there are some stuff that still does not convince me when using EF.

### When I decide to use EF (and not NH) 

Sometimes I need to access small legacy databases to do a small amount of operations and I must admit that adding a EF Model from Visual Studio is a matter of seconds and the LINQ provider of EF is quite good so it is a valuable alternative to create a quick DAL. I have a simple database (four tables), I created an EF model, and then issue this query.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image7.png)

 ***Figure 1***: *A very simple piece of code that query database with EF*

This is a very super simple piece of code, in the first line I grab an instance of Term from the database (actually I grab the first one, in real code I have a complex query that returns a specific term). Then I want to grab all instance of Verbs that are related to this term, so I issue the second query, what will be the result?

![](http://t0.gstatic.com/images?q=tbn:ANd9GcSdyTdE26j7X1A04CUg2PNg9VAWxnxfX6mIRYKgv_6jpdSKN7cCEQ&amp;t=1)

This image exceptionally capture my face the first time I ran this query.

[![SNAGHTML4bb74e](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/SNAGHTML4bb74e_thumb.png "SNAGHTML4bb74e")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/SNAGHTML4bb74e.png)

 ***Figure 2***: *Strange error in the query.*

Iâ€™m really disappointed from this exception for many reasons. First of all I do not know why it does not work, because this is a perfectly and reasonable query to issue.

### Fix the query to make it works 

To verify that the query is indeed ok lets modify it in this way.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image8.png)

 ***Figure 3***: *Modified version of the query, now it works.*

This version works simply changing the order of the *Where* and *ToList* operators. It now works because it *loads the entire Verbs table in memory* and then filters out with LINQ to Object. This clearly makes me sick, because this creates a big memory pressure. The second issue with the above error is the error message, that is really obscure. *Unable to create a constraint value of type xxxxxxxx*. If you read with caution you could eventually understand that you cannot put a condition based on equality of objects, but only primitive type.

This error could have a good reason to exists: if the Term entity overrides the Equality method, it could be impossible to create an equivalent query in SQL to mimic the same behavior by the EF LINQ provider. Suppose that the Term overrides the Equal operator comparing two entities by checking for equality of the  **Value** and  **Type** properties, how could the EF provider understand this behavior to issue an equivalent query to the database? I can agree with this reason, but only if the error would be something like â€œCould not issue a comparison between two entities in a EF query because it is impossible to mimic the semantic of equals operator.. bla bla blaâ€.

### A real solution, but you need to make your hands dirty

But working with objects in DDD or Domain Model or even with Active Record pattern, the programmer in 99.99% of the situation, translate the condition * **V.Term == term** *with: â€œ*gives me all  **verbs** that are  **connected** with  **term** â€.*This because we are used to the fact that a reference from Verb entity to Term entity is part of the object graph and this can easily be translated with a comparison between identity operators. Given that, you can rewrite the above query in this way.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image9.png)

 ***Figure 3***: *The right way to issue the EF query*

Now the query runs fine, but you can have two completely different opinion about it.

The first opinion is negative, because I need to understand the name of the property/properties used as id by the ORM. I know that by convention you can use a property named  **Id** for every entity, but sometimes, especially with legacy database you can have entities with composite key or identity property named differently. LINQ is great to express query in the object model, but in this situation I need to be aware of details of the ORM Mapping to issue the right query and this is bad.

![](http://www.mydswa.org/wp-content/uploads/2010/09/negative-attitude.gif)

The second type of opinion is positive, because this query does not suffer from mismatch between the LINQ to entities counterpart when someone redefines the equals operator for the entity.

![](http://www.tigweb.org/images/express/panorama/articles/26121.jpg)

### Conclusion

I tend to agree with the dislike part, because I want my ORM to permit me to express query without being aware of the details. So I tend to consider EF not a real ORM but something like a * **SuperDataset** *, it is quick to use with database first approach, it permits you to create a DAL quickly, but it forces you to know the detail of the database, like a dataset. Clearly EF has  **really a lot of interesting feature respect to a dataset** , but it still miss something to be considered an ORM.

Alk.

Tags: [ORM](http://technorati.com/tag/ORM) [Entity Framework](http://technorati.com/tag/Entity%20Framework)
