---
title: "Clone a simple dashboard with API in Azure DevOps"
description: "Dashboard are an incredible way to visualize data in Azure DevOps, being able to manipulate them with API is a great way to automatically create Dashboards for each sprint"
date: 2022-02-11T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

If you work in Scrum, being able to visualize data on current and past Sprints is an invaluable way to keep track on team improvement. **Azure DevOps allows you to create Dashboards to visualize interesting metrics**, but actually you do not have a way to create Dynamic Dashboards, I.E. a Dashboard that allows you to specify a parametric query so you can, for example, change the iteration and view how the data changes.

Luckily enough, all Azure DevOps functionalities are exposed via API, so you can **write small programs to automate mundane tasks** and obtain what you need.

> I know that some functionalities should be present out of the Box, but being able to automate with API is the last level of flexibility.

Full example is on [GitHub](https://github.com/alkampfergit/AzureDevOpsPlayground/tree/develop/Dashboard/AzdoDashboard)

## How you create the project.

I've started with a simple C# project with latest .NET6 framework, then I've referenced some NuGet packages **to import Azure DevOps Object model**. It is true that all API are now REST API, but having a nice object model tremendously simplify stuff, you can just follow intellisense and you are ready to go.

These are the packages needed to run the project:

{{< highlight xml "linenos=table,linenostart=1" >}}
<PackageReference Include="Microsoft.TeamFoundationServer.Client" Version="16.170.0" />
<PackageReference Include="Microsoft.TeamFoundationServer.ExtendedClient" Version="16.170.0" />
<PackageReference Include="Microsoft.VisualStudio.Services.Client" Version="16.170.0" />
<PackageReference Include="Microsoft.VisualStudio.Services.InteractiveClient" Version="16.170.0" />
{{< / highlight >}}

## Connect to the server

You can use different ways to authenticate to the server, the easiest one is using Personal Access Token, a strategy that is **used not only if you work interactively, but especially when your tool needs to run unattended**.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var credential = new VssBasicCredential("", "your-token-here");
VssConnection connection = new VssConnection(new Uri(collectionUri), credential);
{{< / highlight >}}

Usually I read the PAT from a file (stored in an encrypted disk) to avoid the risk of **committing it to a repository**, also you can specify as command line argument. **NEVER write a token in a source file, you can risk to compromise that token pushing to a repository**.

> Please do not store a real PAT in your source code because you risk to commit it to a public repository.

## Interact with Work Items

When you create the VssConnection object, you can starts retrieving specific services to interact with the part of AzDo you need to manipulate.

{{< highlight csharp "linenos=table,linenostart=1" >}}
WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();
{{< / highlight >}}

The trick is simple **just ask to the connection object to get a specific client, in the above example **I've asked for the client to interact with the Work Item Tracking part of the product**. 

If you look in the internet for examples, you can find C# code that uses the old classes, something like this:

{{< highlight csharp "linenos=table,linenostart=1" >}}
_workItemStore = new WorkItemStore(_tfsCollection, WorkItemStoreFlags.BypassRules);
{{< / highlight >}}

The above snippet uses WorkItemStore class, that uses the old SOAP based web services. You should **avoid using the old object model, unless you want to target really old Team Foundation Server versions (on premise)**, and always use the new REST API. To help you identify if a code uses old or new model, look at classes names, the new classes always contains the Http word in it, and usually ends with HttpClient (like WorkItemTrackingHttpClient).

Also Visual Studio starts warning the usage of old class as deprecated. More details [here at https://aka.ms/witclientom](https://aka.ms/witclientom). Deprecation is a really recent thing, so be cautious because that objects could not work in the future (SOAP services will be removed in a future... probably).

To copy a dashboard, I simply need to copy all queries used by that dashboard, a really simple operation thanks to the Object Model wrapper.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = await witClient.GetQueryAsync(projectName, "Shared Queries/Test/TestQuery", expand: QueryExpand.All, depth: 2);

// this is the new query copied
var newQuery = new QueryHierarchyItem()
{
    Name = "copied",
    Wiql = query.Wiql.Replace("Proximo\\Sprint 1", "Proximo\\Sprint 2"),
    IsFolder = false,
};

var newQuerySaved = await witClient.CreateQueryAsync(newQuery, projectName, "Shared Queries/Test");
{{< / highlight >}}

The code is really simple, I can get the query knowing its PATH ("Shared Queries/Test/TestQuery") and clearly the team project name, then **it is important to use the expand: QueryExpand.All parameter to retrieve all fields of the query** and the depth is usually used to grab multiple queries and to specify how deep the query can be in the query tree**.

Once you have the query, the real query is a [SQL-Like query](https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops) contained in the Wiql property, you can **replace the name of the iteration with the name of the new iteration and you are ready to go.** 

> You can also install a nice addin to being able to work directly with [WIQL in your account](https://marketplace.visualstudio.com/items?itemName=ottostreifel.wiql-editor&targetId=0ab47163-c335-4202-af04-4f37a747eecb&utm_source=vstsproduct&utm_medium=ExtHubManageList)

Once you have created the new query, just call the CreateQueryAsync, specify where you want to be saved, and you have cloned the query, three lines of code.

## Interact with dashboard

This is a pretty new part for me, but thanks to the Object Model it is really simple to create code **to grab a dashboard and create another one with the same widgets that points to the new query**. In the first part I find the Dashboard I need.

{{< highlight csharp "linenos=table,linenostart=1" >}}
// this is the new query copied
var dashClient = connection.GetClient<DashboardHttpClient>();
var dashboards = await dashClient.GetDashboardsByProjectAsync(new TeamContext(projectName));

// then find the dashboard with a specific name.
var dashTest = dashboards.Single(d => d.Name == "DashTests");
TeamContext teamContext = new TeamContext(projectName, "Proximo Team");
var dashboard = await dashClient.GetDashboardAsync(
    teamContext,
    dashTest.Id.Value);
{{< / highlight >}}

The code is not optimal, I had some problem looking for dashboard with the name, so **I've simply grab a reference to all the Dashboards then filter in memory the one I need**. Once I know the ID (Not the name) of the Dashboard I need I used **GetDashboardAsync to grab all the details of the dashboard**.

{{< highlight csharp "linenos=table,linenostart=1" >}}
// now iterate in all widgets, replace old query id with the new query id.
foreach (var widget in dashboard.Widgets)
{
    widget.Settings = widget.Settings.Replace(query.Id.ToString(), newQuerySaved.Id.ToString());
    widget.Name += " copied";
}

// create the dashboard with the new widget.
var newDashboard = new Dashboard(dashboard.Widgets);
newDashboard.Name = "Copied dashboard";
newDashboard.OwnerId = dashboard.OwnerId;
await dashClient.CreateDashboardAsync(newDashboard, teamContext);
{{< / highlight >}}

The code is really simple, I directly **modify the In Memory representation of the Widget of the original Dashboard, replacing the old query id with the new query id**. Once you have a new list of Widgets with query replaced, you can recreate a new Dashboard with the new Widgets. The whole code is really simple, I've tested only on a simple dashboard with a simple widget, but it can be expanded to programmatically clone a dashboard **and change all the queries, maybe to create a new dasboard for each sprint**-

![Dashboard cloned for the new Sprint](../images/cloned-dashboard.png)

***Figure 1***: *Dashboard cloned for the new Sprint*

The whole project can be [found on GitHub](https://github.com/alkampfergit/AzureDevOpsPlayground)

Gian Maria.