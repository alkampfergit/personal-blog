---
title: "Basic Request Response WCF service"
description: ""
date: 2012-03-12T07:00:37+02:00
draft: false
tags: [Architecture,Wcf]
categories: [Software Architecture]
---
The concept of Request-Response service is to have an endpoint with a single function capable to handle a command (a Request) and return a Response, to have a single entry point of our service. There are a lot of architectures around the web based on WCF and this pattern and this [old series of post are a really good example](http://davybrion.com/blog/2009/11/requestresponse-service-layer-series/) on how you can implement it in practice.

The only drawback is that sometimes these architectures are quite complex for the average programmer, at least you can introduce them in a team where everyone is quite familiar with concept of Inversion Of Control, Dependency Injection, etc etc. The risk is that people are scared about the complexity and they start to believe that the benefit of such an architecture does not worth the extra complexity of the code, after all with WCF you can simply create a function on the interface, an implementation on a service class, update service reference and the game is done. On the contrary, some implementations of Request/Response pattern are quite complicated, you need to create a request, then the handler, then configure the IoC engine, etc etc.

![](http://i443.photobucket.com/albums/qq156/JenniferJ_28/PUZZLED-1.gif)

Another problem is that *one of the key requirement of an architecture is that it is perfectly understood by the whole team*, if some members use an architecture without fully comprehension, you are in trouble because you are creating a bottleneck because only some person of the team are capable to modify base architecture or solve bugs. This can lead to a fight between programmer and architecture, because everytime the service does not behave correctly people are puzzled on what happened (maybe the IoC engine is badly configured, maybe some interceptor created error, etc etc)

So I got a request from a team, how much is the minimum code that I need to create a Super Simple Request/Response architecture in WCF, the purpose is verify if it is *simple enough to introduce in team unfamiliar with IoC, DI, and with a very basic skill of WCF*. This approach is preferable, you can show how simple is to implement such a pattern with a minimum set of functionality, then when the needs of the team start to grow, you can evolve the architecture one step at a time, making it really comprehensible by the whole team because they fully understand the reason of each piece of the game.

The starting point is creating an interface, a concrete implementation and finally two base classes called Request and Response.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image6.png)

 ***Figure 1***: *Base classes to create a super simple Request/Response sample*

As you can see I have a simple  **ICoreService** interface with only a method called Execute, that accepts a Request and return a response. The  **CoreService** concrete class implements the IDisposable interface (more to come) and the execute method. Then I have a basic  **Request** abstract class with an abstract method called  **Execute()** , finally the base Response class has only two property:  **IsSuccess** to inform if the operation completed successfully, and an  **ErrorCode** , to contain an integer code of the error (but you can include more common property if your client needs to know you want in your basic Response class). Here is the code for the base Request class.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image7.png)

The class is really simple, just add the DataContract attribute and the abstract method. Here is the code for the CoreService class. The core concept is that it simply add some infrastructural code (the try catch at the minimum level) and it simply call Execute method that will be implemented by the real request class.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image8.png)

This class implements IDisposable because the ICoreService inherit from IDisposable (I show the reason of this structure in a future post), but the core part is that it simply calls the Execute abstract method of base Response class in a try catch. Now lets see how we can implement an operation to add Two numbers.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image9.png)

As you can see this is really simple, create one class, insert a property for each input parameter and override the Execute method. With such a simple architecture everyone can use it without any fear of “not understanding the big picture”. The only other class you need to create is the MathOperationResult that inherits from Response and add an OperationResult property to return the result of the operation to the caller.

The only other infrastructural class needed to make this code works, is a class that instruct the WCF engine at run-time on all the types that can be used in the contract, called * **KnownTypes** *. The ICoreService interface is decorated with a  **ServiceKnownType** attribute that specify the class that is capable to give the list of known types at runtime.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image10.png)

Implementing such a class is really trivial.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image11.png)

In static constructor I scan the current assembly to find all non abstract types that inherits from Request and response and store them in a list, that I return in the GetKnownTypes. This technique is really useful, because you can also scan for all assembly in a directory, so you can load at runtime Requests originally unknown from the original service as a plugin. Thanks to this great flexibility of WCF, you can use WCF infrastructure to handle all serialization issue for you.

The client can simply add a service reference and call the service with this code.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image12.png)

 ***Figure 2***: *You can add a normal service reference from another project*

Here is the call.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image13.png)

The only drawback of this architecture is a little verbosity in client code, that instead of calling something like Add(12, 32), needs to create the request, cast the response to the right type and verify the success of the operation, but you have the advantage of a single entry point of your service, where you can put all the common logic you want and every person in the team can fully understand what is going on.

Gian Maria.
