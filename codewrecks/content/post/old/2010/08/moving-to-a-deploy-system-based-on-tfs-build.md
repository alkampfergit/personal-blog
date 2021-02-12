---
title: "Moving to a deploy system based on Tfs Build"
description: ""
date: 2010-08-10T08:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Team Foundation Server]
---
Now that I'm able to deploy to a remote machine a web application thanks to a customized build workflow it is time to move to a real scenario. I've blogged about two distinct tasks

1. [executing arbitrary code with a tfs build](http://www.codewrecks.com/blog/index.php/2010/07/07/use-tfs-2010-build-to-execute-arbitrary-task/)
2. [deploy an application to a remote server with a custom tfs workflow](http://www.codewrecks.com/blog/index.php/2010/07/10/deploy-remotely-with-tfs-build/)

Now I want to move to a real scenario:*executing the deploy when build quality of a specific build changes to *ready for deployment*.* To accomplish this task you first need to understand how to register for event subscription in TFS, thanks to the  **[bisubscribe.exe](http://msdn.microsoft.com/en-us/magazine/cc507647.aspx)** tool. Subscription is made through webservices.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image1.png)

You register to TFS event submitting ad url where your service is listening, and whenever the event fires, TFS calls your service. To find all events you can register to, you can simply browse the service

[http://win-y4onzs094up:8080/tfs/services/v1.0/registration.asmx](http://win-y4onzs094up:8080/tfs/services/v1.0/registration.asmx "http://win-y4onzs094up:8080/tfs/services/v1.0/registration.asmx")

Then click GetRegistrationEntries, and invoke the service. The result value is a long XML where you can find the eventType node that specifies the type of events you can register to. Since I want to be notified when a build changes quality, I need to register to BuildStatusChangeEvent

{{< highlight csharp "linenos=table,linenostart=1" >}}
- <EventType>
<Name>BuildStatusChangeEvent</Name>
<Schema><?xml version="1.0" encoding="utf-8"?>
<xs:schema elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="BuildStatusChangeEvent" nillable="true" type="BuildStatusChangeEvent" />
<xs:complexType name="BuildStatusChangeEvent">
<xs:sequence>
<xs:element minOccurs="0" maxOccurs="1" name="TeamFoundationServerUrl" type="xs:anyURI" />
<xs:element minOccurs="0" maxOccurs="1" name="TeamProject" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="Title" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="Subscriber" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="Id" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="Url" type="xs:anyURI" />
<xs:element minOccurs="0" maxOccurs="1" name="TimeZone" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="TimeZoneOffset" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="ChangedTime" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="StatusChange" type="Change" />
<xs:element minOccurs="0" maxOccurs="1" name="ChangedBy" type="xs:string" />
</xs:sequence>
</xs:complexType>
<xs:complexType name="Change">
<xs:sequence>
<xs:element minOccurs="0" maxOccurs="1" name="FieldName" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="OldValue" type="xs:string" />
<xs:element minOccurs="0" maxOccurs="1" name="NewValue" type="xs:string" />
</xs:sequence>
</xs:complexType>
</xs:schema>
</Schema>
</EventType>
{{< / highlight >}}

The command I issue to the tfs service to register my service for changing of *BuildStatusChangeEvent* is the following one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
C:\Program Files\Microsoft Team Foundation Server 2010\Tools>
BisSubscribe.exe
/EventType BuildStatusChangeEvent
/address http://10.0.0.2/Bisubscribe.Test/BuildMachine.svc
/collection http://win-y4onzs094up:8080/tfs/DefaultCollection
 
BisSubscribe - Team Foundation Server BisSubscribe Tool
Copyright (c) Microsoft Corporation.  All rights reserved.
 
TF50001:  Created or found an existing subscription. The subscription ID is 2.
{{< / highlight >}}

You need simply to specify: *EventType, address and collection* and you are done. Now for those ones that have no idea on how to implement the *BuildMachine.svc* service here is the details.

First of all check [this post](http://mskold.blogspot.com/2010/02/upgrading-tfs-event-subscriptions-to.html) that explains in detail how to use WCF to create a service that is compatible with TFS subscription system, then it is matters of minute because the service needs only a function called *Notify*. First of all I created service interface

{{< highlight csharp "linenos=table,linenostart=1" >}}
namespace Bisubscribe.Test.Services
{
[ServiceContract(Namespace = "http://schemas.microsoft.com/TeamFoundation/2005/06/Services/Notification/03")]
public interface INotificationService
{
 
[OperationContract(Action = "http://schemas.microsoft.com/TeamFoundation/2005/06/Services/Notification/03/Notify")]
[XmlSerializerFormat(Style = OperationFormatStyle.Document)]
void Notify(string eventXml, string tfsIdentityXml);
 
}
}
{{< / highlight >}}

Then the concrete class to simply dump content of the messages to verify that the event system is called.

{{< highlight csharp "linenos=table,linenostart=1" >}}
namespace Bisubscribe.Test.Services
{
public class BuildMachine : INotificationService
{
private ILogger Logger { get; set; }
 
public BuildMachine(ILogger logger)
{
Logger = logger;
}
 
public void Notify(string eventXml, string tfsIdentityXml)
{
Logger.Debug("Called eventXML:\n{0}",  eventXml );
Logger.Debug("Called tfsIdentityXml:\n{0}", tfsIdentityXml);
}
}
}
{{< / highlight >}}

Since I'm using castle log4net integration and castle wcf integration I'm able to declare dependency to a ILogger interface to simply log every information that the server receives. Then I create a simple web application and insert the BuildMachine.Svc file with this content

{{< highlight csharp "linenos=table,linenostart=1" >}}
<%   1:  @ServiceHost Service="Bisubscribe.Test.Services.BuildMachine"
Factory="Castle.Facilities.WcfIntegration.DefaultServiceHostFactory, Castle.Facilities.WcfIntegration"
%>
{{< / highlight >}}

I'm using the Castle WcfIntegration facility so I need to register the class in the castle config file, and finally, the only really critical step, is creating the right configuration for WCF to expose the service with SOAP 1.2 as described in [this article](http://mskold.blogspot.com/2010/02/upgrading-tfs-event-subscriptions-to.html). Now I changed the build quality of one of the build and check log file to verify if service is called. Here is the result.

{{< highlight csharp "linenos=table,linenostart=1" >}}
2010-08-07 11:14:39,666 [7] DEBUG Bisubscribe.Test.Services.BuildMachine [(null)] - Called eventXML:
<?xml version="1.0" encoding="utf-16"?><BuildStatusChangeEvent xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<BuildUri>vstfs:///Build/Build/34</BuildUri>
<TeamFoundationServerUrl>http://win-y4onzs094up:8080/tfs/DefaultCollection</TeamFoundationServerUrl>
<TeamProject>WebDeploy</TeamProject>
<Title>WebDeploy Build Demo_20100709.7 Quality Changed To Initial Test Passed</Title>
<Subscriber>WIN-Y4ONZS094UP\Administrator</Subscriber>
<Id>Demo_20100709.7</Id>
<Url>http://win-y4onzs094up:8080/tfs/web/build.aspx?pcguid=ab718f2c-b4ab-499e-98c1-0a9766e3ddf6&amp;builduri=vstfs:///Build/Build/34</Url>
<TimeZone>Pacific Daylight Time</TimeZone>
<TimeZoneOffset>-07:00:00</TimeZoneOffset>
<ChangedTime>8/7/2010 2:12:37 AM</ChangedTime>
<StatusChange>
<FieldName>Quality</FieldName>
<OldValue>Ready for Deployment</OldValue>
<NewValue>Initial Test Passed</NewValue>
</StatusChange>
<ChangedBy>WIN-Y4ONZS094UP\gianmaria.ricci</ChangedBy>
</BuildStatusChangeEvent>
{{< / highlight >}}

This is simple XML that can be parsed with Linq2SQL, you can find the id of the build and in StatusChange node you are notified of the field name that changes (Quality) the old and new value and this is enough information to implement the requested functionality.

Next step is [triggering the execution of the remote build script](http://www.codewrecks.com/blog/index.php/2010/07/10/deploy-remotely-with-tfs-build/) to deploy the right build into the test server.

alk.

[Sample code is here](http://www.codewrecks.com/Files/bisubscribe.zip).
