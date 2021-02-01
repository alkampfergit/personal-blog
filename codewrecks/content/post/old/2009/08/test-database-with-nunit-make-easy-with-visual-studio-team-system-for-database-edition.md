---
title: "Test database with Nunit make easy with Visual Studio Team System For Database Edition"
description: ""
date: 2009-08-06T06:00:37+02:00
draft: false
tags: [VSTSDBEdition]
categories: [NET framework,Visual Studio]
---
I have a project born without VSTS database edition, all tests to database are done using custom preload scripts that run.sql scripts to regenerate a [sandbox database](http://xunitpatterns.com/Database%20Sandbox.html) to use for unit testing. This turns to be a quite good system, but it requires manteniance, since every time you change the database you also need to change sql file to recreate the new structure to run tests.

My goal is to fully automate this process, avoiding manual intervention and running everything in a standard NUNIT project, and make test runnable even from programmer that does not have visual studio database edition installed.

First of all you should notice that the command line deploy tool [vsdbcmd.exe is a redistributable tool](http://blogs.msdn.com/gertd/archive/2008/08/22/redist.aspx), so I can include it in the internal repository actually distributing to everyone, even those collaborators that does not have the database edition installed. Then I modify my recreatedb.bat file with this instruction.

{{< highlight csharp "linenos=table,linenostart=1" >}}
osql -S localhost\SQL2008 -U sa -P ottagono -i Drop.sql
vsdbcmd /a:Deploy /ConnectionString:"Data Source=localhost\sql2008;user=sa;pwd=xxxxx" /dsp:SQL /manifest:Myproj.Database.deploymanifest /p:TargetDatabase=MyprojTest /dd{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And with a few code lines in C# I call it to sync test database with the latest schema. Notice how I call a Drop before vsdbcmd, because I must be sure that the database is recreated empty to make tests repeatable.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static void InitDatabaseStructureFromScripts()
{
    if (!DbInited)
    {
        DbInited = true;
        using (System.Diagnostics.Process process = new System.Diagnostics.Process())
        {
            process.StartInfo.FileName = Path.GetFullPath("./Preloads/Scripts/RecreateTestDb.bat");
            process.StartInfo.WorkingDirectory = Path.GetFullPath("./Preloads/Scripts/");
            process.StartInfo.WindowStyle = ProcessWindowStyle.Normal;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.ErrorDialog = false;
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.RedirectStandardOutput = true;
            process.Start();    
            //process.WaitForExit();
            String output = process.StandardOutput.ReadToEnd();
            System.Diagnostics.Debug.WriteLine(output);
        }
...
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this and some attribute and base class magic I'm able to write NUnit test like this.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[TestFixture, Category("ElaborateKeywordResult")]
[UseSqlServer(ClearAtEachTest = true)]
[DisableIntegrityCheck]
public class TestStoredProceduresForSearchUnitLink : BaseDatabaseTest{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

My UseSqlServer attribute calls the function seen before, and impose transactional test, so I'm sure that each test does not modify the content of the database. Thanks To Visual Studio Database Edition the process of database sincronization is automatic even in NUnit.

Alk.

Tags: [Visual Studio Team System Database Edition](http://technorati.com/tag/Visual%20Studio%20Team%20System%20Database%20Edition)
