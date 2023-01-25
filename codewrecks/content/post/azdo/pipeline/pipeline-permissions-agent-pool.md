---
title: "Azure DevOps: pipeline permission to use an agent pool"
description: "When you create an agent Pool in Azure DevOps to run your pipeline, you can require each pipeline to be authorized to run on that agent and sometimes this can generate some glitch."
date: 2023-01-25T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

Scenario: We created a **new Agent Pool** in Azure DevOps called "linux" and we added some **docker based agents**, and finally we add this new pool into the available pool for a couple of builds. To verify that agents can indeed run the builds we scheduled run onto this new pool **but pipeline execution failed**. The error is depicted in **Figure 1**

![Failed build details after changing pool to linux](../images/build-failed-not-allowed-to-run-on-agent.png)

***Figure 1***: *Failed build details after changing pool to linux*

The error is quite strange, ***(1)*** we have clearly a failed build, the build is red, but in ***(2)*** **we have a link "Show 1 additional error" that does nothing when you click on it**, and finally ***(3)*** we can **verify that last job was canceled**. 

> The problem is a job canceled, and that is the job we moved to the new agent pool

This is a security feature of Azure DevOps, if you **do not explicitly allow any pipeline to use a pool, only authorized pipeline can run on that pool's agent**. Usually when such error arise, if you have the right to administer the pool, you can find directly in the ui of the failed job a button that allows you **to authorize that pipeline to access the pool**. In this scenario we have no button, build fails and we have no way to authorize the pipeline.

![Pipeline does not have permission to use the pool](../images/pipeline-permission-required.png)

***Figure 2***: *Pipeline does not have permission to use the pool*

The whole problem arises because **the pipeline has not a stable pool to use, pool is a parameter of the build itself** as you can see in the following YAML

{{< highlight yaml "linenos=table,linenostart=1" >}}
variables:
  Pool: ${{ parameters.Pool }}
  
jobs:

- job: net_build_test

  pool:
    name: '$(Pool)'
{{< / highlight >}}

This pipeline defines a parameter called Pool and then schedule the job on that pool. Since pool to use is determined at RUN level, **the runner is not able to know upfront pool that will be used, permissions check passed and build is scheduled**. When the build try to run on the agent real security checks kick in and prevent the pipeline to run on the agent because it has no rigth to use the pool. Build fails but we have **no way to authorize the pipeline to use the pool**.

The quick solution was to create a new branch called temp_to_remove_build_auth, **change the pipeline definition to run on pool called "linux" not using parameter**. Since the pipeline now can run the job only on linux pool if you queue another run build does not starts because it has no permission.

![Pipeline run fails but this time we have specific error detected](../images/pipeline-permission-request-error.png)

***Figure 3***: *Pipeline run fails but this time we have specific error detected*

Since now the scheduler knows up-front that at least one job will be run on linux pool, it **immediately checks permission and if the pipeline does not have required permissions it immediately mark it failed**, but this time it gives you detailed error reason as you can see in Figure 3.

Now the great difference is that the UI correctly **shows the button to authorize the pipeline to run on the pool**.

![UI now correctly shows a button to authorize the pipeline](../images/pipeline-permission-authorize-UI.png)

***Figure 4***: *UI now correctly shows a button to authorize the pipeline*

You can authorize the pipeline only if you **have admin permission on the pool**. Once you authorize the pipeline, you can **remove the temporary branch and the pipeline will run correctly**.

Clearly you can remove restriction and configure the pool **to be used by all pipelines of the team Project without explicit authentication**.

![Open the pool to be used by all pipelines without explicit authorization](../images/allow-permission-to-all-pipelines.png)

***Figure 5***: *Open the pool to be used by all pipelines without explicit authorization*

You can change this from Pool administration, tab security (1), then you can select "Open access" (2). The interface usually shows you which pipeline are actually authorized to use the pool (3). 

Gian Maria.

