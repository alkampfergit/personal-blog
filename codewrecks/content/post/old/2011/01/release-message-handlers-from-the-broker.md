---
title: "Release Message handlers from the Broker"
description: ""
date: 2011-01-20T14:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
Some time ago I blogged about a [primitive Broker class](http://www.codewrecks.com/blog/index.php/2010/07/26/primitive-broker-class/) to manage messaging between View Models in a simple custom MVVM infrastructure. Since my Broker basically accepts delegates and manage calling them with the right message, it is quite important for ViewModels to remove all registered handler. This is especially important because Broker is a singleton, and if some ViewModel forgets to unregister some messages, the Broker will keep reference to member functions, thus keeping the ViewModel alive forever.

To manage this problem in a single place, Iâ€™ve done a little modification to the IBrocker interface

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image9.png)

 ***Figure 1***: *The new interface for the IBroker*

The only modification to the base Broker is the presence of another version of the RegisterForMessage method, and the UnRegisterAll() method.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image10.png)

 ***Figure 2***: *The new RegisterForMessage() method and corresponding UnRegisterAll*

Now we can register for message specifying the action that has to be called and a *token* that can be used to ask to broker to unregister all message handler registered with that token.

Thanks to those new methods I can write an helper method on the BaseViewModel class to register for messages

{{< highlight csharp "linenos=table,linenostart=1" >}}
public virtual void Dispose(Boolean isDisposing)
{
if (isDisposing)
{
Broker.UnRegisterAll(this);
}
}
 
protected void RegisterListenerOnBroker<T>(Action<Message<T>> dispatchMessage)
{
Broker.RegisterForMessage(dispatchMessage, this);
}
{{< / highlight >}}

BaseViewModel is IDisposable, and during dispose it unregister all handler from the Broker, using * **this** *as token, thus freeing all the reference to this specific ViewModel. With this simple modification Iâ€™m sure that whenever a ViewModel is disposed all reference to it from the Broker are removed and I do not relay on people that will write the ViewModel to remember to unregister message handlers from Broker.

Since I use castle, I only need to remember to release the view when it will be closed. I have a navigator class that actually manage Views

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void ShowViewXXX()
{
XXX view = IoC.Resolve<XXX>();
ShowAPrincipalView(view);
}
{{< / highlight >}}

When the navigator determines that a new View should be showed to the user, it simply resolve the View (all view are transient) with the IoC engine and then calls a method to show that specific view.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void ShowAPrincipalView(Window view)
{
_principalViews.Add(view);
view.Closed += ViewClosed;
view.Show();
}
{{< / highlight >}}

as you can see the code that actually shows a view simply add it to a list of all opened views, and add an handler to the Closed event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
void ViewClosed(object sender, EventArgs e)
{
Window w = (Window)sender;
if (_principalViews.Contains(w))
{
_principalViews.Remove(w);
}
w.Closed -= ViewClosed;
IoC.Release(w);
}
{{< / highlight >}}

The handler of the Closed event simply remove the View from the list of active views, remove the handler for the Closed event and tells the IoC engine to release the view, thus releasing and calling dispose even on transient dependent object, this makes castle to call Dispose on related ViewModel, and everything is released correctly.

alk.
