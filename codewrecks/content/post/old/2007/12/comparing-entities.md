---
title: "Comparing Entities"
description: ""
date: 2007-12-07T07:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
This morning a friend of mine [post about testing for equality of two class](http://blogs.ugidotnet.org/AntonioGanci/archive/2007/12/07/90154.aspx). My opinion is that to test if we have the need to test if two entities has all or some property equals it is better not to override equals or modify the original entity. I’m collecting a series of helpers class I written over time for NUNIT and I’m now able to write simple test like this.

[Test]  
publicvoid  TestSimpleEquals()  {  
SimpleTwoProps  obja  =  newSimpleTwoProps(“test”,  15);  
SimpleTwoProps  objb  =  newSimpleTwoProps(“test”,  15);  
Assert.That(obja,  MyIs.AllPropertiesEqualTo(objb));  
}

Sometimes I need not to check that all properties are equal, but only a subset.

[Test]  
publicvoid  TestSimpleEqualsConditionedProperty2()  {  
SimpleThreeProps  obja  =  newSimpleThreeProps(“test”,  15,  “EQ”);  
SimpleThreeProps  objb  =  newSimpleThreeProps(“test”,  16,  “EQ”);  
Assert.That(obja,  MyIs.SomePropertiesEqualTo(objb,  “PropA”,  “ThirdProperty”));  
}

I really love fluent interfaces.

Alk.
