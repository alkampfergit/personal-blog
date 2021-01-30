---
title: "Azure DevOps API Retrieve Work Items Information"
description: ""
date: 2018-12-28T11:00:37+02:00
draft: false
tags: [API]
categories: [Azure DevOps]
---
Post in the series:  
1) API [Connection](http://www.codewrecks.com/blog/index.php/2018/12/28/azure-devops-api-connection/)

Now that we know how to connect to Azure DevOps services, it is time to  **understand how to retrieve information about Work Items** to accomplish the requested task: export Work Items data inside a Word Document.

Once you connected to Azure DevOps account you start retrieving helper classes to work with the different functions of the service,  **if you need to interact with Work Items  you need a reference to the WorkItemStore class**. Since this is the most common service I need to interact I simply get a reference in the connection class

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-8.png)

 ***Figure 1***: *Retrieving reference to the WorkItemStore helper class*

At this point usually people goes to find a way to execute stored queries present in the service, but this is quite often the wrong way to got if you are working on a tool that needs to export information from Work Item, **the right way to go is build your own query in code**.

> Creating a query in WIQL is the best way to programmatically query WorkItemStore to find what you need

 **Thanks to Microsoft, you have a full SQL Like query engine that supports a custom syntax called** [**WIQL (Work Item Query Language)**](https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=vsts) **that you can use to find what you want**. In my example I’m interested in exporting data belonging to a specific area path and iteration path (usually data of a sprint), and here is the code to retrieve what I need.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public List LoadAllWorkItemForAreaAndIteration(string areaPath, string iterationPath)
{
    StringBuilder query = new StringBuilder();
    query.AppendLine($"SELECT * FROM WorkItems Where [System.AreaPath] UNDER '{areaPath}' AND [System.IterationPath] UNDER '{iterationPath}'");
    if (!String.IsNullOrEmpty(_teamProjectName))
    {
        query.AppendLine($"AND [System.TeamProject] = '{_teamProjectName}'");
    }

    return _connection.WorkItemStore.Query(query.ToString())
       .OfType()
       .ToList();
}

{{< / highlight >}}

As you can verify this is really a SQL LIKE query, but it is expressed with some concepts of Work Items, such as UNDER operator that allows me to query for Work Items whose AreaPath is under a certain path. As you can see, specifying the team project is completely optional, and it is present only for completeness, because if you specify area path and iteration you are actually filtering for Work Item of a specific team project.  **Once the query text is ready, just call the Query method of the WorkItemStore and do some LINQ manipulation to cast everything to WorkItem Class** (helper class included in the Nuget Packages).

> Querying Work Items is just: creating text query and call a method of the WorkItemStore

Another great advantage in using Nuget Packages is having intellisense that helps you working with results, here is a sample code used to dump all Work Items returned from the query.

{{< highlight csharp "linenos=table,linenostart=1" >}}


WorkItemManger workItemManger = new WorkItemManger(connection);
workItemManger.SetTeamProject("zoalord insurance");
var workItems = workItemManger.LoadAllWorkItemForAreaAndIteration(
    "zoalord insurance", 
    "zoalord insurance\\Release 1\\Sprint 6");
foreach (var workItem in workItems)
{
    Log.Debug("[{Id}/{Type}]: {Title}", workItem.Id, workItem.Type.Name, workItem.Title);
}

{{< / highlight >}}

Nothing could be simpler, thanks to intellisense **I can simply dump id name and type of the work items in few lines of code** , here is a sample output of the code.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-9.png)

 ***Figure 2***: *Dump output of Work Items returned from the query.*

As you can see, with very few lines of code I was able to connect to my Azure DevOps account, query for Work Items belonging to a specific iteration then dump information to console.

Next step will be creating a skeleton Word document with data instead of dumping data to console.

Gian Maria.
