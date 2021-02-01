---
title: "Improving the WCF logger"
description: ""
date: 2008-11-06T01:00:37+02:00
draft: false
tags: [NET framework,Nhibernate]
categories: [NET framework,Nhibernate]
---
One of the first improvement to the WCF logger is the ability to choose the list of logger to monitor during registration. A real application can generate tons of logs, suppose you are interested only in looking at the NHibernate generated query. The solution is to add another registration method and internally use an object that keeps care of the registration and senting log progress. Here is the new interface

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[ServiceContract(SessionMode = SessionMode.Required, CallbackContract = typeof(IL4NClient))]
public interface IL4NServer
{
    [OperationContract]
    Boolean Register();

    [OperationContract]
    Boolean RegisterForSpecificLogger(params String[] loggerNameList);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now I can choose the name of the logger I'm interested to filter messages log.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image2.png)

But this is not the only improvement I need. Quite often it happens that developer X called you telling â€œWhen I press the button Y the application responds after 20 secondsâ€, then you see with the SQL profiler that tons of query gets issued to the database. For a layered and complex application it can be difficult to understand where that queries are issued in the code, so I need a way to get a valid stack trace from the logger. To accomplish this task I modified the LogMessage object

{{< highlight sql "linenos=table,linenostart=1" >}}
[DataContract]
public class LogMessage
{
    [DataMember]
    public String Message { get; set; }

    [DataMember]
    public List<StackStep>  StackSteps { get; set; }

    public LogMessage()
    {
        StackSteps = new List<StackStep>();
        StackTrace trace = new StackTrace(true);
        var interestingFrames = from StackFrame frame in trace.GetFrames()
                                where frame.GetMethod().DeclaringType.Assembly.GetName().Name != "LiveLogger4Log4Net"
                                      && frame.GetMethod().DeclaringType.Assembly.GetName().Name != "log4net"
                                                && frame.GetFileLineNumber() != 0
                                select new StackStep()
                                           {
                                               SourceFile = frame.GetFileName(),
                                               LineNumber = frame.GetFileLineNumber()
                                           };
        StackSteps.AddRange(interestingFrames);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

First I have inserted in the message a list of stacksteps, a class that contains filename and line number, in the constructor of the message I use the StackTrace.NET class to obtain the stack trace, then I do a linq query to remove all the steps that have no source file or are part of my logging system. The result is really interesting.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image3.png)

Not only I'm able to intercept NHibernate generated SQL, but I have a full stack trace that tells me where the query is generated, now the next step is to build a better client interface to present the result in a more usable and readable form.

alk.

Tags: [log4net](http://technorati.com/tag/log4net) [NHibernate](http://technorati.com/tag/NHibernate)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/06/improving-the-wcf-logger/';</script><script type="text/javascript">var dzone_title = 'Improving the WCF logger';</script><script type="text/javascript">var dzone_blurb = 'Improving the WCF logger';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/06/improving-the-wcf-logger/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/06/improving-the-wcf-logger/)
