---
title: "Again on TimeGrowingResource"
description: ""
date: 2011-09-09T15:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
In the last post I explained how I resolved the problem of Time Growing Resources in my hypothetical role playing game. The advantage of using an OOP approach is that you can think without data in mind and you can identify * **entities** *that represents a single concept in a given * **BOUNDED CONTEXT** *an approach that leads to simpler code and models.

Suppose that we want to add other logic to the *TimeGrowingResource* class, first of all we want to be able to change the rate of growing, so we write this simple test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void Verify_change_increase_level()
{
DateTime dt = new DateTime(2010, 1, 1, 12, 00, 00);
DisposeAtTheEndOfTest(DateTimeService.OverrideTimeGenerator(() => dt));
TimeGrowingResource sut = CreateBasicSut(10);
dt = dt.AddSeconds(60);
//now the resource should have value 600
sut.ChangeIncrementValue(20);
dt = dt.AddSeconds(60);
//another 60 second passed, quantity should be 600 + 60 * 20
sut.Quantity.Should().Be.EqualTo(600 + 60 * 20);
}
{{< / highlight >}}

Even if you usually do not use full TDD approach, writing the test first helps me to understand how we want to use the new feature and at the same time states *how this new feature should behave*. With this test Iâ€™m telling this

 **Given** a resource that increase 10 units per second

 **and** after 60 seconds I change the increase level to 20 units per second

 **when** another 60 seconds passed

 **then** the quantity should be 1800

To implement this logic I can write the following method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Int64 ChangeIncrementValue(int newIncrementValue)
{
UpdateQuantity();
IncrementQuantity = newIncrementValue;
return _quantity;
}
{{< / highlight >}}

This is really simple code, I update the quantity so I have the real value at the current time, then I change the increment value and return the current value.

Then we have another feature to implement, since energy can be gained from other actions in the game, I want to be able to add an arbitrary quantity to the resource value. Here is the test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void Verify_adding_arbitrary_value_to_resource()
{
DateTime dt = new DateTime(2010, 1, 1, 12, 00, 00);
DisposeAtTheEndOfTest(DateTimeService.OverrideTimeGenerator(() => dt));
TimeGrowingResource sut = CreateBasicSut(10);
dt = dt.AddSeconds(60);
//now the resource should have value 600, I add 200
Int64 actual = sut.AddQuantity(200);
actual.Should().Be.EqualTo(800);
}
{{< / highlight >}}

Implementing this feature is really simple

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Int64 AddQuantity(int quantityToAdd){
_quantity += quantityToAdd;
return Quantity;
}
{{< / highlight >}}

I can add directly to the snapshot field, then return the updated quantity.

Where is the advantage of OOP against a typical * **database first** *approach? This logic is quite simple and there are no difficulties on implementing it at database level, but working with OOP first of all simplify your tests, because no database is needed  to test the logic you write. Another advantage is that this object can be reused in all * **BOUNDED CONTEXT** *where the concept of *resources that grows with time* is valid and is well encapsulated, so the user cannot broke internal logic in any way.

Gian Maria.
