---
title: "Theta join in HQL - join with unrelated entities"
description: ""
date: 2009-09-04T04:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
NHibernate HQL language is really powerful, and work in many scenario. Suppose you have those two classes.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image.png)

Action is an object capable of executing something, while ActionLog stores the result of the execution of an action. There is no direct relation between the two, so in ActionLog we have not a reference to Action, but a simple field called ActionId that stores the id of the action. The reason for this choice is that Action objects can be deleted (and there is a special form of action called SpawnedAction that gets created, executed, and finally phisically deleted from the table); ActionLog must be retained even for deleted action, so we prefer not to store a direct relation.

Everything works fine, but today I need to create a dto that transfer for each failed ActionLog both the ActionLog class and the Action class to access field from action. A first solution is to retrieve all ActionLog, then for each ActionLog load the appropriate Action using ActionId, but this will cause N+1 select.

Thanks to HQL we can use theta joins, here is my HQL

{{< highlight sql "linenos=table,linenostart=1" >}}
Select L, A from ActionLog L, Action A  where L.ActionId = A.id and L.IsSuccess = 0 order by L.StartDate desc{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see i select L and A from ActionLog and Action, then in where condition I'll insert the join condition L.ActionId with A.id, where *id*is a special property name in HQL that gets translated to the name of the property used as identifier for the Action class.

The result of this query is an arraylist, where each element is an array of objects, an instance of ActionLog and the corresponding instance of Action. Then I proceed creating this object

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image1.png)

the ActionErrorLog is a Dto that returns to the caller a couple consisting of a Log and corresponding action. Retrieving a list of ActionErrorLog is really simple.

{{< highlight sql "linenos=table,linenostart=1" >}}
IList logs = uow.Session.CreateQuery("Select L, A from ActionLog L, Action A  where L.ActionId = A.id and L.IsSuccess = 0 order by L.StartDate desc")
   .SetFirstResult(pageNum * pageSize)
   .SetMaxResults(pageSize)
   .List();
return logs
   .Cast<Object[]>()
   .Select(ae => new ActionErrorLog((ActionLog)ae[0], (Action)ae[1]))
   .ToList();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With the HQL query I recover all the couple Log-Action, then with a simple LINQ to object expression I can create all the object I need.

The only important stuff you need to remember, is that theta join are Inner join, so with the above query you do not find ActionLog where the corresponding action is deleted. I have no problem because I really need to show only result of actions that are still in the table. ;)

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)
