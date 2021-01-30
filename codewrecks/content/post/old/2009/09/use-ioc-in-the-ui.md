---
title: "Use IoC in the UI"
description: ""
date: 2009-09-21T06:00:37+02:00
draft: false
tags: [IoC]
categories: [Castle]
---
I have a UI that uses MVC pattern, and it communicates with the server through a service exposed with WCF. Now one of the most annoying stuff is a correct handling of all typical errors that could arise in such a situation. We can have different result when you call a service method

1. The operation succeeded
2. The operation failed for an exception of the server that was not handled
3. The server is unreachable
4. Validation of some object failed
5. The server  fail with a specific reason that can be handled by the UI

All these situation lead to different behavior of the UI. As an example point 3 should show a message that suggest the user to check connectivity because the server is unreachable, while for point 2 we could simply show a message like â€œthe server encountered an error, try again and if the error persist contact the supportâ€. For each point I have always the same sets of actions to do, and I want a way to handle this only in one single point.

The solution is using an interceptor that wraps the instance of the service. If a controller needs to use a service it simply declares a dependency

{{< highlight csharp "linenos=table,linenostart=1" >}}
public ICustomerService CustomerService { get; set; }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thus when I resolve the controller with castle this property gets filled with the concrete service class, or with the WCF proxy, or with a mock or with whatever implementation you like :), that’s the power of IoC. Now the trick is to create a concrete class of an interceptor to wrap the instance.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var interceptor = new ClientServiceWrapperInterceptor();
interceptor.SecurityException += InterceptorSecurityException;
interceptor.ServiceException += InterceptorServiceException;
interceptor.ServiceFailure += InterceptorServiceFailure;
interceptor.ValidationFailed += InterceptorValidationFailed;
CustomerService = IoC.Wrap(CustomerService, interceptor);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The need to create an interceptor here in the code, instead of configuring it with castle is to avoid using static events that I do not like very much. With such a code I create an instance of a given interceptor, then I add handlers for different type of evens. The SecurityException event is launched when the user access a service methods that is not permitted to his role, and the others events are used to communicate a failure in validation or a service exception. Thanks to the Wrap function of the IoC helper class I can simply wrap the service with this interceptor.

Now we need a little bit of convention over configuration, because the interceptor swallows all exceptions, leaving to the controller the task of reacting to specific events, the controller needs to know if an operation was successful. For my project all service methods returns: a dto, or a Boolean that states if the operation succeed, or an integer or double. To make things simple I decided by convention that if a method will return null, or Int32.MinValue, or Double.MinValue or false, it means that the invocation failed. Here is a typical call

{{< highlight CSharp "linenos=table,linenostart=1" >}}
generatedId = CustomerService.InsertLinkResult(currentLinkData);
if (generatedId == Int32.MinValue) return;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The Method InsertLinkResult will insert a specific object into database and return the Id of the new object, so I need only to check if generatedId is equal to Int32.MinValue. If this condition is true,  it means that some exception is occurred, so I can simply return from the method avoiding doing other operations because this failed. If there is  a validation I show a form that list errors, etc etc. The good stuff about this approach, is that I write error handling code only in one place.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static void InterceptorServiceException(object sender, ServiceExceptionEventArgs e)
{
    if (e.Exception is System.ServiceModel.CommunicationException)
    {
        ShowMessage("Impossibile contattare il servizio, controllare la connessione di rete.", "Errore", MessageBoxIcon.Error);
    }
    else
    {
        ErrorLog.ShowException(e.Exception);
    }

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the handler for generic exception, where I simply check if the exception is a CommunicationException, so I can show a simple Messagebox, for every other exception I show a form with detailed errors and the ability to send the errors to the team by email.

Thanks to IoC I centralized errors handling in the ui without code duplication.

alk.

Tags: [IoC](http://technorati.com/tag/IoC)
