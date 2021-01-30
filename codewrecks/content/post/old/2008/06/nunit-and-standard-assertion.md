---
title: "Nunit and standard assertion"
description: ""
date: 2008-06-03T04:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
If you use Nunit and use standard System.Diagnostics.Debug.Assert in your code, you can get tired of the messagebox that is raised when a standard assertion fail. To avoid this, you can use app.config to completely remove all listener during the test.

{{< highlight xml "linenos=table,linenostart=1" >}}
    <system.diagnostics>
         <trace autoflush="false" indentsize="4">
             <listeners>
                 <clear/>
             </listeners>
         </trace>
     </system.diagnostics>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This solves the problem, now you can launch nunit interface, run the test and get rid of the annoying messagebox that gets displayed when a standard assertion fail. If you do not want to use app.config, you can still create a base test class, and clear the listeners in the fixture setup.

{{< highlight xml "linenos=table,linenostart=1" >}}
readonly List<TraceListener> oldListener = new List<TraceListener>();
[TestFixtureSetUp]
public void FixtureSetup() {
    foreach (TraceListener listener in Trace.Listeners)
        oldListener.Add(listener);
    Trace.Listeners.Clear();
}
[TestFixtureTearDown]
public void FixtureTearDown()
{
    Trace.Listeners.AddRange(oldListener.ToArray());
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this code you get the same effect, except that now you can disable listeners per test instead of disabling for entire test suite.

This technique has a drawback, in this way you completely disable standard assertions, but I like that my tests fail even if a standard assertion fails, and it is good to make possible for me to choose if in a test I want that standard assertion make my test fail or not. A quick and dirty solution is the following

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class NunitTraceListener : TraceListener
{
    public override void Fail(string message)
    {
        NUnit.Framework.Assert.Fail("StandardAssertionFailed: " + message);
    }

    public override void Fail(string message, string detailMessage)
    {
        NUnit.Framework.Assert.Fail("StandardAssertionFailed: " + message);
    }
    public override void Write(string message)
    {
        Console.Write(message);
    }

    public override void WriteLine(string message) {
        Console.WriteLine(message);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This class inherits from standard TraceListener, standard messages goes to the console (nunit is able to intercept them) and I override the two *Fail()* method that are called when some assert is failing. In my fail routines I simply make a standard fail assertion of nunit framework, this makes my test fail. The only thing you need to do is to set this listener in the trace.listeners collection

{{< highlight xml "linenos=table,linenostart=1" >}}
readonly List<TraceListener> oldListener = new List<TraceListener>();
[TestFixtureSetUp]
public void FixtureSetup()
{
    foreach (TraceListener listener in Trace.Listeners)
        oldListener.Add(listener);
    Trace.Listeners.Clear();
    Trace.Listeners.Add(new NunitTraceListener());
}
[TestFixtureTearDown]
public void FixtureTearDown()
{
    Trace.Listeners.Clear();
    Trace.Listeners.AddRange(oldListener.ToArray());
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

alk.

Tags: [nunit](http://technorati.com/tag/nunit) [TraceListener](http://technorati.com/tag/TraceListener)

<!--dotnetkickit-->

<script type="text/javascript"><!--
digg_bodytext = 'If you use Nunit and use standard System.Diagnostics.Debug.Assert in your code, you can get tired of the messagebox that is raised when a standard assertion fail. To avoid this, you can use app.config to completely remove all listener during the test.';
digg_skin = 'compact';
//--></script>  
<script src="http://digg.com/tools/diggthis.js" type="text/javascript"></script>
