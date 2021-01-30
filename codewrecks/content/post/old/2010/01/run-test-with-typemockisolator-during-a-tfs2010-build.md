---
title: "Run test with TypeMockIsolator during a tfs2010 build"
description: ""
date: 2010-01-27T10:00:37+02:00
draft: false
tags: [Testing,TFS Build]
categories: [Team Foundation Server]
---
[TypeMock Isolator](http://site.typemock.com/) is a good library to inject mock objects without the need of interfaces, but what happens when you try to run test that uses typemock isolator inside a tfs 2010 build? Clearly the tests will not succeed

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb34.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image34.png)

If you look at test result you can check why the tests are failing

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb35.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image35.png)

Ok, the error is really clear, to run typemock tests, you need to run mstest with the tmockrunner.exe test runner that gets installed with typemock. To solve this problem create a custom activity like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Activities;
using System.IO;
using System.Diagnostics;
 
namespace DotNetMarche.Activities
{
 
public sealed class ExternalTestRunner : CodeActivity<Int32>
{
// Define an activity input argument of type string
public InArgument<string> TestRunnerExecutable { get; set; }
 
public InArgument<string> TestAssemblyName { get; set; }
 
public InArgument<string> MsTestExecutable { get; set; }
 
public InArgument<string> ProjectCollection { get; set; }
 
public InArgument<string> BuildNumber { get; set; }
 
public InArgument<string> TeamProjectName { get; set; }
 
public InArgument<string> Platform { get; set; }
 
public InArgument<string> Flavor { get; set; }
 
 
// If your activity returns a value, derive from CodeActivity<TResult>
// and return the value from the Execute method.
protected override Int32 Execute(CodeActivityContext context)
{
String mstest = MsTestExecutable.Get(context);
if (string.IsNullOrEmpty(mstest))
mstest = @"C:\Program Files\Microsoft Visual Studio 10.0\Common7\IDE";
if (!mstest.EndsWith(".exe"))
mstest = Path.Combine(mstest + "mstest.exe");
String testrunner = TestRunnerExecutable.Get(context);
String arguments = String.Format(
@"""{6}"" /nologo /testcontainer:""{0}"" /publish:""{1}"" /publishbuild:""{2}"" /teamproject:{3} /platform:""{4}"" /flavor:""{5}"" /resultsfile:""TestResult.trx""",
TestAssemblyName.Get(context), ProjectCollection.Get(context),
BuildNumber.Get(context), TeamProjectName.Get(context),
Platform.Get(context), Flavor.Get(context), mstest);
Utils.LogMessage("Call Mstest With Wrapper " + testrunner + " and arguments " + arguments, context);
using (System.Diagnostics.Process process = new System.Diagnostics.Process())
{
process.StartInfo.FileName = testrunner;
process.StartInfo.WorkingDirectory = Path.GetDirectoryName(TestAssemblyName.Get(context));
process.StartInfo.WindowStyle = ProcessWindowStyle.Normal;
process.StartInfo.UseShellExecute = false;
process.StartInfo.ErrorDialog = false;
process.StartInfo.CreateNoWindow = true;
process.StartInfo.RedirectStandardOutput = true;
process.StartInfo.Arguments = arguments;
process.Start();
String output = process.StandardOutput.ReadToEnd();
 
process.WaitForExit();
Utils.LogMessage("output of ExternalTestRunner:" + output, context);
return process.ExitCode;
}
}
}
}
{{< / highlight >}}

This is a really simple activity, and probably it needs more work to go in production, but it can be used as starting point. It simply uses System.Diagnostic.Process to invoke MsTest.exe with TMockRunner.exe wrapper, and thanks to output redirection Iâ€™m able to read all the output of the run and log it in the build.

The important aspect is that I return the MsTest exit code from the custom activity, and this is needed to verify test outcome. This is really important because the caller can assign the return value to a variable and check the real Mstest return value, to understand if the tests succeeded.

With this action in hand you need to substitute the standard mstest activity in the workflow. Here is the how I inserted this action for my test project. (locate the section of the workflow that use MsTest activity to run the tests.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb36.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image36.png)

I create a foreach for each string in testAssemblies variable (an enumerable&lt;STring&gt;), that contains all test assembly configured in the build, then for each one I create a sequence where the first action is my new custom action seen before. This action return value (remember that is the return value of mstest) is assigned to a local variable called  **TypemockTestResult** , so I can verify if its value is different from zero or 128 (this indicates an error in the test). Any return value different from 0 or 128 means that there was an error running the tests so I can set BuildDetail.TestStatus to fail, informing the whole workflow that test are failed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb37.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image37.png)

These are all the properties of my custom action. As you can verify the  **Result** value is assigned to the TypeMockTestResult, so the workflow can verify the test result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb38.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image38.png)

Other properties are needed to publish the result in the build. Now I schedule a build with two tests, one use typemock and succeeded, the other use typemock but fails. When I run the build I obtain:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb39.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image39.png)

As you can see tests are run under TMockRunner.exe and everything is good. I can see test results and the build is partially failed because one of the test failed.

If you look at the details you can verify how tests were run.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb40.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image40.png)

Thanks to logging I can see all details in the build log. As you can verify I logged all the output of the TMockRunner.exe, so I can verify details of execution.

This example needs more work to be used in production, this because some value like â€œany CPUâ€ and â€œDebugâ€ are hardcoded in the action, moreover the custom action does not permits to use a test configuration file, but it can be used as starting point :)

Alk.

Tags: [TfsBuild2010](http://technorati.com/tag/TfsBuild2010) [TypeMockIsolator](http://technorati.com/tag/TypeMockIsolator)
