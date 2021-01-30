---
title: "Write a custom lifecycle for castle windsor"
description: ""
date: 2007-09-11T23:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
In [another post](http://www.nablasoft.com/Alkampfer/?p=105) I spoke about castle Windsor and lifecycle of objects, now I want to show how to write a custom lifecycle. First of all the class must inherit from *AbstractLifestyleManager* class, then we must choose where to store the instance of the object that are created by the container. Since I want to build a lifecycle that can be used both from winform code and from web code I choose to use [System.Runtime.Remoting.Messaging.CallContext class](http://msdn2.microsoft.com/en-us/library/system.runtime.remoting.messaging.callcontext.aspx), this class is used internally to implement the HttpContext so it can be used to store object for a HttpCall. But I need another behavior, I need to programmatically manage the lifecycle from calling code, this is especially useful for testing purpose. The result is a class called *ManageableLifeCycle*  used to implement a custom lifecycle that can be managed from called code.

The final result should be a lifecycle that is transient by default, but that can become singleton when the caller needs it, and only for a small amount of time. First step is making our custom lifecycle overrides the *Resolve()*method, that is called by castle when he need to resolve an object. This is the code.

publicoverrideobject  Resolve(global::Castle.MicroKernel.CreationContext  context)  {  
if  (contextBag  !=  null)  {  
//We  are  in  a  context  
if  (\_instance  ==  null)  {  
              \_instance  =  base.Resolve(context);  
              contextBag.Add(\_instance);  
        }  
return  \_instance;  
  }  else  {  
//We  are  not  in  a  context  
returnbase.Resolve(context);  
  }  
}

First of all you should know that castle creates a lifecycle manager for each defined components. Our lifecycle defines an arraylist called contextBag that contains all the instance that are created in a context, the context is defined from calling code, so if the calling code does not create a context the lifecycle of the object is the same as transient. As you can see the code first checks if the contextBag is null, if is null it simply returns base.Resolve() actually creating a new entity for each call. If the contextBag is not null we are inside a context, so we create the object and store it into a inner field called \_instance. This means that our context works like a singleton inside a context and as transient outside the context. Please note that the instance created is also stored inside the arraylist stored in the CallContext. Now the lifecycle must also override the *Release()* method, called when the client code calls Release() on an instance created through the container.

publicoverridevoid  Release(object  instance)  {  
if  (contextBag  ==  null)  {  
base.Release(instance);  
  }  else  {  
if  (!contextBag.Contains(instance))  
base.Release(instance);  
  }  
}

If we are not in a context (contextBag != null) the lifecycle calls the base version of Release, but if we are in a managed cycle we release the object only if it is not contained in the contextBag, this is needed to mimic the same behavior of the singleton lifecycle, this means that calling Release inside a Contex does not release anything. Ok, now the goals it to make this test pass.

publicvoid  TestInsideContext()  {  
using  (IoC.OverrideGlobalConfiguration(@”Castle\Windsor\ManageableLifeCycle\WindsorConfig.xml”))  {  
ITest  dt1,  dt2;  
using  (ManageableLifeCycle.BeginThreadContext())  {  
              dt1  =  IoC.GetObject&lt;ITest&gt;();  
              dt2  =  IoC.GetObject&lt;ITest&gt;();  
Assert.AreSame(dt1,  dt2);  
        }  
//Context  is  ended  now  all  requested  object  are  new.  
Assert.AreNotSame(dt1,  IoC.GetObject&lt;ITest&gt;());  
//Check  that  object  are  really  disposed  when  we  are  outside  of  a  context  
Assert.IsTrue(dt1.IsDisposed,  “object  gets  not  disposed  correctly  at  the  end  of  the  context”);  
  }  
}

When we call static method *BeginThreadContext()* we are actually asking to our lifecycle manager to go in singleton mode beginning a contet, but when the using block is ended the behavior is reverted to singleton. This is not enough because all objects created inside the context should be disposed if they implement the IDisposable interface. First of all let’s see the code to begin a context

publicstaticDisposableAction  BeginThreadContext()  {  
if  (contextBag  !=  null)  
thrownewInvalidOperationException(“Another  thread  context  was  already  begun”);  
CallContext.SetData(dataId,  newArrayList());  
returnnewDisposableAction(delegate()  {  
        EndThreadContext();  
  });  
}

We simply store a new arraylist in System.Runtime.Remoting.Messaging.CallContext class using a guid as key identifier, then we create a disposable action that simply call EndThreadContext.

publicstaticvoid  EndThreadContext()  {  
if  (contextBag  ==  null)  
thrownewInvalidOperationException(“No  thread  context  is  begun.”);  
foreach  (object  obj  in  contextBag)  {  
IDisposable  d  =  obj  asIDisposable;  
if  (d  !=  null)  
              d.Dispose();  
  }  
CallContext.FreeNamedDataSlot(dataId);  
}

The EndThreadContext simply iterate through the list of created objects, and if an object implements IDisposable it simply calls the Dispose Method. Now if you create a simple httpModule that calls BeginThreadContext at the beginning of a request and calls EndThreadContext at the end of the same request you have singleton behavior only for the scope of the WebRequest, and you can use the BeginThreadContext in your test to create a simple scope where the lifecycle of managed object are really singleton object but gets disposed and released when the scope ends.

Relating to an [older post of mine](http://www.nablasoft.com/Alkampfer/?p=104) where I spoke about the importance to call Container.Release, please note that this custom lifecycle manager, does not store any reference to the object when there is no context, so it does not calls Dispose when the container is disposed nor it risk to have leak if you forget to call Container.Release.

Alk.

P.S If you are interested in the code you can checkout with subversion at [http://nablasoft.googlecode.com/svn/trunk/](http://nablasoft.googlecode.com/svn/trunk/), please excuse the messy of the code, since this repository is only a place where I do various experiments.
