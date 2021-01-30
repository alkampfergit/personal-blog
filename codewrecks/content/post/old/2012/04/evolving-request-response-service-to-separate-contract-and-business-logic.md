---
title: "Evolving Request Response service to separate contract and business logic"
description: ""
date: 2012-04-23T11:00:37+02:00
draft: false
tags: [Architecture,MEF,Wcf]
categories: [Software Architecture]
---
Example [**can be downloaded here**](http://www.codewrecks.com/Files/requestresponsemef.zip) **.** I previously described a scenario where the customer needs a [really basic Request Response service in WCF](www.codewrecks.com/blog/index.php/2012/03/12/basic-request-response-wcf-service/), the goal is being able to take [advantage of a request / response structure](http://www.codewrecks.com/blog/index.php/2012/04/05/reson-behind-request-responseservice-in-wc/), but with an approach like: “*the simpliest thing that could possibly works*”. This technique is usually needed to  **introduce new architectural concepts in a team** without requiring people to learn a huge amount of concepts in a single shot, a scenario that could ends in a  team that actively * **fight the new architecture because it is too complex** *.

Once the team is used to the basic version of the Request/response service and understand the advantage of this approach, it is time to evolve it towards a more mature implementation, and since the grounding concepts are now clear, *adding a little bit of extra complexity* is usually a simple step. This is the concept of Evolving Architecture or [Emergent Design](http://en.wikipedia.org/wiki/Emergent_Design), the goal is to introduce functionality and adding extra complexity only  **to answer a requirement need and not for the sake of having a Complete/Complex architecture**. After a little bit of usage of the basic version of the Request Response service, some new requirements lead to an improvement of the basic architecture. The very first problem of the actual basic architecture is: * **contract and implementation are contained in the same class** *.

[![Class diagram of a sample Request class](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/image_thumb.png "Figure 1.")](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/image.png)

 ***Figure 1***: *Class diagram of a sample Request class*

In  **Figure 1** you can see a sample request, it is called *AddTwoNumber*and it contains both the contract definition and the business logic that execute the request. *This coupling is too high* and the new requirement ask to separate contract from the business logic and also  **requires to evolve the architecture to make it possible loading contracts and business logic from separate assembly using the concept of** * **Plugin**.*

This new requirement can be solved easily with MEF, a library that will take care of everything about discovering and loading all *request / response / handler* objects that compose our service. I started **removing the Execute method from the basic Request class and moving it to another class Called Handler** , that will take care of the execution of a request.

[![New version of the base Request and Response classes](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/image_thumb1.png "New version of the base Request and Response classes")](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/image1.png)

 ***Figure 2***: *New version of the base Request and Response classes*

As you can see from  **Figure 2** Request and Response class are now only just base contract classes, with no method related to execution; they contains only properties.  **To execute a request and return a Response we need another class called Handler** , that is capable of *Handling a request and returning a response.*The key concept is that  **for each request we have a separate handler that is capable of executing that request** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/image2.png)

I decided to introduce a *basic abstract class with no generic*,  **this base class is able to handle a Request object** and then I inherited another abstract class called *Handler&lt;T&gt;***** **capable of handling a specific type of request** , here is the full code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[InheritedExport]
public abstract class Handler
{
    public Response Handle(Request request)
    {
        return OnHandle(request);
    }
    protected abstract Response OnHandle(Request request);
    public abstract Type RequestHandledType();
}
public abstract class Handler<T> : Handler where T : Request
{
    protected override Response OnHandle(Request request)
    {
        return HandleRequest((T) request);
    }
    protected abstract Response HandleRequest(T request);
    public override Type RequestHandledType()
    {
        return typeof(T);
    }
}

{{< / highlight >}}

The key point in this structure is:  **the base Handler class has MEF Specific** [**InheritedExport**](http://msdn.microsoft.com/en-us/library/ee388321.aspx) **attribute** , that basically  **tells to MEF engine to automatically Export all types that inherit from this base type**. The basic Handler class has a *RequestHandledType()* method to specify the concrete Request class executed by this handler, this permits me to override it in the Handler&lt;T&gt; just returning typeof(T).  **The same InheritedExport attribute is then added to Request and Response class** to make them loadable by MEF. The cool part is that everything related to discovering Requests, Responses and Handlers is done by MEF. All MEF functionalities are shielded by a simple MefHelper class.

{{< highlight as3 "linenos=table,linenostart=1" >}}


public static class MefHelper
{
    private static CompositionContainer theContainer;
    private static DirectoryCatalog catalog;
    static MefHelper()
    {
        catalog = new DirectoryCatalog(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location));
        theContainer = new CompositionContainer(catalog);
    }
    public static void Compose(Object obj)
    {
        var cb = new CompositionBatch();
        cb.AddPart(obj);
        theContainer.Compose(cb);
    }
    public static T Create<T>()
    {
        return theContainer.GetExportedValue<T>();
    }
    public static CoreService CreateService()
    {
        return Create<CoreService>();
    }
}

{{< / highlight >}}

Code is minimal, I simply create a MEF catalog to scan all assemblies that are in the same directory of the executing assembly and a couple of helper methods to simplify composition and exporting value. The  **key method here is the CreateService() that internally uses MEF to create a concrete implementation of the CoreService class,** where CoreService is the class that is exposed as a WCF service.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Export(typeof(ICoreService))]
public class CoreService : ICoreService
{
    #region ICoreService Members
    private Dictionary<Type, IList<Handler>> HandlerForTypes = new Dictionary<Type, IList<Handler>>();
    private IList<Handler> GetHandlersForType(Type type) {
        if (!HandlerForTypes.ContainsKey(type)) {
            HandlerForTypes.Add(type, new List<Handler>());
        }
        return HandlerForTypes[type];
    }
    [ImportingConstructor]
    public CoreService([ImportMany(typeof(Handler))] IEnumerable<Handler> handlers)
    {
        foreach (var handler in handlers)
        {
            GetHandlersForType(handler.RequestHandledType()).Add(handler);
        }
    }

{{< / highlight >}}

CoreService class was modified to use this new architecture, **first of all I added the Export attribute** to tell MEF that this class is an Export for the ICoreService class service, **then I added a simple Dictionary to associate each request with the corresponding handler** and finally **I added a Cosntructor with the *ImportingConstructorAttribute* and the *ImportMany* attribute on the single parameter of IEnumerable&lt;Handler&gt;**. This specific constructor tells MEF that CoreService class needs the list of all Handlers discovered by MEF and it is the magic attribute that permits you to make MEF scan all dll in the current directory to find every class that inherit Handler basic abstract class. In the constructor there is a simple foreach used to associate each handler to the concrete Request that it is capable to handle, this is accomplished with *RequestHandledType()* discussed previously.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public Infrastructure.Response Execute(Request request)
{
    try
    {
        var handlerList = GetHandlersForType(request.GetType());
        if (handlerList.Count == 0)
            return new Response() { IsSuccess = false };
        if (handlerList.Count == 1) 
            return handlerList[0].Handle(request);
        throw new NotSupportedException();
    }
    catch (Exception ex)
    {
        return new Response() { IsSuccess = false, ErrorMessage = "Exception during execution" };
    }
}

{{< / highlight >}}

The execute method is really simple, *for each request I verify if an appropriate Handler was available, if I have no handler I return an error, if I have a single Handler I simply use it to execute the Request and finally if I have more than one single Handler I throw an Exception because this is an unsupported scenario for this version*.  **Thanks to MEF and very few lines of code I was able to evolve the basic structure in a more complex architecture where the CoreService dynamically loads Request/Response/Handlers of the concrete implementation**.

Now you can take the old *AddTwoNumber* request from previous example and evolve it to fit this new architecture. The only operation we need to do is removing the Execute() method from the request and move in an appropriate Handler as shown in this simple snippet.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class AddTwoNumberHandler : Handler<AddTwoNumberRequest>
{
    protected override Response HandleRequest(AddTwoNumberRequest request)
    {
        return new MathOperationResult(request.FirstAddend + request.SecondAddend);
    }
}

{{< / highlight >}}

The code to implement a business operation is really minimal, just inherit from  **Handler&lt;AddTwoNumber&gt;** override the Handle request and  **let the infrastructure takes care of everything else**. A working example [can be downloaded here](http://www.codewrecks.com/Files/requestresponsemef.zip) and in future posts I will explain all the other parts of this infrastructure related to MEF and runtime discovering of plugin.

Gian Maria
