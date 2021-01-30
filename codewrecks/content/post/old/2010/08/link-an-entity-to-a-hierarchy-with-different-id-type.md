---
title: "Link an entity to a hierarchy with different Id type"
description: ""
date: 2010-08-02T15:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
In a [thread](http://www.guisa.org/forums/t/247.aspx) of Guisa (Italian language), a user poses a question, he works with a legacy db, he has Foo and Bar entities with id of different type, one is string and another one is Integer. The two entities implements a common interface (IItemContent), and he want to be able to create an entity of type Item, that is connected to only one IItem content (a Foo or a Bar), but the caller should only see a property of type IITemContent, he should be able to set this property with an object of type Foo or Bar and being sure that the Item entity cannot be related to two entity, a Foo and a Bar at the same time.

This is a situation where you need to do some custom work in the Domain Model to accomplish this:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image.png)

Foo and Bar implements the IItemContent, and Item has a property called Foo that links to a Foo element and a Property of type Bar that links to a Bar Content, and it has a property of type Content that is of type ItemContent. Inside the Item class we can assure that the requirement are maintained.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public IItemContent Content
{
get { return (IItemContent)Bar ?? Foo; }
set {
Bar = value as Bar;
Foo = value as Foo;
}
}
 
protected Bar Bar { get; set; }
 
protected Foo Foo { get; set; }
{{< / highlight >}}

Foo and Bar properties are protected, so they are not visible from external code, but they can be set by nhibernate. The ContentProperty return Bar or Foo (whichever is not null) and when you set the content property the setter part assure that only one of the Foo or Bar property is set to a value, the other is null.

Now you can map with nhibernte Foo and Bar properties.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<class name="Item" table="Item" lazy="false">
<id name="Id" unsaved-value="0" type="System.Int32">
<generator class="native" />
</id>
 
<many-to-one name="Foo" />
<many-to-one name="Bar" />
 
</class>
{{< / highlight >}}

This is necessary because Foo and Bar has different id type, one is string and the other is Int32, but you can grant model coherence directly in the entity. With this model an Item is associated with only one IItemContent object, a Foo or a Bar.

This example shows how the Domain Model approach can present to the user a cleaner view of the data, even if you are forced to work with legacy db, designed with only the relational model in mind.

alk.
