---
title: "Protect the status of your entities"
description: ""
date: 2011-10-20T06:00:37+02:00
draft: false
tags: [DDD]
categories: [Domain Driven Design]
---
Encapsulation is one of the key concept of [OOP](http://en.wikipedia.org/wiki/Object-oriented_programming), the status of an entity should be protected from external direct manipulation, state of an object can be changed only by the object itself so the object is always in  **Valid State.** One of the classic example is protecting property that contains collection of elements in.NET, like properties of type *ILIST&lt;T&gt;.*

Suppose that your * **Character** *entity has a property called Weapons of type *IList&lt;Weapon&gt;*, directly exposed to the outside world; this is the perfect example of broken encapsulation, because the entity has *no control over what it got added to that collection*. This will mean that this code is perfectly valid and compile

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void Oh_my_god_wizards_can_use_swords()
{
Wizard curumir = CharacterFactory.Wizard("Curumir")
.AddAvailableSpell(new Spell())
.WithHealth(10)
.Create();
curumir.Weapons.Add(new Sword());
}
{{< / highlight >}}

This violates a *domain rule*  because a *sword is not a permitted weapon for a wizard character*. This trivial example show the risks of not applying a good encapsulation of the state of your domain entity. The really wrong aspect of this kind of design, is that you should enforce the application of Domain Rules outside the object itself, in this specific situation, whenever some code should add a  **Weapon** to a  **Character** it should check if this is valid assignment. The usual symptom of this problem is that you have Domain Logic scattered around the world.

The solution to this problem is quite simple, first of all the *Weapons*property should be exposed as IEnumerable&lt;T&gt;, then you can add a couple of methods:  **AddWeapon()** and  **RemoveWeapon()** to implement the two Domain Operation of adding and removing a weapon to a  **Character**. Now the entity has the ability to check the weapon that got assigned and can validate all the Domain Rules. We are still really far from an optimal solution, but this is far better than giving to the outside full access to the collection.

Now lets change a little bit this example, suppose you have a different Domain where each Character is allowed to use only a single weapon. Now we can write this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
curumir.Weapon = new Weapon();
{{< / highlight >}}

Since you can can put logic inside the setter part of the property, you can enforce the invariant of the above code and maintaining encapsulation, so the above snippet looks like a perfect valid encapsulated object.

Putting logic inside the setter is not the best option, mainly because it has no return value, so we cannot understand if the assignment was successful or not. Throwing an exception is not an option, since exception should not be used to signal that a business rule was violated and if you need to catch an exception for each assignment to verify if some rule was violated…. your code soon becomes unreadable.

Another possible solution is: if the weapon assigned to the Character is not valid, it maintains the old weapon he has (or null if he previously had no weapon). This leads to this ugly snippet of code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var oldWeapon = curumir.Weapon;
curumir.Weapon = new Sword();
if (curumir.Weapon != oldWeapon)
{
//code to handle error here
}
{{< / highlight >}}

A possible solution is using * **[DOMAIN EVENTS](http://martinfowler.com/eaaDev/DomainEvent.html)** *, you can register for: *WeaponAssigned*and *WeaponAssignementRejected* events, assign the weapon and check the * **DOMAIN EVENT** *that was actually raised to verify the assignment outcome, or you can simply assign the weapon and let other handlers to take the appropriate action.

In the end using an explicit *AssignWeapon()* method is probably the best alternative, this method can return a Boolean telling us if the operation succeeded or not and we can listen to * **DOMAIN EVENTS** *only if we are really interested on the real outcome of the operation.

As an example, if the User drag a Weapon in the UI to a character, the UI can simple send a COMMAND  **AssignWeapon(charachterid, weapon)** to the Domain and got a Boolean that basically states if the command was executed or not. This boolean value permits the UI to react accordingly (as an example removing the weapon from the *unassigned weapon list*, and adding to the character graphical representation. You can use another handler that runs in the UI that is listening for the even  **WeaponAssignementRejected** that inform the user on the exact reason why the weapon was rejected. A really improved implementation have the  **AssignWeapon(charachterid, weapon)** returns void, so the UI call this method asynchronously, then you have a couple of Domain Events handlers, the first intercepts the *WeaponAssigned* domain event, and update the UI accordingly, the other intercepts the *WeaponAssignementRejected* and shows some detailed error message to the user. This second type of implementation follow the [CQS pattern](http://martinfowler.com/bliki/CommandQuerySeparation.html), where all method that can change the state of an object should not return value.

Another benefit of using an explicit method to change properties instead of a plain setter, is reducing interface complexity of the object. If you usually insert complex logic in property Setters, whenever you assign something to each property of a domain object, you should check for failure.

All these considerations lead to removing completely all setters from your domain objects, excepts for trivial properties like *CharachterBackground, Age, Name, etc.*The rule is: use a setter only if the property has no logic in it and it does not take part in any business rule. If you discover later than you need to apply a business rule on some property that actually has a setter, you should: remove the setter, add a ChangeAge() method and fix all compiler errors.

In the end, we can state that in a Domain Object property setter is an antipattern and should be avoided if possible.

Gian Maria.
