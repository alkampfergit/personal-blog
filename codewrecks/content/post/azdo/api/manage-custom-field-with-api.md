---
title: "Azure Devops Api - Update list of allowed values for Custom Fields"
description: "How you can use Azure DevOps REST API to update the list of allowed values for a custom field. A typical scenario is keeping the list of available values in sync with a database."
date: 2024-02-22T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

The ability to **customize process of Azure DevOps** is one of the most powerful feature of the platform. Usually you **add custom fields to work items** to allow tracking information related to your own process and for your organization. One of the most common question I got usually is: 

> How can I create a field that allows for a series of values that is taken from a database of mine?

One typical scenario is a field that is called **ProductCode** that should contain a list of all active product in the company. 

The  problem is that Azure Devops (Even on premise version) cannot dinamically contact a server to get a list of available items, **and a possible solution is to create a custom UI field that implements this logic**. You have also another option, you can **create a simple picking list field and then programmatically use the API to update the list of available values** when available values changed.

Suppose you created a custom field called **MyCustomField** and you want to update the list of available values programmatically. The first step is to connect to the server, and this is the first step of the process.

![Simple field with a picking list](../images/custom-field.png)

***Figure 1***: *Simple field with a picking list*

Now using api to update this field is straightforward, you need to start from [official documentation page](https://learn.microsoft.com/en-us/rest/api/azure/devops/processes/fields/get?view=azure-devops-rest-7.1&tabs=HTTP) and start trying to **perform a sequence of REST calls** to understand how to interact with the server.

A simple tool that simplify this phase is [Postman](https://www.postman.com/), it has a lot of nice functionalities to allow **to rapidly prototyping a series of REST calls**, organize them in a collection and save into your account for future documentation.

## Authentication

To authenticate to the service the simplest thing to do is create a Personal Access Token (PAT) and use it to authenticate to the service. **To use the token you can use Basic Authentication using a null user and the token as a password**. To avoid leaking of the PAT 

![How to configure a secret in environment](environments-postman.png)

***Figure 2***: *How to configure a secret in environment*

1. Choose environments
2. Create a new environment
3. Add a new variable
4. Set the variable type as secret
5. Save PAT into the variable as secret

Now you can right click the environment and then **activate the environment** and you are ready to start using the environment to call the REST API.

## Collections

Now you can create another collection **that is a simple container for a series of REST calls**. Once you select the new collection you can set the authentication

!["Setting authentication for the entire collection](collection-authentication.png)

***Figure 3***: *Setting authentication for the entire collection*

1. Select the collection
2. Select Authorization tab
3. Select Basic Auth
4. Use the variable saved before to use the PAT in password field

## Start calling the server

Now you can start creating requests in the new collection, you **should use subfolder to organize your requests** and you can simply choose "inherit auth from parent" for each request to use the global basic authentication.

> Thanks to Postman we can quickly test a series of REST calls to understand how to interact with the server while keeping the access token secure.

If you want to update the aforementioned field changing the list of available values you need to perform this sequence of calls:

## Sequence of call to update picking list

### Get the list of process

You start with a simple GET to the url https://dev.azure.com/{organization}/_apis/work/processes?api-version=6.0-preview.2 that simply return a list of processes available in the organization. **You need to list all processes to grab the id of the process you want to change**.

### Get the list of types

This is also a simple GET to the url https://dev.azure.com/{**organization**}/_apis/work/processes/{**processid**}/workitemtypes?api-version=7.1-preview.2. As you can see you should use the **process id you got from the previous call** to get the list of work item types for the process. Then you will find the name of work item type that contains the field you want to change.

### Get the list of fields for type

Another get to url https://dev.azure.com/{**organization**}/_apis/work/processes/{**processid**}/workItemTypes/{**Work Item type reference name**}/fields?api-version=6.0-preview.2. An example of this call is https://dev.azure.com/gianmariaricci/_apis/work/processes/ecd31c18-9044-4340-aaf5-47a59c84f689/workItemTypes/BasicTEst.Issue/fields?api-version=6.0-preview.2 now you can finally find the referenceName of the field you want to change.

> The three calls above are not really necessary if you already know the process id and all reference names, but it is a good way to understand how to interact with the server.

### Get details for the field

This is another simple GET to the url https://dev.azure.com/{**organization**}/_apis/work/processes/{**processid**}/workItemTypes/BasicTEst.Issue/fields/Custom.productline?api-version=7.1-preview.2&$expand=all that returns the details of the field you want to change. A possible return is

{{< highlight json "linenos=table,linenostart=1" >}}
{
  "referenceName": "Custom.productline",
  "name": "productline",
  "type": "string",
  "description": "",
  "url": "https://dev.azure.com/gianmariaricci/_apis/work/processes/ecd31c18-9044-4340-aaf5-47a59c84f689/behaviors",
  "customization": "custom",
  "allowedValues": [
    "lineA"
  ],
  "isLocked": false
}
{{< / highlight >}}

Now you can verify that it has allowedValues property that contains the list of available values for the field. This is the list i want to change. Now I spend some time trying **to change the allowedValues field without any success**, and thanks to my friend **[Alessandro Alpi](https://www.linkedin.com/in/suxstellino/)** I discovered that the documentation is wrong.

The [Official Documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/processes/fields/update?view=azure-devops-rest-7.1&tabs=HTTP) states that you can use the field allowedValues inside the payload to the PATCH API, but the net result is that **I was able to change defaultValue, required, but not the allowedValues**. The problem is that you do not get an error, the field is simply unchanged.

> Official documentation is wrong, you cannot change allowedValues using the PATCH API directly on the field details.

The key to **understand how you really need to change the allowedValues is to notice that the previous URI has a parameter called $expand=all**. This parameter is used to get the details of the field, and retrieve also data from other entities that are related to the field. If you remove the $expand parameter from the URI, allowed values **is not contained in the answer**. Thanks to Alessandro I was pointed in the right direction, the list of allowed values is stored in an object called PickingList.

### Get the list of picking lists

This is a simple GET to the url https://dev.azure.com/{**organization**}/_apis/work/processes/lists?api-version=7.1-preview.1 that return the list of all picking lists in the organization. **You can then get details for each picking list to identify the one you want to change** using the url property of each element of the list.

### Update picking list

Finally you are able to do the call to modify the list of allowed values of a field, this is a PUT on the url https://dev.azure.com/{**organization**}/_apis/work/processes/lists/{**picking-list-id**}?api-version=7.1-preview.1 with a simple json POST DATA

{{< highlight json "linenos=table,linenostart=1" >}}
{
  "items": [
    "LineA",
    "LineB",
    "LineC"
  ]
}
{{< / highlight >}}

This will update the list of allowed fields for the field you want to change. The **annoying part is that the only way that I find to identify the picking list is looking to the allowed values to identify the one you want to change**. Once you got this information you can update the list of value with a simple call.

Gian Maria.