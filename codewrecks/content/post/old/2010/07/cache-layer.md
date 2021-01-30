---
title: "Cache layer"
description: ""
date: 2010-07-07T11:00:37+02:00
draft: false
tags: [Aop,Architecture Castle]
categories: [Software Architecture]
---
Thanks to AOP concept, creating a cache layer that is transparent to the caller is not a big deal. I have a piece of code that in a loop calls this method

{{< highlight csharp "linenos=table,linenostart=1" >}}
ClientCompetitor competitor = Repository.ClientCompetitor.GetByCriteria(
Query.CreateEq("AssociatedClient", clieid))
.SingleOrDefault();
{{< / highlight >}}

This is based on a standard implementation of repository and a [Specification Pattern](http://en.wikipedia.org/wiki/Specification_pattern) as a query model. With [nhibernate profiler](http://nhprof.com/) I see that during the execution of this task, a lot of identical query are issued, because it gets called around 1000 times always with the same clieid.

Now before changing the code of the class to store in a dictionary&lt;ClieId, ClientCompetitor&gt; cached result, I like to handle this with a transparent cache layer used with AOP. This could be achieved registering this interceptor.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<component
id="RepositoryCache"
service="Castle.Core.Interceptor.IInterceptor, Castle.Core"
type="xxx.BaseServices.Castle.Cache2Interceptor, xxx.BaseServices"
lifestyle="transient">
<parameters>
<invocationCache>${WindowsCache}</invocationCache>
<Rules>
<dictionary>
<entry key="ClientCompetitor.*GetByCriteria">.classname(ClientCompetitor).absolute(600)</entry>
</dictionary>
</Rules>
</parameters>
</component>
{{< / highlight >}}

I simply create a Cache2Interceptor object that has a property called Rules to define regular expression to specify witch methods I want to apply cache to. With this configuration I ask to put cache in ClientCompetitor repository and with GetByCriteria method. The cache component use the Specification Pattern object for retrieving the key to the real cache implementation, and I tell cache component that the classname is (ClientCompetitor). The className is used because I can register other method as cache invalidator, as an example I can tell that the method Save of ClientCompetitor repository will invalidate the entire ClientCompetitor class.

When the interceptor is configured, I can simply tell castle to apply it to ClientCompetitor repository class, and the game is done.

Then I rerun the code and only one query gets issued, with no modification to the original code.

alk.
