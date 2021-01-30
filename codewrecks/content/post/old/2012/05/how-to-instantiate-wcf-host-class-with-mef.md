---
title: "How to instantiate WCF host class with MEF"
description: ""
date: 2012-05-08T16:00:37+02:00
draft: false
tags: [Architecture,Wcf]
categories: [Software Architecture]
---
- [Basic Request Response WCF service](http://www.codewrecks.com/blog/index.php/2012/03/12/basic-request-response-wcf-service/)
- [Reason behind a request – response service in WCF](http://www.codewrecks.com/blog/index.php/2012/04/05/reson-behind-request-responseservice-in-wc/)
- [Evolving Request Response service to separate contract and business logic](http://www.codewrecks.com/blog/index.php/2012/04/23/evolving-request-response-service-to-separate-contract-and-business-logic/)

I described in the last post of the series the structure behind the Request/Reponse service based on MEF, now it is time to explain how to make MEF and WCF happily live together. In the first version I hosted the service with these simple lines of code

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (ServiceHost host = new ServiceHost(typeof(CoreService)))
{
    host.Open();

{{< / highlight >}}

Basically all I needed to do is to create a ServiceHost specifying in the constructor the type of the class that implements the service and let WCF to take care of every details about the creation of the concrete instances that will answer to the requests.

In this new version of the service  **the CoreService class cannot be anymore created with default constructor, because I need to construct the instance with MEF** ; so I need to instruct WCF to create the CoreService class with MEF.

What I need is concrete implementation of the** **[** IInstanceProvider **](http://msdn.microsoft.com/en-us/library/system.servicemodel.dispatcher.iinstanceprovider.aspx)** , an interface used by WCF to manage the creation of concrete classes that implements my service **.

{{< highlight csharp "linenos=table,linenostart=1" >}}


class CoreServiceInstanceProvider : IInstanceProvider
{
    public object GetInstance(System.ServiceModel.InstanceContext instanceContext, System.ServiceModel.Channels.Message message)
    {
        return MefHelper.Create<ICoreService>(); 
    }
    public object GetInstance(System.ServiceModel.InstanceContext instanceContext)
    {
        return GetInstance(instanceContext, null);
    }
    public void ReleaseInstance(System.ServiceModel.InstanceContext instanceContext, object instance)
    {
    }
}

{{< / highlight >}}

My implementation is super simple, I only need to use the** MefHelper.Create() method to let MEF create the class **and compose everything, but I need another couple of classes to instruct WCF to use my CoreServiceInstanceProvider to instantiate classes for my service. First class is a Service Behavior, represented by a class that** implements  **[** IServiceBehavior **](http://msdn.microsoft.com/en-us/library/system.servicemodel.description.iservicebehavior.aspx)** to make WCF use my CoreInstanceProvider **, then I create another class that** inherits from ServiceHost to automatically add this behavior to the WCF host**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class CoreServiceBehavior : IServiceBehavior
{
    public void ApplyDispatchBehavior(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
    {
        foreach (ChannelDispatcherBase cdb in serviceHostBase.ChannelDispatchers)
        {
            ChannelDispatcher cd = cdb as ChannelDispatcher;
            if (cd != null)
            {
                foreach (EndpointDispatcher ed in cd.Endpoints)
                {
                    ed.DispatchRuntime.InstanceProvider = new CoreServiceInstanceProvider();
                }
            }
        }
    }
    public void AddBindingParameters(ServiceDescription 
        serviceDescription, 
        ServiceHostBase serviceHostBase, 
        Collection<ServiceEndpoint> endpoints,
        BindingParameterCollection bindingParameters)
    {
    }
    public void Validate(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
    {
    }
}
public class CoreServiceHost : ServiceHost {
    public CoreServiceHost() : base(typeof(CoreService))
    {
    }
    protected override void OnOpening()
    {
        Description.Behaviors.Add(new CoreServiceBehavior());
        base.OnOpening();
    }
}

{{< / highlight >}}

With these helper classes, hosting the service in a simple console application is a breeze.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (ServiceHost host = new CoreServiceHost())
{
    host.Open();

{{< / highlight >}}

Et voilà, two lines of code and I’m able to start the service where every instance of the service is created by MEF.

Gian Maria.
