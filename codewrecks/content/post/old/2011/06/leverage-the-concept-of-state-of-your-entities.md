---
title: "Leverage the concept of ldquostaterdquo of your entities"
description: ""
date: 2011-06-13T07:00:37+02:00
draft: false
tags: [Architecture,DDD,OOP]
categories: [Domain Driven Design]
---
One of the interesting ideas found in [Radical](http://radical.codeplex.com/) and other implementations of DDD architectures, is implementing properties of Domain objects in a slightly different way from the standard, using something like a dictionary to store values of properties. When we want to implement a property for a Domain class you usually end up with similar code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public String Property { get; set; }
 
private string _fieldBasedProperty;
public String FieldBasedProperty
{
get { return _fieldBasedProperty; }
set { _fieldBasedProperty = value; }
}
{{< / highlight >}}

Both of them use a private field to store the real value of the property, the first one is a compact form  (I to not like it for Domain object because it gives you no control on state changing of the object), the second one is the standard code to implement a property with a Backing field. Remember that in OOP an Object is a composition of Code and Data and having getter and setter for properties give use control on the * **state** *of the object. Both of the above implementations are based on this concept and are widely used in all projects.

But we could adopt another approach to enforce the concept of * **state** *of the object, making the concept of * **state** *emerge from the implementation. We start defining a State class.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image10.png)

This class is used to store values indexed by property names and will used to maintain the * **state** *of all entities. Thanks to this class we can define a *BaseEntity*class to implement some basic functionality that we want to share between all classes.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image11.png)

The most important methods are * **Get** *and * **Set** *methods, used by derived classes to manage change of state of the object. If you want to implement a simple property in a derived class, you will write this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
class Post : BaseEntity
{
public String Title
{
get { return Get(() => Title);}
set { Set(() => Title, value);}
}
}
{{< / highlight >}}

The syntax used is strongly typed, thanks to *static reflection*, and delegates to base class * **state** *management, in this simple example base class implements the INotifyPropertyChanged, but you can implement all the logic you want.

This approach is really interesting, because it does not prevent you from using any technique you use with the standard property and state management, but leverage the concept of * **state** *in a consistent way. With standard property implementation, state is scattered across various fields of an entity, an approach that is not really DDD oriented; using an explicit concept (and a specific class) to manage * **state** *leverage the concept of *encapsulation*in a more explicit way and can lead to interesting solutions.

Alk.

Tags: [DDD](http://technorati.com/tag/DDD)
