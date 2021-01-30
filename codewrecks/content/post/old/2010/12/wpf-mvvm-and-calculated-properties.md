---
title: "WPF MVVM and calculated properties"
description: ""
date: 2010-12-03T12:00:37+02:00
draft: false
tags: [MVVM,WPF]
categories: [WPF]
---
Today I have to solve a situation like this one

I have a ViewModel, with a  property of type X, and has a property called BorderBrush that is calculated based on a property Rank of X class. Building such a property is straighforward, but I need to put some logic inside the Viewmodel to monitor when the Property Rank is changed on X class to notify the interface that the property BorderBrush (that depends on Rank property of X) is also changed.

Thanks to some base classes of my friend [Mauro](http://topics.it/), that make an idea raise in my mind, I decided to solve this situation with an helper that permits me to use Strongly Typed Syntax.

{{< highlight csharp "linenos=table,linenostart=1" >}}
PropertyLink.OnObject(this, _rilevazione)
.Link(p => p.Rank, s => s.BackGroundBrush)
.Link(p => p.UserEvaluation, s => s.BackGroundBrush)
.Link(p => p.UserEvaluation, s => s.BorderBrush);
{{< / highlight >}}

With the PropertyLink Iâ€™m able to express the fact that two object are related, and when certain property of object \_rilevazione changed, another object should raise a property changed. The first link tells my system that whenever the property Rank changed I need to raise a propertyChanged event by the current object telling that BackGroundBrush property is also changed.

To make this possible I created a new interface.

{{< highlight csharp "linenos=table,linenostart=1" >}}
interface ICanNotifyPropertyChanged : INotifyPropertyChanged
{
void OnPropertyChanged(String propertyName);
}
{{< / highlight >}}

This is needed to make possible from another object to tell ViewModel: â€œHey raise a property changed for property xâ€. The object that implement this is really simple

{{< highlight csharp "linenos=table,linenostart=1" >}}
internal class PropertyLinkMonitor<T, O>
where T : class, ICanNotifyPropertyChanged
where O : class, INotifyPropertyChanged
{
private WeakReference<O> Originator;
 
private WeakReference<T> Source;
 
public PropertyLinkMonitor(T source, O originator)
{
this.Source = new WeakReference<T>(source);
this.Originator = new WeakReference<O>(originator);
this.Originator.Target.PropertyChanged += HandlePropertyChanges;
}
{{< / highlight >}}

It keeps two weak reference for the originator of the event and the source of related events, and in the constructor simply handle the ProppertyChanged event for the originator event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private Dictionary<String, List<String>> links = new Dictionary<string, List<string>>();
 
private void HandlePropertyChanges(Object sender, PropertyChangedEventArgs e)
{
 
List<String> related;
if (links.TryGetValue(e.PropertyName, out related))
{
if (related != null)
{
if (Source.IsAlive)
{
T pinSourced = Source.Target;
foreach (var relatedProperty in related)
{
pinSourced.OnPropertyChanged(relatedProperty);
}
}
}
}
}
{{< / highlight >}}

The HandlePropertyChanged simply looks into a internal dictionary if the property of the originator has some links, and for each linked property it tells the source object to raise the corresponding related property. The link Function is where everything takes place, thanks to a little bit of ExpressionTree knowledge.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public PropertyLinkMonitor<T, O> Link<TProperty1, TProperty2>(
Expression<Func<O, TProperty1>> propertySource,
Expression<Func<T, TProperty2>> propertyDest)
{
var propertyName = propertySource.GetMemberName();
if (!links.ContainsKey(propertyName))
{
links.Add(propertyName, new List<string>());
}
links[propertyName].Add(propertyDest.GetMemberName());
return this;
}
{{< / highlight >}}

The GetMemberName() extension method is this, and is taken from [Mauroâ€™s Radical](http://radical.codeplex.com/).

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static String GetMemberName<T, TProperty>( this Expression<Func<T, TProperty>> source )
{
var expression = source.Body as MemberExpression;
if( expression != null )
{
var member = expression.Member;
return member.Name;
}
 
throw new NotSupportedException( "Only MemberExpression(s) are supported." );
}
{{< / highlight >}}

Now I can use strongly typed syntax to express a link between properties of my View Models, with few lines of code.

alk.
