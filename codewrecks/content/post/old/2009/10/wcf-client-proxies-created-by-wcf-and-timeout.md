---
title: "Wcf client proxies created by WCF and timeout"
description: ""
date: 2009-10-21T08:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
In this [post](http://www.nablasoft.com/guardian/index.php/2009/05/21/castle-windsor-wcf-services-resolution-facility/), Alessandro explains how to create dynamically wcf proxy objects through Castle Windsor. We used this factory for some services exposed with basichttp binding with no problem, now we are using WS\* binding and we are experiencing some problems.

The problem arise when the client spends too many time without calling the service. After a long inactivity when we try to call a service function we get an error. The reason can be [seen here](http://www.request-response.com/blog/PermaLink,guid,f731e5cc-9490-4f1e-bc7d-efb91f357cd1.aspx). Our structure is a MVC on winform, so the controller depends on IxxxService interface to communicate with the server. Now I need a way to intercept communication failures and recreate another proxy to start communication again, and I do not want to insert this code everywhere I call a service function.

I decided to modify the facility to support this scenario, here is the main function that build dynamically wcf proxy

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public static object CreateWcfChannelProxy(Type service, string endpoint)
{
    var interceptor = new WcfProxyInterceptor(service, endpoint);
    object wcfProxy = InnerCreateProxy(service, endpoint, interceptor);
    Object wrapped = Generator.CreateInterfaceProxyWithTargetInterface(
        service, wcfProxy, interceptor);
    return wrapped;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The function InnerCreateProxy is the one described in original [Alessanrdoâ€™s post](http://www.nablasoft.com/guardian/index.php/2009/05/21/castle-windsor-wcf-services-resolution-facility/)

{{< highlight xml "linenos=table,linenostart=1" >}}
internal static object InnerCreateProxy(Type service, string endpoint, WcfProxyInterceptor interceptor)
{
    Type channelFactoryBaseType = typeof(ChannelFactory<>);
    channelFactoryBaseType = channelFactoryBaseType.MakeGenericType(service);
    // Create an instance
    object instance = Activator.CreateInstance(channelFactoryBaseType, endpoint);
    if (!String.IsNullOrEmpty(UserName))
    {
        PropertyInfo gcpinfo = instance.GetType().GetProperty("Credentials", BindingFlags.Instance | BindingFlags.Public);
        ClientCredentials c = (ClientCredentials) gcpinfo.GetValue(instance, null);
        c.UserName.UserName = UserName;
        c.UserName.Password = Password;
    }
    MethodInfo createchannel = instance.GetType().GetMethod("CreateChannel", new Type[0]);

    interceptor.ActualWcfClientProxy = createchannel.Invoke(instance, null);
    interceptor.ChannelFactory = instance as IDisposable;
    return interceptor.ActualWcfClientProxy;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The interesting part is the WcfProxyProxyInterceptor class, a castle interceptor that is used in conjunction with Castle DynamicProxy to create a proxy of the WcfProxy :). If it seems weird to create a proxy of a proxy lets look at this schema.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/10/image7.png)

The reason behind this structure is: WCF Proxy abstracts the call to the server with a channel, but if it becomes corrupted, as example when timeout occurs, we need to recreate another valid proxy to communicate with the server. The problem is that now I need to instruct all controllers to use the new proxy. If I use another proxy that wraps WCF proxy, I can simply return that proxy to the controller, and let it manage wcf proxy recreation in case of CommucationException. Letâ€™s see how the WcfProxyInterceptor works

{{< highlight chsarp "linenos=table,linenostart=1" >}}
internal class WcfProxyInterceptor : IInterceptor
{

    public Type TargetType { get; set; }

    public String Endpoint { get; set; }

    public Object ActualWcfClientProxy { get; set; }

    public IDisposable ChannelFactory { get; set; }

    public WcfProxyInterceptor(Type targetType, string endpoint)
    {
        TargetType = targetType;
        Endpoint = endpoint;
    }

    #region IInterceptor Members

    public void Intercept(IInvocation invocation)
    {
        SetCurrentProxyAsTarget(invocation);
        try
        {
            invocation.Proceed();
        }
        catch (CommunicationException cex)
        {
            DisposeActualProxyAndRecreateOther();
            invocation.ReturnValue = invocation.MethodInvocationTarget.Invoke(ActualWcfClientProxy, invocation.Arguments);
        }
    }

    private void DisposeActualProxyAndRecreateOther()
    {
        try
        {
            //First step, dispose everything needs to be disposed.
            ChannelFactory.Dispose();
            ((IDisposable)ActualWcfClientProxy).Dispose();
        }
        catch (Exception) {}
        //Recreate another proxy.
        WcfProxyActivator.InnerCreateProxy(TargetType, Endpoint, this);
    }

    private void SetCurrentProxyAsTarget(IInvocation invocation)
    {
        IChangeProxyTarget changeTarget = invocation as IChangeProxyTarget;
        changeTarget.ChangeInvocationTarget(ActualWcfClientProxy);
    }

    #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

IT simply wraps the call to invocation proceed to intercept all CommunicationException exceptions. When an exception occurs, it simply disposes the actual WCF Proxy to avoid leak, then it creates another wcf proxy and stores it internally in the ActualWcfClientProxy. Finally it does a direct invocation with MethodInfo in the new object (this because we cannot call interceptor.Proceed() multiple times). The trick is in the function SetCurrentProxyAsTarget, that uses the IChangeProxyTarget interface to change the wrapped object for each call. With this situation the Controller can use the IXxxxService interface without worrying of communication exception and WCF proxy recreation.

Alk.

Tags: [Castle](http://technorati.com/tag/Castle) [Wcf](http://technorati.com/tag/Wcf)
