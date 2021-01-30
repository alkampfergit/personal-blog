---
title: "The importance of WindsorContainerRelease"
description: ""
date: 2007-08-08T00:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
The WindsorContainer has a method call release that must be called to release the instance of transient object that gets created by the container itself. If you forget to call release, the container keeps a reference to all transient object created with resolve, that prevent the garbage collector from reclaiming the memory of that object. Suppose you have such a class.

publicclassDisposableTest  :  IDisposable,  ITest  {  
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

This is a test class that implements IDisposable and ITest interface, the ItestInterface contains only the Aproperty property. The class logs the number of time that dispose gets called, and allocates a huge array just to waste memory. Now if you configure the lifecycle as transient and run this code, the program chrashes with a OutOfMemoryException

1using  (WindsorContainer  ioc  =  newWindsorContainer(newXmlInterpreter(“config1.xml”)))  {  
    2for  (Int32  I  =  0;  I  &lt;  10000;  ++I)  {  
    3  
    4ITest  var  =  ioc.Resolve&lt;ITest&gt;();  
    5if  (I  %  100  ==  0)  {  
    6GC.Collect(2);  
    7  
    8Console.WriteLine(“Iteration:  {0},  Memory  {1}  Dispose  {2}”,    
    9                                                        I,  GC.GetTotalMemory(false),  DisposableTest.NumOfDispose);    
  10              }  
  11//ioc.Release(var);  
  12        }  
  13  }  
  14Console.WriteLine(“Number  of  Dispose  Called  {0}”,  DisposableTest.NumOfDispose);

At line 6 I force a collect, but the memory cannot be reclaimed because the container keeps a reference to all the objects created with resolve. If you uncomment the ioc.Release() call, everything works fine and the program runs without problems. A different situation happens if you have this class, that simply declare a dependency from the ITest interface

publicclassDisposableCon  {  
  
publicITest  ITest;  
  
public  DisposableCon(ITest  iTest)  {  
        ITest  =  iTest;  
  }  
}

If you declare lifecycle as transient, you get a fresh new DisposableCon object and a new fresh DisposableTest each time you do a Resolve call. If you run the same test as above, even if you forget to call ioc.Release() the program runs fine, this because the container seems not to keep references of the transient object created to satisfy dependencies from other object. These two different behavior of WinsorContainer could be confusing for the user, but are reasonable because since I cannot obtain a reference to the instances created to satisfy a dependencies, the container should not keep any references to them. So keep attenction and remember not forget to call IoC.Release for transient instance of object created with the container.

Alk
