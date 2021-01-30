---
title: "Advantage of DDD approach to problem"
description: ""
date: 2011-11-08T18:00:37+02:00
draft: false
tags: [DDD,Unit Testing]
categories: [Domain Driven Design]
---
If you read my [last post](http://www.codewrecks.com/blog/index.php/2011/11/07/traffic-light-experiment/), I explain how I solved a really stupid problem of managing a Traffic Light using OOP principles and the concept of Domain Events, now I want to emphasize some of the advantages you have using this approach.

One benefit is in unit testing, suppose you want to test that a traffic light in red state does not cancel the request of another Traffic Light that want to become green.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Fact]
public void verify_that_a_red_traffic_light_permits_other_to_become_green()
{
TrafficLight.TrafficLight sut = TrafficLightFactory
.WithStatus(LightColor.Red.State())
.Create();
MayITurnGreen msg = new MayITurnGreen();
sut.MayITurnGreen(msg);
_domainEvent.Should().Be.Null();
msg.Cancelled.Should().Be.False();
}
{{< / highlight >}}

This test is really simple, thanks to a simple factory, I’m able to create a traffic light in red state, then create a MayITurnGreen message and pass to the MayITurnGreen() method of TrafficLight. The test is really simple, but I want to emphasize the assertions.

I’m inheriting this test class from a base test class that register itself for Domain Events and the last event is always stored in the \_domainEvent field of the test class. This permits to assert not only that msg.Cancelled is false (when a Traffic Light is in red status it should not prevent other Traffic Light to become green), but I’m able to assert also that no Domain Event were raised during this request.

This kind of testing is really important, because since Domain Events capture important events occurred in the past, being able to assert on them means that you are able to assert on every important event that happened to the domain during the test (this is really powerful). Let’s see another test

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Fact]
public void verify_that_a_green_traffic_light_after_ten_seconds_prohibit_to_become_green_but_becomes_yellow()
{
TrafficLight.TrafficLight sut = TrafficLightFactory
.WithStatus(LightColor.Green.State())
.Create();
MayITurnGreen msg = new MayITurnGreen();
AddSecondsToTestTime(15);
sut.MayITurnGreen(msg);
_domainEvent.NewStatus.Should().Be.EqualTo(LightColor.YellowFixed);
msg.Cancelled.Should().Be.True();
}
{{< / highlight >}}

As you can see this test verify that, when 15 seconds are passed (this test is based on green time of 10 seconds) and someone ask to a Traffic Light in Green Status if it can become Green, it answers NO(cancelled == true), but also it become YellowFixed because 10 seconds are passed and it can become red to permit other Traffic Light to become green after yellow time will pass.

As you can see, the OOP and DDD approach can even simplify your tests.

Gian Maria.
