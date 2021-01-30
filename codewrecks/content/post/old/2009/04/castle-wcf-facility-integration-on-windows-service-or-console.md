---
title: "Castle Wcf facility integration on windows service or console"
description: ""
date: 2009-04-27T03:00:37+02:00
draft: false
tags: [NET framework,Castle]
categories: [NET framework,Castle]
---
Castle has a [great facility](http://www.castleproject.org/container/facilities/trunk/wcf/index.html) to resolve Wcf services with castle windsor. This is really useful because it helps you when your concrete service classes have dependency to be resolved. There are a lot of tutorials or blog posts on how to configure it when you want to host service in IIS, but little bit about how to do self hosting, for example in a console application or in a windows service. Here is how to accomplish this. Suppose you have this little service

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[ServiceContract]
public interface IKernel
{
 [OperationContract(Name = "Test")]
 Int32 Test();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And this concrete class

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class Kernel : IKernel 
{
   public Int32 TestValue { get; set; }

   #region IKernel Members

   public Int32 Test()
   {
      return TestValue;
   }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Suppose you want to configure TestValue parameter or resolve dependencies, this can be easily done with Castle Windsor, but how can you tell WCF to create your services asking to a Windsor Container to resolve dependencies? The solution is the Wcf integration Facility. First of all create the windsor configuration file like this one.

{{< highlight xml "linenos=table,linenostart=1" >}}
<configuration xmlns="http://www.tigraine.at/windsor-configuration.xsd">
   <components>
      <component id="Kernel" service="KilogWms.Services.Interfaces.IKernel, KilogWms.Services.Interfaces"
                 type="KilogWms.Services.Impl.Kernel, KilogWms.Services.Impl" >
         <parameters>
            <TestValue>42</TestValue>
         </parameters>
      </component>
   </components>

   <facilities>
      <facility
          id="CastleWcfItegration"
          type="Castle.Facilities.WcfIntegration.WcfFacility, Castle.Facilities.WcfIntegration">
      </facility>
   </facilities>
</configuration>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I configured my service class with parameters, and then tells windsor to use the WcfFacility. Now hosting your service in a console application is a breeze

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (DefaultServiceHost host = (DefaultServiceHost)new DefaultServiceHostFactory().CreateServiceHost(
   typeof(IKernel).AssemblyQualifiedName, new Uri[0]))
{
    Uri serviceAddress = new Uri("http://localhost:7601/Kernel");
    Uri serviceMexAddress = new Uri("http://localhost:7601/Kernel/mex");
    host.Description.Behaviors.Add(new ServiceMetadataBehavior());
    host.AddServiceEndpoint(typeof(KilogWms.Services.Interfaces.IKernel), new BasicHttpBinding(), serviceAddress);
    host.AddServiceEndpoint(typeof(IMetadataExchange), MetadataExchangeBindings.CreateMexHttpBinding(), serviceMexAddress);
   host.Open();
   Console.WriteLine("Host started");
   System.Console.ReadKey();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You need to create a  **DefaultServiceHost** using the  **DefaultServiceHostFactory** class, this is the only difference from hosting services in standard way. You should pass the assembly where the Interface is defined and an empty array of uri. Then you can process to configure the host as usual, but now when you invoke the service from a client you can see that the component was resolved by castle.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/04/image-thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/04/image6.png)

As you can see I simply used the Wcf Test Client included with visual studio, reference the service with the IMetadataExchange endpoint and when I call the test method the return value is 42, because Kernel Class was resolved with a castle container. Surely configuring endpoints in code is not the best thing to do, so it is better to use config file to setup wcf endpoint. Since Wcf Castle Integration is completely transparent, you configure services as ususal.

{{< highlight xml "linenos=table,linenostart=1" >}}
 <system.serviceModel>
      <behaviors>
         <serviceBehaviors>
            <behavior name="BaseBehaviors">
               <serviceDebug includeExceptionDetailInFaults="true" />
               <serviceMetadata />
            </behavior>
            <behavior name="TcpBased" />
         </serviceBehaviors>
      </behaviors>
      <services>
         <service behaviorConfiguration="BaseBehaviors"
                  name="KilogWms.Services.Impl.Kernel">

            <endpoint address="Kernel" binding="netTcpBinding" bindingConfiguration=""
               name="TcpCustomer" contract="KilogWms.Services.Interfaces.IKernel" />
            <endpoint address="KernelMex" binding="mexTcpBinding" bindingConfiguration=""
               name="Mex" contract="IMetadataExchange" />
            <host>
               <baseAddresses>
                  <add baseAddress="net.tcp://localhost:6501/" />
               </baseAddresses>
            </host>
         </service>

      </services>
   </system.serviceModel>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this configuration I use net tcp binding and changed address, if you want to use it to self host the service you can simply use the same code as before, just without the configuration.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (DefaultServiceHost host = (DefaultServiceHost)new DefaultServiceHostFactory().CreateServiceHost(
   typeof(IKernel).AssemblyQualifiedName, new Uri[0]))
{
   host.Open();
   Console.WriteLine("Host started");
   System.Console.ReadKey();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Alk.

Tags: [Castle Windsor](http://technorati.com/tag/Castle%20Windsor) [WCF](http://technorati.com/tag/WCF)
