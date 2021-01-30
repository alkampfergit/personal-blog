---
title: "Use the right Azure Service Endpoint in build vNext"
description: ""
date: 2015-12-29T08:00:37+02:00
draft: false
tags: [Azure,build,VSTS]
categories: [Azure]
---
Build vNext has a  **task dedicated to uploading files in azure blob** , as you can see from  ***Figure 1***: [![Sample build vNext that has an Azure File Copy task configured.](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image_thumb2.png)](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image2.png)

 ***Figure 1***: *Azure File Copy task configured in a vNext build*

The nice parte is the Azure Subscription setting, that allows to choose one of the Azure endpoint configured for the project. Using service endpoint, you can ask to the person that has password/keys for Azure Account to configure an endpoint. Once it is configured  **it can be used by team members with sufficient right to access it, without requiring them to know password or token or whatever else**.

> Thanks to Services Endpoints you can allow member of the team to create builds that can interact with Azure Accounts without giving them any password or token

If you look around you find a nice blog post that explain how to [connect your VSTS account using a service principal](http://blogs.msdn.com/b/visualstudioalm/archive/2015/10/04/automating-azure-resource-group-deployment-using-a-service-principal-in-visual-studio-online-build-release-management.aspx).

[![SAmple of configuration of an Endpoint for Azure with Service Principal](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image_thumb3.png "configure a service principal endpoint")](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image3.png)

 ***Figure 2***: *Configure a service endpoint for Azure with Service Principal Authentication*

Another really interesting aspect of Service Endpoints, is the ability to choose people that can administer the account and people that can use the endpoint, thus giving you full security on who can do what.

[![Each Service endpoint has its security setting to specify people that can administer or read the endpoint](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image_thumb4.png "You can manage security for each Service Endpoint configured")](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image4.png)

 ***Figure 3***: *You can manage security for each Service Endpoint configured*

Finally, using Service Endpoint you have a **centralized way to manage accessing your Azure Subscription Resources** , if for some reason a subscription should be removed and not used anymore, you can simply remove the endpoint. This is a better approach than having data and password or token scattered all over the VSTS account (builds, etc).

I’ve followed all the steps in the article to [connect your VSTS account using a service principal](http://blogs.msdn.com/b/visualstudioalm/archive/2015/10/04/automating-azure-resource-group-deployment-using-a-service-principal-in-visual-studio-online-build-release-management.aspx), but when it is time to execute the Azure File Copy action, I got a strange error.

{{< highlight bash "linenos=table,linenostart=1" >}}


Executing the powershell script: C:\LR\MMS\Services\Mms\TaskAgentProvisioner\Tools\agents\default\tasks\AzureFileCopy\1.0.25\AzureFileCopy.ps1
Looking for Azure PowerShell module at C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1
AzurePSCmdletsVersion= 0.9.8.1
Get-ServiceEndpoint -Name 75a5dd41-27eb-493a-a4fb-xxxxxxxxxxxx -Context Microsoft.TeamFoundation.DistributedTask.Agent.Worker.Common.TaskContext
tenantId= ****** **azureSubscriptionId= xxxxxxxx-xxxxxxx-xxxx-xxxx-xxxxxxxxxx
azureSubscriptionName= MSDN Principal
Add-AzureAccount -ServicePrincipal -Tenant $tenantId -Credential $psCredential
There is no subscription associated with account** **** **.
Select-AzureSubscription -SubscriptionId xxxxxxxx-xxxxxxx-xxxx-xxxx-xxxxxxxxxx
The subscription id xxxxxxxx-xxxxxxx-xxxx-xxxx-xxxxxxxxxx doesn't exist.
Parameter name: id
The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.
The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.
Storage account: portalvhdsxxxxxxxxxxxxxxxxx1 not found. Please specify existing storage account

{{< / highlight >}}

This error is really strange because the first error line told me:

>** The subscription id xxxxxx-xxxxxx-xxxxxx-xxxxxxxxxxxxx doesn’t exist. **This cannot be the real error, because I’m really sure that my Azure Subscription is active and it is working everywere else. Thanks to the help of [Roopesh Nair](https://social.msdn.microsoft.com/profile/roopesh%20nair/), I was able to find my mistake. It turns out that the** Storage Account I’m trying to access is an old one created with Azure Classic Mode, and it is not accessible with Service Principal.  **A Service Endpoint using Service Principal can manage only Azure Resource Manager based entities.

Shame on me :) because I was aware of this limitation, but for some reason I completely forgot it this time.

Another sign of the problem is the error line telling me: Storage account xxxxxxxxx not found, that should ring a warning bell about the** script not being able to find that specific resource, because it is created with classic mode **.

The solution is simple, I could use a Blob Storage created with Azure Resource Manager, or I can configure another Service Endpoint, this time based on a management certificate. The second option is preferrable, because** having two Service Endpoint, one configured with Service Principal and the other configured with Certificate allows me to manage all type of Azure Resources **.

Configure an endpoint with certificate is really simple, you should only copy data from the management certificate inside the Endpoint Configuration and you are ready to go.

[![Configuration of an endpoint based on Certificate](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image_thumb5.png "Configuration of an endpoint based on Certificate")](https://www.codewrecks.com/blog/wp-content/uploads/2015/12/image5.png)** Figure 4: ***Configure an Endpoint based on Certificate*

Now my build task Azure File Copy works as expected and I can choose the right Service Endpoint based on what type of resource I should access (Classic or ARM)

Gian Maria
