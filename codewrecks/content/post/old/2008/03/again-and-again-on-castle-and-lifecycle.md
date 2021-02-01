---
title: "Again and again on Castle and lifecycle"
description: ""
date: 2008-03-13T02:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
You can find at this subversion repository ( [http://nablasoft.googlecode.com/svn/trunk/Castle/TestIOC](http://nablasoft.googlecode.com/svn/trunk/Castle/TestIOC "http://nablasoft.googlecode.com/svn/trunk/Castle/TestIOC") ) a simple project that contains a custom lifecycle that bound the lifecycle of objects to a  context. This lifecycle was created to address the problem of disposing inner object, [you can find the deails here](http://www.nablasoft.com/Alkampfer/?p=156). This new version support both singleton and transient objects, this a sample test.

{{< highlight xml "linenos=table,linenostart=1" >}}
        [Test]
        public void BaseTestSingletonContextDisposable3() {
            DisposableComponent tran1, tran2;
            using (WindsorContainer ioc = new WindsorContainer(new XmlInterpreter("ConfigurationCustom.xml"))) {
                using (ContextLifecycle.BeginThreadContext()) {
                    tran1 = ioc.Resolve<DisposableComponent>("SingletonDisposableCon");
                    tran2 = ioc.Resolve<DisposableComponent>("SingletonDisposableCon");
                    Assert.That(tran1, Is.EqualTo(tran2));
                    Assert.That(tran1.ITest, Is.EqualTo(tran2.ITest));
                }
                Assert.IsTrue(tran1.ITest.IsDisposed);
                Assert.IsTrue(tran2.ITest.IsDisposed);
                Assert.IsTrue(tran1.IsDisposed);
                Assert.IsTrue(tran2.IsDisposed);
            }
        }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This test shows that an object with singletonContext custom lifecycle is singleton inside a context, and when the context ends all it gets disposed and all the inner references are disposed too. This lifecycle has the main purpose of estabilishing a context that once ended dispose every object created inside the context itself.

The code is still experimental, but it can be a viable solution.

Alk.

