---
title: "Complex fixture teardown"
description: ""
date: 2007-09-08T06:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
[Download](http://www.nablasoft.com/Alkampfer/storage/test.7z) the code of the post.

Have you ever deal with tests having really complex fixtures? Sometimes it happens for projects that are not designed for testability, quite often you need to refactor, you begin to prepare a series of basic tests, but the interactions between the components of the system are really complex, and when a test gone wrong the whole suite is compromised. Yesterday I dealed with a series of tests that needed a really complex fixture, composed by classes that opened sockets and did all sort of complex thing (remoting, socket, shared variable, etc etc). The first test suite was a pity result, when a test failed the fixture was not cleared well, all remaining test will fail and it is very difficult to understand where is the error. Let’s try to simulate the same situation: here is a possible test.

SomeClass  test1;  
SomeDisposable  test2;  
SomeDisposable  test3;  
  
[SetUp]  
publicvoid  SetUp()  {  
  test1  =  newSomeClass();  
  test1.Init();  
  test1.AddSomething();  
  test2  =  newSomeDisposable(1);  
  test2.DoSomething(100);  
  test3  =  newSomeDisposable(2);  
  test3.DoSomething(50);  
}  
  
[TearDown]  
publicvoid  TearDown()  {  
  test3.UndoSomething();  
  test3.Dispose();  
  test2.UndoSomething();  
  test2.Dispose();  
  test1.RemoveSomething();  
}  
  
[Test]  
publicvoid  Test1()  {  
Console.WriteLine(“Exercise  SUT”);  
}

Please keep open the example project shipped with this post to look at the various classes. The concept here is that the class SomeClass needs the method RemoveSomething()  called to bring the system in the previous state, the SomeDisposable has DoSomething() and Undo Something() function plus the standard Dispose, so we need to call a series of function in the reverse order to teardown the fixture. The above test does not work, there are too many problem with it. If the DoSomething(100) threw an exception, the teardown method will try to call test2.UndoSomething(), but this is an error, since if the DoSomething() threw an error, the corresponding UndoSomething() must not be called for my fixture. Moreover, if the test2.UndoSomething() throw an exception the teardown method will exit, and test2 and test1 objects get not disposed. The above situation is quite complex, we need a class that is capable to handle this complex fixture. First of all let’s define some delegates

publicdelegatevoidProc();  
publicdelegatevoidProc&lt;T1&gt;(T1  param1);  
  
publicdelegate  TRet  Func&lt;TRet&gt;();  
publicdelegate  TRet  Func&lt;TRet,  T1&gt;(T1  param1);

With these delegates I can write a class that will handle a fixture made of distinct steps. Each step has a setup and teardown function, and for each setup function that is called without exeption I want the corresponding teardown method to be called.

publicclassFixtureHandler  :  IDisposable    {  
  
privatereadonlyDictionary&lt;Proc&lt;FixtureHandler&gt;,  Proc&gt;  mFixture;  
privatereadonlyStack&lt;Proc&gt;  mDisposeProcedures;  
privatereadonlyStack&lt;IDisposable&gt;  mDisposeList;

This class is Disposable and store a *mFixture* dictionary of delegates, the key is the setup function and the value is the teardown function, the setup function should return the object created by the step or null if the step really does not create any object. Then I declare two stack, one for the teardown function that I need to call at the disposing of the fixture, and another that keeps track of all disposable objets that gets created by the various setup functions. The setup part of the step is a function that returns void and accept a parameter of type FixtureHandler. To fully understand how this class work here is the SetupMethod.

publicvoid  AddFixtureStep(Proc&lt;FixtureHandler&gt;  setup,  Proc  teardown)  {  
  mFixture.Add(setup,  teardown);  
}  
  
publicvoid  AddDisposable(IDisposable  objToDispose)  {  
if  (objToDispose  !=  null)  
        mDisposeList.Push(objToDispose);    
}  
  
publicBoolean  SetUp()  {  
foreach  (KeyValuePair&lt;Proc&lt;FixtureHandler&gt;,  Proc&gt;  element  in  mFixture)  {  
try  {  
              element.Key(this);  
              mDisposeProcedures.Push(element.Value);  
        }  
catch  (Exception  ex)  {  
Console.Error.WriteLine(“Exception  during  Setup:  {0}”,  ex.ToString());  
returnfalse;  
        }  
  }  
returntrue;  
}

First of all we have two methods, one that adds a step and the other that adds a disposable object to the handler. This method cycles for all defined steps, for each one invokes the setup function (the key of the dictionary) passing itself as parameter, then pushes the teardown function (The value of the element of the dictionary) into the stack that contains the list of teardown procedures. With this scheme we can be sure that for each Setup step that succeeds, the corresponding teardown step is recorded. If an exception is thrown during the setup phase, the corresponding teardown function gets not added to the list and the method returns false to signal that the setup phase is failed. The dispose method of the FixtureHandler class takes care of all the teardown tasks

publicvoid  Dispose()  {  
  TearDown();  
}  
  
publicvoid  TearDown()  {  
while  (mDisposeProcedures.Count  &gt;  0)  {  
try  {  
              mDisposeProcedures.Pop()();  
        }  
catch  (Exception)  {  }  
  }  
while  (mDisposeList.Count  &gt;  0)  {  
try  {  
              mDisposeList.Pop().Dispose();  
        }  
catch  (Exception)  {  }  
  }  
}

As you can see all teardown delegates are called in reverse order, since a stack is basically a LIFO structure, then after all teardown methods are executed the FixtureHandler cycles into the stack of Disposable object and dispose everything. Each operation is wrapped in try..catch block, in this way if a teardown function throws an exception we can be sure that the other teardown methods will be called as well the object will get disposed. Now we can build a real strong test.

[TestFixture]  
publicclassExample2  {  
  
SomeClass  test1;  
SomeDisposable  test2;  
SomeDisposable  test3;  
  
  [Test]  
publicvoid  Test2()  {  
  
using(FixtureHandler  fixture  =  CreateFixture())  {  
Assert.That(fixture.SetUp(),  “FixtureSetupFailed”);  
//ExerciteSut  
        }  
  }  
  
privateFixtureHandler  CreateFixture()  {  
FixtureHandler  fixture  =  newFixtureHandler();  
  fixture.AddFixtureStep(  
delegate(FixtureHandler  fixtureHandler)  {  
              test1  =  newSomeClass();  
              test1.Init();  
              test1.AddSomething();  
        },  delegate()  {  
        test1.RemoveSomething();  
  });  
  fixture.AddFixtureStep(  
delegate(FixtureHandler  fixtureHandler)  {  
              test2  =  newSomeDisposable(1);  
              fixtureHandler.AddDisposable(test2);  
              test2.DoSomething(100);  
        },  delegate()  {  
        test2.UndoSomething();  
  });  
  fixture.AddFixtureStep(  
  …  
  …  
First of all with anonymous delegate we can easily build each step of the fixture, the test itself is very clean because the FixtureHandler object implements IDisposable, so it can be used in a using block. The Setup() method of the FixtureHandler returns a Boolean, so we put an Assertion on it, in this way if the setup part of the fixture gone wrong, the test will fail in predictable way. When we deal with disposable object, as for the SomeDisposable class, the setup function should call the AddDisposable() method of the FixtureHandler soon after the object gets created, in this way if the DoSomething() throws an error, the FixtureHandler can dispose the object correctly.

Alk.
