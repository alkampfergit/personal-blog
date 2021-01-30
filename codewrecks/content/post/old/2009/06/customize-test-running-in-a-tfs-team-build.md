---
title: "Customize test running in a Tfs Team Build"
description: ""
date: 2009-06-29T10:00:37+02:00
draft: false
tags: [NET framework,Team Foundation Server]
categories: [NET framework,Team Foundation Server]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2009/06/26/running-tests-during-a-build-in-tfs/) I showed how to setup a build in tfs that not only builds the solution, but also runs all the tests. The next step is to configure how tests are run and reacting to test result. The first thing I want is the ability to make the entire build fail if one of the test fails. As you see in the previous post, the default behavior of the build, is to partially fail if one or more tests fail.

This kind of option is not present in the wizard, and it is time to make your hands dirty. To unleash the full power of team builds, you need to know [msbuild](http://msdn.microsoft.com/en-us/library/0k6kkbsd.aspx), in order to configure the build editing the msbuild file of the team build. First of all go to the team explorer, open the source control node (step 1), here you will find a folder named " **TeamBuildTypes** (step2) that contains a subfolder for each build definition, in the BuildWithTests folder there are a couple of file, the one named TFSBuild.proj (Step 3) is the one that contains all operations of the build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb46.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image46.png)

In order to edit that file, you first need to grab a copy from the source control to your local folder, simply right click in the teamBuildTypes folder to â€œGet the latest versionâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb47.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image47.png)

Ok now you can double click the tfsbuild.proj file to edit it. This is a simple msbuild file, and in the first lines you find this instruction

{{< highlight xml "linenos=table,linenostart=1" >}}
<Import Project="$(MSBuildExtensionsPath)\Microsoft\VisualStudio\TeamBuild\Microsoft.TeamFoundation.Build.targets" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

it imports a file called  **Microsoft.TeamFoundation.Build.targets** that contains base targets for a build definition. This file permits you to override some specific target to execute custom code in specific moments of the build process. You can find a list of overridable targets [here](http://msdn.microsoft.com/en-us/library/aa337604.aspx). From that list you can verify that there is a target called  **BeforeTestConfiguration** that can be used to specify some custom configuration for test execution.

To fully understand how overriding works, you can open the Microsoft.TeamFoundation.Build.Targets file and look at the BeforeTestConfiguration target.

{{< highlight xml "linenos=table,linenostart=1" >}}
  <!-- Override this target to execute custom tasks before the testing of an individual configuration -->
  <Target Name="BeforeTestConfiguration" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Since its only purpose is running your own code, it contains no task. Then you can verify on how it is used by the basic test runner task.

{{< highlight xml "linenos=table,linenostart=1" >}}
  <PropertyGroup>
    <TestConfigurationDependsOn>
      BeforeTestConfiguration;
      CoreTestConfiguration;
      AfterTestConfiguration;
    </TestConfigurationDependsOn>
  </PropertyGroup>
  <!-- Batch target for individual configuration testing -->
  <Target Name="TestConfiguration" 
          DependsOnTargets="$(TestConfigurationDependsOn)"
          Outputs="@(TestOutputs)" />
...
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

From that code you can verify that test configuration depends on  **BeforeTestconfiguration, CoreTestConfiguration, AfterTEstConfiguration**.Of these three targets, only CoreTestConfiguration contains real actions, the other two are there only to insert own task into the build process. If you look at the CoreTestConfiguration you can find this code.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    <PropertyGroup>
      <ContinueOnTestError Condition=" '$(StopOnTestFailure)' != 'true' ">true</ContinueOnTestError>
      <ContinueOnTestError Condition=" '$(StopOnTestFailure)' == 'true' ">false</ContinueOnTestError>
    </PropertyGroup>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok this is exactly what we need, the Continue on test property is set to true or false depending on the StopOnTestFailure variable. Another interesting piece of code is this one

{{< highlight xml "linenos=table,linenostart=1" >}}
  <Target Name="RunTest" 
          DependsOnTargets="$(RunTestDependsOn)"
          Outputs="@(TestOutputs)">

    <MakeDir
          Directories="$(TestResultsRoot)"
          Condition="!Exists('$(TestResultsRoot)')" />

    <MSBuild Projects="@(ConfigurationList)"
             Properties="TreatTestFailureAsBuildFailure=$(TreatTestFailureAsBuildFailure)"
             Targets="TestConfiguration"
             StopOnFirstFailure="$(StopOnFirstFailure)">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

That shows you an interesting property called  **TreatTestFailureAsBuildFailure** , that is initially set to false. Now you have every information needed to solve the original problem, you can simply edit TFSBuild.proj file inside the definition of your build, and add this code, after the import statement of the file Microsoft.TeamFoundation.Build.Targets.

{{< highlight xml "linenos=table,linenostart=1" >}}
<Target Name="BeforeTestConfiguration">
    <Message Text="Configure test runner to make the entire build fails if a single test fails" />
    <PropertyGroup>
        <StopOnTestFailure>True</StopOnTestFailure>
        <TreatTestFailureAsBuildFailure>True</TreatTestFailureAsBuildFailure>
    </PropertyGroup>
</Target> {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see, overriding a target is done simply redefining it in the build file. With this simple addition, the msbuild engine will call your BeforeTestConfiguration task that sets the StopOnTestFailure property to True and the  **TreatTestFailureAsBuildFailure** also to true, thus asking to msbuild to make the entire build fails when the test task fails. Now if I fire a build with a failing test I see.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb48.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image48.png)

As you can see the entire build is considered to be failed, because we override the BeforeTestConfiguration. If you click on the Log file you can find the Message that confirms that your override task was really called.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Building with tools version "3.5".
Target "CanonicalizePaths" skipped. Previously built successfully.
Target "BeforeTestConfiguration" in file "C:\Users\tfsservice\AppData\Local\Temp\FluentMsTest\BuildWithTests\BuildType\TFSBuild.proj" from project "C:\Users\tfsservice\AppData\Local\Temp\FluentMsTest\BuildWithTests\BuildType\TFSBuild.proj":
Task "Message"
  Configure test runner to make the entire build fails if a single test fails
Done executing task "Message".{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Configuring Tfs build is quite simple, it is only a matter of overriding certain specific targets to insert custom msbuild code in the main build process.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
