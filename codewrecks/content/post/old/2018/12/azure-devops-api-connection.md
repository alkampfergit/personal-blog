---
title: "Azure Devops API Connection"
description: ""
date: 2018-12-28T10:00:37+02:00
draft: false
tags: [API]
categories: [Azure DevOps]
---
 **One of the great benefit of using Azure DevOps is the ability to interact with the service through API calls,** making it possible to extend the service with a few bunch of C#, or PowerShell or whatever language you want, because almost everything is exposed with REST API, and a simple HTTP call is enough.

Since I’m mostly a C# and.NET guy, I’ll explain how to build a C# program that interact with an Azure DevOps account, because thanks to Nuget Packages offered by Microsoft, you can interact with your account with Strongly Typed C# classes, so you can have intellisense and compile type checking to verify that everything is good.

> C# helps using Azure DevOps API because you have helper client libraries that guides the programmer with Intellisense and documentation.

 **The first example I’m going to show, is how to retrieve a bunch of Work Items to export to a Word Document** , a requirement that is really needed by everyone that uses the services. While there are commercial and non commercial tools out there, if you really need to extract Word Document with maximum customization a bunch of C# code can made your life easier.

 **Sample code accompanying this series of blog posts can be found at this address:** [**https://github.com/alkampfergit/AzureDevopsWordPlayground**](https://github.com/alkampfergit/AzureDevopsWordPlayground "https://github.com/alkampfergit/AzureDevopsWordPlayground") where I’m pushing some code to export (migrate) data from Azure DevOps to word.

First of all we need to know how to setup the project and how to connect to an account and it turns out that is really simple,  **first of all create a Full Framework.NET project and add these nuget references**.

Microsoft.TeamFoundationServer.Client  
Microsoft.TeamFoundationServer.ExtendedClient  
Microsoft.VisualStudio.Services.InteractiveClient  
Microsoft.VisualStudio.Services.Client

With these packages you have a bunch of libraries that makes your life easier, especially for connection and interacting with base functions of the services.

> Authentication can be done in several ways, but a token is the real way to go because it has several advantages over standard credentials.

When it is time to authenticate to the service, you have several options,  **but the most useful is using an** [**Access Token**](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=vsts) **because it has several benefits.** First of all it does not require interactivity, second it can be revoked whenever you want, third you can generate a token with a reduced permission set, fourth it will expire automatically after one Year.

Using a token is perfect for a tool that should run unattended and this will be my usual first choice. To make debug life simpler I allow to specify the access token in a couple of way in command line **, I can directly specify the token or I can specify the token that contains the file.** The second method is useful for debugging, because I write my token in a file, then encrypt with standard NTFS routine to allow only my user to decrypt and use it, then I can configure the debugger to launch my console application with that token file and everything is secure, I do not incur the risk of incorrectly store my token file in some commit.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-7.png)

 ***Figure 1***: *Project options, where I specify start options to specify token and other parameter to my application*

As you see in  **Figure 1** I simply specify the c:\crypted\patOri.txt in the command line to made my software authenticate to the service, startup program is usually a normal console application.

Having a console application is really useful because it can be automated in a simple Bat or powershell file, it can be easily converted to a service with TopShelf and it is my usual way to go over a full WPF or Winform or Web application that require user interactivity.

Once I have an access token, here is my Connection helper class used to connect to my service.

{{< highlight csharp "linenos=table,linenostart=1" >}}


 public class Connection
    {
        /// <summary>
        /// Perform a connection with an access token, simplest way to give permission to a program
        /// to access your account.
        /// </summary>
        /// 
        public Connection(String accountUri, String accessToken)
        {
            ConnectToTfs(accountUri, accessToken);
            _workItemStore = _tfsCollection.GetService();
        }

        private TfsTeamProjectCollection _tfsCollection;
        private WorkItemStore _workItemStore;

        public WorkItemStore WorkItemStore =&gt; _workItemStore;

        private bool ConnectToTfs(String accountUri, String accessToken)
        {
            //login for VSTS
            VssCredentials creds = new VssBasicCredential(
                String.Empty,
                accessToken);
            creds.Storage = new VssClientCredentialStorage();

            // Connect to VSTS
            _tfsCollection = new TfsTeamProjectCollection(new Uri(accountUri), creds);
            _tfsCollection.Authenticate();
            return true;
        }

{{< / highlight >}}

The class does nothing more than create a VssBasicCredential with empty user and token as a password, use a standard VssClientCredentialStorage and pass everything to TfsTeamProjectCollection class, finally it calls the Authenticate method and if no exception is thrown, you are connected to the service.

As you can see, connecting and authenticating to an Azure DevOps account is just a matter of a few bunch of Nuget Packages and few C# lines of code.

Gian Maria.
