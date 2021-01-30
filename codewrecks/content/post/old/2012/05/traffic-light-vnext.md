---
title: "Traffic light vNext"
description: ""
date: 2012-05-07T15:00:37+02:00
draft: false
tags: [DDD]
categories: [Software Architecture,Testing]
---
- [TrafficLight Experiment.](http://www.codewrecks.com/blog/index.php/2011/11/07/traffic-light-experiment/)
- [Advantage of DDD approach to the problem](http://www.codewrecks.com/blog/index.php/2011/11/08/advantage-of-ddd-approach-to-problem/)
- [Traffic Light, say goodbye to public properties](http://www.codewrecks.com/blog/index.php/2012/01/30/traffic-light-say-goodbye-to-public-properties/)

It is a long time I did not post about simple  **Traffic Light experiment**. I’ve ended with a super simple Domain with no Getters and no Setters, but there is still something I really do not like about that sample and it is represented by this test.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Fact]
public void When_both_semaphore_are_red_one_become_green()
{

    //move all to yellow fixed
    using (DateTimeService.OverrideTimeGenerator(DateTime.Now.AddSeconds(1)))
    {
        sut.Tick();
    }
    _domainEvents.Clear();
    //now move again to both red
    using (DateTimeService.OverrideTimeGenerator(DateTime.Now.AddSeconds(10)))
    {
        sut.Tick();
    }
    _domainEvents.Should().Have.Count.EqualTo(2);
    _domainEvents.All(e => e.NewStatus == LightColor.Red).Should().Be.True();
    _domainEvents.Clear();
    using (DateTimeService.OverrideTimeGenerator(DateTime.Now.AddSeconds(1)))
    {
        sut.Tick();
    }
    //only one semaphore should be go to green state
    _domainEvents.Should().Have.Count.EqualTo(1);
    _domainEvents[0].NewStatus.Should().Be.EqualTo(LightColor.Green);
}

{{< / highlight >}}

This test is quite ugly and it requires some initialization code, contained in the constructor of the test class.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public TwoTrafficLightFixture()
{
    DomainEvents.ClearAllRegistration();
    CommunicationBus.ClearAllRegistration();

    DomainEvents.Register<ChangedLightStatus>(this, e => _domainEvents.Add(e));
    sut = CrossRoadFactory.For(2.Roads()).Create();
    sut.Start();
}

{{< / highlight >}}

The bad part about this code is that I want to test this situation: *when both traffic light are in red state, only one of them can become green after a given amount of time passed*. The awful part about this test is how I setup the fixture; to bring both the Traffic Light in the Red state, I need to create the CrossRoadFactory in the constructor of the test (this is because all tests share this common initialization), then I need to call Tick() several time simulating passing time and moving the system from the initial status to the status that represents the fixture (both light red).

This test is simply wrong, because if if fails you cannot tell if the failure is caused by the initialization code or the real part of the domain logic you want to test, because  **I’m actually exercising the SUT until it reach the status I want to test with my unit test** and this can cause a failure in the Fixture. This is done because if the Traffic Light has no public properties and it is not possible to manipulate the status directly in the test.

To simplify the test I need a way to change the status of a Traffic Light, so I can simply fixture creation and the obvious solution is to use [Event Sourcing](http://codebetter.com/gregyoung/2010/02/20/why-use-event-sourcing/). I do not want to evolve the Traffic Light to a full Event Sourcing enabled domain, but I wish to verify if  **having the ability to reconstruct the state of a Domain Object from domain events he raised in the past can solve my test smell**. I decided to add a constructor on the TrafficLight domain class that permits to create an instance from a sequence of Domain Events.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public TrafficLight(params BaseEvent[] eventStream)
{
    ActualState = YellowBlinkingState.Instance();
    CommunicationBus.Register<MayITurnGreen>(this, MayITurnGreen);
    Load(eventStream);
}

public void Load(params BaseEvent[] eventStream)
{
    foreach (var eventInstance in eventStream)
    {
        HandleChangedLightStatus(eventInstance as ChangedLightStatus);
    }
}

{{< / highlight >}}

This is really primitive, it is really far from being a real entity based on Event Sourcing, but the key concept is,  **I want to be able to reconstruct the private state of an entity simply passing a series of domain events that he raised in the past.** Now the previous test can be modified to make it really simpler:

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Fact]
public void When_both_semaphore_are_red_one_become_green()
{

    TrafficLight first = new TrafficLight(new ChangedLightStatus(LightColor.Red, null));
    TrafficLight second = new TrafficLight(new ChangedLightStatus(LightColor.Red, null));
    CrossRoad theSut = new CrossRoad(
        new TrafficLightCreated(first),
        new TrafficLightCreated(second));

    using (DateTimeService.OverrideTimeGenerator(DateTime.Now.AddSeconds(1)))
    {
        theSut.Tick();
    }

    //only one semaphore should be go to green state
    _domainEvents.Should().Have.Count.EqualTo(1);
    _domainEvents[0].NewStatus.Should().Be.EqualTo(LightColor.Green);
}

{{< / highlight >}}

Now I’m able to create two traffic light passing a ChangedLightStatus event that bring the Traffic Light to the status requested by the fixture, then I can create the CrossRoad class passing two TrafficLightCreated domain events and this is all the code I need to setup the fixture of my test. Now I can simulate that one second is passed, call Tick() function on the CrossRoad and  **verify that only one Domain Event is raised** ,  **because only one Traffic Light Should have changed the value of the light from Red to Green**.

Even with this super simple example you can understand that  **Event Sourcing simplify your tests** , because they give you the ability to recreate a specific state of the domain under test from a stream of Domain Events.

Gian Maria.
