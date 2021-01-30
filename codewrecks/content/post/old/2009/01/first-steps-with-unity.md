---
title: "First Steps with Unity"
description: ""
date: 2009-01-16T03:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
I use Castle.Windsor for IoC, and sometimes I used Spring; those two are really enough to cover all IoC problems I had in the past. I do no like very much [Enterprise Library](http://msdn.microsoft.com/en-us/library/cc467894.aspx) but in some situation customers does not like open source code, and ask you to use only MS product, so it is worth to give a look at unity that is shipped as part of the enterprise library, but also distributed in stand alone form.

My first step is to look at configuration file, it is basically an XML file and you can embed the configuration in app.config or in a loose xml file, I prefer the second option, since xml file tends to grow bigger and complex, I prefer to have a dedicated file for IoC configuration,  so I created this configuration file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8" ?>
<configuration>

   <configSections>
      <section name="unity"
                type="Microsoft.Practices.Unity.Configuration.UnityConfigurationSection,
                 Microsoft.Practices.Unity.Configuration, Version=1.2.0.0,
                 Culture=neutral, PublicKeyToken=31bf3856ad364e35" />
   </configSections>

   <unity>
      <typeAliases>
         <typeAlias alias="ITest" type="PolicyInjection.ITest, PolicyInjection" />
         <typeAlias alias="TestA" type="PolicyInjection.TestA, PolicyInjection" />
         <typeAlias alias="TestB" type="PolicyInjection.TestB, PolicyInjection" />
      </typeAliases>
      <containers>
         <container name="DefContainer">
            <types>
               <type type="ITest" mapTo="TestA" name="">
               </type>
               <type type="ITest" mapTo="TestB" name="OtherTest">
               </type>
            </types>
         </container>
      </containers>
   </unity>
</configuration>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The file is really simple, the unity section has a typealiases section where you can give aliases to your type, this helps to keep the configuration file more readable. Then you can configure more than one container, and inside each container you map interfaces to concrete types. Here is the code to build the container from *stand alone configuration file* and resolve the default instance for the ITest interface.

{{< highlight xml "linenos=table,linenostart=1" >}}
IUnityContainer container = new UnityContainer();
ExeConfigurationFileMap map = new ExeConfigurationFileMap();
map.ExeConfigFilename = "UnityConfiguration.xml";
System.Configuration.Configuration config
  = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
UnityConfigurationSection section
  = (UnityConfigurationSection)config.GetSection("unity");
section.Containers["DefContainer"].Configure(container);

ITest test = container.Resolve<ITest>();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This first snippet shows that the UnityContainer is similar to other containers, it consists simply of a configuration file (or you can configure at runtime) then you create the container and resolve objects. If you test the code you can verify that each time you call Resolve, the container gives you a new object, if you need a singleton lifecycle you need two modification to configuration file. The first is register an alias.

{{< highlight xml "linenos=table,linenostart=1" >}}
<typeAlias alias="singleton" 
           type="Microsoft.Practices.Unity.ContainerControlledLifetimeManager, 
           Microsoft.Practices.Unity" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Since ContainerControlledLifetimeManager is the lifecycle that is bound to the life of the container, as [explained here](http://msdn.microsoft.com/en-us/library/cc440953.aspx). To make the code more readable it is useful to create an alias named singleton, now you can specify the lifecycle

{{< highlight xml "linenos=table,linenostart=1" >}}
   <containers>
         <container name="DefContainer">
            <types>
               <type type="ITest" mapTo="TestA" name="">
                  <lifetime type="singleton" />
               </type>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the very basic of an IoC container, now I need to verify how unity behave in more complex situation.

Alk

Tags: [IoC](http://technorati.com/tag/IoC) [Unity](http://technorati.com/tag/Unity)
