---
title: "SqlError quotThe server encountered a stack overflow during compile timequot"
description: ""
date: 2008-08-05T05:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
This morning I see from a server log this frightening error.. “The server encountered a stack overflow during compile time”. Fortunately I used elmah to log all error of the site, so I immediately find the page that gives that problem.

It turns out that in a page we used to make some query to get a list of entities that satisfies some kind of criteria, then we build a page showing all these entities.

The query was build dynamically with a SELECT xx, yy from ZZ where Id IN(1,2,3,5,6..). We simply generate a list of comma separated Id that will be passed to sql server in a IN clause. We used to set up some control that prevent the user from doing a search with no criteria, but it turns out that this check is removed for some sort of reason.

Now a user can run the routine without condition, actually retrieving the id of all the entities, thus creating a frightening 5k query with  thousands of Ids…….the query was so bit that it breaks the query parser.

Using the SQL instruction IN with such a pattern is surely a bad thing.

Alk.

<!--dotnetkickit-->
