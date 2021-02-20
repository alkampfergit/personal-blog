---
title: "AOP With castle-Part 3-The first interceptor"
description: ""
date: 2010-08-09T06:00:37+02:00
draft: false
tags: [Aop,Castle]
categories: [Castle]
---
Previous Parts of the series

[Part 1 – The basic of interception](http://www.codewrecks.com/blog/index.php/2010/06/01/aop-with-castle-part-1/)  
[Part 2 – Selecting Methods to intercept](http://www.codewrecks.com/blog/index.php/2010/06/08/aop-with-castle-part-2-selecting-methods-to-intercept/)

Usually the very first interceptor you can build with an AOP framework is the *logger Interceptor*, because it is simple and useful, especially when you expose some services with WPF. *Consider this scenario*: you expose some services with WPF, sometimes people tell you that your services have bugs or they encountered an exception, or they get wrong result, etc. In this situation you receive information like:

**I got exception from your service*,* and no more details, so you need to spent time trying to understand what is happened.

Since this is probably the *most detailed* information you can have from the customer J, having a good log system is vital. You need to identify what is happened and you need to build a system to log:

- every call to service methods
- all parameters value for the call
- return value and exception that are raised (if one).

The goal is having a full and configurable log of what is happened in the service to retrace exception and problems experienced by users. Now wait and avoid the temptation to modify every service class in the system adding log calls since you can use AOP to add logging capability to each intercepted service. Such an interceptor is really simple to build, and with few lines of code you can log every call made to a function of intercepted class.

As a requisite, you need to instantiate wcf service classes with CastleIntegration facility and Logging integration facility; thanks to these two facilities you are able to resolve the service class with castle (thus adding interceptor), and use the log4net integration to avoid hardcoding logging to specific target, like file etc. The good point in log4Net castle integration is the ability to declare a dependency to a generic *ILogger* interface. This feature can be used in the Logging Interceptor.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class LogAspect : IInterceptor
{
public LogAspect(ILogger logger)
{
Logger = logger;
}
 
public ILogger Logger { get; set; }
{{< / highlight >}}

Castle log4net facility is able to resolve the ILogger dependency with an implementation of log4net logger that has a name equal to the name of the class that declares dependency. This is the most important point, because in the above code, the logger will have the name MusicStore.Aspects.Log.LogAspect, and this permits me to change the log setting for each single class in the system. The interceptor will need also a little helper function to create a string that dump every details of the call.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static String CreateInvocationLogString(IInvocation invocation)
{
StringBuilder sb = new StringBuilder(100);
sb.AppendFormat("Called: {0}.{1}(", invocation.TargetType.Name, invocation.Method.Name);
foreach (object argument in invocation.Arguments)
{
String argumentDescription = argument == null ? "null" : DumpObject(argument);
sb.Append(argumentDescription).Append(",");
}
if (invocation.Arguments.Count() > 0) sb.Length--;
sb.Append(")");
return sb.ToString();
}
{{< / highlight >}}

Since parameters of the service could be complex objects I'm dumping information with an helper function that is able to include every detail of a class.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static string DumpObject(object argument)
{
Type objtype = argument.GetType();
if (objtype == typeof(String) || objtype.IsPrimitive || !objtype.IsClass)
return objtype.ToString();
return DataContractSerialize(argument, objtype);
}
{{< / highlight >}}

I want to keep the code simple, if the object type is not primitive I use DataContractSerialize to dump the content in XML format. Once everything is in place I need to insert the call to the logger in the appropriate point.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void Intercept(IInvocation invocation)
{
if (Logger.IsDebugEnabled) Logger.Debug(CreateInvocationLogString(invocation));
try
{
invocation.Proceed();
}
catch (Exception ex)
{
if (Logger.IsErrorEnabled)  Logger.Error(CreateInvocationLogString(invocation), ex);
throw;
}
}
{{< / highlight >}}

Before each call to the logger object I first check if the appropriate level of logging is enabled. This technique is useful to avoid loss of performance when log is not enabled; if the debug level is set to warn, the Logger.Debug will not log anything and the CreateInvocationLogString will build the log string for nothing, losing processor time with no benefit. To avoid this loss you can issue a call to Logger.IsDebugEnabled to avoid entirely the call to logging function.

Now suppose that the caller pass an invalid object to method Save() of MusicStoreService, the user will see a message telling that a service error is occurred, but now I'm able to check the log to understand exactly what is happened. Here is the log of a call that raise an exception.

{{< highlight csharp "linenos=table,linenostart=1" >}}
2010-07-24 10:12:28,320 ERROR MusicStore.Aspects.Log.LogAspect - Called: MusicStoreService.Save(<Album xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/MusicStore.Entities">
<Id>0</Id>
<Author
i:nil="true" />
<Genre
i:nil="true" />
<Image
i:nil="true" />
<Label
i:nil="true" />
<Note
i:nil="true" />
<PublicationDate>0001-01-01T00:00:00</PublicationDate>
<Title
i:nil="true" />
<Tracks
i:nil="true" />
</Album>)
NHibernate.PropertyValueException: not-null property references a null or transient valueMusicStore.Entities.Album.Title
at NHibernate.Engine.Nullability.CheckNullability(Object[] values, IEntityPersister persister, Boolean isUpdate)
at NHibernate.Event.Default.AbstractSaveEventListener.PerformSaveOrReplicate(Object entity, EntityKey key, IEntityPersister persister, Boolean useIdentityColumn, Object anything, IEventSource source, Boolean requiresImmediateIdAccess)
at NHibernate.Event.Default.AbstractSaveEventListener.PerformSave(Object entity, Object id, IEntityPersister persister, Boolean useIdentityColumn, Object anything, IEventSource source, Boolean requiresImmediateIdAccess)
at NHibernate.Event.Default.AbstractSaveEventListener.SaveWithGeneratedId(Object entity, String entityName, Object anything, IEventSource source, Boolean requiresImmediateIdAccess)
{{< / highlight >}}

From this log I understand that an invalid object is passed to the service, the property Album.Title is required in the database, but the user passed a property with null value. Since log4net is really flexible I'm able to dump this information to a file, to a database, to network or with mail. You can as example send a mail each time an exception occurs, so you are immediately notified if something in the service is not going well.

This logger can be improved a little bit because the name of the logger is always MusicStore.Aspects.Log.LogAspect for each wrapped service. This is not really a problem, but I prefer to have the ability to configure logging differently for each service; in real product with a lot of services, this is a key requiremente. The interceptor can be changed in this way:

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class LogAspect : IInterceptor
{
public LogAspect(ILoggerFactory loggerFactory)
{
LoggerFactory = loggerFactory;
Loggers = new Dictionary<Type, ILogger>();
}
public ILoggerFactory LoggerFactory { get; set; }
public Dictionary<Type, ILogger> Loggers { get; set; }
{{< / highlight >}}

Now the interceptor declares a dependency to an ILoggerFactory and not to a concrete ILogger, and caches a list of ILogger object based on type. The result is a concrete ILogger object for each wrapped type.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void Intercept(IInvocation invocation)
{
if (!Loggers.ContainsKey(invocation.TargetType))
{
Loggers.Add(invocation.TargetType, LoggerFactory.Create(invocation.TargetType));
}
ILogger logger = Loggers[invocation.TargetType];
if (logger.IsDebugEnabled) logger.Debug(CreateInvocationLogString(invocation));
{{< / highlight >}}

instead of using the same logger, we first check if we had already created a logger for a given type, if false we use the ILoggerFactory to create the logger and cache it to an inner dictionary. If we send an invalid object again to the service the head of the log is.

{{< highlight csharp "linenos=table,linenostart=1" >}}
2010-07-24 10:27:30,783 DEBUG MusicStore.WebService.MusicStoreService - Called: MusicStoreService.Save(..
{{< / highlight >}}

Now the name of the logger is equal to the name of the concrete service class and you have created a simple logging system that can:

1. Add transparently to each service class without needing a single line of code
2. Change logging level for each concrete class of the service.

Happy intercepting with Castle :)

Alk.
