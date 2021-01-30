---
title: "SyncronizationContextCurrent is not null still not be able to access UI Controls in WPF"
description: ""
date: 2012-10-29T21:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
As you probably already know,  **you can access WPF controls only from a UI Thread and when I use MVVM each PropertyChanged message check for the need to execute on the UiThread to avoid cross-thread problems**. Instead of using the Dispatcher in each property changed sometimes you can find code that does a little optimization like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}


if (SynchronizationContext.Current != null)
    SynchronizationContext.Current.Send(delegate { OnPropertyChanged(propertyName); }, null);

{{< / highlight >}}

The above code simply  **check if the Current synchronization Context is not null, if this condition is true, we are in a UI Thread** so we can simply raise the OnPropertyChanged event directly in this thread (with the [Send](http://msdn.microsoft.com/en-us/library/vstudio/system.threading.synchronizationcontext.send%28v=vs.100%29.aspx) method), because it is associated with a UI and we have no need to use the Dispatcher. The else branch was omitted, but actually is a simple use of a saved instance of the UI Dispatcher to raise the property changed event on the WPF ui thread.

After one year, I discovered that sometimes I still got some cross thread exception and if I check the stack trace of logs I verified that the thread that is generating this exception has SyncronizationContext.Current not null, so you start wondering why you still got exception if the code that is raising the PropertyChanged is belonging to the UI.

In this specific situation the source of the problem is due to WebBrowser control because you should know that a  **Wpf BrowserControl is a wrapper for the standard winform Browser control** , thus if you are in some callback of a WebBrowser control (es. DocumentCompleted) you are in a thread with SyncronizationContext.Current not null, but that specific SyncronizationContext cannot access WPF control because it is a Winform one, thus you still have a cross-thread exception.

 **The simplest solution is capturing a reference to the original SyncronizationContext.Current during startup of the program, and change the above check to verify also if the Current syncronization context is the very same of the startup of the software** {{< highlight csharp "linenos=table,linenostart=1" >}}


if (SynchronizationContext.Current != null && SynchronizationContext.Current == mainSyncContext)  
  SynchronizationContext.Current.Send(delegate { OnPropertyChanged(propertyName); }, null);

{{< / highlight >}}

In app.xaml.cs, during the startup of the program I grab a reference to the current synchronization context, I store a reference inside a static variable called mainSyncContext and this permits to check if we are in the main UI thread of WPF verifying that the current synchronization context is the very same I got during application startup. To understand what I’m telling you, here is a snapshot of what happens during the execution of the software

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image8.png)

 ***Figure 1***: *As you can see I have a current Synchronization context that is not the Wpf Dispatcher one*

As you can see in this specific situation  **I have SyncronizationContext.Current not null, but is not the same context I have at startup of the application.** Loking in the stack trace I verified that this code was called from the event handler of OnNavigated event of a WebBrowser control. From  **Figure1** you can also verify that mainSyncContext is of type [DispatcherSyncronizationContext](http://msdn.microsoft.com/en-us/library/system.windows.threading.dispatchersynchronizationcontext.aspx), (the context used in WPF applications) while the current Sync Context is a generic SynchronizationContext, thus confirming that I’m dealing with two different SynchronizationContext in the same application.

Alk.
