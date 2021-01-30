---
title: "Role playing games resources that grow with time"
description: ""
date: 2011-09-05T07:00:37+02:00
draft: false
tags: [DDD]
categories: [Domain Driven Design]
---
In a typical online web browser role playing game, usually players has â€œresourcesâ€, that are needed to create building, weapon etc etc, and those resources are timed based. In the domain the concepts is something like â€œthe player earn X energy each secondâ€.

![](http://www.thinkgeek.com/images/products/zoom/mana_energy_potion_sixpack.jpg)

This is a typical situation in a role playing web game and if you try to implement logic at database level you can find a lot of problems. First of all, suppose you have some stored procedure or data related logic to load the correct value of the â€œenergyâ€ (you can store amount and a time and calculate the right value doing a diff with the current value). When you load data you could not store the value in cache, because it get staled quite immediately and can lead to incorrect behavior. You can implement some logic to keep cache data updated, but the whole problem is that logic gets scattered all over the program. The real problem is that you have the risk of not knowing exactly where the logic of â€œtime growing resourceâ€ is effectively handled in your code.

Solving this problem in a DDD approach is somewhat simpler, because you can create an object that implement the logic of an â€œamount that increase with timeâ€, and use to represent â€œenergyâ€, â€œmanaâ€ or every other resource that uses that logic.

You can start with this assumption for the model: quantity of a resource can be used in the game to do some actions based on value and there is no logic to apply when the value reaches some value. I mean, there is no rule in the domain that states

*when the resource X reach value Y, the action Z will be triggered*

If this assumption is valid, we are interested to know the real value of the resource only when we ask the object for its value. You can begin writing the test for the logic

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void Verify_increase_level_with_one_minute()
{
DateTime dt = new DateTime(2010, 1, 1, 12, 00, 00);
DisposeAtTheEndOfTest(DateTimeService.OverrideTimeGenerator(() => dt));
TimeGrowingResource sut = CreateBasicSut(10);
dt = dt.AddSeconds(60);
sut.Quantity.Should().Be.EqualTo(600);
}
{{< / highlight >}}

What Iâ€™m testing here is that, creating a new empty TimeGrowingResource that increase its value 10 units each second, after 60 seconds the Quantity should be equal to 600. A possible implementation could be.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Int64 Quantity
{
get
{
UpdateQuantity();
return _quantity;
}
}
 
private void UpdateQuantity()
{
var oldTimestamp = LastReadTimestamp;
LastReadTimestamp = DateTimeService.Now;
var increment = LastReadTimestamp.Subtract(oldTimestamp).TotalSeconds;
_quantity += (Int64) (IncrementQuantity * increment);
}
 
private Int64 _quantity;
 
private DateTime LastReadTimestamp { get; set; }
{{< / highlight >}}

This is a really simple implementation: each time we ask for the quantity, the object will update the value and memorize the instant value and the timestamp. Each time someone asks for property, all that the object needs to do is update the quantity and the game is done.

As you can see, solving the problem of the time growing resource is really simple using OOP principle instead of starting to model stuff with data.

Gian Maria.
