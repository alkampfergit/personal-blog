---
title: "Spring and AOP proxy lifecycle"
description: ""
date: 2007-07-03T07:00:37+02:00
draft: false
tags: [SpringNET]
categories: [SpringNET]
---
Spring.Net is a great library, with interesting capabilities for AOP. Here is some suggestion on how to handle lifecycle of proxyed object. Suppose you have a Order object with virtual methods and you want to add an aspect with spring.NET. Suppose also that you have created an interceptor, a possible spring configuration is the following

&lt;objectid=“OrderTarget“type=“Domain.Order,  Domain“singleton=“false“  /&gt;  
  
  &lt;objectid=“myOrderInterceptor“type=“AopSample.OrderAdvice,  AopSample“&gt;  
        &lt;propertyname=“AutomaticOrderMaxAmount“value=“1000“  /&gt;  
  &lt;/object&gt;  
  
  &lt;objectid=“Order“  
type=“Spring.Aop.Framework.ProxyFactoryObject,  Spring.Aop“&gt;  
      &lt;propertyname=“Target“ref=“OrderTarget“  /&gt;  
        &lt;propertyname=“interceptorNames“&gt;  
              &lt;list&gt;  
                    &lt;value&gt;myOrderInterceptor&lt;/value&gt;  
              &lt;/list&gt;  
        &lt;/property&gt;  
&lt;/object&gt;

You may be surprised by the fact that each time you get a reference to the Order object, even if the OrderTarget has *singleton=”false”*, the proxy point to the same instance of the Domain.Order object. This happens because ProxyFactoryObject wrap with a SingletonTargetSource the element when specified with the *Target* property. This is the correct behavior, since the Proxy itelf is a singleton. A different approach is using a PrototypeTargetSource, here is an example

&lt;objectid=“Order“  
type=“Spring.Aop.Framework.ProxyFactoryObject,  Spring.Aop“&gt;  
  
        &lt;propertyname=“targetSource“&gt;  
              &lt;objectid=“OrderTargetPrototype“  
type=“Spring.Aop.Target.PrototypeTargetSource,  Spring.Aop“&gt;  
                    &lt;propertyname=“targetObjectName“value=“OrderTarget“  /&gt;  
              &lt;/object&gt;  
        &lt;/property&gt;  
  
        &lt;propertyname=“interceptorNames“&gt;  
              &lt;list&gt;  
                    &lt;value&gt;myOrderInterceptor&lt;/value&gt;  
              &lt;/list&gt;  
        &lt;/property&gt;  
  &lt;/object&gt;

With this configuration the proxy will create a new instance of the Domain.Order object at each method invocation, since the PrototypeTargetSource rules the lifecycle of the proxied object. This configuration is not so useful, and moreover it is not so efficient because a full Order object is constructed for *each method call of the proxy.*More often you need a different behavior, most of the time you need that each time you ask for Order object, Spring.Net will return a different proxy with a new instance of the wrapped object. This is the most intuitive lifecycle, for object such an Order. The configuration to obtain such behavior is the following.

&lt;objectid=“Order“  
type=“Spring.Aop.Framework.ProxyFactoryObject,  Spring.Aop“&gt;  
  
        &lt;propertyname=“isSingleton“value=“false“/&gt;  
        &lt;propertyname=“TargetName“value=“OrderTarget“/&gt;  
        &lt;propertyname=“interceptorNames“&gt;  
              &lt;list&gt;  
                    &lt;value&gt;myOrderInterceptor&lt;/value&gt;  
              &lt;/list&gt;  
        &lt;/property&gt;  
  &lt;/object&gt;

When you set isSingleton property to false you are telling Spring.Net to create a different proxy each time you ask the context for a different object, at each proxy creation the TargetName property instructs the ProxyFactoryObject on the type of the object that is to be wrapped. With this third configuration the lifecycle of the Order object is ruled by the attribute *singleton* of the OrderTarget object, and surely it is the most intuitive one. These three configurations are the most common to work with AOP in Spring.NET.

Alk.
