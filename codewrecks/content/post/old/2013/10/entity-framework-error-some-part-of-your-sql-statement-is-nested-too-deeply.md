---
title: "Entity Framework error Some part of your SQL statement is nested too deeply"
description: ""
date: 2013-10-02T16:00:37+02:00
draft: false
tags: [EF,LINQ]
categories: [Entity Framework]
---
Today a colleague told me that he got a strange Entity Framework error

> Some part of your SQL statement is nested too deeply. Rewrite the query or break it up into smaller queries

I immediately ask him what kind of **huge and big query he was issuing to EF** , but the answer is pretty simple.

> Context.EntityName.Where(u =&gt; listOfId.Any(s =&gt; s.Equals(u.UserId))).ToList()
> 
> and listOfId is a List&lt;Int32&gt; with 100 integer

Basically he want to retrieve all entities that are related to a list of UserIds, having the list of UserId inside a simple list of integer. Even if the query looks good, this got translated to a monster Sql Query. Here it is a screenshot of the query (it is really too big to include in source)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/10/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/10/image.png)

Actually this probably happens because EF is not hable to handle well an Any operator applied to a list of integer and he treats it as any other ANY operator, so he creates basically a subquery for each of the number in the list.

The solution is quite obvious,  **rewrite the query** > Context.EntityName.Where(u =&gt; listOfId.Contains(u.UserId)).ToList()

This is a much simpler query, it simply express that we want all the entities with a UserId property that is contained in the list of Id. EF is now capable of translating in a much simpler SQL.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/10/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/10/image1.png)

This query is what we expect, a simple query with an IN operator.

The lesson learned from this example is:  **Try to express your query in the simplest way** and always look at what EF generates, to avoid bad surprise.

Gian Maria
