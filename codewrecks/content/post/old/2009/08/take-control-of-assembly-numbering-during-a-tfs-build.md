---
title: "Take control of assembly numbering during a tfs build"
description: ""
date: 2009-08-21T06:00:37+02:00
draft: false
tags: [Msbuild,TeamFoundationServer,TfsBuild]
categories: [Team Foundation Server,Tools and library]
---
One of the most important stuff in a project build, is *the ability to mark the assemblies with unique numbers that permits us to reproduce the build*. Tfs does not have a standard way of doing this, but with a couple of MsBuild actions it is really simple to overcome this limitation. This is a good example that shows how you can extend build script to do complex task.

First of all I want to change only [AssemblyFileVersion](http://msdn.microsoft.com/en-us/library/system.reflection.assemblyfileversionattribute.aspx) and not the AssemblyVersion, in this way all builds are compatible until someone manually changes AssemblyVersion. A standard technique I like very much is letting the programmers to *manage major and minor number manually*, and *letting my builds generates build and revision ones*. For build number I want to be able to generate a unique number each build, a sequential generator will be fine; but for revision number I want to use the changeset used to generate the build. To accomplish this we need essentially four macro steps.

![External Image](http://yuml.me/45c1d876)

In the first step I need to generate unique integer build number, most of the time sequential generator is ok, then I need also to find a way to correlate this generated number with the build label of the TFS. Step two is used to find latest changeset, then in step three we need to check-in modified files (the one used by the generator), being sure that this check-in does not trigger another build, finally we need to modify a file named ProjectVersion.cs that is used by all projects.

To modify AssemblyFileVersion for a project I love this technique: I remove AssemblyFileVersion and AssemblyVersion attributes from assemblyinfo.cs, put them in a single  **ProjectVersion.cs** file stored in the root of the team project. Here is a typical content for the ProjectVersion.cs.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using System.Reflection;
[assembly: AssemblyVersion("1.2.0.0")]
[assembly: AssemblyFileVersion("1.2.0.0")]{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Next I import this file as link in every project that belong to this team project

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image25.png)

With this little trick to change AssemblyFileVersion attribute for every project I*need only to change one file.* Now it is time to build some custom tasks that will help us to manage the whole process, first of all the task that generates unique numbers and correlate them with build label.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class BuildVersionNumberManagerTask : Task
{
    /// <summary>
    /// Filename that will store the versions
    /// </summary>
    [Required]
    public String VersionFileName { get; set; }

    /// <summary>
    /// label of the current build.
    /// </summary>
    [Required]
    public String BuildLabel { get; set; }

    /// <summary>
    /// new incremental version numer.
    /// </summary>
    [Output]
    public Int32 NewVersionNumber { get; set; }

    public override bool Execute()
    {
        if (!File.Exists(VersionFileName))
        {
            Log.LogError("The file {0}[{1}] with version number does not exists", VersionFileName, Path.GetFullPath(VersionFileName));
            return false;
        }
        String[] allLines = File.ReadAllLines(VersionFileName);
        String startChar = "";
        if (allLines.Length > 0 && !String.IsNullOrEmpty(allLines[allLines.Length - 1]))
        {
            startChar = "\n";
            String lastline = allLines[allLines.Length - 1];
            String lastNum = lastline.Substring(0, lastline.IndexOf("|"));
            Int32 lastNumber;
            if (!Int32.TryParse(lastNum, out lastNumber))
            {
                Log.LogError("There are errors in the version file, the last line does not contains lastnum|lastlabel valid format");
                return false;
            }
            NewVersionNumber = lastNumber + 1;
        } else
        {
            //There is no lines, or the last line is empty.
            NewVersionNumber = 1;
        }
        String newLastLine = String.Format("{0}{1}|{2}",startChar,  NewVersionNumber, BuildLabel);
        File.AppendAllText(VersionFileName, newLastLine);
        return true;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The BuildVersionNumberManagerTask is responsible of the generation of a sequential number, as well as storing in a file the relationship between autogenerated numbers and build labels. It use a simple text file and write a line for each generated number. Here is an example of file content.

{{< highlight csharp "linenos=table,linenostart=1" >}}
...
3|Standard build for CI_20090820.20
4|Standard build for CI_20090820.21
5|Standard build for CI_20090820.24
...{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With such a technique, we can immediately find the build label associated with each auto generated number. Now if you have problem with an assembly that have 4 as the build number, I immediately find in the file that it was build by * **Standard build for CI\_20090820.21** * Here is how I call this task into TFSBuild.proj file

{{< highlight xml "linenos=table,linenostart=1" >}}
<PropertyGroup>
        <tfTool>"C:\Program Files\Microsoft Visual Studio 9.0\Common7\IDE\tf.exe"</tfTool>
       ...
<Target Name="BeforeCompile" Condition=" '$(IsDesktopBuild)' != 'true' ">
        <Message Text="Beginning generation of new AssemblyFileVersionAttribute" />
        <Exec Command="$(tfTool) checkout..\sources\src\StandardBuildForCIVersion.txt"  />
        <BuildVersionNumberManagerTask
            VersionFileName="..\sources\src\StandardBuildForCIVersion.txt"
            BuildLabel="$(BuildNumber)">
            <Output TaskParameter="NewVersionNumber" PropertyName="NewVersionNumber" />
        </BuildVersionNumberManagerTask>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I override the BeforeCompile task, since I need to change version number before the compile phase. As you can see *I use the Exex command to call the tf.exe tool to checkout the file* * **StandardBuildForCIVersion.txt** *, the one used to store autogenerated numbers. In this way I can use a different file for each build definition or I can use same file for different builds, I have great flexibility. The checkout is needed because I want to check in modified file at the end of the process, in this way the autogenerated number can be accessed from other build agents. Then I need another custom task capable to modify the ProjectVersion.cs file.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class AssemblyInfoVersionManagerTask : Task
{
    [Required]
    public String AssemblyInfoFileName { get; set; }

    [Required]
    public Int32 NewBuildNumber { get; set; }

    [Required]
    public Int32 NewRevisionNumber { get; set; }
    public override bool Execute()
    {
        if (!File.Exists(AssemblyInfoFileName))
        {
            Log.LogError("The file {0} does not exists", AssemblyInfoFileName);
            return false;
        }
        String filecontent = File.ReadAllText(AssemblyInfoFileName);
        Match curVersionMatch =
            Regex.Match(filecontent, "AssemblyVersion\\(\"(?<curversion>.*?)\"\\)");
        if (!curVersionMatch.Success)
        {
            Log.LogError("The content of file {0} does not contains valid Assemblyversion attribute");
            return false;
        }
        String curversion = curVersionMatch.Groups["curversion"].Value;
        String[] versionParts = curversion.Split('.');
        String newVersion = String.Format("{0}.{1}.{2}.{3}", versionParts[0], versionParts[1], NewBuildNumber, NewRevisionNumber);
        String newFileContent = Regex.Replace(
            filecontent,
            "AssemblyFileVersion\\(\"(?<curversion>.*?)\"\\)",
            String.Format(@"AssemblyFileVersion(""{0}"")", newVersion));
        FileAttributes currentFileAttributes = File.GetAttributes(AssemblyInfoFileName);
        File.SetAttributes(AssemblyInfoFileName, FileAttributes.Normal);
        File.WriteAllText(AssemblyInfoFileName, newFileContent);
        File.SetAttributes(AssemblyInfoFileName, currentFileAttributes);
        return true;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is another simple task, it uses a little bit of regular expression to find actual version number stored in the ProjectVersion.cs, then it creates another version number with simple composition.  **Major and minor number are taken from the original content, while build and revision are passed by the caller**. Remember also to remove the Readonly attribute from the file, because it is usually readonly since it is under version control. Now I need the last piece, a simple TfTask that permits me to grab the changeset number associated with the current project.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class TfTask : ToolTask
{
    public TfTask()
    {
        ToolPath = @"C:\Program Files\Microsoft Visual Studio 9.0\Common7\IDE\";
    }

    [Required]
    public String Operation { get; set; }

    [Output]
    public String TfOutput { get; set; }

    public String TfsUrl { get; set; }

    public String TeamProject { get; set; }

    protected override int ExecuteTool(string pathToTool, string responseFileCommands, string commandLineCommands)
    {
        TfTaskOperation operation = (TfTaskOperation)Enum.Parse(typeof(TfTaskOperation), Operation);
        String commandline;
        switch (operation)
        {
            case TfTaskOperation.GetLatestChangeset:
                commandline = String.Format(
                    "history /s:{0} /stopafter:1 /noprompt /recursive /version:T $/{1}", TfsUrl, TeamProject);
                break;
            default:
                throw new NotSupportedException();
        }
        using (System.Diagnostics.Process process = new System.Diagnostics.Process())
        {
            process.StartInfo.FileName = Path.GetFullPath(pathToTool);
            process.StartInfo.Arguments = commandline;
            process.StartInfo.WorkingDirectory = Path.GetDirectoryName(pathToTool);
            process.StartInfo.WindowStyle = ProcessWindowStyle.Normal;
            process.StartInfo.UseShellExecute = false;
            //process.StartInfo.ErrorDialog = false;
            //process.StartInfo.CreateNoWindow = true;
            process.StartInfo.RedirectStandardOutput = true;
            process.Start();
            process.WaitForExit();
            TfOutput = process.StandardOutput.ReadToEnd();
        }
        return 0;
    }

    protected override string GenerateFullPathToTool()
    {
        throw new NotImplementedException();
    }

    protected override string ToolName
    {
        get { return "tf.exe"; }
    }
}

public enum TfTaskOperation
{
    GetLatestChangeset = 0,
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a simple wrapper to the tf.exe tool, and since I invoke it with the System.Diagnostic.Process class, *I'm able to intercept the output*. There are a lot of possibilities on how to get latest changeset, but the simplest is to invoke tf.exe with a command line like this:  **tf.exe history /s:http://tfsalkampfer:8080 /stopafter:1 /noprompt /recursive /version:T $/MsBuildExtension** This This command gives a result like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Changeset User          Date       Comment
--------- ------------- ---------- ---------------------------------
129       TfsService    8/21/2009  * **NO_CI** *{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

That can be parsed with a simple regular expression, here is the remaining of the build script.

{{< highlight xml "linenos=table,linenostart=1" >}}
<TfTask 
    TfsUrl="$(TeamFoundationServerUrl)" 
    TeamProject="$(TeamProject)" 
    Operation="GetLatestChangeset">
    <Output    TaskParameter="TfOutput" PropertyName="historyOutput"/>
</TfTask>

<Message Text="historyOutput is $(historyOutput)" />

<RegexTask TextToMatch="$(historyOutput)" Regex="\n(?&lt;changeset&gt;\d+)" FailIfNoMatch="true" GroupName="changeset">
    <Output
         TaskParameter="Result"
         PropertyName="lastChangeset"/>
</RegexTask>

<AssemblyInfoVersionManagerTask
    AssemblyInfoFileName="..\sources\src\ProjectVersion.cs"
    NewBuildNumber="$(NewVersionNumber)"
    NewRevisionNumber="$(lastChangeset)">
</AssemblyInfoVersionManagerTask>

<Exec Command='$(tfTool) checkin /comment:"* **NO_CI** *"..\sources\src\StandardBuildForCIVersion.txt' />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

IT is quite simple, I first invoke the TfTask, then I use a simple RegexTask to find the changeset number from tf output. Thanks to TfTask custom task, the script remains simple, I need only to specify tfsurl, team project name and the operation I want to execute (in this situation GetLatestChangeset), and the task will store in the *historyOutput* property the full output of the tf.exe command.

Finally I use my AssemblyInfoVersionManager task to change the ProjectVersion.cs file and finally I do a check-in of the file that contains the new generated sequential build number *with comment \*\*\*NO\_CI\*\*\* to avoid going in loop with continuos integration engine*.

After a build you can verify that everything is gone ok.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image26.png)

Now if you deploy this assembly into a customer computer, if you have a problem in the future, you can immediately verify that this was compiled with the build called 8, then you check the StandardBuildForCIVersion.txt

{{< highlight csharp "linenos=table,linenostart=1" >}}
7|Standard build for CI_20090820.37
8|Standard build for CI_20090820.39
9|Standard build for CI_20090821.2{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can immediately find the label of the build, but the most important thing in my opinion is the revision number, 128 in the picture above, because it is the changeset that generates this assembly, to replicate and debug any problem, you can simply do a Get Specific Version of that changeset, and you can work with the exact source code and build tools that generates that assembly.

This example shows how simple can be extending build process with the creation of some ad-hoc tasks and a good use of the tf.exe command line tool.

A zip of all the repository [can be downloaded here](http://www.codewrecks.com/blog/storage/msbuildextension.zip).

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server) [MsBuild](http://technorati.com/tag/MsBuild)
