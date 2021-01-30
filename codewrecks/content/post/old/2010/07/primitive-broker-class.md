---
title: "Primitive broker class"
description: ""
date: 2010-07-26T14:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
I need in a simple project the ability to communicate various type of messages through different View Model in a WPF application, some VM raise some message about something that is happened in the system, and other VM can listen for messages and doing something with them.

I know that there are a lot of framework out of there, but sometimes you need a quick implementation that you can share with the team, without the need to tell to others â€œHey you need to master xxx framework for understanding what is happeningâ€. The result is a really 30 minutes implementation of a primitive broker. I want a central component where every View Model can register/unregister for a specific kind of a message, and send messages.

I decided to discriminate messages based on the type of data contained in the message, the message itself is a simple class with a message string and a payload.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image_thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image17.png)

View Models register for a specific kind of payload, as an example I want to be able of issue this code to register whenever someone send a message with a  payload of type List&lt;ActionLogViewModel&gt;.

{{< highlight csharp "linenos=table,linenostart=1" >}}
broker.RegisterForMessage<List<ActionLogViewModel>>(ReceiveLog);
{{< / highlight >}}

The result is this really simple class, that is based on delegate

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image_thumb18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image18.png)

It maintains internally a dictionary of registered action based on type of the payload

{{< highlight csharp "linenos=table,linenostart=1" >}}
private Dictionary<Type, List<Object>> _registeredActions =
new Dictionary<Type, List<Object>>();
{{< / highlight >}}

The RegisterForMessage&lt;T&gt; is really simple, because I simply need to save an Action&lt;Message&lt;T&gt;&gt; into the dictionary.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void RegisterForMessage<T>(Action<Message<T>> action)
{
List<Object> actions;
if (!_registeredActions.ContainsKey(typeof(T)))
{
actions = new List<Object>();
_registeredActions.Add(typeof(T), actions);
}
else
{
actions = _registeredActions[typeof(T)];
}
 
actions.Add(action);
}
{{< / highlight >}}

The send message is a very simple function too because it look for registered action in the internal dictionary, and executes them one after the other.

I know that this is really a too simple implementation for a serious brocker system, but for a  simple program, where my only need is to dispatch some messages between windows, it is enough. The main advantage of this approach, is that it is really simple to understand, and I can avoid to force other members of the team to learn new framework.

alk.
