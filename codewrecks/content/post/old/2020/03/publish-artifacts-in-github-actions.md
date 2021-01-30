---
title: "Publish artifacts in GitHub actions"
description: ""
date: 2020-03-15T11:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
GitHub action is perfect to automate simple build workflow and can also be used to publish “releases” of our software. While we can do actions to publish on cloud or elsewhere, what I appreciate from a tool is:  **allow me to make simple things with simple workflow.** While I appreciate being able to obtain complex result and indeed, sometimes we evaluate products on the ability to fulfill complex scenario, often we forgot about the simple things. **Is it true that, if a product allows me to solve complex scenarios, it will surely allow me to solve simple scenario, but I wonder about the complexity**.

> To automate a complex build and release workflow, currently I’d prefer Azure DevOps pipelines, but if I have a simple tool or library opensource on GitHub, quickly creating an action is the simplest way to go.

 **GitHub actions is still in its infancy and while it probably lack the ability to orchestrate complex workflows, it makes extremely simple to publish something** , especially if the source uses command line tooling lile.NET core.

Here it is a small piece of GH action where I publish two distinct.NET core projects and then upload as artifact attachment to action run result.

{{< highlight bash "linenos=table,linenostart=1" >}}


    - name: dotnet publish server
      run: dotnet publish src/StupidFirewallManager/StupidFirewallManager.csproj --configuration release

    - name: dotnet publish client
      run: dotnet publish src/StupidFirewallManager.Client/StupidFirewallManager.Client.csproj --configuration release

    - uses: actions/upload-artifact@v1
      with:
        name: Publish server
        path: src/StupidFirewallManager/bin/release/netcoreapp3.1/publish

    - uses: actions/upload-artifact@v1
      with:
        name: Publish client
        path: src/StupidFirewallManager.Client/bin/release/netcoreapp3.1/publish

{{< / highlight >}}

As you can see I can use dotnet publish commanline to simple publish software written in.NET core, then  **using** [**actions/upload-artifact@v1**](mailto:actions/upload-artifact@v1) **I can publish artifact to the action result.** [![SNAGHTML4b1e49](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/SNAGHTML4b1e49_thumb.png "SNAGHTML4b1e49")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/SNAGHTML4b1e49.png)

 ***Figure 1***: *Artifacts attached to execution actions, simply downloadable from the UI.*

With a simple task I can simply upload folders with build/publish result as execution artifacts, and I can simply download the result from the web interface. Artifacts are downloadable also from action run summary page.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-10.png)

 ***Figure 2***: *Artifacts of the build in the summary page of action run.*

Few lines of YAML, push on GH and you have each build to allow download of artifacts. Simple thing made simple.

Gian Maria
