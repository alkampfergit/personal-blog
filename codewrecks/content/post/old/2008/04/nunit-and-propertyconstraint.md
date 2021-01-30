---
title: "Nunit and PropertyConstraint"
description: ""
date: 2008-04-07T11:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
The PropertyConstraint of nunit is useful to assert some condition on a property of an object. This constraint permits to specify the Name of the property and then a constraint on his value. The only thing that miss is a better error message when the object does not contains the specified property. Suppose you write a wrong test like this

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void TestErrorMessages() {
   List<SimpleTwoProps> list = CreateTestList();
   Assert.That(list, new PropertyConstraint("PropB", new EqualConstraint(2)));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This test will fail because the List does not have PropB property, the error from nunit is.

> *Expected: Property "PropB" 2  
>   
> But was:  &lt;System.Collections.Generic.List`1[SimpleTwoProps]&gt;*

This sounds not so interesting to me, it could be better to modify the WriteActualValueTo

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public override void WriteActualValueTo(MessageWriter writer) {
   if (this.propertyExists) {
      writer.WriteActualValue(this.propValue);
   }
   else {
      writer.WriteActualValue(String.Format("The property {0} was not found on type {1}", name, base.actual.GetType()));
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this modification the error is much more clear

> Expected: Property "PropB" 2  
>   
>  But was:  "The property PropB was not found on type System.Collections.Generic.List`1[SimpleTwoProps]

This message is much more clear for me.

Alk.

Tags: [Nunit](http://technorati.com/tag/Nunit) [Testing](http://technorati.com/tag/Testing)
