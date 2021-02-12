---
title: "Integrate Nunit test into a Tfs build"
description: ""
date: 2009-07-19T20:00:37+02:00
draft: false
tags: [Team Foundation Server,Testing]
categories: [Team Foundation Server,Testing]
---
Since a lot of people use NUnit testing framework, it is of high importance knowing how to fully integrate nunit test runner inside a tfs build. The overall problem is that you can create a custom task, or using an [existing one](http://msbuildtasks.tigris.org/) to run nunit tests, but the main problem is *integrating nunit output with standard tfs output*. The problem and a possible solution is described [here](http://richardsbraindump.blogspot.com/2008/06/merging-nunit-build-results-into-tfs.html).

This means that someone had already solved this problem for us :), and created an *xslt that transforms a nunit-style output into a mstest-style output (.trx file)*, you can find the xslt and an example proj in the [nunit4teambuild](http://nunit4teambuild.codeplex.com/Wiki/View.aspx?title=sample%20script) codeplex project.

The only things you should do is to include all needed file in the source control of the project, to make them avaliable to each build. (Note: in the project site the author ask you to download the nxslt2.exe xslt command line tool, the link appear to be broken, so you can download an update version [here](http://www.xmllab.net/downloads/nxslt/)).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image18.png)

Now that everything is in place we need to extend the build process including nunit tests and publish results in the team foundation server.

{{< highlight xml "linenos=table,linenostart=1" >}}
<Target Name="AfterCompile">
    <Message Text="Running NUnit test with custom task" />
    <!-- Create a Custom Build Step -->
    <BuildStep TeamFoundationServerUrl="$(TeamFoundationServerUrl)" BuildUri="$(BuildUri)" Name="NUnitTestStep" Message="Running Nunit Tests">
        <Output TaskParameter="Id" PropertyName="NUnitStepId" />
    </BuildStep>

    <ItemGroup>
        <TestAssemblies Include="$(OutDir)DotNetMarche.NunitTest.Test.dll" />
    </ItemGroup>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

To extend the build you need to override the AfterCompile target, then with the BuildStep you creates another build step that will be visualized in the build result window. The BuildStep is a predefined task of msbuild, and has an output property called Id, that must be stored in some properties to close the step once testing phase will finish. Then you must create the list of the assembly that contains nunit test to be run, now it is possible to use the nunit task taken from the community task project.

{{< highlight xml "linenos=table,linenostart=1" >}}
<NUnit 
    ContinueOnError="true" 
    Assemblies="@(TestAssemblies)" 
    OutputXmlFile="$(OutDir)nunit_results.xml" 
    ToolPath="..\sources\BuildTools\nunit">
    <Output TaskParameter="ExitCode" PropertyName="NUnitResult" />
</NUnit>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The task is really simple, you need simply to specify the list of the assemblies, the output file you want and the path of the nunit test runner, that I included in the source under the BuildTools\nunit folder. As I told before, having all tools you need for the build in the source repository is handful, because you can avoid deploying them in the build machines. After tests are run it is time to set the status of this step to success or failure depending on the outcome of the test result

{{< highlight xml "linenos=table,linenostart=1" >}}
<BuildStep Condition="'$(NUnitResult)'=='0'" TeamFoundationServerUrl="$(TeamFoundationServerUrl)" BuildUri="$(BuildUri)" Id="$(NUnitStepId)" Status="Succeeded" />
<BuildStep Condition="'$(NUnitResult)'!='0'" TeamFoundationServerUrl="$(TeamFoundationServerUrl)" BuildUri="$(BuildUri)" Id="$(NUnitStepId)" Status="Failed" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to the Condition attribute, you can set the Status of the previously created BuildStep to Succeded or Failed depending on the content of the property NUnitResult. Now it is time to transform the result file from xml Nunit file format to trx format, thanks to the trasfromation sheet.

{{< highlight xml "linenos=table,linenostart=1" >}}
<Exec Command="..\sources\BuildTools\xslt\nxslt3.exe &quot;$(OutDir)nunit_results.xml&quot; &quot;..\sources\BuildTools\nunit\nunit transform.xslt&quot; -o &quot;$(OutDir)nunit_results.trx&quot;"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The final step is calling mstest to publish result trx file to the TFS server, and associate it with the actual build.

{{< highlight xml "linenos=table,linenostart=1" >}}
<Exec Command="&quot;$(ProgramFiles)\Microsoft Visual Studio 9.0\Common7\IDE\mstest.exe&quot; /publish:$(TeamFoundationServerUrl) /publishbuild:&quot;$(BuildNumber)&quot; /publishresultsfile:&quot;$(OutDir)nunit_results.trx&quot; /teamproject:&quot;$(TeamProject)&quot; /platform:&quot;%(ConfigurationToBuild.PlatformToBuild)&quot; /flavor:&quot;%(ConfigurationToBuild.FlavorToBuild)&quot;"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a simple Exec towards the  **mstest.exe** executable, that is able to take a trx file and publish to TFS. Here is the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image19.png)

As you can verify nunit tests are executed correctly, and results are correctly published in the TFS build result window. Thanks to BuildStep we created a step that states *Running Nunit Tests*, and thanks to mstest.exe and xslt transformation we transformed the result from nunit output to mstest output, so we can publish them into the tfs build.

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server) [Nunit](http://technorati.com/tag/Nunit)
