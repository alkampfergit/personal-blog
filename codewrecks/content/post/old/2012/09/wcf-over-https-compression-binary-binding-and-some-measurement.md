---
title: "Wcf over HTTPS compression binary binding and some measurement"
description: ""
date: 2012-09-11T20:00:37+02:00
draft: false
tags: [Performance,Wcf]
categories: [Frameworks]
---
I’ve an application that is composed by  **WPF clients deployed over the internet and a central WCF service exposed over Https for security reason** , everything works fine, but as the number of clients grows, performance starts to decrease a little. Since I have a great number of clients that operates behind a single standard ADSL 8 MBit (used for everything, mail, browsing, etc..), I measured and found that bandwidth is becoming a bottleneck, so  **I need to reduce amount of traffic between clients and server**.

It turns out that the  **easiest way to gain bandwidth is enabling IIS dynamic compression** , as you can read on [this interesting article by Scott Hanselman](http://www.hanselman.com/blog/EnablingDynamicCompressionGzipDeflateForWCFDataFeedsODataAndOtherCustomServicesInIIS7.aspx) that explain in great details how you can enable compression in IIS. Since my server has plenty of CPU available, compression is a real interesting way to reduce bandwidth.

This is not the only option,  **you can also enable binary serialization over Http because binary serialization usually is smaller than standard serialization you obtain with DataContractSerializer** , the only drawback is that such an endpoint is accessible only with WCF client; but if this is an issue it is really simple to expose the same service with multiple endpoints, each one with a different binding. I decided to add another endpoint with customBinding to use the BinaryMessageEncoding (because I want to be interoperable with non.NET clients), so I added this binding configuration

{{< highlight xml "linenos=table,linenostart=1" >}}


      <customBinding>
        <binding name="BinaryHttpBindingWithNoAuth">
          <binaryMessageEncoding>
            <readerQuotas maxDepth="32" maxStringContentLength="2100000000" maxArrayLength="16384" maxBytesPerRead="2147483647" maxNameTableCharCount="16384" />
          </binaryMessageEncoding>
          <httpsTransport />
        </binding>
        <binding name="BinaryHttpBinding">
          <binaryMessageEncoding>
            <readerQuotas maxDepth="32" maxStringContentLength="2100000000" maxArrayLength="16384" maxBytesPerRead="2147483647" maxNameTableCharCount="16384" />
          </binaryMessageEncoding>
          <security authenticationMode="UserNameOverTransport">
          </security>
          <httpsTransport />
        </binding>
      </customBinding>

{{< / highlight >}}

Then I added another endpoint of this service that use this binding (actually I have more than a single wcf service, some of them without authentication, some other that needs to be authenticated, this is the reason why I need two configuration for binding).

Then I modified my client program to be able to use standard or binary endpoint with a user settings and I started to measure bandwidth usage in various situation. I’ve started with a  **real scenario, startup of the application with production real data** , because during startup the application issues seventeen requests to the service to initialize everything, it start requesting customer information, then try to login the user and finally loads all data the user needs to start working. I can improve performances reducing number of requests, but actually I’m interested only in download bandwidth.

Here is the sum of bytes downloaded for all the requests, first column is SOAP uncompressed, second one SOAP compressed, third column BinaryMessageEncoding uncompressed, and finally fourth column BinaryMessageEncoding compressed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/09/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/09/image5.png)

 ***Figure 1***: *Measurement over the amount of data downloaded at application startup*

With SOAP binding and no compression the startup download ~262Kb of data and  **since data is mostly textual, simply enabling Http Dynamic compression (second column) saved ~80% of the bandwidth** , because total amount of data is now ~52Kb. Now it is interesting to compare these numbers with BinaryMessageEncoding (third column) because the  **total size is ~155Kb, a ~40% saving respect SOAP uncompressed data**. This is interesting because if for some reason you have small CPU power to enable compression, with Binary Encoding you can still save a lot of bandwidth without resorting to compression. The fourth column represents  **BinaryEncoding with Dynamic compression, since the content is mostly textual I can gain ~76% of the bandwidth (36Kb instead of 155Kb) enabling compression even for the Binary Encoding**. It is a ~30% save respect to compressed SOAP and ~86% gain respect to SOAP uncompressed.

These numbers can vary a lot in your situation, because they are highly dependent of format of data (I need to send large portion of textual data so it my data is highly compressible), but it worth takes some measurement to understand if you can gain similar amount of bandwidth with your data. The important stuff is that everything is done simply changing WCF configuration and you do not need to change a single line of code.

Gian Maria.
