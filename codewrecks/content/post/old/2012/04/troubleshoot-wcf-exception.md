---
title: "Troubleshoot WCF exception"
description: ""
date: 2012-04-23T11:00:37+02:00
draft: false
tags: [Wcf]
categories: [NET framework]
---
WCF is an exceptional library but sometimes it is hard to troubleshoot problems, especially when you start to encounter intermittent communication errors and you feel lost because you have no clue on where the error is. As an example I have a service that worked for a lot of time, then sometimes the client started to receive this error

>  **The server did not provide a meaningful reply; this might be caused by a contract mismatch, a premature session shutdown or an internal server error** The easiest way to troubleshoot this kind of error is to enable logging for WCF in the system.diagnostic section of the application configuration file, just modify the system.Diagnostics adding a System.ServiceModel source to enable logging and be sure to redirect the log into a file with the.svclog extension because it has the Microsoft Service Trace Viewer tools asssociated with it.

{{< highlight xml "linenos=table,linenostart=1" >}}


  <system.diagnostics>
    <trace autoflush="true" />
    <sources>
      <source name="System.ServiceModel"
              switchValue="Information, ActivityTracing"
              propagateActivity="true">
        <listeners>
          <add name="sdt"
              type="System.Diagnostics.XmlWriterTraceListener"
              initializeData="c:\log\client.svclog"  />
        </listeners>
      </source>
    </sources>
  </system.diagnostics>

{{< / highlight >}}

After adding this section to the configuration file you can fire the program and use it until you get the WCF exception you are trying to troubleshoot,  **once you had the exception you can simply double click on the client.svclog file and Microsoft Service Trace Viewer will open** , showing you detailed information of everything happened in WCF stack. The tool is really super easy to use, all exceptions are marked in red and selecting all the exception happened in WCF stack you usually are able to understand what gone wrong exactly.

[![23-04-2012 14-35-31](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/23-04-2012-14-35-31_thumb.png "23-04-2012 14-35-31")](http://www.codewrecks.com/blog/wp-content/uploads/2012/04/23-04-2012-14-35-31.png)

 ***Figure 1***: *The detail of the exception logged by WCF*

As you can spot from  **figure 1** , the real exception is the QuotaExceedException and the real message is “The maximum message site quota for incoming messages (65536) has been exceeded …” now you have a better understanding of what is gone wrong and how you can solve it.

In my specific situation, one of the call receive too much data from the server, so I needed only to modify configuration to allow bigger message transfer.

Gian Maria.
