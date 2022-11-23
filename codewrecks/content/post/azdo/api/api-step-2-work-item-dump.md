---
title: "Azure Devops Api - Export Work Items"
description: "If you want to export all of your Work Items in another format (excel, internal database) Azure DevOps Api are the solution"
date: 2022-11-26T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

One of the most common scenario where Azure DevOps API shine is **exporting data into some other db/file**. There can be lots of legitimate reason why you want to export data: Custom Reporting, Custom Analysis, put everything into a file/database to **perform offline query on your data outside Azure DevOps interface**.

In previous parts we already saw how to [connect to the server](https://www.codewrecks.com/post/azdo/api/api-step-1-connection/) and how to [check if credentials are ok](https://www.codewrecks.com/post/azdo/api/api-step-1a-connection-check/); if we want to interact with the various part of the server you need to get an instance of **appropriate client class**. In sample code, once connection is estabilished, **ConnectionManager class** is used to obtain an instance of WorkItemTrackingHttpClient class, using [**GetClient<T>()** method of VssConnection](https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2013/dn228356(v=vs.120)).

{{< highlight csharp "linenos=table,linenostart=1" >}}
_workItemTrackingHttpClient = _vssConnection.GetClient<WorkItemTrackingHttpClient>();
{{< / highlight >}}

All client classes to interact with Azure DevOps have a name that **ends in HttpClient** and this identify new clients that uses REST api. The old clients that uses SOAP api have a name that ends in **Service**, they are deprecated and will be removed, so please be sure to always use client classes that end in HttpClient.

> Once you have a WorkItemTrackingHttpClient it is time to dump every work item in the team project

In GitHub example the class that will export all work items is called **WorkItemExporter** and simply dump every Work Item into an Excel file. In this first example excel is the destination of choice, in future **I'll show a better technique to export data dumping items in MongoDb / ElasticSearch**.

Let's start with a WIQL query, a special syntax that resembles SQL but is made to query Work Item in Azure DevOps

{{< highlight csharp "linenos=table,linenostart=1" >}}
var initialId = 0;
var query = $@"Select
    [Id]
from 
    WorkItems 
where 
    [System.TeamProject] = '{teamProject}' and Id > {initialId}
order by
    Id ASC
";

int lastId = 0;
var wiql = new Wiql() { Query = query };
//execute the query to get the list of work items in teh results
WorkItemQueryResult workItemQueryResult = await _connection.WorkItemTrackingHttpClient.QueryByWiqlAsync(wiql, top: 1000);
{{< / highlight >}}

As you can see, the code is really simple, just create an **instance of Wiql class with the query and then use QueryByWiqlAsync method of the client** to have a batch of Work Items. Actually I've selected only Id field, and **used top parameter to limit the number of items returned**. Remember that you cannot grab more than a certain number of Work Items in a single query, even if you get only very few fields. Condition of the query is really simple, belonging to a specific team project and **Id greater than InitialId value initialized to 0** to paginate the results.

The goal is continue executing query until you terminate all Work Items, and for each block **requesting all the details and relations of Work Items to dump everything**.

{{< highlight csharp "linenos=table,linenostart=1" >}}
if (workItemQueryResult.WorkItems.Any())
{
    Log.Information("Loaded a block of {count} WorkItems starting from {start}", workItemQueryResult.WorkItems.Count(), initialId);
    //need to get the list of our work item id's paginated and get work item in blocks
    var count = workItemQueryResult.WorkItems.Count();
    var current = 0;
    var pageSize = 200;

    while (current < count)
    {
        List<WorkItem> workItems = await RetrievePageOfWorkItem(_connection, workItemQueryResult, current, pageSize);

        row = DumpPageOfWorkItems(ws, row, workItems, workItemInformations);

        current += pageSize;
        lastId = workItems[workItems.Count - 1].Id.Value;
    }
}
{{< / highlight >}}

As you can see in the above snippet, I **iterate until the result has at least one work item**, then I start doing batch of 200 ids calling another function **RetrievePageOfWorkItem** that will perform another request to grab all the details of a batch of Work Items. Then the Batch is dumped in an Excel file (in this first version), finally **the routine will update lastId value to perform a query for the next page**.

RetrievePageOfWorkItem is a really simple function that uses **GetWorkItemsAsync passing a batch of Work Items Ids to retrieve details** and returns data to the caller. 

> To dump all work items you need to use multiple step, first one retrieve pages of id, then another step needs to use id to get details

{{< highlight csharp "linenos=table,linenostart=1" >}}
private async Task<List<WorkItem>> RetrievePageOfWorkItem(ConnectionManager conn, WorkItemQueryResult workItemQueryResult, int current, int pageSize)
{
    List<int> list = workItemQueryResult
        .WorkItems
        .Select(wi => wi.Id)
        .Skip(current)
        .Take(pageSize)
        .ToList();

    var workItems = await conn.WorkItemTrackingHttpClient.GetWorkItemsAsync(
        list,
        expand: WorkItemExpand.Relations);
    Log.Information("Work item DETAILS result: record from {from} to {to} retrieved", current, current + pageSize);
    return workItems;
}
{{< / highlight >}} 

Once the caller has the **batch of Work Items it can dump them on an excel file or any other persistent medium**. 

{{< highlight csharp "linenos=table,linenostart=1" >}}
private int DumpPageOfWorkItems(ExcelWorksheet ws, int row, List<WorkItem> workItems, List<WorkItemInformations> workItemInformations)
{
    foreach (WorkItem workItem in workItems)
    {
        Log.Debug("Loaded work item {id}.", workItem.Id);

        var info = new WorkItemInformations()
        {
            WorkItem = workItem,
        };
        workItemInformations.Add(info);

        ws.Cells[$"A{row}"].Value = workItem.Id;
        ws.Cells[$"B{row}"].Value = workItem.Fields["System.WorkItemType"];
        ws.Cells[$"C{row}"].Value = workItem.Fields["System.State"];
        ws.Cells[$"D{row}"].Value = ((DateTime)workItem.Fields["System.CreatedDate"]);
        ws.Cells[$"E{row}"].Value = workItem.Fields.GetFieldValue<IdentityRef>("System.CreatedBy")?.DisplayName ?? "";
        ws.Cells[$"F{row}"].Value = workItem.Fields.GetFieldValue<IdentityRef>("System.AssignedTo")?.DisplayName ?? "";

        if (workItem.Relations != null)
        {
            ws.Cells[$"G{row}"].Value = info.NumOfRelations = workItem.Relations.Count(r => WorkItemHelper.IsLinkToWorkItem(r.Url));
            ws.Cells[$"H{row}"].Value = info.NumOfCodeRelations = workItem.Relations.Count(r => WorkItemHelper.IsLinkToCode(r.Url));
            ws.Cells[$"I{row}"].Value = info.NumOfPullRequests = workItem.Relations.Count(r => WorkItemHelper.IsLinkToPullRequest(r.Url));
        }
        else
        {
            ws.Cells[$"G{row}"].Value = 0;
            ws.Cells[$"H{row}"].Value = 0;
            ws.Cells[$"I{row}"].Value = 0;
        }
        row++;
    }

    return row;
}
{{< / highlight >}} 

Actually I'm dumping **some fields as well as the number of relations to other Work Items, to code and to Pull Requests**. This will helps me to made some analysis on the data in excel without the need to further manipulate data in Excel. The result is a nice Excel worksheet with all the data you need. 

> Excel is a format understood by everyone and that can be use to further manipulate data for analysis

Using Excel is a nice solution because it can be **used also by non programmer people to made analysis**, so you can generate some nice pivot table that gives you an idea on how your server is used. If you launch the program, after you logged into your server you will start looking at the logs.

![Logs of software dumping all Work Items](../images/polling-work-items.png)

***Figure 1***: *Logs of software dumping all Work Item*

When Work Item are finished the tool starts dumping other data for Team Project, at the end you will have all Work Items **in the first tabs, with only few fields, but you can start doing some analysis, like the following one**. We have distribution in time of various Work Item Type creation

![Distribution in time of Work Item Types](../images/work-item-type-distribution-in-time.png)

***Figure 2***: *Distribution in time of Work Item Types*

Code of the example is in [GitHub](https://github.com/alkampfergit/AzureDevopsExportQuickAndDirty).

> Tables like this can give you an insight of how your server is used.

As an example, in the above picture, we can see **that in 2018 the team created lots of task, then the number of task decreased**. This is an indication that maybe the team does not need to decompose work in small tasks for simple stories, but only for complex ones. From 2019 the team **started to create Technical Debt Work Item Type**. This is an indication that the team is aware of the technical debt and is trying to reduce it.

> having all Work Items data in a single source makes easy perform analysis to understand how the team is performing.

You can easily create other pivot tables showing **distribution of Work Item for state, or from author, to verify who in the team opens what**. In the end with very few lines of C# code you are able to dump all Work Item Information in something more manageable like an Excel file that can be used to perform quick analysis of the data.

Other posts in this series:
- Step 1: [Connecting to the server](https://www.codewrecks.com/post/azdo/api/api-step-1-connection/)
  - Step 1a: [Detect if credentials are ok](https://www.codewrecks.com/post/azdo/api/api-step-1a-connection-check/)
- Step 2: Work Items
  -  [Dump all Work Items of a Team Project](https://www.codewrecks.com/post/azdo/api/api-step-2-work-item-dump/)


Gian Maria.