---
title: "Wrap a MsBuild Custom task inside a custom action"
description: ""
date: 2010-01-19T21:00:37+02:00
draft: false
tags: [Continuous Integration,TFS Build]
categories: [Team Foundation Server]
---
If you have an MSBuild custom task that you want to reuse in a TFS 2010 build workflow, you have two solution. The first is using the MsBuild activity as I described in [this post](http://www.codewrecks.com/blog/index.php/2009/11/09/use-msbuild-custom-action-in-tfs2010-build-with-a-custom-project/), but this approach has a lot of limitations.

First of all it is clumsy, because you have to pass custom task parameters as arguments to msbuild, but the worst problem is that you lose the ability to use output properties of the custom task. Suppose you have a TinyUrl custom task, that takes an url as input and gives back the tined version, this custom task has this implementation.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb27.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image27.png)

Now suppose you do not have this source code, so you really need to use the MsBuild Custom Task; if you simply use the MsBuild activity as described in the previous post, how can you grab the TinedUrl output property and pass its value to the workflow engine?

To solve this problem you can use another approach to reuse a Custom MsBuild task in a tfs 2010 build, because you can wrap the task execution in a custom activity. First of all we need to fool the Custom MsBuild Task that it is executing inside MSBuild. A first problem is, how can I intercept the inner calls to Log.LogMessage or Log.LogWarning that are inside the CustomTask and pass them to the workflow engine? The solution is this simple class.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
class WorkflowBuildEngine : IBuildEngine
{
    public CodeActivityContext Context { get; set; }

    public WorkflowBuildEngine(CodeActivityContext context)
    {
        Context = context;
    }

  ...

    public void LogErrorEvent(BuildErrorEventArgs e)
    {
        Utils.LogError(e.Message, Context);
    }

    public void LogMessageEvent(BuildMessageEventArgs e)
    {
        Utils.LogMessage(e.Message, Context, BuildMessageImportance.Normal);
    }

    public void LogWarningEvent(BuildWarningEventArgs e)
    {
        Utils.LogWarning(e.Message, Context);
    }

    public string ProjectFileOfTaskNode
    {
        get { throw new NotImplementedException(); }
    }
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It Implements IBuildEngine, its constructor requires a CodeActivityContext that is used inside the LogErrorEvent, LogMessageEvent and LogWarningEvent methods to forward log message issued by the custom task to the workflow engine. In this way every log that takes place inside the MsBuild custom Action gets forwarded into the workflow engine. Finally you need to create the TinyUrl custom activity that wraps the custom MsBuild task:

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public sealed class TinyUrl : CodeActivity<String>
{
    [RequiredArgument]
    public InArgument<string> Url { get; set; }

      protected override String Execute(CodeActivityContext context)
    {
        TinyUrlTask wrappedTask = new TinyUrlTask();
        WorkflowBuildEngine engine = new WorkflowBuildEngine(context);
        wrappedTask.BuildEngine = engine;
        wrappedTask.Url = Url.Get(context);
        if (!wrappedTask.Execute())
        {
            Utils.LogError("Tiny url task failed", context);
        }
       return wrappedTask.TinedUrl;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The first important aspect is that it inherits from CodeActivity&lt;String&gt; instead from a simple CodeActivity, this because this activity will return a string (the tined url) so the type parameter instruct the workflow on the return type of the action. The execute is different too because it should return the result of the action. As you can see the first operation is creating the MsBuild custom task and a WorkflowBuildEngine that gets assigned to the BuildEngine property of the task. After the Engine is ok, you need to populate all the input properties of the MsBuild Custom task, and then call execute.

If the return value of execute is false the action logs the error (so the build [partially fails](http://www.codewrecks.com/blog/index.php/2010/01/18/log-warning-and-errors-in-a-custom-action/)) and finally returns the value to the caller because output properties of MsBuild custom Tasks are simple properties, so the tined url is in the TinedUrl property of the task. The good part of this technique is that you can use this action from the graphical designer.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb28.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image28.png)

If you compare with the [approach that uses MsBuild Activity](http://www.codewrecks.com/blog/index.php/2009/11/09/use-msbuild-custom-action-in-tfs2010-build-with-a-custom-project/) you have several advantages. First you can use the graphical designer, then you can edit the property with the full editor of workflow foundation and finally you can use output properties. I inserted a WriteBuildMessage after the TinyUrl Custom Activity to verify if the TinedUrl property is correctly set by the action. If you run the build you can verify that everything is good.  I placed two TinyUrl custom activity inside the workflow, the second one tiny the url [www.c.com](http://www.c.com), just to trigger the warning inside the MsBuild custom Task.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb29.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image29.png)

If you look at the first picture of this post, you can verify that the warning â€œThere is no need to tiny the url because is less than 20 charsâ€ is a warning issued internally by the custom MsBuild task, and you are looking at it thanks to the WorkwlofBuildEngine class that forward MsBuild log calls to workflow environment.

alk.

Tags: [tfs](http://technorati.com/tag/tfs)
