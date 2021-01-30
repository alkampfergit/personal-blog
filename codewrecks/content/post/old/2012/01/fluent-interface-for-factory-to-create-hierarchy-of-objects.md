---
title: "Fluent interface for factory to create hierarchy of objects"
description: ""
date: 2012-01-02T15:00:37+02:00
draft: false
tags: [DDD,OOP]
categories: [Domain Driven Design]
---
[Fluent interfaces](http://www.martinfowler.com/bliki/FluentInterface.html) are great for a various amount of situations because they permit to create a simple DSL using only the base capabilities of your language of choice. I like very much Fluent Interfaces especially to create [Factories](http://en.wikipedia.org/wiki/Factory_%28software_concept%29) to avoid messing with several constructors when your classes are complex to create.

<font size="3"><strong>The model</strong></font>

Suppose you want to create a fluent Factory for a * **Character** *abstract class that has two concrete classes called:  **Warriors** and  **Wizards,** with this model you want to create a Fluent Interface to create object. This is the Class Diagram

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image9.png)

 ***Figure 1***: *Class diagram for Warriors and Wizards*

Now I hear you screaming that I’ve just blogged about [Getter properties as an Antipattern](http://www.codewrecks.com/blog/index.php/2011/12/16/getters-are-an-antipattern/), but clearly there are a lot of situations where we can live happily with public getters, because we should not think that a “single technique fits all of my models” really exists, so I need to be aware that sometimes you can have public getter and sometimes even public setter and the purpose of a fluent factory class is to permit the creation of a class with a clear syntax and with full intellisense suggestions.

 **<font size="3">The problem</font>** If you want to create a Fluent interface, you should be aware that warrior and wizard have specific properties, like ArmorProtectionLevel for Warriors, that are not available to the other class, but a lot of properties are shared in the base class and are available to both of them.

To avoid duplication I want to be able to create a base fluent factory for base properties, then specialize a specific factory for each concrete class, specifying only the methods to fill specific properties of objects. In the end I want to be able to write this code.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image10.png)

 ***Figure 2***: *Code to create a warrior with fluent factory*

Since I want to be able to fully use the intellisense, the CharacterFactory for warrior should permit me to set only properties available to warriors.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image11.png)

 ***Figure 3***: *Intellisense suggests me both the WithArmorProtectionLEvel and the base class WithHealth methods.*

As you can see, the methods that intellisense is suggesting are [Extension Methods](http://msdn.microsoft.com/en-us/library/bb383977.aspx) and this is the *trick* that permits to easily create a factory that supports inheritance. In this situation the WithHealth factory method should be available to Wizard and Warriors (health is a property of the base class), but WithArmorProtectionLevel() should be available only for Warrior factories. Suppose to create a basic CharacterFactory class and two inherited factory class, do you see the problem?

Implementing the Health setter method in the base Character Factory class is not trivial because you really do not know the return type. If such a method method would return a CharacterFactory class you will lose all the methods for Warriors and Wizards properties. This makes inheritance not suitable to create a good implementation of factory classes for a hierarchy of objects.

A trivial and not-so-good solution is to delegate all factory methods to concrete WarriorFactory and WizardFactory,  with this solution the WithHealth() method will be implemented both in Warrior Factory and in Wizard Factory and each one can return the correct type. This will lead to a lot of duplicated code, because each concrete factory should be able to set all properties, and for complex hierarchy can be a mess to maintain.

<font size="3"><strong>The solution</strong></font>

The solution is using Extension Methods plus generics to make compile do all the magic for us, this is the code for the base factory for Character class

{{< highlight csharp "linenos=table,linenostart=1" >}}
 
public class CharacterFactory
{
private static Character _model = null;
 
public static WarriorFactory Warrior(String name)
{
var factory = new WarriorFactory();
factory._state.Set(() => _model.Name, name);
return factory;
}
 
public static WizardFactory Wizard(string name)
{
var factory = new WizardFactory();
factory._state.Set(() => _model.Name, name);
return factory;
}
 
internal State _state = new State();
}
{{< / highlight >}}

As you can see the factory actually has only static methods to generate the right factory for each concrete class. To set properties the base factory stores a static instance of a Character class called \_model, that is used to do static reflection when you need to set a property into the real state object of the class, stored in the \_state variable.

As you can see for WarriorFactory construction method, in the line 8 we construct a new WarriorFactory, in line 9 the factory sets the name of the character using static reflection in the state object of the concrete factory and finally the real factory is returned.

Now the problem is, where is the WithHealth() method to set the Health of a generic Charatcer? To solve the aforementioned problem you should implement all the factory methods that logically belongs to base class with generic Extension Methods.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static class CharacterFactoryMethods
{
private static Character _model = null;
public static T WithHealth<T>(this T fluent, Int32 healthValue) where T : CharacterFactory
{
fluent._state.Set(() => _model.Health, healthValue);
return fluent;
}
}
{{< / highlight >}}

The trick is to define this extension method generic on type T, then restrict T to be a class that inherit from *CharacterFactory* and return a value of type T. With this code, if you create a WarriorFactory (that inherits from CharacterFactory) the compiler permits you to call this extension method binding the type T to WarriorFactory; this means that when you call WithHealth on WarriorFactory it will return a WarriorFactory, but when you call on a WizardFactory it will return a WizardFactory, so the chaining is not broken. Now I can write this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Warrior warrior2 = CharacterFactory.Warrior("Frodo")
.WithHealth(50)
.WithArmorProtectionLevel(5)
.Create();
{{< / highlight >}}

If you look closely to the order of method call, you can see that you first call the  **WithHealth** method that logically belongs to the base CharacterFactory class, but then you are still able to call specific WarriorFactory methods, with full intellisense support.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image12.png)

 ***Figure 4***: *Even after the call of a method of the factory for base class, I’m still able to call warrior specific methods.*

Now if you are curious how is implemented the specific WarriorFactory class here is the code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class WarriorFactory : CharacterFactory
{
private static Warrior _model = null;
 
public Warrior Create()
{
return new Warrior(_state);
}
}
 
public static class WarriorFactoryMethods
{
private static Warrior _model = null;
public static T WithArmorProtectionLevel<T>(this T fluent, Int32 armorProtectionlevel) where T : WarriorFactory
{
fluent._state.Set(() => _model.ArmorProtectionLevel, armorProtectionlevel);
return fluent;
}
}
{{< / highlight >}}

The real class contains only the Create() method, that is responsible to create the object passing the \_state object with all the properties populated by factory method calls, then the WithArmorProtectionLevel is implemented as extension method of a generic T class with T : WarriorFactory restriction. This is the same trick used with the base factory class and now you are able to create efficient factories for hierarchy of objects with little code.

Here is the class diagram of the three factories

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image_thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/12/image13.png)

And that’s all folks.

Gian Maria.
