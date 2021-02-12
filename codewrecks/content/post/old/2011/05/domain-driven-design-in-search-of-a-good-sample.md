---
title: "Domain Driven Design in search of a good sample"
description: ""
date: 2011-05-13T06:00:37+02:00
draft: false
tags: [DDD]
categories: [Domain Driven Design]
---
Some time ago, I was speaking with my dear friend [Mauro Servienti](http://www.topics.it/) about Domain Driven Design and the hard time we have in making people understand the real reasons behind [DDD](http://domaindrivendesign.org/), CQRS and all the concepts in the DDD ecosystem.

![](http://comm563.files.wordpress.com/2011/03/test_difficult.jpg)

Maybe I'm wrong but in my opinion it is difficult to explain DDD with classic examples like Orders&lt;-&gt;products&lt;-&gt;Customers or similar examples. In Italy DDD is still not know by many people and there is the need to make them aware of the real reason behind OOP. What I usually see during a DDD talk are people in the room that had already implemented Order/products/customer concept several times in their life; this lead them to compare the DDD approach to the ones they used in the past to understand if they can benefit from it. Since most people usually proceed with database first approach, they absolutely does not understand the reason behind concepts like CQRS, or an approach based on OOP. The result is that quite all the question are on the data layer (orm, transaction, etc) and little or no question arise about OOP concepts like Patterns. Many people think the DDD approach is using an ORM to persist object in database.

![](http://www.adobe.com/newsletters/edge/october2008/articles/article2/images/fig02.jpg)

Sadly enough I see people in the audience ends up telling *I do not need DDD in my work, it seems complex, I need an ORM, with CQRS everything became much more complicated, I'll keep to use dataset or maybe Entity Framework or NHibernate to avoid writing query in SQL and saving.NET objects.*

I and Mauro ended our brainstorming with the conviction that part of the problem is in the sample used during the talk, DDD should be explained with a complex domain and it would be useful if the audience never engaged in the past with that domain, so their mind is free from old concepts and they are forced to think to a new approach to a new problem. I must admit that I never engaged me in real complex projects solved with full DDD approach, mostly because you need a full team that agree with DDD principles and approach.

![](http://www.personaltraining-coaching.com/public/img/images/team-building1.jpg)

I and Mauro ended with the desire to challenge us on this direction, spending some spare time trying to create a domain to use as a sample, to verify if this makes the audience more aware of the benefit of a DDD approach.

Alk.
