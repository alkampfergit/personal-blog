---
title: "Converting a big project to NET Standard without big bang"
description: ""
date: 2019-08-05T16:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Visual Studio]
---
When you have a big project in.NET full framework and you want to convert to.NET standard / core,  **usually MultiTargeting can be a viable solution to avoid a Big Bang conversion.** You starts with the very first assembly in the chain of dependency, the one that does not depends on any other assembly in the project, and you start checking compatibility with.NET standard for all referenced NuGet Packages. Once the first project is done you proceed with the remaining.

The very first step is converting [all project files to new project format](http://www.codewrecks.com/blog/index.php/2018/10/27/converting-a-big-project-to-new-vs2017-csproj-format/), leave all project to target full framework, then you can use a nice technique called MultiTargeting starting with the aforementioned first assembly of the chain.

> Multitargeting allows you to target both framework with a single Visual Studio Project

To enable it just edit project files, and change TargetFramework to TargetFramework **s** (mind the final s) and specify that you want that project compiled for Full Framework and.NET Standard. Including.NET Standard in the list of target framework requires removal of all code that is dependent on Full Framework, but this  **is not always obtainable in a single big bang conversion, because the amount of code could be really high.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-10.png)

 ***Figure 1***: *Multi Targeting in action*

 **To easy the transition I usually add some constants so I’ll be able to use #ifdef directive to isolate some piece of code only when the project is targeting Full Framework.** {{< highlight xml "linenos=table,linenostart=1" >}}


  <PropertyGroup Condition=" '$(TargetFramework)' == 'netstandard2.0'">
    <DefineConstants>NETCORE;NETSTANDARD;NETSTANDARD2_0</DefineConstants>
  </PropertyGroup>

  <PropertyGroup Condition=" '$(TargetFramework)' == 'net461'">
    <DefineConstants>NET45;NETFULL</DefineConstants>
  </PropertyGroup>

{{< / highlight >}}

> Thanks to conditional compile we can have some of the code that is compiled only for full framework, or we can have different implementation for a given class (full or netstandard)

After multitarget is enabled and netstandard is one of the target,  project usually stops compiling, because it usually contains some code that depends on full framework. There are two distinct problems: A) nuget packages that does not support netstandard, B) references to full framework assembly.  **To solve the problem you must use conditional referencing, setting the references only for specific framework version.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-11.png)

 ***Figure 2***: *Conditional reference in action.*

As you can see in  **Figure 2** I can reference difference nuget packages or assemblies depending on the version of framework used.  **The nice part is being able to reference different version of a library (ex System.Buffers) for full framework or.net standard framework.** At this point the project usually stops compiling because code references classes that are not available in netstandard, as an example in  **Figure 2** you can verify that netstandard misses lots of references like System.Runtime.Caching and System.Runtime.Remoting.  **For all code that uses references not available for netstandard project just use a #ifdef NETFULL to compile those classes only with full framework.** This is not a real complete solution, but at the end you will have your project that is still fully functional with.NET full framework, and a nice list of #ifdef NETFULL that identify the only parts that are not available in netstandard. Now you can continue working as usual while slowly removing and upgrading all the code to netstandard.

Now repeat the process this for every project in the solution, usually there are two scenarios:

*1) The vast majority of the code is full functional with netstandard, there are very few point in the code where you use #ifdef NETFULL.   
2) Some of the classes / functionality available only in full framework are extensively used in all of your code, the amount of code with #ifdef NETFULL is becoming too big*

Point 1 is the good side, you can continue working with full framework then convert remaining code with your pace. If you find yourself in point 2, as an example if some code uses MSMQ you should  **isolate the full framework depending code in a single class, then use Inversion Of Control to inject concrete class.** As an example, instead of having lots of points in the code that uses MSMQ simply abstract all the code in a IQueue interface, create a MSMQQueue class and you have a single point of code that is not available for netstandard. You can then write code that uses Rabbit MQ and the problem is gone with a simple class rewrite.

Lets do an example:  **I have a InMemoryCacheHelper to abstract the usage of MemoryCache, and since MemoryCache class from System.Runtime.Caching is not available in netstandard, I simply protect the class with #if NETFULL conditional compiling.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-13.png)

 ***Figure 3***: *Conditional compilation, this is version of the class for NET Full.*

Looking in the documentation there is a nuget package called Microsoft.Extensions.Caching.Memory meant to be a replacement for MemoryCache standard full framework class. I can use this NuGet packages to create an implementation of InMemoryCacheHelper compatible with netstandard.

> When you enable multitargeting it is quite common to manually edit references in project file, because references are different from Full Framework build and NetStandard build.

 **Remember that you need to reference the full framework version (1) for net461 compilation, but reference nuget package for netstandard version. This can be done manually editing references in csproj file**  **Figure 4**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-14.png)

 ***Figure 4***: *Reference the correct assembly or NugetPackage based on framework version.*

Now you come back to the InMemoryCacheHelper class add an #else branch to the #ifdef NETFULL directive and start writing a version of the class that uses Microsoft.Extensions.Caching.Memory. One class after another you will have all of your code that is able to target both net full and netcore. **You can rewrite the entire class or you can use the same class and use #if NETFULL inside each method, I prefer the first approach but this is what happens when I’m starting editing the netstandard version of the class** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-15.png)

 ***Figure 5***: *No highlight and no intellisense because we are in a conditional compilation branch that evaluates to false.*

Ouch, since we are in a branch of conditional compilation that evaluate to false, VS does not offer highligh, no intellisense, everything is greyed out. At this point you should be aware that,  **when you use multitargeting, the order of the frameworks in the project file matters. The first framework in &lt;TargetFrameworks&gt; node is the one that VS would use to evaluate conditional compilation**. This means that, when you are working on classes or piece of code that should target both full framework and NET standard, you need to change the order to fit your need.

In this example I needed to change &lt;TargetFrameworks&gt;net461;netstandard2.0;&lt;/TargetFrameworks&gt; to &lt;TargetFrameworks&gt;netstandard2.0;net461&lt;/TargetFrameworks&gt;, save project file and unload and reload the project (sometimes you need to force a project reload) and Visual Studio will consider netstandard2.0 during code editing.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-16.png)

 ***Figure 6***: *Reversing the order of the frameworks, will enable intellisense for netstandard branch of the conditional compilation directive.*

Now you can edit the netstandard version of your class and convert one by one all parts of the code that does not natively run on netstandard.

Happy coding.
