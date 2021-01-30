---
title: "The importance of Factories in testing"
description: ""
date: 2009-05-15T10:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
One of the most frustrating stuff is refactoring code where errors gets discovered at run-time and not at compile time. These days Iâ€™m refactoring a section of a project, since some concepts are changed I needed to change also some database columns names.

Since naming of the table follows a convention that is not fully object oriented, it is easy to made mistake and mistype a column name in the mapping for nhibernate, for this reason I always create smoke test to verify that Iâ€™m able to save and reload all mapped classes in a database that is a empty copy of developing master database. This means that since I have a lot of not nullable columns, Iâ€™m forced to populate quite all properties of all object to be able to save them.

Moreover, to save instances of class X I need also to save all related entities, suppose you are saving an order class, you must populate the Customer Property, because the foreign key is not nullable. Since the test can be run in isolation, and I use scripts to clear all table before tests, I cannot assume that at least a customer is in database. To solve such a problem you need to carefully use Factories during testing. As an example Iâ€™ve created a simple factory that thanks to reflection populates all property of base types (int, strings, datetime etc,).

Here is a simple piece of test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
LinkResult result = SqlServerEntityFactory.CreateResult();
data.AnalyzedLink = result.Link;
uow.Save(data);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The data variable contains the object under test, I only want to test if I can save it, but it have a property of type AnalyzedLink  that link this object to a LinkResult. To create a valid LinkResult object, is a pain, because it is a central object it needs data in other three tables etc etc, but thanks to the SqlServerEntityFactory Iâ€™m able to create an object and saved it to the database, so I have a valid link.

Thanks to an helper class that populates basic properties with default values the factory have this code

{{< highlight csharp "linenos=table,linenostart=1" >}}
AnalyzedLink link = AnalyzedLinkGenerator.Generate();
uowal.Save(link);
LinkResult res = LinkResultGenerator.Generate();
res.Link = link;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

since AnalyzedLink have 13 properties this saves me a lot of typing, moreover if I add a new not nullable property to the class, all test continues to run with no problem because the AnalyzedLinkGenerator will populate that property with reflection.

alk.

Tags: [Testing](http://technorati.com/tag/Testing)
