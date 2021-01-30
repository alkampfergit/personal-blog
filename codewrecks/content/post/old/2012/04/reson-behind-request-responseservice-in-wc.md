---
title: "Reason behind a request 8211 response service in WCF"
description: ""
date: 2012-04-05T16:00:37+02:00
draft: false
tags: [Architecture,Wcf]
categories: [Software Architecture]
---
I dealt with a minimal implementation of a [basic Request Response WCF Service](http://www.codewrecks.com/blog/index.php/2012/03/12/basic-request-response-wcf-service/) some times ago, now it is time to show some advantages you have using this approach. If the caller is created in.NET technology, you can  **directly reference**  **the dll that contains all Requests and responses** , without the need to create a service reference in Visual Studio. In my example the service is called CoreService, so I created a CoreServiceClient class to implement communication from client to server.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public partial class CoreServiceClient :
    System.ServiceModel.ClientBase<ICoreService>, ICoreService
{
    public static ICoreService CreateClient() {
        String useWcf = ConfigurationManager.AppSettings["useWcf"];
        if (useWcf.Equals("false", StringComparison.OrdinalIgnoreCase)) {
            return new CoreService();
        }
        return new CoreServiceClient();
    }
    public CoreServiceClient()
    {
    }
    public CoreServiceClient(string endpointConfigurationName) :
        base(endpointConfigurationName)
    {
    }
    public CoreServiceClient(string endpointConfigurationName, string remoteAddress) :
        base(endpointConfigurationName, remoteAddress)
    {
    }
    public CoreServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) :
        base(endpointConfigurationName, remoteAddress)
    {
    }
    public CoreServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) :
        base(binding, remoteAddress)
    {
    }
    public Response Execute(Request request)
    {
        return base.Channel.Execute(request);
    }
}

{{< / highlight >}}

Code is really trivial, the class inherits from *System.ServiceModel.ClientBase&lt;ICoreService&gt;,*it declares all needed constructors for the base class and it also implements ICoreService. Apart from the standard constructors of a ClientBase class, it implements the ICoreService interface and *forward the call to the underling Channel that implements the communication with WCF infrastructure*. This class also declares a *static factory method called CreateClient(),* that internally checks in AppSettings the presence of a setting called useWcf. If this values is *false*,  **it return to the caller a concrete instance of the CoreService class** , if the value is true or is not present (default behavior) it returns the CoreServiceClient class that communicates with WCF.

The purpose of this code is simple, client code needs only to directly reference the dll that contains the server and use the Factory method of CoreServiceClient class to obtain a reference to a ICoreService instance.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (ICoreService client = CoreServiceClient.CreateClient())
{
    // Console.WriteLine("1 + 1 = " + client.Add(1, 1));
    AddTwoNumber message = new AddTwoNumber();
    message.FirstAddend = 1.0;
    message.SecondAddend = 2.0;
    MathOperationResult result = (MathOperationResult)client.Execute(message);
    Console.WriteLine("1.0 + 2.0 = " + result.OperationResult);

{{< / highlight >}}

Now you can simply change the value of  **useWcf settings** to decide *if the client code will use WCF to communicate with the server, or if the client will directly use the service class*. The result is being able with a setting in configuration file to decide if the client and the request/reponse service will run in 2 tier mode or in single tier mode.

This scenario is useful in many situation, first of all  **it can simplify debugging** , because if you only want to debug code to verify business logic, you can run everything in single tier mode, setup your breakpoint and press F5; but the most important stuff is that you are able to debug without the need to setup a real WCF service communication.

If you install your software in a simple scenario, you can opt for a single tier deploy where everything run on a single machine to simplify maintenance, *but you can support more complex scenario simply changing one setting and deploy a WCF service in IIS and multiple clients in different machines*.

This peculiar structure is the reason behind the ICoreService implements the IDisposable interface. The caller ask for a ICoreService class,  **but when you are using WCF, you will need to dispose the communication proxy** , so it is necessary for the ICoreService class to implement IDisposable to inform the caller that he need to dispose that instance once finished. In a single tier deployment the call to dispose is simply ignored by the CoreService class, but in a two tier deployment the call to dispose will call the Dispose method of the System.ServiceModelClientBase&lt;&gt; class.

Gian Maria.
