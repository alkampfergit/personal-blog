---
title: "Multiple bag with Fetchrdquojoinrdquo in nhibernate"
description: ""
date: 2010-04-03T15:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Suppose you have an entity like this

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image.png)

your NickName class has two bags, one containing a list of DomainRegistrations, and the other containing a series of Attachments. Now suppose you map both of these with fetch=â€joinâ€, this can cause a really really really big problem.

As you can read in [this bug](http://216.121.112.228/browse/NH-1471) in NHibernate jira, you should know that fetch join is not supported when there is more than one bag in the entity, because bag allows for duplicate items :). When you do your unit testing of the basic mapping functionality (you should always unit test mappings") when you save a NickName with 2 domains and 2 attachments and reload it, the ISession will give you a nasty object with 4 Domains and 4 Attachments :). If you think that NH should support this scenario think that bag allows duplicate, and this makes impossible for NH to understand from the resultset with fetch join, if the original object has 1 2 3 or 4 attachments.

The obvious solution is to change the fetch mode from join to select, but if you really want to be able to do a fetch=â€joinâ€ you can consider if you really want to allow duplicates in your DomainRegistrations and Attachments properties. Mapping association from one to many with a bag is simple, because you can use an IList&lt;T&gt; interface in your domain classes. If you do not want to allow duplicates, and map the collection as a &lt;set&gt; instead of a &lt;bag&gt; you cannot use anymore the IList&lt;T&gt; interface. This is due to the fact that NHibernate rehydrate entities using a specific class that supports â€œsetâ€ semantic, not allowing a duplicate and it does not implement IList&lt;T&gt;.

In my situation, I can change those two properties from IList&lt;T&gt; to ICollection&lt;T&gt; and initialize them with HashSet&lt;T&gt; framework class. Now Iâ€™m able to map them with &lt;set&gt;, setting fetch mode to â€œjoinâ€ avoiding the aforementioned duplicate problem. In the end I would prefer nhibernate to give me an error during mapping compile phase, something telling me â€œyou cannot use fetch mode join on a bag when more than a bag is present in an entityâ€, instead of having strange behavior at runtime :)

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)
