---
title: "Traffic Light Experiment"
description: ""
date: 2011-11-07T17:00:37+02:00
draft: false
tags: [DDD,OOP]
categories: [Domain Driven Design]
---
Suppose you need to implement a traffic light manager for a crossroad and you decide to approach with a DDD style to experiment some patterns and techniques. Going with DDD-Like approach in such a simple scenario is probably not the best idea, but the aim of this little experiment is trying to approach a problem trying to follow “object thinking”.

A classic approach to this problem usually produces a  TrafficLight class with a bunch of properties and probably a CrossRoad or TrafficLightManager class with all the logic, that basically read the status of Traffic Lights elaborates these data and change the status accordingly.

A more OOP approach will *encapsulate* the state of the TrafficLight, *protecting the internal status from direct manipulation by the outside world* and all communication is handled by [DomainEvents](http://www.udidahan.com/2009/06/14/domain-events-salvation/). I’ve found that the best way to approach a problem with “Object Thinking” is trying to impersonate an Object of your domain, understand what are * **my tasks** *and think to * **what I need to communicate to the external world** *. This example took me little time to write and it is only an experiment, but I think that I’ve learned something from it.

Actually in this super trivial example I’ve found a couple of Domain Events.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image1.png)

One aspect I do not like of these two events, is that they have a direct reference to the TrafficLight object that raised the event, but I’ll have time to refactor in the future, for now I’m interested only in having a very first embrional working prototype.

After I understood that these two are the only interesting information that the domain communicatese with outside world I need to create the Domain, so I started with this thought: “If I would be a Traffic Light, what task should I accomplish?”, the answer is basically: “you should manage change of the light based on passing time and * **coordinating with other TrafficLight** *". Now, as a Traffic Light, I can simplify all the logic behind synchronization with some simple assumptions.

- If I’m Red, I need to ask other Traffic Light if I can become Green (because Green is good :))
- If I’m Green I want to stay green for at least X seconds.
- The transition from Green to Red is not immediate, I should show yellow for Y seconds.

These are probably the only real business rules behind this domain, then we have some minor rules for the initialization of the system

- a Traffic Light start with a yellow blinking light (to signal caution, because there is a crossroad)
- when all the traffic lights are yellow blinking, you need to start normal behavior, first of all, all traffic lights should become Yellow Fixed (so people  understand that the TL is going to red), then all TL go to RED for a moment (to maximize security, stop the entire crossroad traffic), then one of the TL becomes GREEN and everything starts.

These three points are much more simpler rules because they are used only to initialize the system, and there is no big logic in them. The first rule states that *I need to ask other TL if I can become Green*, this means that I need some form of channel to permits object communication, so I created the static class CommunicationBus (really similar in code to the DomainEvents dispatcher class).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image2.png)

This is the Class Diagram of the two Aggregate Roots that I’ve in this domain.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/11/image3.png)

All properties have private setter, because no one is allowed to change the status from the outside. To easy the testing and to simply the concept of time that passes, I’ve created a Tick method in the CrossRoad to signal the time that passes from the outside world. The logic behind the tick function is really trivial.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void Tick()
{
DateTime now = DateTimeService.Now;
foreach (TrafficLight trafficLight in TrafficLights)
{
trafficLight.TimeSpanElapsed(now);
}
}
{{< / highlight >}}

The CrossRoad simply call the TimeSpanElapsed of the single TrafficLight. With a simple state pattern, it is possible to simply as a minimum the code you write to implement business logic. Here is the code for the RedStatus

{{< highlight csharp "linenos=table,linenostart=1" >}}
public override void Tick(DateTime timestamp, TrafficLight trafficLight)
{
var mayITurnGreen = new MayITurnGreen(trafficLight);
CommunicationBus.Raise(this, mayITurnGreen);
if (!mayITurnGreen.Cancelled)
{
trafficLight.ChangeState(GreenState.Instance);
}
}
{{< / highlight >}}

The code is really trivial, it simply ask to the communication bus MayITurnGreen, and if there is no cancellation I can change status to Green, but how is implemented the Green Status?

{{< highlight csharp "linenos=table,linenostart=1" >}}
 
public override void Tick(DateTime timestamp, TrafficLight trafficLight)
{
//a green traffic light does not want to change its status
}
 
public override void HandleMessage(DateTime timestamp, TrafficLight trafficLight, MayITurnGreen mayITurnGreenMessage)
{
if (base.SecondsElapsed(timestamp, trafficLight) > 30)
{
//ok this trafficlight is now ready to become red.
trafficLight.ChangeState(YellowFixedState.Instance);
}
mayITurnGreenMessage.Cancel();
}
{{< / highlight >}}

Super Trivial code, it does nothing on the Tick method because a Green Traffic Light want to remain Green, while in the HandleMessage that manages the MayITurnGreen message, if more than 30 seconds passed, traffic light can become Yellow, but the other Traffic Light is always prevented to become green.

DomainEvents and Object Thinking seems to produce more code, but in the end the code devoted to business logic is really reduced to minimum possible and is well encapsulated in the object that really should perform that logic.

In subsequent post I’ll show other little pieces of this super simple example to show the benefit of this kind of approach.

Gian Maria.
