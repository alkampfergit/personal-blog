---
title: "Extending the WCF castle proxy generator"
description: ""
date: 2010-04-02T13:00:37+02:00
draft: false
tags: [Castle,Wcf]
categories: [Castle]
---
Since Iâ€™m using extensively the [Wcf castle proxy generator](http://www.codewrecks.com/blog/index.php/2009/10/21/wcf-client-proxies-created-by-wcf-and-timeout/) today I needed to add a new feature, I need to be able to specify via code the base address of the various services. I know that my service are usually in [https://www.mysite.com/services/](https://www.mysite.com/services/) but I want to be able to specify via code the base address, especially to target different environment, like production and test.

To keep everything simple, I created a simple static property on the proxy creator

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static String HostAddress
{
get { return _hostAddress; }
set
{
_hostAddress = value;
 
}
}
{{< / highlight >}}

This property is usually set by the facility, so Iâ€™m able to configure the base address directly from facility configuration.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<facility id="wcfproxycreation"
type="MyProject.WcfProxyCreationFacility, MyProject.BaseServices"
serviceBaseAddress="https://www.mybaseaddress.com/ServicesPreProd/">
{{< / highlight >}}

But Iâ€™m also able to change it by code, this permits me to change it at runtime. All the dirty work is made by the WcfProxyActivator, that needs to use a little bit of reflection to create the service.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Type channelFactoryBaseType = typeof(ChannelFactory<>);
channelFactoryBaseType = channelFactoryBaseType.MakeGenericType(service);
// Create an instance
object instance = null;
instance = Activator.CreateInstance(channelFactoryBaseType, endpoint);
{{< / highlight >}}

Now if I need to create a proxy that point to the current service address specified in web.config I use this code

{{< highlight csharp "linenos=table,linenostart=1" >}}
MethodInfo createchannel = instance.GetType().GetMethod("CreateChannel", new Type[0]);
proxy = createchannel.Invoke(instance, null);
{{< / highlight >}}

But if I want the proxy to point to a different address I need this piece of code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
ClientSection configuration = (ClientSection) ConfigurationManager.GetSection("system.serviceModel/client");
ChannelEndpointElement element = configuration.Endpoints
.OfType<ChannelEndpointElement>().Single(c => c.Name == endpoint);
String serviceAddress = element.Address.AbsoluteUri;
serviceAddress = HostAddress + serviceAddress.Substring(serviceAddress.LastIndexOf("/") + 1);
EndpointAddress endpointAddress = new EndpointAddress(serviceAddress);
MethodInfo createchannel = instance.GetType().GetMethod("CreateChannel", new[] {typeof (EndpointAddress)});
proxy = createchannel.Invoke(instance, new [] { endpointAddress });
{{< / highlight >}}

What I need to do is knowing the original address of the service, and changing the base address, keeping only the name of the service.

Knowing the original address can be tricky, what I got in the proxy creator is the name of the endpoint of the service and I need to know the address. The solution is reading the configuration file with the ConfigurationManager that can be queried for the  â€œsystem.serviceModel/clientâ€ section, that contains the configuration of services. This section has a list of endpoints, and you can use a little bit of LINQ to the one you are creating (remember that you have the name of the endpoint). The result of the LINQ query is an object of type ChannelEndpointElement that contains endpoint configuration, and from it you can fine service address in the Address property. Now you only need to create a new EndpointAddress with the new address of the service, and pass it to â€œCreateChannelâ€ method. And everything works as expected.

Alk.

Tags: [WCF](http://technorati.com/tag/WCF) [Castle](http://technorati.com/tag/Castle)
