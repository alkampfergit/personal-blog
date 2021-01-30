---
title: "Multithread testing"
description: ""
date: 2009-04-10T02:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Testing multithreaded objects are quite complex. I have an object that keeps care of executing some action in a different thread, monitor progress of that action, and then signal to the caller progress and return value. for testing purpose I write a simple action like this.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
   internal class TestStandard : AsyncOperationBase
   {
      protected override object InnerExecute()
      {
         for (int i = 0; i < 10; i++)
         {
            OnProgress(i * 10, (i * 10).ToString());
         }
         return "OOK";
      }
   }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This class inherits from AsyncOperationBase, it makes a simple iteration, raises 10 progress event and returns â€œOOKâ€. What I want to test is OperationManager Object that have a similar function

{{< highlight CSharp "linenos=table,linenostart=1" >}}
      public static OperationData Start(
         string operationName, 
         AsyncOperationBase operationToExecute, 
         IProgressConsumer callback){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The IProgressConsumer is the interface that will accepts the callback and contains a couple of methods called SignalProgress and Return. Now I want to mock this interface, pass the mock object to the Start method of OperationManager and verify that progress and return methods are called correctly. Since Start method runs the action in a different thread, I need to make some synchronization stuff in the test. Here is it:

{{< highlight xml "linenos=table,linenostart=1" >}}
ManualResetEvent ev = new ManualResetEvent(false);
IProgressConsumer mock = base.RhinoRepository.StrictMock<IProgressConsumer>();
for (int i = 0; i < 10; i++)
{
   Expect.Call(() => mock.SignalProgress(Guid.Empty, 0, null))
     .Constraints(RhinoIs.Anything(), RhinoIs.Equal(i * 10), RhinoIs.Equal((i * 10).ToString()));
}
Expect.Call(() => mock.Return(Guid.Empty, null))
   .Constraints(RhinoIs.Anything(), RhinoIs.Equal("OOK"))
   .WhenCalled(m => ev.Set());
RhinoRepository.ReplayAll();
OperationData id = OperationManager.Start("TEST", new TestStandard(), mock);
if (!ev.WaitOne(4000)) Assert.Fail("no answer in 4 seconds");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

First of all I have some base code that keeps track of creating the [Rhino repository](http://ayende.com/projects/rhino-mocks.aspx), and verifying the expectation once the test code was run. Based on this structure I need a ManualResetEvent to make sure that the mock verification phase is called only when the asynchronous action is completed. The test uses this structure

1. creates a ManualResetEvent in false status
2. create mocks objects, sets the expectations
3. use the WhenCalled method of Rhino Mocks in the Return expectation, in this way I can signal the event object created in point 1.
4. Exercise the sut (call start method)
5. wait for a certain number of seconds for the event to be signaled

In this way Iâ€™m sure that the verification phase is run only after the action completed the execution.

This is one of the most common problem when testing asynchronous components, you need to be sure to begin the verification phase only when all the asynchronous operations of the sut are completed. Standard unit testing follows the [Four Phase Test pattern](http://xunitpatterns.com/Four%20Phase%20Test.html).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image-thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image.png)

When the sut executes its operation asynchronously this pattern needs to be changed slightly

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image-thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image2.png)

To make this possible you should structure the sut in such a way that it is possible for the test to know when all the asynchronous operations are completed. In my example this is straightforward, because the sut signals to the caller the return value of the action, when you have â€œfire and forget actionsâ€ where there is no notification sent to the caller, implementing this pattern can be a little more complicated.

Alk.

Tags: [testing](http://technorati.com/tag/testing)
