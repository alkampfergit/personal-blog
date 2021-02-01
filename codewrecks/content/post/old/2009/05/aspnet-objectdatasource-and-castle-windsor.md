---
title: "AspNet ObjectDataSource and Castle Windsor"
description: ""
date: 2009-05-22T04:00:37+02:00
draft: false
tags: [ASPNET,Castle]
categories: [ASPNET,Castle]
---
I'm restructuring a portion of a site, it is well structured, and all logic is inside business classes in another assembly, and they are accessed with ObjectDataSources. My problem is that with the new structure I cannot refer to the concrete classes anymore, but I need to resolve them with an IoC container, like Castle Windsor.

The solution to this problem was really simple, I created this simple class

{{< highlight CSharp "linenos=table,linenostart=1" >}}
Public Class IoCObjectDataSource : Inherits ObjectDataSource
   Public Shadows Property TypeName() As String
       Get
           Return MyBase.TypeName
       End Get
       Set(ByVal value As String)
           MyBase.TypeName = IoC.GetConcreteTypeFor(Type.GetType(value)).FullName
       End Set
   End Property
End Class{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It inherits from the basic ObjectDataSource, but it shadows the TypeName property; in setter part of TypeName it call a IoC wrapper to get the concrete name of the component configured for a given interface. Now I can specify an interface instead of the real type.

{{< highlight xml "linenos=table,linenostart=1" >}}
<rmWeb:IoCObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}"
   SelectMethod="GetLogTypes" TypeName="MyProject.DataService.IXmlLogService, MyProject.DataService" >
</rmWeb:IoCObjectDataSource>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to Castle Windsor I can easily recover the concrete type registered for a given interface.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static Type GetConcreteTypeFor(Type service)
{
    return ActualContainer.Kernel
     .GetHandler(service).ComponentModel.Implementation;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Alk.

Tags: [Castle Windsor](http://technorati.com/tag/Castle%20Windsor) [.Net Framework](http://technorati.com/tag/.Net%20Framework) [IoC](http://technorati.com/tag/IoC) [Asp.Net](http://technorati.com/tag/Asp.Net)
