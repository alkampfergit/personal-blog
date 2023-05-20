---
title: "Open an issue when a test fails during a TFS build"
description: ""
date: 2009-07-02T08:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
In last post I show how to configure test run in a team foundation build, simply editing the msbuild file. The aim of the post was showing how to make the entire build fail when a single test fails. To achieve this result I simply override a target and set some properties values.

In this post I'll show how to automatically open an issue in TFS when a test fails. This is a standard requirement, because in such a way you are immediately aware when some test are failing.

{{< highlight xml "linenos=table,linenostart=1" >}}
<Target Name="AfterTest">

    <!-- Refresh the build properties. -->
    <GetBuildProperties TeamFoundationServerUrl="$(TeamFoundationServerUrl)"
                                 BuildUri="$(BuildUri)"
                                 Condition=" '$(IsDesktopBuild)' != 'true' ">
        <Output TaskParameter="TestSuccess" PropertyName="TestSuccess" />
    </GetBuildProperties>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

To execute some task after tests are run, you can simply override the target  **AfterTest** then insert inside it all the tasks you like. To know result of tests we need to refresh some properties of the build, this is simply done with the  **GetBuildProperties task** , you need to insert the serverUri, the BuildUri and ask to know the value of the TestSuccess parameter. Now you can know if some tests failed during test run, and you can create an issue if TestSuccess property is false.

{{< highlight xml "linenos=table,linenostart=1" >}}
<CreateNewWorkItem
    Condition="'$(IsDesktopBuild)' != 'true' and '$(TestSuccess)' != 'true'"
     TeamFoundationServerUrl="$(TeamFoundationServerUrl)"
     BuildUri="$(BuildUri)"
     BuildNumber="$(BuildNumber)"
     Description="Test run failure in build"
     TeamProject="$(TeamProject)"
     Title="Unit Test Failure in build number: $(BuildNumber)"
     WorkItemFieldValues="$(WorkItemFieldValues)"
     WorkItemType="$(WorkItemType)"
     ContinueOnError="true" />
</Target>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The condition property is used to create the item only if the DesktopBuild is false and TestSuccess is also false, this means that issue are created only when the build is executed by the server and at least one test failed. You can configure every parameters but the most important one is the WorkItemFieldValues that can be specified in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
<PropertyGroup>
    <WorkItemFieldValues>
        priority =2; severity=3; rank =4; triage =Investigate
    </WorkItemFieldValues>
</PropertyGroup>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It must contains a list of issue properties that you want to set when you create the new work item. Now I reset back the TreatTestFailureAsBuildFailure to false, so the build will partially succeed even when some tests fails, but for each build that fails unit testing task an issue is automatically generated, with the desidered properties.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image4.png)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image5.png)

Configuring the build adding msbuild tasks is quite simple and permits you to fully configure your build.

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
