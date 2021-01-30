---
title: "Wcf over secure transport"
description: ""
date: 2009-11-25T13:00:37+02:00
draft: false
tags: [Security,Wcf]
categories: [NET framework]
---
In some [older](http://www.codewrecks.com/blog/index.php/2009/09/08/use-aspnet-membership-provider-with-a-wcf-svc-service/) [posts](http://www.codewrecks.com/blog/index.php/2009/09/09/generate-a-certificate-for-wcf-service-with-windows-server-2003/), I dealt with wcf configuration to manage authentication of a service with the asp.net [membership provider](http://www.codewrecks.com/blog/index.php/2009/09/08/use-aspnet-membership-provider-with-a-wcf-svc-service/).

Now I need to modify configuration, because in another project, all the site is forced over https, and the configuration I used in the other project cannot be used anymore. In older post in fact, I explained how to send credentials over http with message security, using self issued certificates. Now I have transport security, so I can avoid the need to distribute certificates to people that will use the service.

I need two different configuration, the first is for unauthenticated services, Iâ€™ll use for services that must be used by everyone with no authentication, but I need also another configuration that permits me to secure the service through asp.net membership and role management.

Letâ€™s start with the first configuration, first of all I configure IIS7 to use both https binding and http binding, and then I can configure the endpoint on the server to use https

{{< highlight xml "linenos=table,linenostart=1" >}}
<service behaviorConfiguration="BasicHttpsWithoutAuthBehavior"
            name="MyProject.DataService.Concrete.CustomerService">
    <endpoint address="https://mydomain.com/customerservice.svc"
                 binding="basicHttpBinding"
                 name="CustomerService"
                 contract="MyProject.DataService.ICustomerService"
                 bindingConfiguration="SecureTransport">
        <identity>
            <dns value="mydomain.com" />
        </identity>
    </endpoint>
    <endpoint address="mex" binding="mexHttpsBinding" contract="IMetadataExchange" />
</service>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In this configuration there are several thing to notice, first of all the endpoint address begins with https, then I use  **[basicHttpBinding](http://msdn.microsoft.com/en-us/library/system.servicemodel.basichttpbinding.aspx)** , because I do not need credentials to be sent, and finally to have metadataExchange I need to specify [mexHttpsBinding](http://msdn.microsoft.com/en-us/library/aa967391.aspx). This last option is needed, because if you use the standard mexHttpBinding you will end with the error  **â€œCould not find a base address that matches scheme http for the endpoint with binding MetadataExchangeHttpBinding. Registered base address schemes are [https]â€** Now here is the BindingConfiguration for this service:

{{< highlight xml "linenos=table,linenostart=1" >}}
<basicHttpBinding>
    <binding name="SecureTransport">
        <security mode="Transport">
            <transport clientCredentialType="None"/>
        </security>
    </binding>
</basicHttpBinding>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Iâ€™ve simply specified that the security has the mode=â€Transportâ€ and the transport does not use clientCredentialType. If you do not specify â€œnoneâ€ in this value, the service will expect that IIS site is configured to use windows credential as default.

The client should be configured in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
<binding name="HttpsWithNoCredentials" closeTimeout="00:01:00" openTimeout="00:01:00"
receiveTimeout="00:10:00" sendTimeout="00:01:00" allowCookies="false"
bypassProxyOnLocal="false" hostNameComparisonMode="StrongWildcard"
maxBufferSize="65536" maxBufferPoolSize="524288" maxReceivedMessageSize="65536"
messageEncoding="Text" textEncoding="utf-8" transferMode="Buffered"
useDefaultWebProxy="true">		<readerQuotas maxDepth="32" maxStringContentLength="8192" maxArrayLength="16384"		 maxBytesPerRead="4096" maxNameTableCharCount="16384" />		<security mode="Transport">			<transport clientCredentialType="None" proxyCredentialType="None"			 realm="">				<extendedProtectionPolicy policyEnforcement="Never" />			</transport>			<message clientCredentialType="UserName" algorithmSuite="Default" />		</security>	</binding></basicHttpBinding>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is quite complicated configuration, but the relevant part is that the security is mode=â€Transportâ€, thus specifying that https will be used. Then each endpoint that will does not need credentials can be specified in this way

{{< highlight xml "linenos=table,linenostart=1" >}}
<endpointaddress="https://mydomain.com/CustomerService.svc"binding="basicHttpBinding"bindingConfiguration="HttpsWithNoCredentials"contract="MyProject.DataService.ICustomerService"name="CustomerServiceIoC" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this configuration you can secure wcf calls simply using the same certificate used for the https site, and since the security is granted by the transport, you does not need to give certificates to the client.

The configuration with client credentials over https in the next post.

Alk.

Tags: [Wcf](http://technorati.com/tag/Wcf) [Security](http://technorati.com/tag/Security)
