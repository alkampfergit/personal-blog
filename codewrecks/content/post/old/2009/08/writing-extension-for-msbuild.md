---
title: "Writing extension for Msbuild"
description: ""
date: 2009-08-01T00:00:37+02:00
draft: false
tags: [Msbuild]
categories: [NET framework]
---
[Msbuild](http://msdn.microsoft.com/en-us/library/ms171452.aspx) is microsoft build engine, and I showed [some time](http://www.codewrecks.com/blog/index.php/2009/07/06/tfs-web-access-and-some-tinyurl-magic-to-signal-test-failure/) ago how you can write a custom task to post in twitter the outcome of a build result. Now it is time to give a greater focus on how to write a good task.

Creating a Task is a simple matter of inheriting from the [Task](http://msdn.microsoft.com/en-us/library/microsoft.build.utilities.task.aspx) class but there are some key points you should keep in mind, first of all you should never throw an exception when executing the task, except for some specific system exception like  [OutOfMemoryException](http://msdn.microsoft.com/en-us/library/microsoft.build.utilities.task.aspx) or [StackOverflowException](http://msdn.microsoft.com/en-us/library/microsoft.build.utilities.task.aspx), then you should provide good logs to make simple for the user of your task to understand causes of failures.

Some of the tasks I miss most from transition to [Nant](http://nant.sourceforge.net/) to Msbuild is the couple XmlPeek and XmlPoke, used to read and manipulate xml files with xpath. Replicate them with LINQ to XML is a breeze. To actually build the task I first included all the logic in a different class.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image.png)

With such an arrangement I can easily test my XML logic

{{< highlight xml "linenos=table,linenostart=1" >}}
[TestMethod]
public void TestXmlPeek()
{
    XElement element =  XElement.Parse("<root>value</root>");
    String value = XmlFunctions.Peek( element,  "/");
    Assert.AreEqual("<root>value</root>", value);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

After you have carefully tested your logic function it is time to test logic of the task, here is the full code of the task.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class XmlPeek : Task
{
    [Required]
    public String XPath { get; set; }

    [Required]
    public String FilePath { get; set; }

    [Required]
    public Boolean FailIfError { get; set; }

    [Output]
    public String Value { get; set; }

    public override bool Execute()
    {
        try
        {
            if (!File.Exists(FilePath))
            {
                Log.LogError("The file {0} cannot be found", FilePath);
                return !FailIfError;
            }
            //can load the file
            XElement element = XElement.Load(FilePath);
            String foundValue = XmlFunctions.Peek(element, XPath);
            if (foundValue == null)
            {
                Log.LogError("No node found with XPath={0}.", XPath);
                return !FailIfError;
            }
            Log.LogMessage("Found node with XPath={0}", XPath);
            Value = foundValue;
            return true;
        }
        catch (OutOfMemoryException ex)
        {
            throw;
        }
        catch (StackOverflowException ex)
        {
            throw;
        }
        catch (Exception ex)
        {
            Log.LogErrorFromException(ex);
            return false;
        }
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I enclosed the main body of the action in a try catch, but I need to rethrow exceptions that really cannot be catched. Then for every other exception I simply log it and then return false to the caller. For the main path of the action you should carefully validate input parameters, and give detailed error with the Log property from Task base class. Since good logs are *really important*, you should test them carefully.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void TestNotFailDefault()
{XmlPeek sut = new XmlPeek() {FilePath="notExists"};sut.BuildEngine = MockRepository.GenerateStub<IBuildEngine>();Assert.IsTrue(sut.Execute());sut.BuildEngine.AssertWasCalled(	be => be.LogErrorEvent(null), 	e => e.IgnoreArguments().Repeat.Once());
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to [Rhino Mock](http://ayende.com/projects/rhino-mocks.aspx) I create an implementation of IBuildEngine to pass to my action to simulate the msbuild execution environment, then I call my task with a file name that does not exists, and verify that the LogErrorEvent was called in the BuildEngine.

Alk.

Tags: [Msbuild](http://technorati.com/tag/Msbuild)
