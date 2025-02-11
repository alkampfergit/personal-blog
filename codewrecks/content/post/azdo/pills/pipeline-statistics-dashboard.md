---
title: "Understanding Azure DevOps Pipeline Statistics"
description: "Learn how Azure DevOps pipeline statistics provide valuable insights into your CI/CD processes."
date: 2025-02-11T08:00:00+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

Pipeline statistics in Azure DevOps provide a wealth of information that can help you understand the **performance and efficiency of your pipelines**. Even with really basic informations you can have interesting information. Lets examine 

![Pipeline statistics dashboard in Azure DevOps](../images/pipeline-statistics-dashboard.png)

***Figure 1***: *Pipeline statistics dashboard in Azure DevOps*

My favorite information (1) is the 80th percentile of pipeline duration, this indicates me **if for some reason some pipeline is becoming slower**. Actually in **Figure 1** I can see that seems to be an increase in pipeline duration. **With (2) you can immediately understand which is the step that predates the execution time**. In this example it is not a mistery, the IN-PROCESS step is actually running a full suite of integration test that uses MongoDB, Elasticsearch, and a complex software end-to-end without the UI.

Clicking on the tiles brings you to a detailed page that shows much more information about duration.

![Detailed statistics about build time](../images/detailed-build-timing.png)

***Figure 2***: *Detailed statistics about build time*

As you can see I have the ability to have a graph that show the trend, **up to a 180 days of data**. In this example I see no mistery, we spend time running test, then building the .NET solution (94 projects, 12 years of code) then we have again jest tests and so on. **Nevertheless it is interesting looking at these graph because sometimes you find something that can surprise you**.

> You can choose the number of days but also you can filter by branch. Usually we are interested only in develop branch.

If you look again at Figure 1 the central graph is devoted to test failures, in this situation the detail is the real **information you want to look at**.

![Detailed statistics about test failures](../images/detailed-build-tf.png)

***Figure 3***: *Detailed statistics about test failures*

As you can see we have a high number of failure today, this happens due to my fault **because I've added test on ElasticSearch 8, forgetting to configure a valid ElasticSearch 8 instances in build server**. Actually the tests should be skipped, but a bug in the logic made the test run and they all fails because no ElasticSearch is found.

You can filter by branch, by test status, but the **most important thing is that you can click on a test failure to look at details of that specific tests**.

![Detailed statistics about single test failure](../images/tf-details.png)

***Figure 4***: *Detailed statistics about single test failure*

You have also the list of all the branches where the test is failing, this helps you to determine if it is failing on **develop or master branch or it fails on a feature branch that still needs to be merged with the stable branches**.

To conclude: always keeps an eye on the basic metrics of your pipeline, you will have a really good insight of how your project is going.

Gian Maria.
