---
title: "Castle Windsor quotNo converter registered to handle the typequot"
description: ""
date: 2008-06-04T01:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
If you have an object that has a property of some type that is not known by windsor (as example Regex), if you try to configure it with xml the error “No converter registered to handle the type” will occurs. This happens because the container read configuration as string, and then it has to convert to a type it does not know. The solution is to write few line of code to create a converter

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class RegexConverter : AbstractTypeConverter  
{
    public override bool CanHandleType(Type type)
    {
        return type == typeof (Regex);
    }

    public override object PerformConversion(global::Castle.Core.Configuration.IConfiguration configuration, Type targetType)
    {
        return PerformConversion(configuration.Value, targetType);
    }

    public override object PerformConversion(string value, Type targetType)
    {
        return new Regex(value);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

A converter has three methods, the first *CanHandleType* is called to check if this converter can handle various type. In our implementation I return true only if the type is a Regular Expression. The remaining two methods *PerformConversion* are called to actually perform the desidered conversion. In our situation the conversion is straightforward because you can simply use the constructor of the Regex that accepts a string.

To register this converter into the container you need to use these snippet

{{< highlight csharp "linenos=table,linenostart=1" >}}
globalContainer = new WindsorContainer(
    new XmlInterpreter(new ConfigResource(cCastleWindsorConfigSection)));
IConversionManager manager = (IConversionManager)
    globalContainer.Kernel.GetSubSystem(SubSystemConstants.ConversionManagerKey);
manager.Add(new RegexConverter());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You get the IConversionManager by Kernel.GetSubSystem, and then add your new converter…the game is done.

alk.

Tags: [Castle Windsor](http://technorati.com/tag/Castle%20Windsor) [Converters](http://technorati.com/tag/Converters)
