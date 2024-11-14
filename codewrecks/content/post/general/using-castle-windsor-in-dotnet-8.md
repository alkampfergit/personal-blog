---
title: "Using Castle Windsor in .NET 8"
description: "I've used Castle Windsor for years and I found it to be a fantastic library but..."
date: 2024-11-14T08:00:00+02:00
draft: false
tags: ["programming"]
categories: ["castle"]
---

Microsoft introduced Dependency Injection in the base framework with .NET Core, but until then, with the classic framework, we used external libraries, I've used Castle Windsor for years without any problem, but **when .NET 8 was out, we start having tons of problems.**

The main problem is that with .NET 8 Microsoft **introduced a concrete and working implementation of Named Dependencies**, you can [find some details here](https://weblogs.asp.net/ricardoperes/net-8-dependency-injection-changes-keyed-services). The problem is that Castle Windsor Adapter does not work with keyed services, so I wrote with my friend [Alessandro](https://github.com/AGiorgetti) a working version, that is still in PR with the official driver.

The problem is that Microsoft Dependency Injection works with different paradigms that Castle Windsor and almost all Microsoft Libraries expect Dependency Injection mechanism to work their way, not Castle Way. As an example, if **you use Microsoft Orleans, it absolutely does not work without supporting of keyed service**. I've forked the library [https://github.com/alkampfergit/Windsor](https://github.com/alkampfergit/Windsor) and I've done a Pull Request, but we really modified lots of stuff so the PR is not still merged.

But nevertheless we are using it in production because we cannot afford not to upgrade Orleans due to Castle.

> If you use an open source library for some core component of your application the risk is lack of maintainer blocking you from upgrading.

Despite having our modification that supports keyed services, we still have problem, sometimes the resolution in castle completely goes in deadlock. This happens because we are resolving service A that depends on B (Singleton) that in turn seems to depend on A again (circular dependency). That happens **because Castle Windsor inject not only dependencies in constructors, but also on public properties**. So when Microsoft or others designed their types to be used with Microsoft DI they does not thing that a public property declares a dependency. The result is a random hang of our application on startup. 

To solve this Castle allow for custom Property inspector classes that we can use

{{< highlight csharp "linenos=table,linenostart=1" >}}
var conversionManager = _container.Kernel.GetConversionManager();
var customPropertyResolver = new UniqueHostPropertiesDependenciesModelInspector(conversionManager);
_container.Kernel.ComponentModelBuilder.AddContributor(customPropertyResolver);
{{< / highlight >}}

This is **the power of Castle, it can be extended in a very flexible way**, but this is also its weakness. Since it can do lots of interesting and fancy stuff, usually people uses to the fullest capabilities (why not, it worked perfectly), then removing from a 10 years project is absolutely not simple.

Here is the implementation of the class

{{< highlight csharp "linenos=table,linenostart=1" >}}
  public class UniqueHostPropertiesDependenciesModelInspector : PropertiesDependenciesModelInspector
  {
      public UniqueHostPropertiesDependenciesModelInspector(IConversionManager converter) : base(converter)
      {
      }

      protected override void InspectProperties(ComponentModel model)
      {
          var fullName = model.Implementation.FullName;
          if (fullName.StartsWith("Microsoft.AspNetCore.") || fullName.StartsWith("Orleans"))
          {
              //Avoid inspection of properties due to castle resolving properties, thus creating a circular dependency.
              return;
          }
         
          base.InspectProperties(model);
      }
  }
{{< / highlight >}}

This simple code allows me to avoid injecting properties in all of AspNetCore components and Orleans, because we found that **with standard resolution we can have a deadlock**. 

Software is a complex thing, using complex open source libraries helps you, but when the library start being not maintained anymore, you should always have plan B :/.

Gian Maria.
