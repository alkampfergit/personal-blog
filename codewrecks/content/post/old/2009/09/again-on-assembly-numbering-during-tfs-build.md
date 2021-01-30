---
title: "Again on assembly numbering during TFS Build"
description: ""
date: 2009-09-07T03:00:37+02:00
draft: false
tags: [TeamFoundationServer]
categories: [Team Foundation Server]
---
If you read [this post](http://www.codewrecks.com/blog/index.php/2009/08/21/take-control-of-assembly-numbering-during-a-tfs-build/), you can see how to customize a tfs build to modify versioning of the assembly. During that process to find the latest changeset of the repository, to use as â€œrevision Numberâ€ , I used a direct call to tf.exe tool and a custom Regex msbuild task to parse the result to find desired number. This approach have some weak points, first of all you need to know the location of tf.exe tool, moreover we are bound to the format output of the tool, now I want to show you a different way to obtain the same result.

To access functionality of Team Foundation Server you can also use API, and I must admit that I really like this approach instead of relying on calling an external exe tool and parse its output. Here is the full code of a custom task that accomplish the same operation with the use of tfs API.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
namespace DotNetMarche.MsBuildExtensions.TfsBuild
{
    public class SourceControlTask : Task
    {
        [Required]
        public String Operation { get; set; }

        [Required]
        public String TfsUrl { get; set; }

        [Output]
        public Int32 LatestChangeset { get; set; }

        public ICredentials Credentials { get; set; }

        public String TeamProject { get; set; }

        public override bool Execute()
        {
            SourceControlTaskOperation operation;
            try
            {
                operation = (SourceControlTaskOperation)Enum.Parse(typeof(SourceControlTaskOperation), Operation);
            }
            catch (FormatException fex)
            {
                Log.LogError("The operation {0} is not supported;", Operation);
                return false;
            }

            Log.LogMessage("SourceControlTask: Operation{0} requested;");
            TeamFoundationServer tfs;
            if (Credentials == null)
                tfs = new TeamFoundationServer(TfsUrl);
            else
                tfs = new TeamFoundationServer(TfsUrl, Credentials);

            switch (operation)
            {
                case SourceControlTaskOperation.GetLatestChangeset:
                    VersionControlServer vcs = (VersionControlServer)tfs.GetService(typeof(VersionControlServer));

                    LatestChangeset = vcs.GetLatestChangesetId();
                    break;
                default:
                    Log.LogError("The operation {0} is not supported;", Operation);
                    return false;
            }
            return true;
        }
    }

    public enum SourceControlTaskOperation
    {
        GetLatestChangeset = 0,
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The object that permits to access TFS is the TeamFoundationServer one, that you can find in the [C:\Program Files (x86)\Microsoft Visual Studio 9.0\Common7\IDE\PrivateAssemblies\Microsoft.TeamFoundation.Client.dll](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.client.teamfoundationserver%28VS.80%29.aspx) assembly. Since we need also to use version control API we need also a reference to the [Microsoft.TeamFoundation.VersionControl.Client](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.versioncontrol.client%28VS.80%29.aspx "assemblyref://Microsoft.TeamFoundation.VersionControl.Client") located in the same directory. The task has a property called Credentials of type [ICredentials](http://msdn.microsoft.com/en-us/library/system.net.icredentials.aspx) used to specify the credentials used to access tfs. Since during a build the thread runs with the credential of the Build Agent there is no need to specify any credentials, but if you want to create a unit test you absolutely need them.

{{< highlight xml "linenos=table,linenostart=1" >}}
[TestMethod]
public void TestSmokeConnectToServer()
{
    SourceControlTask sut = new SourceControlTask();
    sut.BuildEngine = MockRepository.GenerateStub<IBuildEngine>();
    sut.Operation = "GetLatestChangeset";
    sut.Credentials = new NetworkCredential("alkampfer", "thisisnotmypassword:)");
    sut.TfsUrl = "http://tfsalkampfer:8080/";
    sut.Execute();
    Assert.IsTrue(sut.LatestChangeset > 0);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this test I verify that the task GetLatestChangeset works and returns a value greater than 0, but since this test can be run with an account that have no permission to tfs I need to specify credential in the test. If you  do not like to store credentials in tests, you need to be sure to run this test with a user that have access right to tfs.

After you create a valid TeamFoundationServer object you need to call its [GetService](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.client.teamfoundationserver.getservice%28VS.80%29.aspx) method to obtain a reference to desired service, in this example the [VersionControlServer](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.versioncontrol.client.versioncontrolserver%28VS.80%29.aspx) service. Once you have reference to it, you can simply call his GetLatestChangesetId() method to retrieve the latest changeset number. Once you have this task you can use in a tfs build project in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
<SourceControlTask
    TfsUrl="$(TeamFoundationServerUrl)"
    Operation="GetLatestChangeset">
    <Output    TaskParameter="LatestChangeset" PropertyName="lastChangeset"/>
</SourceControlTask>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see you can simply specify the url of Team Foundation Server, the operation GetLatestChangeset and finally grab the output value with &lt;output&gt; tag.With the old method you need to call two tasks and if for some reason the output of the tf.exe tool changes (maybe for a new version), you need also to change the regex used to parse the output. Thanks to the api you can create a stronger method to obtain latest changeset number in your build file.

Now you can fire a build, goes to the drop location and verify the File Version attribute of the file

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/09/image2.png)

As you can see the version number is 135, my actual latest number for version control system of my test TFS server.

alk.

Tags: [TeamFoundationServer](http://technorati.com/tag/TeamFoundationServer) [MsBuild](http://technorati.com/tag/MsBuild) [TfsBuild](http://technorati.com/tag/TfsBuild)
