---
title: "GitHub Copilot-X in action: simple code conversion"
description: "In a GitHub repository you can fine tuning which actions can run in your workflow"
date: 2023-05-09T06:00:00+00:00
draft: false
tags: ["GitHub"]
categories: ["security"]
---

New [Copilot X](https://github.com/features/preview/copilot-x) from [GitHub](https://github.com) is the next big thing for programmers, because it **brings the power of copilot to the next level**. Actually I'm testing the integrated chat in Visual Studio and Visual Studio Code. The tool is not always perfect, but we really need to understand how and where to use it to gain maximum advantage.

We often encounter **conversion operations** that are very mechanical, boring, and prone to errors due to their repetitiveness. When programming, we are very focused when doing something interesting, but when we perform simple operations, such as trivial conversions, we often make mistakes because our mind is elsewhere. Consider the following situation: you have an **aspnet core controller that needs to be converted to a server-side Blazor component**.

The constructor of this controller has many dependencies because it essentially has several components to perform a series of administrative operations.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public AdministrationController(
    IMongoIndexedDocumentAccessor mida,
    AtomicReadModelForceRebuilder atomicReadModelForceRebuilder,
    AtomicProjectionCheckpointManager atomicProjectionCheckpointManager,
    ICrmOmniSearchPoller crmOmniSearchPoller,
    ICrmSecurityOmniSearchPoller crmSecurityOmniSearchPoller,
    IProductsCatalogOmniSearchPoller productsCatalogOmniSearchPoller,
    IUsersOmniSearchPoller usersOmniSearchPoller,
    IGroupsOmniSearchPoller groupsOmniSearchPoller,
    IConcurrentCheckpointTracker concurrentCheckpointTracker,
    FeatureFlags featureFlags,
    OmniSearchPollerFactory omniSearchPollerFactory,
    IKernel kernel,
    OmniSearchIndexerPipeline omniSearchIndexerPipeline,
    AtomicReadModelDiscoveryService atomicReadModelDiscoveryService,
    IIdentityConverter identityConverter,
    DmsOmniSearchIndexer dmsOmniSearchIndexer)
{{< /highlight >}}

When converting this controller to a Blazor component, the class implementing the server-side Blazor component will need to declare a **property for each of these dependencies with the Inject attribute**.

This is a typical example of a simple, mechanical operation that is very boring, time-consuming, and, due to its tedious nature, risks being done poorly. Thanks to chat, you can simply select constructor declaration and ask it to convert it to the desired format. The prompt in this case is very simple:

"""
I need you to convert all these dependencies in Blazor declaring a property for each interface and using the [Inject] Attribute
"""

The result, in very little time, is exactly what we expected.
{{< highlight csharp "linenos=table,linenostart=1" >}}

public class AdministrationController : Controller
{
    [Inject]
    public IMongoIndexedDocumentAccessor Mida { get; set; }
    
    [Inject]
    public AtomicReadModelForceRebuilder AtomicReadModelForceRebuilder { get; set; }
    
    [Inject]
    public AtomicProjectionCheckpointManager AtomicProjectionCheckpointManager { get; set; }
    
    [Inject]
    public ICrmOmniSearchPoller CrmOmniSearchPoller { get; set; }
    
    [Inject]
    public ICrmSecurityOmniSearchPoller CrmSecurityOmniSearchPoller { get; set; }
    
    [Inject]
    public IProductsCatalogOmniSearchPoller ProductsCatalogOmniSearchPoller { get; set; }
    
    [Inject]
    public IUsersOmniSearchPoller UsersOmniSearchPoller { get; set; }
    
    [Inject]
    public IGroupsOmniSearchPoller GroupsOmniSearchPoller { get; set; }
{{< /highlight >}}

In simple operations like these, especially when there is a need to **change something from one format to another, GitHub Copilot chat** is a godsend. It effectively manages to generate the desired result in a very short amount of time and directly from your IDE, no need to switch to a browser or some other tool.

Actually I've put copilot chat windows in my second monitor, always visible and always available to serve my need. 

![Copilot Chat in action](../images/copilot-chat-in-action.png)

***Figure 1:*** *Copilot Chat in action*

Gian Maria

