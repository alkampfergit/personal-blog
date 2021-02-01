---
title: "TFS Rest Api and Asof operator"
description: ""
date: 2014-07-05T08:00:37+02:00
draft: false
tags: [Rest APIs]
categories: [Team Foundation Server]
---
 **TFS** [**Rest Api**](http://www.visualstudio.com/en-us/integrate/explore/explore-vso-vsi) **are one of the most exiting new feature introduced in Visual Studio Online**. One of the most important aspect of TFS is the ability to gather data about our team and having full access to that data for custom reporting is the primary need for most people. While you can query TFS Warehouse database for on-premise TFS to gather all the data you need, you have no access to databases for VSO In such scenario Rest APIs are the best way to interact to your account to quickly grab data to consume from your application.

To start experimenting with the API,  **one of the best approach is using some Rest Client (I use** [**Advanced Rest Client for Chrome**](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo) **), login to your VSO account so the browser is authenticated and start issuing requests**. As an example, suppose you want to create a chart of Bugs Counts subdivided by State. Sadly enough Work Item query Language does not supports grouping functions, but with Rest APIs you can get data you need with multiple queries. One of the coolest REST endpoint is the one that allows you to [execute a Query in Work Item Query Language](http://www.visualstudio.com/integrate/reference/reference-vso-work-item-query-results-vsi).

You can POST to this url

{{< highlight sql "linenos=table,linenostart=1" >}}


https://gianmariaricci.visualstudio.com/defaultcollection/_apis/wit/queryresults?api-version=1.0-preview

{{< / highlight >}}

With a json payload of

{{< highlight java "linenos=table,linenostart=1" >}}


{ "wiql": "Select [System.Id] FROM WorkItems where 
[System.TeamProject] = 'Experiments' AND
[System.WorkItemType] = 'Bug' AND
[System.State] = 'Proposed'" }

{{< / highlight >}}

Do not forget to set Content-Type header to application/json, and you got a result similar to this one.

{{< highlight js "linenos=table,linenostart=1" >}}


{
asOf: "2014-07-05T09:52:39.447Z"
query: {
type: "query"
columns: [1]
0:  "System.Id"
-
queryType: "flat"
sortOptions: [0]
wiql: "Select [System.Id] FROM WorkItems where [System.TeamProject] = 'Experiments' AND [System.WorkItemType] = 'Bug' AND [System.State] = 'Proposed'"
url: null
}-
results: [13]
0:  {
sourceId: 108
}-
1:  {
sourceId: 270

{{< / highlight >}}

When you execute a query, the result is a series of Work Items Id, but if you need summary data for a chart, you can simply count the number of elements of the results array to obtain the number of bug in state *proposed*. In this example this number is 13. If You execute execute a separate query for each state you will end with all the data you need to create a simple chart of Bugs count divided by state. This is not a big result, because this type of graphs is available directly from your VSO account.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image4.png)

 ***Figure 1***: *Count of Bugs grouped by state*

But the most interesting aspect of using Work Item Query Language is the asOf operator. In the above result you can see that the result starts with

> asOf: “2014-07-05T09:52:39.447Z”

This indicates that the results of the query was done at that specific instant of time, and  **the interesting part is that you can use the asOf operator to query WorkItem at different point in time**. Es

{{< highlight js "linenos=table,linenostart=1" >}}


{ "wiql": "Select [System.Id] FROM WorkItems where 
[System.TeamProject] = 'Experiments' AND
[System.WorkItemType] = 'Bug' AND
[System.State] = 'Proposed'
asof '2014-07-04T10:00:00.000Z'
 " }

{{< / highlight >}}

As you can see I’ve added asOf and a timestamp at the end of the query. This instruct TFS to execute the query and returns me the result valid at that specific Timestamp, in fact I have different number returned.

{{< highlight js "linenos=table,linenostart=1" >}}


{
asOf: "2014-07-04T10:00:00Z"
query: {
type: "query"
columns: [1]
0:  "System.Id"
-
queryType: "flat"
sortOptions: [0]
wiql: "Select [System.Id] FROM WorkItems where [System.TeamProject] = 'Experiments' AND [System.WorkItemType] = 'Bug' AND [System.State] = 'Proposed' asof '2014-07-04T10:00:00.000Z' "
url: null
}-
results: [16]
0:  {
sourceId: 108

{{< / highlight >}}

Number of Bug in state “proposed” was 16 and not 13 at that different timestamp. If you issue multiple queries, you can also create a trend graph with easy.

 **Thanks to asOf operator and REST API, grabbing historical data from TFS to create custom charts or report could not be easier**. My suggestion is creating a routine that grab the data you need and save in some local store. Run that routine each day to keep your local data aligned, then manipulate data with Excel PowerPivot or other similar tool to create the Charts you need.

Gian Maria.
