---
title: "AoP with castle part 4ndashAdding AoP to service oriented App"
description: ""
date: 2011-02-19T09:00:37+02:00
draft: false
tags: [Aop,Castle]
categories: [Castle]
---
Previous Parts of the series

[Part 1 â€“ The basic of interception](http://www.codewrecks.com/blog/index.php/2010/06/01/aop-with-castle-part-1/)  
[Part 2 â€“ Selecting Methods to intercept](http://www.codewrecks.com/blog/index.php/2010/06/08/aop-with-castle-part-2-selecting-methods-to-intercept/)  
[Part 3 â€“ The first interceptor](http://www.codewrecks.com/blog/index.php/2010/08/09/aop-with-castlepart-3-the-first-interceptor/)

AOP works great if you have clear interfaces where you want to put some standard and shared logic, and a Service Oriented Application falls in this category. A service is just a bunch of methods that will share some common behavior like: Validation, logging, Security etc etc, so it is a good strategy to create interceptors for each one of this behavior and associate them to service classes. The good point is that Castle has a dedicated facility to integrate with WCF, that basically is able to resolve WCF server classes with castle. Setting up such a facility is really simple, and you can follow the instruction f[ound on castleâ€™s site](http://stw.castleproject.org/Windsor.WCF-Integration-Facility.ashx).

Surely the first aspect you can add to a Service is the ability to log every call (seen in previous post), but you can also centralize some other operations such as: Exception management or NHibernate session handling.

Validation is another operations that benefit from being applied with AOP. In SOA scenario, services will usually accepts dto objects containing all data needed to accomplish a certain operation. Dto are used because services usually exposes a coarse grained interface to limit the number of calls needed to accomplish a business operation. This is because each call is usually made across a network and latency forces you to limit number of calls, this lead to a common pattern where a business operation is implemented with a single call accepting a dedicated dto. In our example, to create a new album we need to pass an Album object (in real scenario this object will have a list of songs). It is not a real dto because it is a Domain Object, but for this simple example think that it is a dto J, Iâ€™ve decorated entity properties with validation attributes.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[DataMember]
[Required("La proprietÃ  Titolo Ã¨ richiesta")]
[RangeLength("Il titolo deve essere compreso tra 1 e 50 caratteri", 1, 50)]
public virtual string Title { get; set; }
 
[Required("La proprietÃ  Autore Ã¨ richiesta")]
[RangeLength("L'autore deve essere compreso tra 1 e 50 caratteri", 1, 50)]
[DataMember]
public virtual string Author { get; set; }
{{< / highlight >}}

Those attributes are used by a validation library that is able to take an object as input and tell us if it is valid or not. Creating a validation aspect on this structure is straightforward because you can simply validate all objects that are not primitive one, or you can make all of your dto implement a marker interface, or you can use convention over configuration. The important concept is that a service call accepts one or more dto and each one support validation.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class ValidatorAspect : IInterceptor
{
#region IInterceptor Members
 
private DotNetMarche.Validator.Core.Validator validator = new Validator();
 
public void Intercept(IInvocation invocation)
{
foreach (object argument in invocation.Arguments)
{
if (!argument.GetType().IsPrimitive) validator.CheckObject(argument);
}
invocation.Proceed();
}
 
#endregion
}
{{< / highlight >}}

Method CheckObject() takes an object as argument, and raise a ValidationException if the object does not satisfy some validation rule. With this simple interceptor Iâ€™m sure that each call with invalid dto will throw an exception bringing me two distinct advantages: the first is that no invalid object will ever reach a service method and the other one is that the exception raised carries validation errors, so the client is able to understand why the call is failed. Suppose that the Album.Name is a required property, without validation here is the exception returned from a call with invalid arguments.

> *not-null property references a null or transient valueMusicStore.Entities.Album.Title **Server stack trace:** at System.ServiceModel.Channels.ServiceChannel.ThrowIfFaultUnderstood(Message reply, MessageFault fault, String action, MessageVersion version, FaultConverter faultConverter)**at System.ServiceModel.Channels.ServiceChannel.HandleReply(ProxyOperationRuntime operation, ProxyRpc& rpc)Now we have a service that when called with an invalid data will return some useful exception that tells us what exactely is the error.*

Clearly this a NHibernate exception and the caller probably does not know anything about NH to understand why the call failed. Moreover it is not a good strategy to let all exceptions flow to caller, especially for security reason.

Now activate validator interceptor and look at what is happening when you invoke the SaveAlbum()with an empty dto: now a ValidationException is raised and the message is.

> *Title property length should be in range 1-50 **Title property is required.** Author property is required.**Author property length should be in range 1-50*

This is a really clear exception that can be used from the client to understand why the call failed. Now the next step is send back exception data in a way that is more WCF compliant, this is needed because the above examples where run with this configuration

{{< highlight csharp "linenos=table,linenostart=1" >}}
includeExceptionDetailInFaults="true"
{{< / highlight >}}

this is a bad practice, because exceptions should not flow to the caller, but if you set this value to false, when an exception occurs on the server, the client gets

> *The server was unable to process the request due to an internal error. For more information about the error, either turn on IncludeExceptionDetailInFaults â€¦.*

WCF has a specific technique to send back exception data to the caller in a Service Oriented way, you should specify with an attribute witch object will carry exception data to the caller, so whenever an exception occurs, the caller will receive a valid response object with data.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[OperationContract, FaultContract(typeof(FaultDetail))]
int Save(Album album);
{{< / highlight >}}

As you can see, this declaration informs the client that in case of fault, service will return failure details in an object of type FaultDetail.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/image6.png)

When an exception happens, server code should throw a very specific type of exceptions of type FaultException with the type of exception data as Type parameter, as showed with this code:

{{< highlight csharp "linenos=table,linenostart=1" >}}
throw new FaultException<FaultDetail>(
{{< / highlight >}}

Thanks to AOP we can wrap every exception of the service and create specific data to be sent back to the client, categorizing types of error. Here is the code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void Intercept(IInvocation invocation)
{
try
{
invocation.Proceed();
}
catch (FaultException<FaultDetail>)
{
throw;
}
catch (ValidationException vex)
{
throw new FaultException<FaultDetail>(new FaultDetail(vex), "Validation Failed");
}
catch (Exception ex)
{
Logger.Error("Intercepted generic exception on service call", ex);
throw new FaultException<FaultDetail>(
new FaultDetail(ex), new FaultReason(ex.Message));
}
}
{{< / highlight >}}

As you can see, if the calls throws a FaultException&lt;FaultDetail&gt; we can simply rethrow (someone else in the stack already packed a correct WCF exception message), but if a validation exception occurs we should pack all validation exception in a FaultDetail object and throw back to the caller. Finally, for every generic exception we can simply pack exception information in FaultDetail object and tells to caller that something gone wrong.

Another interesting interceptor is used to manage the unit of work for single WCF call. For each call it simply check if a session was already created for that call, if not, it creates one and begin a transaction. It catch also all exception and if an exception occurs, it simply rollback the transaction and rethrow.

The advantage of using AoP is the ability to inject common logic in service pipeline to handle common aspect: validation, session management and error handing in a unique and common position.

Alk.
