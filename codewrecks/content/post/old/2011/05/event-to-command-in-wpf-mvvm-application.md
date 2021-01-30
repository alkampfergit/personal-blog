---
title: "Event to Command in WPF MVVM application"
description: ""
date: 2011-05-04T08:00:37+02:00
draft: false
tags: [MVVM,WPF]
categories: [WPF]
---
I needed a simple way to obtain this simple result: whenever a certain component in the UI (a WebBrowser control) raises some specific event, I want a command in the VM to be executed, without the need to specify any command parameter. The only requirement I want is avoiding a single line of code in the UI :) because, having no code in the UI is one of the main benefit of the MVVM model.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image15.png)

To keep everything simple I want a simple syntax that permits me to specify that when an event of type X is raised, a command of name Y should be called.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Controls:xxxWebBrowserManagerFlexible x:Name="wbBrowser" Margin="0,0,0,0"
BrowserType="InternetExplorer"
Links="{Binding LinksOfThePage}"
Behaviours:EventToCommandBehavior.Bind="DocumentCompleted-SignalDocumentComplete"
RawHtmlContent="{Binding FullHtmlContent, Mode=TwoWay}"
SelectedText="{Binding BrowserSelectedText, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
CurrentUrl="{Binding UrlToNavigate, Mode=TwoWay}" />
{{< / highlight >}}

As you can see I created a simple behavior called  **EventToCommandBehavior** that accepts a very simple syntax: a string of format *EvenName-CommandName.*This solution probably is not so elegant, it has no intellisense or designer support, but it works and it is supersimple. My Behavior has an Attached property called  **Bind** {{< highlight csharp "linenos=table,linenostart=1" >}}
public static readonly DependencyProperty BindProperty =
DependencyProperty.RegisterAttached
(
"Bind",
typeof(String),
typeof(EventToCommandBehavior),
new UIPropertyMetadata(String.Empty, OnBindChanged)
);
{{< / highlight >}}

All the dirty work is done inside the OnBindChanged.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static Dictionary<Object, String> _routes
= new Dictionary<object, String>();
 
private static void OnBindChanged(DependencyObject dpo, DependencyPropertyChangedEventArgs args)
{
if (String.IsNullOrWhiteSpace((String) args.NewValue)) return;
 
String[] bind = ((String) args.NewValue).Split('-');
 
EventInfo ev = dpo.GetType().GetEvent(bind[0]);
MethodInfo handler = typeof(EventToCommandBehavior)
.GetMethod("Handler", BindingFlags.NonPublic | BindingFlags.Static);
var eh = Delegate.CreateDelegate(ev.EventHandlerType, null, handler);
var minfo = ev.GetAddMethod();
minfo.Invoke(dpo, new object[] { eh });
//now go for the command.
_routes.Add(dpo, bind[1]);
}
{{< / highlight >}}

The core part is finding the EventInfo for choosen event, and [create dynamically an handler](http://www.codewrecks.com/blog/index.php/2011/04/22/handle-an-event-with-reflection/) capable to handle every event. The association between EventName and CommandName is stored inside a dictionary object, and the handler is really simple, just get a reference to the command with reflection and call the Execute method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static void Handler(Object sender, EventArgs e)
{
String commandName;
if (_routes.TryGetValue(sender, out commandName))
{
FrameworkElement fe = sender as FrameworkElement;
if (fe.DataContext != null)
{
PropertyInfo pinfo = fe.DataContext.GetType().GetProperty(commandName);
if (pinfo != null)
{
ICommand command = (ICommand) pinfo.GetValue(fe.DataContext, null);
if (command.CanExecute(null))
{
command.Execute(null);
}
}
}
}
}
{{< / highlight >}}

Since the View Model that contains the ICommand is the DataContext of the element that raised the event, I simply use the [GetProperty()](http://msdn.microsoft.com/en-us/library/3x3ss54h.aspx) method to find the right [ICommand](http://msdn.microsoft.com/en-us/library/ms616869.aspx), and finally call the Execute method to actually call the command. Since one of the prerequisites states that we need to pass no command parameters, I simply pass null to Execute method.

Alk.
