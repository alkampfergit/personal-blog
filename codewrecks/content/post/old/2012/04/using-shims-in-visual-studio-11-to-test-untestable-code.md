---
title: "Using Shims in Visual Studio 11 to test untestable code"
description: ""
date: 2012-04-27T20:00:37+02:00
draft: false
tags: [Testing,VS11]
categories: [Testing]
---
I always strive myself to write testable code, but it is not always easy, especially if you do not follow TDD red-green-refactor mantra.  **Code written without Unit Testing in mind is usually not so easy to test** and when is time to modify code written by other, if you want to create a safety net of Unit Tests to avoid breaking code it is usually an hard task. The main problem is  **hardcode dependency from static functions** because you cannot test a single function or method in isolation, forcing you to use pattern like  **[Back door manipulation](http://xunitpatterns.com/Back%20Door%20Manipulation.html)** that makes test difficult to read, write and maintain. Lets take this code as example

{{< highlight csharp "linenos=table,linenostart=1" >}}


    public class PerformHeavyTask 
    {
        private DateTime lastExecutionTime = new DateTime(1900, 1, 1);
        private Int32 intervalInMinutes;
        private Action task;
        public PerformHeavyTask(Int32 intervalInMinutes, Action task) {
            this.intervalInMinutes = intervalInMinutes;
            this.task = task;
        }
        private Boolean CanExecute() {
            return DateTime.Now.Subtract(lastExecutionTime).TotalMinutes >= intervalInMinutes;
        }
        public void Execute() {
            if (CanExecute())
            {
                lastExecutionTime = DateTime.Now;
                task();
            }
        }
    }

{{< / highlight >}}

This is a simple and stupid example class that is used to execute an action no more than once every X minutes.  **The main problem is dependency from the DateTime.Now** static function because it create a dependency to the concept of “passing time” that is almost impossible to manage in a test. Suppose that the logic of CanExecute method is complex and depends not only from DateTime.Now or uses some strange algorithm based on time, *how can you write a unit test that is capable of testing this algorithm simulating the time that pass*? The only solution is being able to change at runtime the behavior of the DateTime.Now static function, a trick that is possible using various external library, but that is now natively available in Visual Studio 11.

This functionality is derived from [Pex and Moles](http://research.microsoft.com/en-us/projects/pex/) project, but now it is fully integrated in VS11, with small differences. First of all you need to right click the reference to the system assembly and choose to  **Add Fakes Assembly;** this creates a special folder called Fakes, with a single file called system.fakes.

[![26-04-2012 19-40-41](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/26-04-2012-19-40-41_thumb.png "26-04-2012 19-40-41")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/26-04-2012-19-40-412.png)

 ***Figure 1***: *Adding a fake assembly for the System assembly.*

Now you can write this simple test that is capable of changing the value of the DateTime.Now static property at runtime

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Fact]
public void Verify_do_not_execute_task_if_interval_is_not_elapsed()
{
    using (ShimsContext.Create())
    {
        Int32 callCount = 0;
        PerformHeavyTask sut = new PerformHeavyTask(10, () => callCount++);
        DateTime startDate = new DateTime(2012, 1, 1, 12, 00, 00);
        ShimDateTime.NowGet = () =>  startDate;
        sut.Execute();
        ShimDateTime.NowGet = () => startDate.AddMinutes(9);
        sut.Execute();
        Assert.Equal(1, callCount);
    }
}

{{< / highlight >}}

As you can see this code is written in xUnit because VS11 is capable of running Unit Test from external framework if there is the corresponding adapter, so I’m not restricted to use MSTest if I want to use some UnitTesting specific feature of Visual Studio. The first interesting line is the  **ShimsContext.Create()** call, used to create a scope where we can use [Shims](http://msdn.microsoft.com/en-us/library/hh549176%28v=vs.110%29.aspx) and isolate calls to non-virtual functions. The concept of Isolation is being able to change how a static property or method behave without the need to change the original code. As you can see I create an instance of the PerformHeavyTask class, with 10 minutes interval and with a function that basically only increment a local variable to have a count of how many times the function is executed. Now to test that the function is not called a second time if not enough time is passed I need to isolate the call to DateTime.Now to return predetermined values.

The line ShimDateTime.NowGet = … permits me to intercepts the getter of the static Now property of DateTime Class and specify the function that will be used instead of standard getter.  **Shim library works with some convention** and since I’ve created a Fake Assembly of the standard System reference, the  **Shim library will create for me a Shim class for every type in the Assembly prepending the world Shim to the original name**. Since I need to change the behavior of the Now static property of DateTime class, I need to use the  **Shim** DateTime class (created for me with the Add fakes assembly command) and use the Now **Get** property to isolate the Getter of the static property Now. To isolate the getter I simply specify the lambda function to call whenever any code calls DateTime.Now.

The test simple calls the Execute() method the first time, then  **change isolation function to returns a DateTime that is 9 minutes greater than the previous value** , finally I call the Execute() method again and verify that the taks passed to PerformHeavyTask was executed only 1 time, because when I invoked Execute() the second time not enough time has passed and the function should not be executed.

Gian Maria.
