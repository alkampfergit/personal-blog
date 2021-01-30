---
title: "Visual studio for big web project8230 so slow"
description: ""
date: 2008-07-29T09:00:37+02:00
draft: false
tags: [Silverlight]
categories: [Silverlight]
---
Yesterday I moved my first steps on silverlight, I’m working on a big solution with a big Web site, and the solution build time is really increased when I add silverlight project to the solution.

It is really frustrating because I change something in the silverlight control, then I had to at least issue a command of “build page” in the site, to make the xap file updates. This cost me about 45 seconds of waiting for….nothing, and I have a 10K RPM disk, with a 3.0 GHz Dual core CPU. This is absolutely embarrassing.

At the end of yesterday I was very happy of silverlight…but completely abhorrent about the time it took me to see the result of any little changes.

The solution I adopted today is the following, I created another solution that contains only the silverlight project and a simple test web site with only a page to host the silverlight application. Then I enable my service (of the main site hosted in my local IIS) to be called from other domain with a clientaccesspolicy.xml file placed in the root directory of my site. Here is the content

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<access-policy>
  <cross-domain-access>
    <policy>
      <allow-from http-request-headers="*">
        <domain uri="*"/>
      </allow-from>
      <grant-to>
        <resource path="/" include-subpaths="true"/>
      </grant-to>
    </policy>
  </cross-domain-access>
</access-policy>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This not so good for security, but this is my test server that only respond to localhost, so I have no problem. Then I’m able to invoke service function from a solution that contains only silverlight project, compile time is 1 second, and with 2 second I can visualize the page in IE…….really a better stuff respect the 45 seconds when I use the full solution. The only inconvenient is that you are not able to debug the service, but I have set up a lot of unit tests that assure me that the service works good.

The result is that if you are working with a big web site, you better work with a solution with only the silverligt project to work at full speed, especially during the first days, when quite often you are trying to do things for the first time (OK, if you already worked with WPF the step is really small) ;)

alk.

Tags: [silverlight](http://technorati.com/tag/silverlight)

<!--dotnetkickit-->
