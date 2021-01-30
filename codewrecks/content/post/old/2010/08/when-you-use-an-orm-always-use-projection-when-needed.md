---
title: "When you use an ORM always use projection when needed"
description: ""
date: 2010-08-05T12:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Iâ€™m optimizing a little bit an application, it is a windows form client that communicates with a WCF service. A specific form is really slow to open, so I decided to measure with a profiler to understand if something could be optimized with a little effort.

It turns out to me that 99% of form starting time is spent in waiting communication with services. First of all I see 8 calls to 8 method of the service, and this could lead to a too fine grained interface for the service, but the real problem is due to a couple of calls. After a brief inspection I found that this process is returning a list of objects bound to a combobox. The service correctly returns a dto with only the Id and Name properties, so the amount of data transmitted is really low, but the query used to retrieve data does not contains a projection.

In the first release of the project, the object has Id, Name and another property of type date, so the service call was created with a simple Repository.EntityName.GetAll() and then the Dto is rehydrated. After a couple of version, the object has really a lot of other information, and relations with many other classes, thus the getAll() produces not a query with a lot of Joins with others table. The solution was a simple projection to retrieve only the Id and Name properties, and query execution time was reduced from a couple of seconds to some milliseconds. (joined table has really a lot of records)

As a rule of thumb, if you need only some properties of an object, always do a projection, to issue simpler query to the database, and to maximize performance.

alk.
