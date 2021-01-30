---
title: "The username is not provided Specify username in ClientCredentials when use CreateChannel at Runtime"
description: ""
date: 2012-10-19T17:00:37+02:00
draft: false
tags: [Wcf]
categories: [NET framework]
---
I’ve encountered a strange problem with WCF today,  **I have a custom Castle facility that is able to automatically create Wcf proxies with code** , and it worked perfectly until I need to add a simple functionality: I want to be able to change at runtime some of the options of bindings that are configured in app.config. The solution was really simple, just write a method to retrieve the BindingConfiguration from the configuration file and the game is almost done.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static Binding ResolveBinding(string name)
{
    System.Configuration.Configuration config =
        System.Configuration.ConfigurationManager.OpenExeConfiguration(Assembly.GetEntryAssembly().Location);

    var serviceModel = ServiceModelSectionGroup.GetSectionGroup(config);

    BindingsSection section = serviceModel.Bindings;

    foreach (var bindingCollection in section.BindingCollections)
    {
        var bindingElement = bindingCollection.ConfiguredBindings.SingleOrDefault(e => e.Name == name);
        if (bindingElement != null)
        {
            var binding = (Binding)Activator.CreateInstance(bindingCollection.BindingType);
            binding.Name = bindingElement.Name;
            bindingElement.ApplyConfiguration(binding);

            return binding;
        }
    }

    return null;
}

{{< / highlight >}}

This code is really simple, it just opens the configuration file related to the entry assembly, get the the ServiceModelSectionGroup and then iterate through all BindingCollections (in Bindings section), looking for a Binding configuration with specified name.  **Once you find the configuration you can simply create an instance of the BindingType and use the ApplyConfiguration of the BindingElement to apply the configuration present in configuration file**. Once you have the instance of the binding configured as for the config file you can simply modify all the option you need. My specific need is the ability to modify the *useDefaultHttpWebProxy* property, to be able to use or not use configured proxy as needed.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var binding = ResolveBinding(element.BindingConfiguration);
if (binding is BasicHttpBinding)
{
    BasicHttpBinding bhb = (BasicHttpBinding)binding;
    bhb.UseDefaultWebProxy = true;
}
else if (binding is WSHttpBinding)
{
    WSHttpBinding wshb = (WSHttpBinding)binding;
        wshb.UseDefaultWebProxy = true;

}
else if (binding is CustomBinding)
{
    CustomBinding cshb = (CustomBinding)binding;
    cshb.Elements
       .OfType<HttpsTransportBindingElement>()
       .Single()
       .UseDefaultWebProxy = true;
}

{{< / highlight >}}

This code is really simple, I needs only to cast the binding to the correct type (I’m using BasicHttpBinding, WsHttpBinding and CustomBinding in this software) to set UseDefaultWebProxy value and the game is done.  **Now I only need to modify the piece of code that actually creates the proxy** {{< highlight csharp "linenos=table,linenostart=1" >}}


MethodInfo createchannel = instance.GetType().GetMethod("CreateChannel", new[] { typeof(EndpointAddress) });
proxy = createchannel.Invoke(instance, new[] { endpointAddress });

{{< / highlight >}}

the *Instance* variable contains a reference to *ChannelFactory&lt;T&gt;* and I create the proxy simply calling the CreateChannel (with reflection) passing the EndpointAddress. After a brief check on MSDN I found a version of CreateChannel that accepts a binding and not only an Endpoint element. In this page ([http://msdn.microsoft.com/en-us/library/aa344556(v=vs.85).aspx](http://msdn.microsoft.com/en-us/library/aa344556%28v=vs.85%29.aspx)) you can verify that a CreateChannel exists that accepts a binding and an endpoint address so I change the above code to invoke this version of the method. Everything works as expected,  **except that I got The username is not provided. Specify username in ClientCredentials error for all authenticated service;** reverting the code to call the old Createchannel solved the problem.

I’ve lost half an hour wondering why credential are not passed to the server if I create the channel with the CreateChannel(Binding, EndpointAddress) but if I create the channel with CreateChannel(EndpointAddress) everything works as expected, until I realize my mistake.  **The CreateChannel(Binding, EndpointAddress) is a static method of the ChannelFactory** , and when you create proxy dynamically with code, credentials are set directly inside the ChannelFactory, I’ve found my mistake.

When you create the proxy with  **instance method CreateChannel(EndpointAddress),** it maintains a connection with the original factory, so it was able to grab credentials when needed from the factory,  **if you create the channel with the static CreateChannel(Binding, EndpointAddress)** you are actually calling this code.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image.png)

 ***Figure 1***: *Reflected code of CreateChannel static method*

As you can verify  **this method actually creates a new ChannelFactory passing the binding, then uses this new factory to create the channel** , and credentials set into the original factory are lost, because the channel is actually created from another ChannelFactory instance. The solution is really obvious; use the CreateChannel(EndpointAddress) method, but changing the call to the constructor of the ChannelFactory to pass modified binding object. Everything now works perfectly, here is the code to create channel factory passing the binding.

{{< highlight csharp "linenos=table,linenostart=1" >}}


instance = Activator.CreateInstance(channelFactoryBaseType, binding);

{{< / highlight >}}

Gian Maria.
