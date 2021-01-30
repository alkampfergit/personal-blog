---
title: "Sample report for Azure DevOps"
description: ""
date: 2019-08-19T06:00:37+02:00
draft: false
tags: [Azure Devops]
categories: [Azure DevOps]
---
Reporting was always a pain point in Azure DevOps, because people used on SQL Server reporting Services for the on-premise version, missed a similar ability to create custom reports in Azure Dev Ops.

Now you have a nice integration with Power BI and a [nice article here](https://docs.microsoft.com/en-us/azure/devops/report/powerbi/sample-odata-overview?view=azure-devops) that explains how to connect Power BI to your instance and create some basic query.  **The nice part is that you can use a query that will connect directly with the OData feed, no need to install anything.** ![Power BI - Advanced Editor - Replace strings in query](https://docs.microsoft.com/en-us/azure/devops/report/powerbi/_img/odatapowerbi-advancededitor-replaced.png?view=azure-devops)

 ***Figure 1***: *Sample OData query that directly connects to your organization account to query for Work Item Data.*

I strongly encourage you to experiment with Power BI because is a powerful tool that can create really good report, closing the gap with on-premise version and old Reporting Services.

Gian Maria.
