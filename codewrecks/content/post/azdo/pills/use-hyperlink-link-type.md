---
title: "Pills: Enhancing Azure DevOps WorkItems with Hyperlinking to External Documentation"
description: "Linking documents to Work Items with an hyper link is a perfect way to integrate external documentation in your Process and keep everything in track on Azure DevOps."
date: 2024-03-12T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

A frequently overlooked feature that can significantly enhance functionality in Azure DevOps is the **ability to attach links to a WorkItem**. A common question among users is: "Can I manage documentation in tools like SharePoint and then easily link it to my project in Azure DevOps?" This query arises because there's often a limitation on how much text can be written directly into a WorkItem, and it's convenient to attach documentation.

> Work Items are perfect to track work and include information, but for formal documentation they probably are not the best choice.

Users typically attach files directly to WorkItems, but this approach is limited, especially because **to modify an attached document, one must download it, make changes, and upload it again then delete the old version**. Additionally, users needs to have an **access to Azure DevOps to manage attachments, while sometimes people that write technical documentation could have no access to the Work Item**.

In such scenarios, the best solution is to create a hyperlink link. This type of link is often underutilized because users  believe that links can only be created between objects within Azure DevOps itself, such as commits and other internal items.

![Adding an hyperlink to Work Item as standard link](../images/hyperlink-link.png)

***Figure 1***: *Adding an hyperlink to Work Item as standard link*

By adding a link to an existing item, you can select a link type called "hyperlink," which allows you to simply connect a URL to a Work Item. This is the perfect solution **to add a link to sharepoint document, or a document in OneDrive or in another cloud storage**. Users would be able to edit the file directly in SharePoint or in other cloud storage, and through the hyperlink in Azure DevOps, **The document is always update because you have only the link in the Work Item**.

In the past I used a lot this kind of approach to link UI prototype in Balsamiq or other tools. This approach not only streamlines the document management process but also **bridges the gap between Azure DevOps and external documentation resources**.

In summary, hyperlinking in Azure DevOps is a powerful feature that enables **seamless integration of external documentation, such as SharePoint files, into your project workflow.** By understanding and utilizing hyperlinks, teams can maintain a **single point of reference within Azure DevOps that reflects real-time updates to their documentation**, all while keeping the documentation itself accessible and editable outside of the Azure DevOps ecosystem.

If you instead write everything in Work Item, and you want to export everything in Word, you can use API to generate a Word Document, I have [a repository on GitHub with some code that can be used](https://github.com/alkampfergit/AzureDevopsWordPlayground) even if it is old code and could need to be renovated.

Gian Maria.