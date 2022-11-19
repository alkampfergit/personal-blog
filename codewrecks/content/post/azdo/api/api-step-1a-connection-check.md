---
title: "Azure Devops Api - Detect if credentials are ok"
description: "When you use interactive login for Azure DevOps API you need to check if the user is correctly logged"
date: 2022-11-19T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

In previous article of the series I've [played with Azure DevOps api connection](https://www.codewrecks.com/post/azdo/api/api-step-1-connection/) showing how you can use a **.NET 4.8 full framework application that can login to Azure DevOps with a token or with an interactive login**.

When you use interactive login, usually Windows operating system will **retain credentials in credentials store**, this will avoid asking for credential every time the application is run. The code that perform the check is really simple, it just check if _vssConnection.AuthorizedIdentity.DisplayName is not "anynymous". This happens because **the real credential check is done usually when you perform some real query, and not only the connection**. 

If you really need your software to verify if credentials are ok before doing everything else, you should **try calling some api**. Here is a possible code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
try
{
    await _vssConnection.ConnectAsync();

    //Can try to force login to the server.
    if (string.IsNullOrEmpty(token) && "anonymous".Equals(_vssConnection.AuthorizedIdentity.DisplayName, StringComparison.OrdinalIgnoreCase))
    {
        var client = _vssConnection.GetClient<Microsoft.TeamFoundation.Core.WebApi.ProjectHttpClient>();
        await client.GetProjects();
    }
    return !"anonymous".Equals(_vssConnection.AuthorizedIdentity.DisplayName, StringComparison.OrdinalIgnoreCase);
}
catch (Exception ex)
{
    Log.Error(ex, "Error logging into the account");
}
return false;
{{< / highlight >}}

This code is really simple, the problem is, after some time, **cached credentials will expire, so you call ConnectAsync() and user DyplayName is "anonymous"**. In this case I have no token (interactive login) and I cannot simply answer "login failed" because the connection failed due to expired cached credentials. The result is to call a simple api like GetProjects() that will **trigger another interactive login**. 

Other posts in this series:
- Step 1: [Connecting to the server](https://www.codewrecks.com/post/azdo/api/api-step-1-connection/)
  - Step 1a: [Detect if credentials are ok](https://www.codewrecks.com/post/azdo/api/api-step-1a-connection-check/)
    
Gian Maria.