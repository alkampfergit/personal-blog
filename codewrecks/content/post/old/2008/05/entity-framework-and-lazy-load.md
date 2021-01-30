---
title: "Entity Framework and lazy load"
description: ""
date: 2008-05-30T01:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In an [old post of mine](http://www.codewrecks.com/blog/index.php/2008/04/06/adonet-entity-framework-and-lazy-load/) I expressed my perplexity with the fetching strategy of Entity Framework. We can discuss on the fact that automatic lazy load can be useful or not, but I expressed my opinion that, if you decide not to include automatic lazy load, and you implement manual load, if the developer forget to call load() an exception should be raised. This because if you forget to load a collection and access it, you find it empty, and this is misleading.

Yesterday I was reading last msdn magazine issue, and I read this article [http://msdn.microsoft.com/en-us/magazine/cc507640.aspx](http://msdn.microsoft.com/en-us/magazine/cc507640.aspx "http://msdn.microsoft.com/en-us/magazine/cc507640.aspx") that answer some standard question on Entity Framework. At the middle of the article I found

> *However, the customer record associated with an order is not fetched as a part of this query, and as a result of this, an Orders entity’s associated Customers entity is not loaded. Therefore, the following code sample will throw an exception when it tries to access the Order’s Customers since it is not loaded:*

It seems that since my first experiment the situation is improved, we still miss the automatic lazy load, but at least the standard behavior is more consistent.

alk.

Tags: [Entity Framework](http://technorati.com/tag/Entity%20Framework)

<!--dotnetkickit-->
