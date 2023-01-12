---
title: "Square peg in a round Hole"
description: ""
date: 2011-10-27T07:00:37+02:00
draft: false
tags: [Architecture,ORM]
categories: [Software Architecture]
---
After lots of year working with NHibernate I started to think that probably the whole concept of ORM can be considered an Antipattern. Some people prefer a “classic” approach to the problem, * **data** *is the key concept and most of the logic is inside a storage based on [Relational Model](http://en.wikipedia.org/wiki/Relational_model).

Is this wrong?

Absolutely not, after all, for many years this was the preferred way to structure your application, and it worked quite well, but after OOP has come to life, a lot of people started appreciating this new paradigm of programming and started to think in terms of “ **objects** ” instead of “ **data** ”.

This is a radical shift, because if you really possess “ **[object thinking](http://www.amazon.com/Object-Thinking-DV-Microsoft-Professional-David/dp/0735619654)** ”, you tend to subdivide the problem in *objects* that  have *methods*instead that in *table*that have *relations.*This lead to an obvious problem, since we need to store the data somewhere and since we already have good Relational Database Engine, the simplest solution is finding a way to save Objects in Relational Storage system and an ORM is the answer.

But after years of ORM the initial enthusiasm is completely passed away and I start believing that I’m forcing a square peg in a round hole.

![External Image](http://internationalhr.files.wordpress.com/2011/07/square-peg-round-hole.jpg)

Since most programmers started to work in terms of data and relations (after all university taught us to think in this way), using an ORM lead usually to highly anemic domain and tend to lead people of thinking in term of *objects that have state (properties) and relations with other objects* instead of *object that have methods and communicates with other objects (with events)*.

If you start designing your entities from their *state (properties)* it could be the sign that you moved from “*tables with relations and stored procedures that operates on tables*” to “*objects with relations and services that operates on objects*”, and you need to realize that the situation is not changed very much.

When people start to have problems with Session duration, Lazy Loading, eager fetching (or other issue related to ORM), is the sign that the square peg is not fitting in the round hole and the ORM becomes the Hammer that forces it down (usually bringing some pain with it).

This means that if you want to do OOP you should move everything to NoSql?

![External Image](http://4.bp.blogspot.com/-2ZyXXjrz7Cc/TeYFzdkAgHI/AAAAAAAAACg/DM8_jJh8yQk/s400/question-mark.jpg)

Absolutely not, because sometimes you will probably find yourself forcing a round peg in a square hole :). I’m starting to think that in a real, big, complex OOP project, you need to have *both type of storage*: Relational and Object based. This will give you  round holes and the square holes, so you can put each peg in the right place.

At least until some new technology comes to life that bring us a new Hexagonal Peg :) that will need an Hexagonal shaped data storage ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/wlEmoticon-smile.png).

Gian Maria.
