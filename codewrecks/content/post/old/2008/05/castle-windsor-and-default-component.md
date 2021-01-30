---
title: "Castle Windsor and default component"
description: ""
date: 2008-05-27T05:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
Castle windsor is a really good library of IoC, but has some issues that sometimes can lead to obscure configuration. One of the most important is the concept of a “default component” suppose I create an *ICache* interface and I want some objects to be “cache-enabled”. My approach is usually that of a [NullObject pattern](http://en.wikipedia.org/wiki/Null_Object_pattern), I build a NullCache component that does not store any object and always return null when we ask for an object in the cache. This is usually good because the code should not check for null when deal with a cache. Another way to use this component is to use [decorator pattern](http://en.wikipedia.org/wiki/Decorator_pattern) to create component with cache and component with no cache, but for some objects I really need the cache object to be part of the real implementation.

As example I have a IPageDownloader interface that simply download a page, I create my concrete instance and I use cache to check if a page is in cache, and then issue a request with ETag HttpHeader to check if the page is really changed. The obvious Windsor configuration can be the following.

{{< highlight xml "linenos=table,linenostart=1" >}}
<component
    id="NullCache"
    service="xxx.ICache, xxx"
    type="xxx.Cache.Nullcache, xxx"
    lifestyle="Singleton">
</component>

<component
    id="PermanentCacheOnDb"
    service="xxx.Cache.ICache, xxx"
    type="xxx.Cache.FullDatabaseCache, xxx"
    lifestyle="Singleton">
    <parameters>
        <connectionString>Database=Test;Server=localhost\sql2005;Integrated Security=SSPI</connectionString>
    </parameters>
</component>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The order of declaration is important, because if someone forget to declare explicitly the dependency, the kernel usually gets the first reference that is found in the configuration. This is the declaration of the element that uses cache.

{{< highlight xml "linenos=table,linenostart=1" >}}
<component
    id="Downloader"
    service="xxx.IPageDownloader, xxx"
    type="xxx.PageDownloaderAsyNoFlood, xxx"
    lifestyle="Transient">
    <parameters>
        <Cache>${PermanentCacheOnDb}</Cache>
    </parameters>
</component>
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But I like to have the concept of default component explicitly set in the configuration, for example I want NullCache to be the default cache that all objects will use if the user does not set explicitly in configuration file. How can you accomplish this? First of all add a parameter to the configuration of the default object

{{< highlight xml "linenos=table,linenostart=1" >}}
<component
    id="NullCache"
    service="xxx.ICache, xxx"
    type="xxx.Cache.Nullcache, xxx"
    lifestyle="Singleton"
    default="true">
</component>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Look at the default attribute, this is not an attribute that castle understands, so we need to build a facility that will use it.

{{< highlight xml "linenos=table,linenostart=1" >}}
public class DefaultComponent : AbstractFacility 
{
    protected override void Init()
    {
        Kernel.ComponentRegistered += OnComponentRegistered;
        Kernel.Resolver.AddSubResolver(new DefaultComponentResolver(defaults, Kernel));
    }

    private Dictionary<Type, ComponentModel> defaults = new Dictionary<Type, ComponentModel>();
    private void OnComponentRegistered(string key, IHandler handler)
    {
        if (handler.ComponentModel.Configuration.Attributes["default"] == "true") {
            defaults.Add(handler.ComponentModel.Service, handler.ComponentModel);
        }
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a very simple facility, it adds a subresolver to the standard resolver, then he scan all defined models (with an handler to the ComponentRegistered event), you can check for optional attributes in the Attributes property of the Configuration object of a componentModel, for each “default” component I store the service type and the model in a dictionary, and the same dictionary is passed to the *DefaultComponentResolver* that really does the work.

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 internal class DefaultComponentResolver : ISubDependencyResolver {
 2 
 3     private Dictionary<Type, ComponentModel> defaults;
 4     private readonly IKernel kernel;
 5     public DefaultComponentResolver(Dictionary<Type, ComponentModel> defaults, IKernel kernel) {
 6         this.defaults = defaults;
 7         this.kernel = kernel;
 8     }
 9 
10     #region ISubDependencyResolver Members
11 
12     public bool CanResolve(CreationContext context, ISubDependencyResolver parentResolver, ComponentModel model, DependencyModel dependency)
13     {
14         if (dependency.DependencyType == DependencyType.Service &&  
15              model.Parameters[dependency.DependencyKey] == null && //On config no specification
16              defaults.ContainsKey(dependency.TargetType)) {
17            return true;
18         }
19         return false;
20     }
21 
22     public object Resolve(CreationContext context, ISubDependencyResolver parentResolver, ComponentModel model, DependencyModel dependency)
23     {
24         ComponentModel defaulmodel = defaults[dependency.TargetType];
25         return kernel.Resolve(defaulmodel.Name, defaulmodel.Service);
26     }
27 
28     #endregion
29 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the interesting part is in the line 14 where I check if I need to set the dependency manually, I first check that the DependencyType is a Service, then that the parameters on the model is null, this because I must be sure that the user does not set explicitly a component reference, and finally that my dictionary contains the service type, this means that I have a default component for that type. If all conditions are true it means that this dependencies is a service, is not set in configuration and has a default, so I want to resolve myself. In the Resolve method I simply delegate the kernel to resolve the default component for me and the game is done

alk.

Tags: [Castle Windsor](http://technorati.com/tag/Castle%20Windsor) [IoC](http://technorati.com/tag/IoC)

<!--dotnetkickit-->
