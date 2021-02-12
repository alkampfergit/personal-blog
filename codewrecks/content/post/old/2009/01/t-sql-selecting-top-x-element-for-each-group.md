---
title: "T-SQL ndash selecting top X element for each group"
description: ""
date: 2009-01-02T08:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Today I need to build a query that selects the most expensive three orders made in a date range for each customer. This is the typical query where the ROW\_NUMBER() function introduced with Sql Server 2005 can really helps you. Here is a solution in northwind database.

{{< highlight sql "linenos=table,linenostart=1" >}}
select 
    orderId, 
    CustomerId, 
    Freight from
    (
    select 
        ROW_NUMBER() over (partition by CustomerId order by Freight desc) as RowNumber,
        orderId, 
    CustomerId, 
    Freight
    from 
        orders
    ) as innerTable
where RowNumber < 4
order by CustomerId, Freight desc{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the ROW\_NUMBER creates a column with an incremental number over some order clause and optionally partitioned over some columns. In this example I partition by CustomerId, this means that for each CustomerId the RowNumber starts again with number 1 then I order for *Freight desc*. I put everything in an inner Select and from the outer query I select only the rows whose RowNumber is less than 4, the result is the list of the three order with higher Freight for each customer, really simple ;)

10835    ALFKI    69.53  
  
10692    ALFKI    61.02

10952    ALFKI    40.42

10625    ANATR    43.90

10926    ANATR    39.92

10759    ANATR    11.99

10573    ANTON    84.84

10856    ANTON    58.43

10507    ANTON    47.45

10768    AROUT    146.32

10558    AROUT    72.97

10355    AROUT    41.95

â€¦

â€¦

Alk.
