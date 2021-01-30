---
title: "Value of architecture"
description: ""
date: 2009-07-28T03:00:37+02:00
draft: false
tags: [Architecture Castle]
categories: [Castle,Software Architecture]
---
If I have to tell what is the main property of a good architecture, I surely will answer that a good architecture centralize common operations and make simple to extend the application.

Here is a typical example. I have a WCF services called from external clients, but I use the same service inside my organization. I created a little WPF project that needs to use services functions, but since this program is run internally, I do not want it to pass in the WCF stack, but I simply want to use concrete services classes that access the database.

The solution is really simple, here it is:

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[AutoscanComponent(LifestyleType.Transient, IsDefault = true, Id = "KeywordService", ServiceType = typeof(IKeywordService))]
public class KeywordService : IKeywordService{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

AutoscanComponent is used by a custom Castle facility, and is used to automatically register a component. For services Iâ€™m sure that there is always only an instance registered for each interface, so I can simply configure castle to use the autoscan facility, and when the code declare a dependency to IKeywordService, Castle resolve it with the concrete class instead of the WCF Proxy.

But this is not enough, I begin to notice that the program is slow, and after a simple inspection I see that there are too many calls to the database. The problem is that the user interact with a WPF UI and there are too many call to the database because the service interfaces are thought for a different usage pattern. This problem could be easily resolved with caching, so I create a simple interceptor.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class CacheInterceptor : global::Castle.Core.Interceptor.IInterceptor
{
    private static String BuildCacheToken(IInvocation invocation)
    {
        StringBuilder sb = new StringBuilder(100);
        sb.Append(invocation.TargetType.Name)
           .Append("|")
           .Append(invocation.Method.Name)
           .Append("|");
        foreach (object argument in invocation.Arguments)
        {
            sb.Append(argument.ToString())
               .Append("|");
        }
        return sb.ToString();
    }

    public Int32 CacheDurationInMinutes { get; set; }

    #region IInterceptor Members
    ICacheManager invocationCache = CacheFactory.GetCacheManager();

    public void Intercept(IInvocation invocation)
    {
        String cacheToken = BuildCacheToken(invocation);
        Object cacheObject;
        if ((cacheObject = invocationCache.GetData(cacheToken)) != null)
        {
            invocation.ReturnValue = cacheObject;
        }
        else
        {
            invocation.Proceed();
            invocationCache.Add(cacheToken, invocation.ReturnValue, CacheItemPriority.Normal, 
                null, 
                new AbsoluteTime(DateTimeService.Now.AddMinutes(CacheDurationInMinutes)));
        }
    }

    #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This component is really simple, It builds a string key that represent the cache composing *service name + method name + parameterlist*, so Iâ€™m sure that I cache only calls with the same parameters call. Then I simply use [entlib caching application block](http://msdn.microsoft.com/en-us/library/dd203248.aspx) to store data in cache. Now I simply need to configure this interceptor in config file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<component id="CacheInterceptor"
     service="Castle.Core.Interceptor.IInterceptor, Castle.Core"
     type="BaseServices.Castle.CacheInterceptor, BaseServices"
     lifestyle="singleton">
  <parameters>
      <CacheDurationInMinutes>5</CacheDurationInMinutes>
  </parameters>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Next I need to instruct my facility to add this interceptor to all autoregistered components

{{< highlight xml "linenos=table,linenostart=1" >}}
<facility id="AutoScan" type="BaseServices.Castle.AutoscanFacility, BaseServices" ><assembly name="DataService" /><assembly name="Analyzer.Service" /><interceptor name="CacheInterceptor" /><interceptor name="SessionPerCallInterceptor" />
</facility>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this configuration Iâ€™m sure that each service is intercepted by the cache component, cache duration is 5 minutes, and the application gains a tremendous speed increase.

This is possible because the architecture extensively use IoC to resolve services and components, and is simple to add features with [AOP](http://en.wikipedia.org/wiki/Aspect-oriented_programming).

alk.

Technorati Tags: [Software Architecture](http://technorati.com/tags/Software+Architecture)
