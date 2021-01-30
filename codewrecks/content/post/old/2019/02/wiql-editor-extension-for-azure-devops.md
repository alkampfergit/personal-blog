---
title: "WIQL editor extension For Azure DevOps"
description: ""
date: 2019-02-03T15:00:37+02:00
draft: false
tags: [AzureDevOps]
categories: [Azure DevOps,DevOps]
---
One of the nice feature of Azure DevOps is extendibility, thanks to REST API you can write addins or standalone programs that interacts with the services. **One of the addin that I like the most is the** [**Work Item Query Language Editor**](https://marketplace.visualstudio.com/items?itemName=ottostreifel.wiql-editor), a nice addin that allows you to interact directly with the underling syntax of Work Item query.

 **Once installed, whenever you are in query Editor, you have the ability to directly edit the query with WIQL syntax,** thanks to the “Edit Query wiql” menu entry.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image.png)

 ***Figure 1***: *Wiql query editor new menu entry in action*

As you can see in  **Figure 2** , there are lots of nice feature in this addin, not only the ability to edit a query directly in WIQL syntax.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-1.png)

 ***Figure 2***: *WIQL editor in action*

You can clearly edit and save the query (3) but  **you can also export the query into a file that will be downloaded into your pc, and you can then re-import in a different Team Project.** This is a nice function if you want to store some typical queries somewhere (source control) then re-import in different Team Project, or for different organization.

If you start editing the query, you will be amazed by intellisense support ( **Figure 3** ), that guides you in writing correct query, and it is really useful because it contains a nice list of all available fields.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-2.png)

 ***Figure 3***: *Intellisense in action during Query Editor.*

The intellisense seems to actually using API to grab a list of all the valid fields, because **it suggests you even custom fields that you used in your custom process**. The only drawback is that it lists all the available fields, not only those one available in the current Team Project, but this is a really minor issue.

> Having intellisense, syntax checking and field suggestion, this addin is a really must to install in your Azure DevOps instance.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-3.png)

 ***Figure 4***: *Intellisense is available not only on default field, but also on custom fields used in custom process.*

If you are interested in the editor used, you can find that this [addin uses the monaco](https://github.com/Microsoft/monaco-editor) editor, another nice piece of open source software by Microsoft.

Another super cool feature of this extension, is the Query Playground, where you can simply type your query, execute it and visualize result directly in the browser.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/02/image-4.png)

 ***Figure 5***: *Wiql playground in action, look at the ASOF operator used to issue query in the past.*

As you can see from Figure 5, you can easily test your query,  **but what is most important, the** [**ASOF operator**](https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops#historical-queries-asof) **is fully supported and this guarantees you the ability to do historical queries directly from the web interface** , instead of resorting using the API. If you need to experiment with WIQL and you need to quick create and test a WIQL query, this is the tool to go.

I think that this addin is really useful, not only if you are interacting with the service with REST API and raw WIQL, but also because it allows you to export/import queries between projects/organization and allows you to execute simply historycal queries directly from the ui.

> Having the full support of WIQL allows you to use features that are not usually available through the UI, like the ASOF operator.

 **As a last trick, if you create a query in the web UI, then edit with this addin and add ASOF operator then save, the asof will be saved in the query, so you have an historical query executable from the UI.** The only drawback is that, if you modify the query with the web editor and then save, the ASOF operator will be removed.

Gian Maria.
