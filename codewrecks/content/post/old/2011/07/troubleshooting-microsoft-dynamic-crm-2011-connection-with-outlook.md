---
title: "Troubleshooting Microsoft Dynamic CRM 2011 connection with Outlook"
description: ""
date: 2011-07-04T13:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
I should specify that I really do not know Microsoft Dynamic CRM 2011, but this morning a friend of mine called me to troubleshoot a problem with Outlook integration. The problem with Outlook connection is that it is based upon a WCF service and my friend told me that the service did not start, each time he tried to browser to the service with a browser ([http://crm.mycompany.com:5555/XRMServices/2011/discovery.svc](http://crm.mycompany.com:5555/XRMServices/2011/discovery.svc)) he got an error and watching the Event Viewer he found the exception message, but he was not able to understand what was wrong.

> Exception: System.ServiceModel.ServiceActivationException: The service ‘/XRMServices/2011/Discovery.svc’ cannot be activated due to an exception during compilation.  The exception message is: The value could not be added to the collection, as the collection already contains an item of the same type: ‘System.ServiceModel.Description.UseRequestHeadersForMetadataAddressBehavior’. This collection only supports one instance of each type.       
> Parameter name: item. —&gt; System.ArgumentException: The value could not be added to the collection, as the collection already contains an item of the same type: ‘System.ServiceModel.Description.UseRequestHeadersForMetadataAddressBehavior’. This collection only supports one instance of each type.

Since I work a lot with WCF, and the error is somewhat related to WCF I tried to solve the problem even if I never worked with CRM 2011. :) First of all this kind of error usually arise when the site in IIS has multiple binding, the first thing to verify is that in IIS the CRM site had only one binding (in default port 5555). It turns out that the configuration was indeed correct, the site had only one binding but the error is indeed related to multiple binding.

To solve this issue I decided to use the [baseAddressPrefixFilters](http://msdn.microsoft.com/en-us/library/bb924481.aspx) configuration element of WCF, because it is used to pick the appropriate IIS bindings for WCF and even if the IIS only has one binding, I was convinced that the error is related to a wrong binding. I changed the system.servicemodel adding this node.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<serviceHostingEnvironment>
<baseAddressPrefixFilters>
<add prefix="http://crm.mycompany.com:5555/"/>
</baseAddressPrefixFilters>
</serviceHostingEnvironment>
{{< / highlight >}}

Now I browse again on the service and it is still broken, but the event viewer showed me another type of error.

> Exception: System.ServiceModel.ServiceActivationException: The service ‘/XRMServices/2011/Organization.svc’ cannot be activated due to an exception during compilation.  The exception message is: The extended protection settings configured on IIS do not match the settings configured on the transport.  The ExtendedProtectionPolicy.PolicyEnforcement values do not match.  IIS has a value of WhenSupported while the WCF Transport has a value of Never.. —&gt; System.NotSupportedException: The extended protection settings configured on IIS do not match the settings configured on the transport.  The ExtendedProtectionPolicy.PolicyEnforcement values do not match.  IIS has a value of WhenSupported while the WCF Transport has a value of Never.

The error changed, and luckily enough this is a very simple error to troubleshoot, because it is due to a mismatch between IIS security configuration for Windows Authentication and WCF configuration. You should open IIS Manager, select the site of the CRM, select the *Authentication* element and search for Windows Authentication. Windows Authentication should be Enabled, and then you should go to the Advanced Settings changing the Extended protection to Off and restart IIS. This finally solved the mismatch.

Now finally outlook is able to connect to the CRM without errors.

alk.

Tags: [CRM](http://technorati.com/tag/CRM) [Microsoft](http://technorati.com/tag/Microsoft)
