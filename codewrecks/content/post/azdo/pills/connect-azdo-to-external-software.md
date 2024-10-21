---
title: "Pills: Connect Azdo to external software"
description: "Often customers keeps information in other systems and not only Azure DevOps, lets see a typical example on how to maximize productivity."
date: 2024-10-21T06:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

In our team, everything regarding developing is kept in Azure DevOps, but other informations are stored inside a custom software, so we **often have the need to jump between a system and the other one**. The actual connection is, one element in our software is bound to one or more Work Items in Azure DevOps.

> Desired result is: Ability to easily create a connection between the two, reduce the need to jump between the two system to see key information.

The easiest way is to extend the process of Azure DevOps to include a new field, the id of the related element in the external system. **This allows AzdoUsers to add a simple id that tells which is the connected element in the custom system**. This allows us to connect more than one Work Item to one of our object in our system.

The complete guidance is available in **[Microsoft learn article](https://learn.microsoft.com/en-us/azure/devops/organizations/settings/work/add-custom-field?view=azure-devops)** where you can simply learn on how to add a custom field inside Azure DevOps.

Now the question arise, how can we reduce the need to navigate between the two system? The obvious solution is to **understand the possibility to configure both sofware extending their basic functionalities**.

In our software we use Elsa Workflow to let the user customize our software, one possibility **is to create a Elsa Workflow that is finally able to return HTML through liquid template engine.** Thanks to the REST api of Azure DevOps, creating a link that extract some key information from AzDo is a pleasure.

![Elsa workflow start](../images/elsa-1-sample.png)

***Figure 1***: *Elsa workflow start*

As you can see actually in Elsa I've created a startup activity that answer to a specific url, and then I can use **basic SendHTTPRequest from elsa to call REST Api**. Since AzDo exposes [nice REST api](https://learn.microsoft.com/en-gb/rest/api/azure/devops/?view=azure-devops-rest-7.2) to **perform Work Item Query with [WIQL syntax](https://learn.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops), there is no problem in retrieving data**.

![Elsa SendHttpRequest to send a simple search query in WIQL](../images/elsa-2-sample.png)

***Figure 2***: *Elsa SendHttpRequest to send a simple search query in WIQL*

This allows me to quickly prototype a page that is able to grab **data from AzDo and show a nice HTML page in our software**. Then Elsa allows for nice control flow instructions, if you look at the above Figure 3 you can find that

1. foreach work item retrieved from the first query we iterate
1. If the work item has pull requests
1. Foreach pull request link to get detail of the pull request

![Elsa contains nice control flow instructions like if/foreach that simplify getting data](../images/elsa-3-sample.png)

***Figure 3***: *Elsa contains nice control flow instructions like if/foreach that simplify getting data*

This allows me to create a not so complex workflow where **I retrieve all work items and all information of related pull request**. The purpose is, from our software, a manger should be able to look at a document and immediately find all Work Items connected to that document with all **base information plus information about pull requests**. This because when the pull request is close, the change will be deployed periodically in our internal service (we use our software to plan feature of our software). Thanks to this dogfooding, when a Pull Request is closed, we can affirm that the feature is closed, test were done, everything is green.

In our software, once you created a liquid page in Elsa Workflow, you can add tabs to object that links to these Workflow.

![And finally we can show the result of the template in a dedicated tab of our software](../images/elsa-4-sample.png)

***Figure 4***: *And finally we can show the result of the template in a dedicated tab of our software*

As you can see, in our software we created a specialized tab called DevOps that shows all connected Work Items and also all the information about related Pull Requests.

This is a typical scenario, when you need to connect an external software to Azure Devops using custom fields and REST API, gives you **tremendous flexibility, in really less than half a day you can create a connection that is really powerful**. In this scenario we didn't develop any extension nor special customization. The process was really simple.

1. Add a field to Azure DevOps to specify our internal id in every Work Item 
1. Created code that uses REST api to retrieve all data of Work Items connected to one of our internal item
1. Then use this information (json) to create html using a template language
1. Show that page in your software.

Latest two steps are easy in our software thanks to Elsa Workflow and the ability to include display of workflow in custom tabs. In the end we have satisfied the user, that can see important and key information of AzDo WorkItem in a single and compact interface that aggregates all the data he/she need without any other distracting information. 

Here is the detailed api used to perform this process.

> Execute a WIQL query 

Reference url is https://dev.azure.com/org/teamproject/_apis/wit/wiql?api-version=6.0 you can simply post a WIQL query and it will return a list of all the Work Item Id that satisfy the query. You need to perform another query to obtain the detail.

> Get Work Item Detail from Id list

Call the api https://dev.azure.com/org/teamproject/_apis/wit/workitemsbatch?api-version=7.1 specifying the [list of the Work Item ids](https://learn.microsoft.com/en-gb/rest/api/azure/devops/wit/work-items/get-work-items-batch?view=azure-devops-rest-7.2&tabs=HTTP) you need to retrieve. Pay attention to the $expand parameters that allows you to ask to retrieve not only the base field **but also relations and other informations**. If you are not worried about bandwidth you can specify ALL so you can retrieve everything.

I found useful to ask for all fields and expand everything, then check all the information you need and finally **if you need you can use fields parameter to limit fields returned and save bandwidth, but usually is not a huge problem.

> Find pull requests in Work Item Detail

Elsa has nice integration with Jint, so you can execute custom javascript on your data, this allows me to examine **all the relations to find that one that points to a Pull Request and find base information.

{{< highlight javascript "linenos=table,linenostart=1" >}}
   if (workItem.relations != null) {
        workItem.relations.forEach(relation => {
            if (relation.attributes.name === "Pull Request") {
                const url = relation.url;

                let pullRequestIdSegment = url.split(/PullRequestId\/|%2F/).slice(1); // Skip the first element which is before 'PullRequestId'
                let repositoryId = pullRequestIdSegment[pullRequestIdSegment.length - 2];
                let pullRequestId = pullRequestIdSegment[pullRequestIdSegment.length - 1];
{{< / highlight >}}

Gian Maria.