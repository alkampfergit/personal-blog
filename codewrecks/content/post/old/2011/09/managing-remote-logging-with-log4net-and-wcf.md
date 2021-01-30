---
title: "Managing remote logging with Log4net and WCF"
description: ""
date: 2011-09-02T14:00:37+02:00
draft: false
tags: [Castle,log4net]
categories: [Castle]
---
Iâ€™ve applications that can work in two distinct configuration, they are based on WPF and MVVM, where the VM communicates with the Domain / Business Logic through services like *IXxxxService*. All View Models depends from one or more services and thanks to Castle I can decide with configuration file which concrete class to use for each service.

When the software is used internally, it has direct access to the Database, so I configure castle to use the concrete class of the various services, but when the software is deployed to external users,  who have no access to the intranet, all communication is done through WCF. This is done transparently because I have a facility that resolve the various IXxxxService with WCF Proxy classes.

All software logs a lot, to be able to diagnostic errors as soon as possible, and I have a IManagement service that has a method dedicated to logging.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[OperationContract(IsOneWay=true, ProtectionLevel=ProtectionLevel.EncryptAndSign)]
void Log(LogDto log);
{{< / highlight >}}

The implementation of this method is really really simple.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void Log(Dto.LogDto log)
{
log.Log(Logger);
}
{{< / highlight >}}

The LogDto has a method Log, that is able to log everything to an ILogger Castle standard logger that in turns uses Log4Net, so remote program can send log through WCF.

My problem is that the various ViewModels are using classes from a shared library and those classes uses Log4Net internally to log stuff. If the software is deployed in internal network I have no problem because I can redirect logging in a log database, but when the software is used by external user how can I send all those log to the server?

The solution is simple I need to create a custom Log4Net appender to intercept Log4Net logs and redirect them to IManagementService.

{{< highlight csharp "linenos=table,linenostart=1" >}}
class ManagementLogAppender : AppenderSkeleton
{
private IManagementService _managementService;
 
 
public ManagementLogAppender(IManagementService managementService)
{
_managementService = managementService;
}
 
protected override void Append(log4net.Core.LoggingEvent loggingEvent)
{
LogDto logDto = new LogDto();
logDto.Message = loggingEvent.MessageObject.ToString();
if (loggingEvent.ExceptionObject != null)
{
logDto.FullExceptionData = loggingEvent.ExceptionObject.ToString();
}
logDto.LoggerName = loggingEvent.LoggerName;
_managementService.Log(logDto);
}
}
{{< / highlight >}}

This appender simply send the log to the IManagementService so I have a centralized point where all the remote logging takes place. Since I have more than one custom appender, I usually register all of them inside Castle Windsor Configuration and add all registered one with this simple snippet of code, that is run from the bootstrapper.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var allAppender = IoC.ResolveAll<IAppender>();
Hierarchy repository = LogManager.GetRepository() as Hierarchy;
foreach (IAppender appender in allAppender)
{
repository.Root.AddAppender(appender);
}
repository.RaiseConfigurationChanged(EventArgs.Empty);
{{< / highlight >}}

This permits me to have appenders that can declare dependencies, like the ManagementLogAppender that is depending from IManagementService. Thanks to the same facility I can use the concrete class in intranet (direct use of log4net) or the dynamic generated proxy that send log through WCF.

Gian Maria.
