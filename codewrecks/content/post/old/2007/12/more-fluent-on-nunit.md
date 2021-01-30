---
title: "More fluent on Nunit"
description: ""
date: 2007-12-07T07:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
In the [previous post](http://www.nablasoft.com/Alkampfer/?p=122) I talked about nunit and fluent interface, I did some modification, now I can write

[Test]  
publicvoid  TestSimpleEqualsConditionedProperty3()  {  
SimpleThreeProps  obja  =  newSimpleThreeProps(“test”,  15,  “EQ”);  
SimpleThreeProps  objb  =  newSimpleThreeProps(“test”,  1,  “EQ”);  
Assert.That(obja,  MyIs.SomePropertiesEqualTo(objb,  “PropA”,  “ThirdProperty”)  
       .And.Property(“PropB”).GreaterThan(14));  
}

Now I can check for equality with a list of properties but added support to create constraint over the single property  using the basic property constraint of nunit.

Alk
