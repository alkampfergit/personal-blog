---
title: "Retrieve Attachment in Azure DevOps with REST API"
description: ""
date: 2019-07-25T20:00:37+02:00
draft: false
tags: [API]
categories: [Azure DevOps]
---
In a previous post I’ve dealt on [how to retrieve image in Work Items](http://www.codewrecks.com/blog/index.php/2019/07/10/retrieve-image-in-work-item-description-with-tfs-api/) description or Comments with a simple WebClient request, using network credentials taken from  [TfsTeamProjectCollection](https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2013/ff732550%28v%3Dvs.120%29) class.

[The](http://www.codewrecks.com/blog/index.php/2019/07/10/retrieve-image-in-work-item-description-with-tfs-api/ "http://www.codewrecks.com/blog/index.php/2019/07/10/retrieve-image-in-work-item-description-with-tfs-api/") solution presented in that article is not complete, because it does not works against Azure Devops, but only against a on-premise TFS or Azure DevOps Server **. If you connect to Azure DevOps you will find that the Credentials of the TfsTeamProjectCollection class are null** , thus you cannot download the attachment because the web request is not authenticated.

To be completely honest, TfsTeamProjectCollection class is quite obsolete, it uses old webservices, but it is really useful if you have lots of code accumulated on the years that uses it and it works perfectly with newest version of the service.

> Azure DevOps has a different authentication scheme from on-premise version, thus you have no Network Credentials to do a simple web request for attachment if you use old TfsTeamProjectCollection class.

The key to the solution of the problem is using the new HTTP REST API and the good news is that you can use old C# API based on SOAP server and new REST API in the same project without a problem. Here is the correct code for the connection

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-21.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-21.png)

 ***Figure 1***: *Connecting to the server.*

Code in  **Figure 1** is valid for on-premise server or for Azure Dev Ops server and if you are running the code from a program with a UI (like a WPF application) it will show the Azure DevOps login page to perform the login with azure Authentication.  **This is the coolest part of the API, few lines of code and you can connect to the service without worrying of authentication method**  **Once the application is connected, the VssConnection class can be used to grab references to a series of clients dedicated to access various sections of the service**. After connection I immediately retrieve a reference to the WorkItemTrakingHttpClient class. Remember that all services/client that contains the Http string in the name are based on the new REST api.

{{< highlight csharp "linenos=table,linenostart=1" >}}


_workItemTrackingHttpClient = _vssConnection.GetClient< WorkItemTrackingHttpClient >();

{{< / highlight >}}

Thanks to this client, we can perform various query to the WorkItemStore and we can use this object to download any attachment. The only thing I need to do is to use a regex to parse attachment uri to grab two information, fileName and fileId (A guid).

> The great benefit of using a client, instead of raw WebClient call, is that you does not need to worry about auth, everything is handled by the library.

A typical attachment url has this format [*https://dev.azure.com/accountName/3a600197-fa66-4389-aebd-620186063db0/\_apis/wit/attachments/a92c440e-374e-4349-a26c-b9ba553e1264?fileName=image.png*](https://dev.azure.com/accountName/3a600197-fa66-4389-aebd-620186063db0/_apis/wit/attachments/a92c440e-374e-4349-a26c-b9ba553e1264?fileName=image.png "https://dev.azure.com/gianmariaricci/3a600197-fa66-4389-aebd-620186063db0/_apis/wit/attachments/a92c440e-374e-4349-a26c-b9ba553e1264?fileName=image.png")  and we need to extract file name (image.png) and file id (a92c440e-374e-4349-a26c-b9ba553e1264) the portion of url after attachments part. One possible regex is ***\_apis/wit/attachments/(?&lt;fileId&gt;.\*)\?fileName=(?&lt;fileName&gt;.\*)* **and it allows me to extract fileId and fileName from the url of the attachment. Once you have fileId and fileName parameters you have a dedicated call to download the attachment.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (var fs = new FileStream(downloadedAttachment, FileMode.Create))
{
    var downloadStream = ConnectionManager.Instance
       .WorkItemTrackingHttpClient
       .GetAttachmentContentAsync(new Guid(fileId), fileName, download: true).Result;
    using (downloadStream)
    {
        downloadStream.CopyTo(fs);
    }
}

{{< / highlight >}}

The variable downloadedAttachment is a temp file name where I want to download the attachment,** I simply open a writer stream with FileMode.Create, then call the *[GetAttachmentContentAsync](https://docs.microsoft.com/en-us/dotnet/api/microsoft.teamfoundation.workitemtracking.webapi.workitemtrackinghttpclientbase.getattachmentcontentasync?view=azure-devops-dotnet)* method of the WorkItemTrackingHttpClient that returns a Task&lt;Stream&gt; and finally I copy attachment stream to destination stream**(temporary file name) to physically download the file.

When you interact with Azure DevOps with API, you always should try to use the official client instead of using raw WebClient class, this will save you time and headache.

Gian Maria.
