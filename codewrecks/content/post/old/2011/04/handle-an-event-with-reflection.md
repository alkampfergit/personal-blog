---
title: "Handle an event with reflection"
description: ""
date: 2011-04-22T12:00:37+02:00
draft: false
tags: [C]
categories: [General]
---
Scenario: You have a generic event handler function

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void GenericHandler(object sender, EventArgs e)
{
MessageBox.Show("TEST");
}
{{< / highlight >}}

Now you have an object and a string representing a name of an event raised from that object and you want to call your GenericHandler whenever the object is raised. This is possible thanks to Contravariance.

Suppose you have a WebBrowserFlexible Wpf Control (it is actually a custom control capable of browsing using WebBrowser control or Gecko) that raise an DocumentCompleted event declared in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public event EventHandler<BrowserFlexibleDocumentCompletedEventArgs> DocumentCompleted
{{< / highlight >}}

You can try this code:

{{< highlight csharp "linenos=table,linenostart=1" >}}
Type handlerType = typeof(EventHandler<EventArgs>);
Delegate eh = Delegate.CreateDelegate(
handlerType,
this,
"GenericHandler",
true);
 
EventInfo ev = typeof (WebBrowserFlexible).GetEvent("DocumentCompleted");
ev.AddEventHandler(wbBrowser, eh);
{{< / highlight >}}

It uses the Delegate.CreateDelegate to create a delegate to the GenericHandler function, but when you call the AddEventHAndler (line 9 ) you got an exception (ArgumentException)

{{< highlight csharp "linenos=table,linenostart=1" >}}
Object of type 'System.EventHandler`1[System.EventArgs]' cannot be converted to type
'System.EventHandler`1[xxx.BrowserFlexibleDocumentCompletedEventArgs]'.
{{< / highlight >}}

This happens because the two types of delegates are different, my GenericHandler accepts an object and an EventArgs, while the real event has a much specialized Argument object. The solution is pretty simple, just avoid to use the CreateDelegate and the AddEventHandler.

{{< highlight csharp "linenos=table,linenostart=1" >}}
EventInfo ev = typeof (WebBrowserFlexible).GetEvent("DocumentCompleted");
MethodInfo handler = this.GetType()
.GetMethod("GenericHandler", BindingFlags.NonPublic | BindingFlags.Instance);
var eh = Delegate.CreateDelegate(ev.EventHandlerType, this, handler);
var minfo = ev.GetAddMethod();
minfo.Invoke(wbBrowser, new object[] { eh });
{{< / highlight >}}

The code is similar to the previous one, but it takes a different path, first of all we create the delegate using the EventInfo.EventHandlerType, passing the MethodInfo of the method that will handle the event. This permits me to create the right type of event handler, one that accepts a EventHandler&lt;BrowserFlexiblexxxEventArgs&gt;. Then instead of calling the AddEventHAndler() method of EventInfo I need to grab a reference to the AddMethod of the EventInfo and call it through reflection.

Now everything is ok, and Iâ€™m able to handle an event knowing only its name and using a generic handler function.

alk.
