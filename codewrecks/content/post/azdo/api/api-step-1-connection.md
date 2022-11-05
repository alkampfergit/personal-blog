---
title: "Azure Devops Api - Connection"
description: "Azure DevOps Api are a fantastic way to interact with the server, in this post I'll show you how to connect to the server"
date: 2022-11-05T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

Quite often people asks me how to interact programmatically with Azure DevOps server, main purpose **is retrieving data for custom reporting** but also interacting with Work Item store etc. Luckily enough, all Azure DevOps functionalities are exposed via API, so you can **write small programs to automate mundane tasks** and obtain what you need.

In this post I'll show how to setup the project in .NET and how to connect to the server. The example can be found in [GitHub](https://github.com/alkampfergit/AzureDevopsExportQuickAndDirty).

First step is connection, and you should be aware that if you **want to use the interactive UI to ask user for credentials, you need to create a Full Framework project because .NET core does not supports this scenario**. Class used to perform this type of authentication is called VssClientCredentials and remember that it **does not work in a .NET core project**.

> Lack of VssClientCredentials class forced me to create a Full Framework project

Sample program just dump information of a Team Project in Excel (or other storage) and it uses a simple class to **handle connection**. First of all you need to import a some nuget packages 

```xml
<PackageReference Include="Microsoft.TeamFoundationServer.Client" Version="16.170.0" />
<PackageReference Include="Microsoft.VisualStudio.Services.Client" Version="16.170.0" />
<PackageReference Include="Microsoft.VisualStudio.Services.InteractiveClient" Version="16.170.0" />
```

Those packages are all you need to start interacting with the server, they contain newest wrapper **classes for REST api, so you do not use the old and deprecated SOAP services**. Just for reference, TFS and first version of Azure DevOps used SOAP services, but now all the services are REST based and while SOAP services still are working they are **Deprecated and will be removed probably in the future so you should keep yourself away from them**.

> To avoid problem, verify that when you interact with the server you are using wrapper clients classes whose name ends with HttpClient

Ok, now it is time to connect to the server:

{{< highlight csharp "linenos=table,linenostart=1" >}}
private async Task<Boolean> ConnectoToAccountAsync(String accountUri, String accessToken)
{
    //login for VSTS
    VssCredentials creds;
    if (String.IsNullOrEmpty(accessToken))
    {
        creds = new VssClientCredentials();
    }
    else
    {
        creds = new VssBasicCredential(
            String.Empty,
            accessToken);
    }
    creds.Storage = new VssClientCredentialStorage();
    _vssConnection = new VssConnection(new Uri(accountUri), creds);
    try
    {
        await _vssConnection.ConnectAsync();
        return !"anonymous".Equals(_vssConnection.AuthorizedIdentity.DisplayName, StringComparison.OrdinalIgnoreCase);
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Error logging into the account");
    }
    return false;
}
{{< / highlight >}}

The above method is really simple, it requires address of the server **and an optional access token**. If an access token is not provided, the user will be prompted to enter his credentials thanks to the VssClientCredentials class (remember **it does not works in .NET core projects**).

Once you create the correct credentials just call the ConnectAsync() method, but pay attention **that if are using a bad access token, you will get an anonymous credentials** so you can think you are logged in but you are not because the token is wrong.

Once you are connected you can start interacting with the server.

Other posts in this series:
- Step 1: [Connection](https://www.codewrecks.com/post/azdo/api/api-step-1-connection/)
  
Gian Maria.