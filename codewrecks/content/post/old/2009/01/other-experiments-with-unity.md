---
title: "Other experiments with Unity"
description: ""
date: 2009-01-17T02:00:37+02:00
draft: false
tags: [NET framework,Frameworks]
categories: [NET framework,Frameworks]
---
Yesterday I give a look at unity, an Inversion Of Control container made by Microsoft, today I’m experimenting a little more to have more confidence with it.

An IoC container not only permits to resolve a concrete entity, but it also permits you to configure it. Here is how you can set a simple property on an object.

{{< highlight xml "linenos=table,linenostart=1" >}}
<type type="ITest" mapTo="TestB" name="OtherTest">
   <typeConfig extensionType="Microsoft.Practices.Unity.Configuration.TypeInjectionElement,
                      Microsoft.Practices.Unity.Configuration">

      <property name="Prop" propertyType="System.String">
         <value value="VAL" />
      </property>
   </typeConfig>
</type>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With typeConfig I can setup properties for my objects, now suppose that I have an array of string as property, you can use &lt;array&gt; tag for configuration.

{{< highlight xml "linenos=table,linenostart=1" >}}
<property name="Names" propertyType="System.String[]">
   <array>
      <value value="Alk" />
      <value value="Grd" />
   </array>
</property>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

with this configuration the container creates the array for me, I looked for configuration tag to insert List&lt;T&gt; or Dictionary&lt;Key, Value&gt; but I did not found any in the documentation, this is a litte annoying.

The property tag can be used to configure not only simple properties like string or int, but the real useful stuff is using them to resolve dependencies between objects. Let’s suppose that we have an ILogger interface and some object needs to do logging. Instead of creating a concrete instance of a logger inside that objec, I can define a property like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Dependency]
public ILogger Logger { get; set; }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Dependency attribute is used to instruct the Unity container to automatically resolve dependency for object. When the object gets constructed, unity scan the object for properties with this attribute, then it resolve the ILogger automatically. The annoying thing is that it does not seems to work if you configure the object through &lt;typeConfig&gt; tag. It seems that if you include a &lt;typeConfig&gt; the objectBuilder does not scan anymore your object for dependencyAttribute, so you are forced to define dependencies with attributes or in the config, but you cannot mix both of them. This is not a problem for me, because I do not like very much using attributes for IoC and I prefer to keep all configuration in one place, the xml file. Here is the configuration for the logger property

{{< highlight xml "linenos=table,linenostart=1" >}}
<type type="ITest" mapTo="TestB" name="OtherTest">
   <typeConfig extensionType="Microsoft.Practices.Unity.Configuration.TypeInjectionElement,
       Microsoft.Practices.Unity.Configuration" >
     ...
      <property name="Logger" propertyType="ILogger">
         <dependency />
      </property>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I simply use the  **&lt;dependency /&gt;** tag to instruct ObjectBuilder to take the default configured element for ILogger. The configuration above works because I have also registered some concrete Logger.

{{< highlight xml "linenos=table,linenostart=1" >}}
<type type="ILogger" mapTo="ConsoleLogger" name="">
   <lifetime type="singleton" />
</type>
<type type="ILogger" mapTo="SuperConsoleLogger" name="SuperLogger">
   <lifetime type="singleton" />
</type>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this configuration I inserted a default ILogger of type  **ConsoleLogger** , it is the default one because it has an empty name. I configured also the type  SuperConsoleLogger with a name of SuperLogger; if I want to use the SuperLogger in the previous class I can specify the name in the dependency tag

{{< highlight xml "linenos=table,linenostart=1" >}}
<type type="ITest" mapTo="TestB" name="OtherTest">
   <typeConfig extensionType="Microsoft.Practices.Unity.Configuration.TypeInjectionElement,
       Microsoft.Practices.Unity.Configuration" >
      ...
      <property name="Logger" propertyType="ILogger">
         <dependency name="SuperLogger" />
      </property>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the basic of Unity configuration, with this knowledge in hand you can use Unity to build complex object graph with an xml configuration.

alk.

Tags: [Unity](http://technorati.com/tag/Unity) [Pattern And Practice](http://technorati.com/tag/Pattern%20And%20Practice) [IoC](http://technorati.com/tag/IoC)
