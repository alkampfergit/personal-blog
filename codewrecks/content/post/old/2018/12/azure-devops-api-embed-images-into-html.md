---
title: "Azure DevOps API Embed images into html"
description: ""
date: 2018-12-31T09:00:37+02:00
draft: false
tags: [API,Azure Devops]
categories: [Azure DevOps]
---
Post in the series:  
 1) API [Connection](http://www.codewrecks.com/blog/index.php/2018/12/28/azure-devops-api-connection/)  
 2) [Retrieve Work Items Information](http://www.codewrecks.com/blog/index.php/2018/12/28/azure-devops-api-retrieve-work-items-information/)

Before going to generate a Word File from Work Item Data we need to solve a little problem with HTML content in Work Item fields. As you know Azure DevOps has a rich web editor that allows you to create complex text in some fields, like Description, the problem is:  **whenever you copy and paste images inside the Web Editor, those images were added as Work Item attachments and the real HTML content**  **is just a reference to the attachmen Url.** If you want to generate a consistent Word or export to whatever destination you want, you should manipulate html to embed the image, or the html will be not consistent.

Focus of this article will be: how I can download attachment of Work Items and how I can embed image attachment directly in HTML code.

> Html content in Work Item support images, but images are usually a reference to attachment of  the Work Item itself, thus it is not consistent because it refers protected resources.

Here is an example, I have a work item, I embedded an image in the description and the HTML content of System.Description field is an &lt;img&gt; tag with this src value: [https://gianmariaricci.visualstudio.com/3a600197-fa66-4389-aebd-620186063db0/\_apis/wit/attachments?FileID=481805&amp;FileName=System.Description.0.png](https://gianmariaricci.visualstudio.com/3a600197-fa66-4389-aebd-620186063db0/_apis/wit/attachments?FileID=481805&amp;amp;FileName=System.Description.0.png "https://gianmariaricci.visualstudio.com/3a600197-fa66-4389-aebd-620186063db0/_apis/wit/attachments?FileID=481805&amp;amp;FileName=System.Description.0.png"). Actually this could be seen as a no-problem, because if you copy this url into a browser the image will be correctly downloaded, but the problem rely in authentication.  **If you are going to embed this HTML into a Word Document no one will be able to visualize the image, because word is not authenticated to Azure DevOps,** thus you need to download locally and embed into the html document.

A possible approach is reference the HtmlAgilityToolkit library, then build a routine that programmatically download every attachment, and finally embeds the image in src attribute value using Base64 encoding, here is the code.

{{< highlight csharp "linenos=table,linenostart=1" >}}

public static String EmbedHtmlContent(this WorkItem workItem, String htmlContent)
{
    HtmlDocument doc = new HtmlDocument();
    doc.LoadHtml(htmlContent);

    var images = doc.DocumentNode.SelectNodes("//img");
    if (images != null)
    {
        foreach (var image in images)
        {
            //need to understand if it is in base 64 or no, if the answer is no, we need to embed image
            var src = image.GetAttributeValue("src", "");
            if (!String.IsNullOrEmpty(src))
            {
                if (src.Contains("base64")) // data:image/jpeg;base64,
                {
                    //image already embedded
                    Log.Debug("found image in html content that was already in base64");
                }
                else
                {
                    Log.Debug("found image in html content that point to external image {src}", src);
                    //is it a internal attached images?
                    var match = Regex.Match(src, @"FileID=(?\d*)");
                    if (match.Success)
                    {
                        var attachment = workItem.Attachments
                           .OfType()
                           .FirstOrDefault(_ =&gt; _.Id.ToString() == match.Groups["id"].Value);
                        if (attachment != null)
                        {
                            //ok we can embed in the image as base64
                            WorkItemServer wise = workItem.Store.TeamProjectCollection.GetService();
                            var downloadedAttachment = wise.DownloadFile(attachment.Id);
                            byte[] byteContent = File.ReadAllBytes(downloadedAttachment);
                            String base64Encoded = Convert.ToBase64String(byteContent);
                            var newSrcValue = $"data:image/{attachment.Extension.Trim('.')};base64,{base64Encoded}";
                            image.SetAttributeValue("src", newSrcValue);
                        }
                    }
                }
            }
        }
    }

    return doc.DocumentNode.OuterHtml;
}

{{< / highlight >}}

This code is really simple, it is an extension method of the WorkItem type so you can simply use whenever you have a reference to a Work Item. The code will simply search in all HTML text img tags, for each img tag it will verify if it already contains string base64 (because the image could be already embedded), if the answer is no, we need to download the image locally and embed.

If you look at the attachment url you can notice a FileID=xxxx that points to the attachment of the work item.  **With a simple regex I can find if the url conform to this pattern, and if the answer is yes, I’ll search into WorkItem.Attachments collection for the right attachment**.

> Work Item object in C# library has a nice Attachments collection that allows you to iterate through all attachments to find any information you need

 **Having a reference to the Attachment is crucial, because I need to know the extension of the file.** Once the attachment object is found, I can use Store property of the work item to grab a reference to the [TfsTeamProjectCollection](https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2013/ff732550%28v=vs.120%29) object that allows me to grab a reference to the [WorkItemServer](https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2010/ff732104%28v=vs.100%29) object, that is needed to download the file locally. Thanks to C# object model, if I have a simple reference to a Work Item I can still traverse properties to grab a reference to the original collection object that was still authenticated to the server.

> Using Store property of Work Item allows you to access the original Collection object that is authenticated to the server, thus you can ignore authentication problems

Once I have a reference to WorkItemServer, its method DownloadFile will simply download attachment by id to a temp local file, then a simple conversion to Base64 will perform the trick. The result is a src attribute that embed the image.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-11.png)

 ***Figure 1***: *Src attribute with image embedded*

Now I can simply change the attribute of the image thanks to HtmlAgilityToolkit library, and finally return modified HTML to the caller.

Now I have html code that embed all images and has no reference to external resources in Azure DevOps, so I can embed it everywhere I want without any problem.

Gian Maria.
