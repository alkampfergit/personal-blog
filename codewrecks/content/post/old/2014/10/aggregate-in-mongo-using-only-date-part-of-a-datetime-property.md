---
title: "Aggregate in Mongo using only Date Part of a DateTime property"
description: ""
date: 2014-10-13T16:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
If you need to do an *aggregation in MongoDb on a DateTime property and you want to aggregate only by Date part*, you can use a simple trick and use a filter to compose the date part before the grouping. Here is the code

{{< highlight jscript "linenos=table,linenostart=1" >}}


db.mycollection.aggregate(
{
    "$project" :
    {
       _id : 0,
       "datePartDay" : {"$concat" : [
           {"$substr" : [{"$dayOfMonth" : "$LastUpdate"}, 0, 2]}, "-",
           {"$substr" : [{"$month" : "$LastUpdate"}, 0, 2]}, "-",
           {"$substr" : [{"$year" : "$LastUpdate"}, 0, 4]}
     ] }
    }
},
{ "$group" : 
    { "_id" : "$datePartDay", "Count" : { "$sum" : 1 } } 
    }
)

{{< / highlight >}}

Thanks to the power of [aggregation framework](http://docs.mongodb.org/manual/applications/aggregation/), we can construct a pipeline where the first stage create a document with a new property that is composed only by the day-month-year.  **That new document can have id equal to zero if we only need a count based on that date field, or you can assign original id of the document or whatever else**. The subsequent stage of the pipeline is a simple count where the id is the new field that contains only date part of the original DateTime property.

Gian Maria.
