---
title: "Again on Castle Transient and the Custom lifecycle"
description: ""
date: 2008-02-29T07:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
Two days ago hammet link one of my old post, ([http://hammett.castleproject.org/?p=252)](http://hammett.castleproject.org/?p=252%29) I want now to make another considerations. The end of my old post ([http://www.nablasoft.com/Alkampfer/?p=105)](http://www.nablasoft.com/Alkampfer/?p=105%29) reported this problem, I have a class DisposableCon that implements IDisposable, this class declare a dependency from an object That implements ITest, This is the object model

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image-thumb5.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image5.png)

This simple model declare a class called DisposableCon, in the constructor this class needs an instance of ITest, implemented by DisposableTest, a class that implements Disposable and ITest. Both these two classes are defined as transient in the config file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8" ?>
<CastleWindsor>

    <components>
        <component
            id="TransientITest"
            service="TestIOC.ITest, TestIOC"
            type="TestIOC.DisposableTest, TestIOC"
            lifestyle="transient"  />

        <component
            id="TransientDisposableCon"
            service="TestIOC.DisposableCon, TestIOC"
            type="TestIOC.DisposableCon, TestIOC"
            lifestyle="transient"  />
    </components>
</CastleWindsor>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With these classes, the problem is that this test shows me that the windsor container did not release the inner component

{{< highlight xml "linenos=table,linenostart=1" >}}
DisposableCon tran;
using (WindsorContainer ioc = new WindsorContainer(new XmlInterpreter("config1.xml"))) {
    tran = ioc.Resolve<DisposableCon>("TransientDisposableCon");
}
Assert.IsFalse(tran.ITest.IsDisposed);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is not a good behavior because the DisposableTest gets not disposed, nor the DisposableCon can dispose it, because it should not need to know that the DisposableTest implements IDisposable. The whole point is that DisposableCon needs a dependencies on ITest and should not worry if the concrete implementation implements IDisposable. A good rule is that  **an object should get disposed by the object that really creates it.** In this situation the *container has the responsibility to dispose the object because this is the core of Dependency Injection, let a container deal with these stuff of lifecycle of components*. Well the solution could be very simple, in an [old post](http://www.nablasoft.com/Alkampfer/?p=113) I showed how to build a custom lifecycle manager. This custom lifecycle does a particular thing, creating a scope where the object are singleton and bound this scope to the current thread, but this can be modified to address the problem of disposing.

The problem was the following, we want to create a container, then we want the objects to be transient, but we need the possibility to open a thread bound context that will dispose everything at the end. I decided today to retrieve that custom lifecycle manager and try to resolve the dispose problem with a custom lifecycle manager. The solution is contained in the attachment project in the class CustomLifecycle. The problem was solved keeping tracks of all objects constructed in a  **context,** and simply calling dispose for each object when the context ends. The implementation is not optimal, it uses an arraylist and store all the objects, but tomorrow I’ll spent some time trying to make it better, for now it make this test pass ;)

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 DisposableCon tran;
 2 DisposableCon tran2;
 3 using (WindsorContainer ioc = new WindsorContainer(new XmlInterpreter("ConfigurationCustom.xml"))) {
 4     using (CustomLifecycle.BeginThreadContext()) {
 5         tran = ioc.Resolve<DisposableCon>("TransientDisposableCon");
 6         tran2 = ioc.Resolve<DisposableCon>("TransientDisposableCon");
 7         Assert.That(tran, Is.Not.EqualTo(tran2));
 8     }
 9     Assert.IsTrue(tran.ITest.IsDisposed);
10     Assert.IsTrue(tran2.ITest.IsDisposed);
11     Assert.IsTrue(tran.IsDisposed);
12     Assert.IsTrue(tran2.IsDisposed);
13 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see after the context goes out of scope in line 8, all the objects created in the context are really disposed, and the test inside the context (line 7) shows that the instances are treated like transient object and not singleton. :) Comments are welcome ;)

[You can find the code here](http://www.codewrecks.com/blog/storage/testioc.7z)

Alk.

