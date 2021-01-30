---
title: "Use AspNet Membership provider with a WCF svc service"
description: ""
date: 2009-09-08T02:00:37+02:00
draft: false
tags: [WCF IIS7]
categories: [NET framework,Programming]
---
Yesterday I literally lost 4 hours trying to do the following thing: Exposing a wcf service with wsHttpBinding, and using the same asp.net membership database used by the site. I encountered many problems, and I decided to write this post to explain the steps that makes everything work for me. First of all you need to know that fact:  **if you want to use asp.net membership in a wcf service exposed with wsHttpBinding you need to use certificates** , and this causes most of the problems.

You need to create certificates in the server that will run the service, to accomplish this you should configure a Certificate Authority, but for testing purpose you can use  **MakeCert.exe** as described [here](http://msdn.microsoft.com/en-us/library/ms733813.aspx). Even if you are not familiar with certificate, here is the two command lines you need to type at vs command prompt (with administrative privilege if you work in windows vista/7 ).

{{< highlight csharp "linenos=table,linenostart=1" >}}
makecert -n "CN=AlkCA" -r -sv AlkCa.pvk AlkCa.cer{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This creates two files, one is the private key of this temp certificate authority, the other is the certificate of the authority. Now you need to create the certificate to use with wcf, using these files just created.

{{< highlight csharp "linenos=table,linenostart=1" >}}
makecert -sk SignedByCA -iv AlkCa.pvk -n "CN=localhost" -ic AlkCa.cer -sr LocalMachine -ss My -sky exchange -pe{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The  **CN=localhost** must be the address you use to expose the service. If the service will go on a server called ServerXXX you need to create the certificate with CN=ServerXXX. Just to be clear, if you will access your service with the address [http://servername:port/servicename.svc](http://servername:port/servicename.svc) you must create with CN=servername. moreover does not forget to create with â€“sky exchange. Now that you have the certificate open the mmc console, typing mmc at command prompt. The mmc opens, then goes to*File-&gt;add/remove snap in*, choose certificate, then choose computer account, then local computer. Now verify that the new certificate is in place.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image3.png)

Now you need to configure web.config on the web application that will host the site. First of all configure the membership as usual, first of all the connectionstring.

{{< highlight xml "linenos=table,linenostart=1" >}}
  <connectionStrings>
    <add name="SqlConn" connectionString="Database=auth;Server=localhost\sql2008;User=blabla;Pwd=blabla" providerName="System.Data.SqlClient" />
  </connectionStrings>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Then Membership and Role provider.

{{< highlight xml "linenos=table,linenostart=1" >}}
<roleManager defaultProvider="SqlRoleProvider" enabled="true" cacheRolesInCookie="true">
  <providers>
    <add name="SqlRoleProvider" type="System.Web.Security.SqlRoleProvider" connectionStringName="SqlConn" applicationName="/" />
  </providers>
</roleManager>
<membership defaultProvider="SqlMembershipProvider" userIsOnlineTimeWindow="15">
  <providers>
    <clear />
    <add
      name="SqlMembershipProvider"
      type="System.Web.Security.SqlMembershipProvider"
     ... />
  </providers>
</membership>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you need to instruct WCF to use certificate and membership. Here is the endpoint as it should be defined in the server.

{{< highlight xml "linenos=table,linenostart=1" >}}
<service behaviorConfiguration="Web.HelloWorldBehavior" name="TestService.HelloWorld">
    <endpoint address="" binding="wsHttpBinding" contract="TestService.IHelloWorld"
              bindingConfiguration="mb">
        <identity>
            <dns value="localhost" />
        </identity>
    </endpoint>
    <endpoint address="mex" binding="mexHttpBinding" contract="IMetadataExchange" />
</service>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The value for the &lt;dns value=â€xxxâ€ /&gt; must be the same of the certificate. In this simple example I simply used localhost, but do not forget to use the real name that you will use to expose the service. The bindingConfiguration is named â€œmbâ€ and is the one that instruct wcf that we are expecting username/password in the header of the messages.

{{< highlight xml "linenos=table,linenostart=1" >}}
<bindings>
  <wsHttpBinding>
    <binding name="mb">
      <security mode="Message">
        <message clientCredentialType="UserName"/>
      </security>
    </binding>
  </wsHttpBinding>
</bindings>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I used security mode Message and credentialType UserName. This is the reason why we need certificates, because*ws\* requires that username credentials must not be sent in clear text*. Finally you need to tell wcf where to find certificate to use, this is done in the behaviour Web.HelloWorldBehaviour

{{< highlight xml "linenos=table,linenostart=1" >}}
<serviceBehaviors>
    <behavior name="Web.HelloWorldBehavior">
        <serviceMetadata httpGetEnabled="true" />
        <serviceDebug includeExceptionDetailInFaults="false" />
      <serviceAuthorization principalPermissionMode="UseAspNetRoles" roleProviderName="SqlRoleProvider" />
        <serviceCredentials>
          <serviceCertificate findValue="localhost" x509FindType="FindBySubjectName" 
                              storeLocation="LocalMachine" storeName="My" />

          <userNameAuthentication userNamePasswordValidationMode ="MembershipProvider"
              membershipProviderName ="SqlMembershipProvider"/>
          </serviceCredentials>
    </behavior>
</serviceBehaviors>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can see that the certificate is specified with ServiceCertificate where  **findValue** is the value used for CN= **localhost** , and the certificate is stored in local machine in personal/certificate as I explained before. Now you can browse to the service and verify that everything works. It is now possible that you get the exception:

> Keyset does not exist

This happens because the user used to run the application pool needs permission to access certificates. Return in mmc and give to that user needed permission

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image4.png)

In my example I simply used NetworkService to run the application so I give to network service the appropriate rights.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image5.png)

Now you should be able to browse the service with no problem, now it is time to configure the client. Since we are using certificates, we need to do a couple of things in all clients computer: install the certificate localhost, and install the certificate authority as trusted one. To accomplish this step you first need to export generated certificate from the server

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image6.png)

Choose not to export the private key, export it in DER encoded binary X.509, and choose destination directory, you will obtain a.cer file. Now move to the client computer (usually it is a good thing to first test client on the server machine to avoid firewall problem etc etc) open mmc console and add another snap/in , choose *certificate* then *My user*. These operations must be executed for each client that will access the service. Goes to the Personal/Certificates and import the localhost.cer certificate just created.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image7.png)

This is not enough, because this certificate was issued by a not trusted temporary certificate authority, it is not a trusted one. You need to add the temp CA into trusted certification authority:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image8.png)

By clicking â€œImportâ€ you need to browse where you created the two pvk and cer file (the very first step of this tutorial), and you need to import the file AlkCa.cer, the certificate file for the temporary certification authority. Clearly you need to send those two files to each client computer, but keep secret the pck file. Now you should see the CA in the list of trusted root certification authorities. Now create a windows form application, set a reference to the service and goes to app.config. In the behaviors section you need to configure certificates.

{{< highlight xml "linenos=table,linenostart=1" >}}
<behaviors>
  <endpointBehaviors>
    <behavior name="certForClient">
      <clientCredentials>
        <clientCertificate findValue="localhost" x509FindType="FindBySubjectName"
                                    storeLocation="CurrentUser" storeName="My"/>
      </clientCredentials>
    </behavior>
  </endpointBehaviors>
</behaviors>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can verify the location is now  **CurrentUser** because the certificate is stored in the certificate store of the current user. This guarantee maximum security, if someone else log in into computer, it does not have certificate to access the service, because the service is bound to that user only. Finally you need to be sure that the endpoint is configured correctly.

{{< highlight xml "linenos=table,linenostart=1" >}}
<client>
   <endpoint address="http://localhost:10001/HelloWorld.svc" binding="wsHttpBinding"
       bindingConfiguration="WSHttpBinding_IHelloWorld" contract="HelloWorld.IHelloWorld"
       name="WSHttpBinding_IHelloWorld" behaviorConfiguration="certForClient">
       <identity>
           <dns value="localhost" />
       </identity>
   </endpoint>
</client>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You need to verify that behaviorConfiguration is ok and that the address of the service is localhost, the exact name of the certificate. Now you can try to access the server from the client with this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (HelloWorld.HelloWorldClient client = new WindowsFormsApplication1.HelloWorld.HelloWorldClient()) {
    client.ClientCredentials.UserName.UserName = "Dev";
    client.ClientCredentials.UserName.Password = "xxxxxx";
    MessageBox.Show(client.HelloWorld().ToString()) ;
} {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I created in asp.net authentication database a user named Dev, that belongs to the role â€œDevelopersâ€.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image9.png)

The method HelloWorld in the concrete implementation of the service requires a specific role

{{< highlight csharp "linenos=table,linenostart=1" >}}
[PrincipalPermission(SecurityAction.Demand, Role="Developers")]
int IHelloWorld.HelloWorld()
{
   ServiceSecurityContext context = ServiceSecurityContext.Current; 
   return 42;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The PrincipalPermission attribute requires that to call this method you need to belong to role â€œDevelopersâ€. You can start the client and verify that it is able to call the server correctly. Now it is possible that you gets the exception.

> The X.509 certificate CN=localhost chain building failed. The certificate that was used has a trust chain that cannot be verified. Replace the certificate or change the certificateValidationMode. The revocation function was unable to check revocation for the certificate

There are a lot of posts dealing with this problem around in the internet, but if you read with attention the error is  **The revocation function was unable to check revocation for the certificate** , and is due to the fact that certificate was not issue by a real Certificate Authority, so the client is not able to verify if the certificate was revocated. You need to change the  **client app.config telling wcf not to check revocation**.

{{< highlight xml "linenos=table,linenostart=1" >}}
<behaviors>
  <endpointBehaviors>
    <behavior name="certForClient">
      <clientCredentials>
        <serviceCertificate >
          <authentication certificateValidationMode="PeerOrChainTrust" revocationMode="NoCheck"/>
        </serviceCertificate>
        <clientCertificate findValue="localhost" x509FindType="FindBySubjectName"
                                    storeLocation="CurrentUser" storeName="My"/>
      </clientCredentials>
    </behavior>
  </endpointBehaviors>
</behaviors>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see  **I set revocationMode to â€œNoCheckâ€** this is usually enough to solve the problem. After everything works you can verify what is happening with a user that does not belongs to Developers role..

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (HelloWorld.HelloWorldClient client = new WindowsFormsApplication1.HelloWorld.HelloWorldClient())
{
    client.ClientCredentials.UserName.UserName = "Test";
    client.ClientCredentials.UserName.Password = "xxx";
    client.HelloWorld();
} {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Iâ€™ve created a valid user Test, that belongs only to role â€œTestersâ€, and when you try to call the HelloWorld method you will get an exception â€œaccess deniedâ€ because the user does not belongs to requested role.

Sometimes you can encounter the following exception.

> An unsecured or incorrectly secured fault was received from the other party

This happens when there is some error in the server, the most common one is a wrong configuration of the authentication database, or authentication. Verify with the appropriate web management that everything is ok in the web.config, verify connection string to the auth database, and verify that authentication mode=â€Formsâ€ and not â€œWindowsâ€.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image10.png)

If you still are receiving this exception try to access the service through an unsecured basicHttpBinding or look at message exchange with fiddler, that usually reveals the real exception that is occurred in the server.

These steps worked for me in a windows server 2008 environment and in Windows7 64 bit environment. Never tested in windows server 2003, xp or vista, but everything should be the same. [You can find my example here](http://www.nablasoft.com/Temp/TestService.zip).

Alk.

Tags: [WCF wsHttpBinding Certificate](http://technorati.com/tag/WCF%20wsHttpBinding%20Certificate)
