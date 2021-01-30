---
title: "CastleWindsor and lifecycle of objects"
description: ""
date: 2007-08-08T23:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
In a [previous post](http://www.nablasoft.com/Alkampfer/?p=104) I discuss about the importance of calling IWindsorContainer.Release() for all object created through Windsor, to avoid memory leak. There is a little correction to do, the container keeps a reference to an object created through Resolve&lt;T&gt; only if that object implements IDisposable. But it is important to really understand the concept of lifecycle of objects in Windsor. Suppose you have an object that implements IDisposable and tells if it was disposed with a simple property called aProperty

publicclassDisposableTest  :  ITest  {  
publicstaticInt32  NumOfDispose  =  0;  
  
privatebyte[]  big  =  newbyte[1000000];  
  
  #region  IDisposable  Members  
  
publicBoolean  aProperty  =  false;  
  
publicvoid  Dispose()  {  
        aProperty  =  true;  
        NumOfDispose++;  
  }  
  
  #endregion  
  
  #region  ITest  Members  
  
publicbool  AProperty  {  
get  {  return  aProperty;  }  
  }  
  
  #endregion  
}

now configure two component in the config file, one with transient lifecycle and another with singleton lifecycle, this test shows you an important concept

ITest  tran,  sing;  
using  (WindsorContainer  ioc  =  newWindsorContainer(newXmlInterpreter(“config1.xml”)))  {  
  tran  =  ioc.Resolve&lt;ITest&gt;(“TransientITest”);  
  sing  =  ioc.Resolve&lt;ITest&gt;(“SingletonITest”);  
}  
Assert.IsTrue(tran.AProperty);  
Assert.IsTrue(sing.AProperty);

After the container is disposed, it disposes also all transient and singleton objects created with resolve. This is the reason why the container keeps references to transient objects that implement IDisposable. So do not remember to call Resolve for all transient object that are IDisposable if you do not dispose the container itself. Now you can do another test.

using  (WindsorContainer  ioc  =  newWindsorContainer(newXmlInterpreter(“config1.xml”)))  {  
  tran  =  ioc.Resolve&lt;ITest&gt;(“TransientITest”);  
  sing1  =  ioc.Resolve&lt;ITest&gt;(“SingletonITest”);  
  ioc.Release(tran);  
  ioc.Release(sing1);  
Assert.IsTrue(tran.AProperty);  
Assert.IsFalse(sing1.AProperty);  
  sing2  =  ioc.Resolve&lt;ITest&gt;(“SingletonITest”);  
Assert.AreSame(sing1,  sing2);  
}

This test shows two distinct things: if you call WindsorContainer.Release only the transient objects gets their Dispose method called, not the singleton one. Moreover, even if you call release on the singleton object, the object gets no removed from the container, if you resolve again, the instance returned is the same as before. So a singleton object lifecycle spans the life of the container, even if the user explicitly calls Release on it. Now to finish this example lets create another class and configure as transient

publicclassDisposableCon  :  IDisposable  {  
  
publicITest  ITest;  
  
public  DisposableCon(ITest  iTest)  {  
        ITest  =  iTest;  
  }  
  
publicvoid  Dispose()  {  
  
  }  
  }

This class simply declare a Constructor dependency, and implements IDisposable, but in the dispose does not do any stuff. The following test shows you that the container does not keeps a reference nor dispose the inner ITest object.

DisposableCon  tran;  
using  (WindsorContainer  ioc  =  newWindsorContainer(newXmlInterpreter(“config1.xml”)))  {  
  tran  =  ioc.Resolve&lt;DisposableCon&gt;(“TransientDisposableCon”);  
}  
Assert.IsFalse(tran.ITest.AProperty);

So it is your duty to be sure that the inner objects injected by the container will be disposed correctly.

Alk.
