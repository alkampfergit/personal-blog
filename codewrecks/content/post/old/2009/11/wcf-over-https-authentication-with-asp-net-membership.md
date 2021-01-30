---
title: "Wcf over https authentication with aspnet membership"
description: ""
date: 2009-11-26T16:00:37+02:00
draft: false
tags: [Security,Wcf]
categories: [NET framework]
---
In [last article](http://www.codewrecks.com/blog/index.php/2009/11/25/wcf-over-secure-transport/) I explained how to configure WCF to secure a service with https, with no authentication, now I want to show you the configuration needed to enable role and user membership using a standard asp.net provider.

Here is the service definition on the server

{{< highlight xml "linenos=table,linenostart=1" >}}
<service behaviorConfiguration="WsHttpWithAuthBehavior"
                name="MyProject.DoSomethingService">
    <endpoint address="https://mydomain.it/DoSomethingService.svc"
                 binding="wsHttpBinding" 
                 name="MyService" 
                 bindingConfiguration="wsHttps"
                 contract="MyProject.IDoSomethingService">
        <identity>
            <dns value="mydomain.it" />
        </identity>
    </endpoint>
    <endpoint address="mex" binding="mexHttpsBinding" contract="IMetadataExchange" />
</service>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the binding is wsHttpBinding, because we need to specify credentials, so we cannot use a basicHttpBinding, also the mex uses mexHttpsBinding because we are in https and not http. The interesting stuff is in the behavior and binding configuration.

{{< highlight xml "linenos=table,linenostart=1" >}}
<behavior name="WsHttpWithAuthBehavior">
    <serviceMetadata  httpsGetEnabled="true" />
    <serviceDebug includeExceptionDetailInFaults="true" />
    <serviceAuthorization
        principalPermissionMode="UseAspNetRoles"
        roleProviderName="aspRoleProvider" />
    <serviceCredentials>
        <userNameAuthentication
             userNamePasswordValidationMode ="MembershipProvider"
             membershipProviderName="aspMembershipProvider"/>
    </serviceCredentials>
</behavior>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see you need to use httpsGetEnabled if you want to enable http get, but the interesting part is the serviceAuthorization node, that contains the principalPermissionMode attribute where you need to specify UseAspNetRoles, then the roleProviderName where you specify the name of the roleprovider. For serviceCredentials we have a similar configuration, you need to specify that userNamePasswordValidationMode is MembershipProvider and you need also to specify the membership provider name. These settings are needed to instruct wcf to use asp.net membership provider.

Finally you need to configure binding

{{< highlight xml "linenos=table,linenostart=1" >}}
<bindings>
    <wsHttpBinding>
        <binding name="wsHttps" >
            <readerQuotas maxStringContentLength="128000"/>
            <security mode="TransportWithMessageCredential" >
                <transport clientCredentialType="None"/>
                <message clientCredentialType="UserName"/>
            </security>
        </binding>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The important part is the &lt;[security](http://msdn.microsoft.com/en-us/library/ms789011.aspx)&gt; tag, where you need to specify witch security [mode](http://msdn.microsoft.com/en-us/library/system.servicemodel.wshttpsecurity.mode.aspx) you want to use, in my situation is TransportWithMessageCredential. This specify that the security is given by transport (https) and there are credentials in the message. Then you need to configure &lt;transport&gt; and &lt;message&gt;, since I want to transfer my credentials in message and not in transport, I specify clientCredentialType to â€œnoneâ€ for &lt;transport&gt;, and to â€œuserNameâ€ in &lt;message&gt; node.

Transport credential is used for  windows login, and if you want to specify custom user name and password to validate against asp.net membership, you need to pass them into message part.

Now goes for the client configuration, first of all the binding

{{< highlight xml "linenos=table,linenostart=1" >}}
 <binding name="DoSomethingService" closeTimeout="00:01:00" openTimeout="00:01:00"
     receiveTimeout="00:10:00" sendTimeout="00:01:00" bypassProxyOnLocal="false"
     transactionFlow="false" hostNameComparisonMode="StrongWildcard"
     maxBufferPoolSize="524288" maxReceivedMessageSize="65536" messageEncoding="Text"
     textEncoding="utf-8" useDefaultWebProxy="true" allowCookies="false">
     <readerQuotas maxDepth="32" maxStringContentLength="8192" maxArrayLength="16384"
      maxBytesPerRead="4096" maxNameTableCharCount="16384" />
     <reliableSession ordered="true" inactivityTimeout="00:10:00"
      enabled="false" />
     <security mode="TransportWithMessageCredential">
      <transport clientCredentialType="None" proxyCredentialType="None"
       realm="">
       <extendedProtectionPolicy policyEnforcement="Never" />
      </transport>
      <message clientCredentialType="UserName" negotiateServiceCredential="true"
       establishSecurityContext="true" />
     </security>
    </binding>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The important stuff is the &lt;security&gt; mode that is set again to â€œTransportWithMessageCredentialâ€, and you need to specify in the trasport part that you have no credential and in message part you have UserName credential. Once you gets the server up and running you can simply use svcutil.exe to generate this one, so it is quite an automated task to do and does not worth further explanation. Now I can use the client in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (DoSomethingServiceClient client = new DoSomethingServiceClient())
{
    client.ClientCredentials.UserName.UserName = "Superadmin";
    client.ClientCredentials.UserName.Password = "xxxxxx";
    Int32 outcount;
    client.GetSuggestedStuff();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see you need to specify credential in the wcf proxy client (in real code I use Castle Windsor to dynamically create proxy), and then in server you can write stuff like this.

{{< highlight xml "linenos=table,linenostart=1" >}}
[PrincipalPermission(SecurityAction.Demand, Role="Superadministrator")]
public ServiceResult<Int32> GetSuggestedStuff()
{
    return 43;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you call this method with a user that is not in role Superadministrator a SecurityException get raised. And clearly you can also access the Principal attached to current thread to verify roles programmatically if you need. All is gained for free, with no code, because wcf can use memberhsip api to validate user and password you specified in the message :) and since you use https, you does not need to deal with certificates, as I explained in older posts.

Alk.

Tags: [WCF](http://technorati.com/tag/WCF) [Security](http://technorati.com/tag/Security)
