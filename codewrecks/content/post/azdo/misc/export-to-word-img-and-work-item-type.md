---
title: "Some fix for Word Exporter"
description: "Why using Hugo and in general why static site generator is a good idea"
date: 2020-07-22T17:00:00+02:00
draft: false
tags: ["blogging"]
categories: ["general"]
---

This is another post in the series "**how to export Work Item data to Word Document**".

Complete code for project can be found in [GitHub - https://github.com/alkampfergit/AzureDevopsWordPlayground](https://github.com/alkampfergit/AzureDevopsWordPlayground)

Post in the series:
1) [API Connection](http://www.codewrecks.com/blog/index.php/2018/12/28/azure-devops-api-connection/)
2) [Retrieve Work Items Information](http://www.codewrecks.com/blog/index.php/2018/12/28/azure-devops-api-retrieve-work-items-information/)
3) [Azure DevOps API, Embed images into  HTML](http://www.codewrecks.com/blog/index.php/2018/12/31/azure-devops-api-embed-images-into-html/)
4) [Create Word Document For Work Items](http://www.codewrecks.com/blog/index.php/2018/12/31/create-word-document-from-work-items/)
5) [Retrieve image in Work Item Description with TFS API](http://www.codewrecks.com/blog/index.php/2019/07/10/retrieve-image-in-work-item-description-with-tfs-api/)
6) [Retrieve Attachment in Azure DevOps with REST API in C#](http://www.codewrecks.com/blog/index.php/2019/07/25/retrieve-attachment-in-azure-devops-with-rest-api/)

Exporter project was updated a little bit in past months, I had no time for blogging about it but probably it is the time to give further information on **how to export all of your Work Items to a Word File.**

First of all I've introduced a new template syntax that allows for more complex export, as an example suppose you want to create a release note composed by an header followed by a ì list of PBIs then list of all Bugs both filtered to specific iteration.

Let's start examining folder with the template, located [at this address](https://github.com/alkampfergit/AzureDevopsWordPlayground/tree/master/src/WordExporter/Templates/ReleaseNotes). If you look at the content there are some word files then **a special file called structure.txt that contains the structure of the template.**

{{< highlight txt "linenos=table" >}}
[[parameters]]
	iteration=teamproject\6.3
[[static]]
    filename: header.docx
[[query]]
    query: "SELECT
        * 
        FROM workitems
        WHERE ([System.WorkItemType] = 'Product Backlog Item')
            AND [System.IterationPath] = '{iteration}'"
[[query]]
    query: "SELECT
        * 
        FROM workitems
        WHERE ([System.WorkItemType] = 'Bug')
            AND [System.IterationPath] = '{iteration}'"
{{< / highlight >}}

This file has a special syntax that allows inclusion of static word files and a series of queries to create a structured document. A special Parameters section allows the specification of parameters that will be used on queries to parametrize your export. **Paramters are supposed to be supplied by the user to create an export**.

> The purpose of the structure file is to create a definition of the structure of final document, then the composer will execute the query and generate complete file.

With this structure file you can call **command line version of the software to immediately create word files without user interaction**. This is a sample command line.

{{< highlight txt "linenos=table" >}}
wordexporter.exe --address https://dev.azure.com/xxxx --tokenfile C:\secure\mytoken.txt --teamproject "mytp" --templateFolder Templates\ReleaseNotes --param iteration=mytp\6.3
{{< / highlight >}}

The only peculiar parameter is the --tokenfile that allows you to specify a **file that contains plain text Personal Access Token**. Since my disk is usually encrypted by BitLocker I can tolerate having a file with a valid PAT in my disk. This will immediately starts a console application that will create word file, you have some log that allows you to understand what is going on and finally the resulting word file is opened.

![Export in action](../images/export-in-action.png)
***Figure 1***: *Export in action*

If you prefer an interactive approach, a really ugly User Interface is present that allows for a richer interaction. **The UI is still really beta, but it allow you to interactively connect to your server and run an export.**

![Word exporter ui](../images/word-exporter-ui.png)
***Figure 2***: *Word exporter ui*

I know that the UI is ugly, but at least you an interactively 

1) Specify your server and connect, it will ask you for credentials
2) Choose a team project
3) Specify the folder that contains all templates
4) Select one of the template
5) Have a stupid UI to populate template parameters
6) Press a button and generate the export

In this last version I've also made some fixes: especially for image retrieval. The problem with image as attachment is that **if you are on-premise you have probably a Network Credentials, while if you are in Azure DevOps you have a completely different set of credentials.** A special method check if the current _tfsCollection has a NetworkCredentials with a valid UserName, if not it will return null.

{{< highlight csharp "linenos=table" >}}
public ICredentials GetCredentials()
{
    if (_tfsCollection.Credentials is NetworkCredential nc)
    {
        if (String.IsNullOrEmpty(nc.UserName))
        {
            //we are not authenticated with network credentials, probably we used a token
            return null;
        }
    }

    return _tfsCollection.Credentials;
}
{{< / highlight >}}

Now depending on the result of the above method, we can choose to retrieve the image with NeworkCredential, or use API otherwise.

{{< highlight csharp "linenos=table" >}}
var serverCredentials = ConnectionManager.Instance.GetCredentials();
string fileName = match.Groups["fileName"].Value;
extension = Path.GetExtension(fileName).Trim('.');
downloadedAttachment = Path.GetTempFileName() + "." + extension;

if (serverCredentials != null)
{
    using (var client = new WebClient())
    {
        client.Credentials = serverCredentials;
        client.DownloadFile(src, downloadedAttachment);
    }
}
else
{
    //download with standard client
    var fileId = match.Groups["fileId"].Value;
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
}
{{< / highlight >}}

This is needed to handle both on-premise TFS (azure devops server) and Azure DevOps standard accounts. Probably using the API for both environment could be a solution, for this version I prefer using a direct Network call for on-premise installation.

Another noticeable fix is **checking for real WorkItem field type to correctly identify all html field (acceptance criteria, etc) and correctly create an HtmlSubstitution to generate a Word with formatted HTML content**. I've also fixed content encoding to avoid weird chars in HTML content.

{{< highlight csharp "linenos=table" >}}
if (field.FieldDefinition.FieldType == FieldType.Html)
{
    return new HtmlSubstitution(field.WorkItem.GenerateHtmlForWordEmbedding(field.Value.ToString(), Registry.Options.NormalizeFontInDescription));
}
{{< / highlight >}}

Given these two fixes this little utils is now ready to be used to export Work Item data in a nice Formatted Word file.

Gian Maria.