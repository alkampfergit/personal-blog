---
title: "Little Trick to generate ILogger with MEF based on type"
description: ""
date: 2012-07-03T17:00:37+02:00
draft: false
tags: [MEF]
categories: [NET framework]
---
I’ve a little application that uses MEF to manage plugins, today I faced this problem, I have classes like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}


    public class TestExport {

        [Import]
        public ILog Logger { get; set; }

{{< / highlight >}}

This is a standard class that declares an import on log4net.ILog interface and since this little program uses MEF to do all composition I’d like to avoid using Castle or other IoC libraries, **but I wish to use MEF to resolve ILog with the constraint that each class should have its own logger** , a condition verified by this test.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Fact]
public void Logger_are_created_with_correct_type()
{
    TestExport sut = new TestExport();
    MefHelper.Compose(sut);
    sut.Logger.Logger.Name.Should().Be.EqualTo("Kangae.ShuppanButsu.Test.Infrastructure.TestExport");
}

{{< / highlight >}}

My problem is that  **I need a factory method to create the Ilog instances and I need to know the type that was actually composed** , because if a type declare an import on ILog I want to create a logger named after that type, to manage granularity of Logging. The problem is, when I ask to a CompositionContainer to compose or to create with GetExportedValue&lt;T&gt; an instance of TestExport class, I want the Logger property populated with log4net logger named after TestExport type.

After various experiment I found a not-so-good solution that does not solves all scenario, so I got a little bit stuck. The problem is that **MEF permits you to create factory that you can use to create loggers, but it does not seems to be an easy way to understand the type of the object that is requesting the creation**. The problem is, when I ask to compose a TestExport class how can I know inside my factory that the ILog Export was requested because we are composing an instance of TestExport? The answers seems to be: there is no way.

A better solution was to abstract an ILogger interface, because now we can control with lazy instantiation when the real logger will be created.

{{< highlight csharp "linenos=table,linenostart=1" >}}


    public interface ILogger
    {
        String LoggerName { get; }

        void Debug(String info);

        void Debug(String info, Exception ex);

{{< / highlight >}}

Now I can create a really stupid class that implements ILogger simply delegating each call to a concrete ILog logger created by Log4Net, the trick is that  **in the internal RealLogger property, I create the real logger at the first call and get the name of the owning class from the Stack Trace**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[PartCreationPolicy(CreationPolicy.NonShared)]
[Export(typeof(ILogger))]
public class Logger : ILogger
{
    private log4net.ILog RealLogger
    {

        get
        {
            return realLogger ?? (realLogger = CreateLogger());
        }
    }
    private log4net.ILog realLogger;

    private log4net.ILog CreateLogger()
    {
            var frame = new StackFrame(3, false);
            return log4net.LogManager.GetLogger(frame.GetMethod().DeclaringType.FullName);
    }

{{< / highlight >}}

The trick is: when the class call a method of this logger for the very first time, Es. Debug(String) the real Log4Net logger is created and thanks to the StackFrame object we can find the method of the real type that is calling the Debug function. The number 3 is because in the stack trace we have the *CreateLogger* function, then the Get\_*RealLogger* getter, the wrapper *Debug*function and finally the method of the class that is calling the Debug method.

With this simple solution I can overcome MEF limitation.

And, yes, I could have used logging facility from Castle, but I want this project to be simple and do not want to introduce a complex IoC library only to resolve some logger.

Gian Maria.
