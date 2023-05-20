---
title: "Application insights installation"
description: ""
date: 2014-03-31T12:00:37+02:00
draft: false
tags: [ApplicationInsights]
categories: [Tfs]
---
I’ve already covered installation of Monitoring Agent for Visual Studio Online Application Insights. Actually the service is in preview and the setup experience is changed from the first one. At date of Today, during installation phase, setup asks you the type of agent you need, but  **it does not asks you if you want to automatically monitor all of your web application**. After the installation you can configure Microsoft Monitoring Agent from Control Panel

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image5.png)

 ***Figure 1***: *Configuration of MMA*

From this configuration panel  **you should insert Account ID and Instrumentation Key that you find in your Visual Studio Online account**. To find these values, you should simply Login in VSO and go to your Application Insights hub, then you press the little “gear” icon in upper right to configure Application Insights. In that section you have an apposite section called Keys & Downloads.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image6.png)

 ***Figure 2***: *Configuration page with all needed data for Microsoft Monitoring Agent.*

Once MMA is configured correctly, you can start monitoring a web site with this simple command.

*Start-WebApplicationMonitoring -Name WebSiteName -Cloud*

 **This simple command will create a file called ApplicationInsights.config in the web site folder with default values to enable Monitoring of the application**. Actually this is not the preferred way to do this, because you should install the [appropriate Visual Studio Add-in](http://blogs.msdn.com/b/bharry/archive/2014/02/06/application-insights-visual-studio-add-in-preview.aspx) that allow you to simply add telemetry configuration to your site directly from Visual Studio.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image7.png)

 ***Figure 3***: *Add Application Insights telemetry to your projects.*

If you use Visual Studio addin, or if you add the application via Start-WebApplicationMonitoring commandlet, I usually change the name of the application immediately. This can be done to the Applicationinsights.config file that is located in the site root

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image8.png)

 ***Figure 4***: *Change the component Name of the application*

This is useful because I do not like to look at my application in Application Insights with the same name of the site in IIS. I like to monitor not only production application, but it can be useful to enable monitoring also of Test and Pre-Production deployment. With such scenario the ability to change the name that I see in Application Insights is a key value. As you can see, in the above picture I changed the name to AzureVM – TailspinToys (in iis the web site is simply named TailspinToys). After a couple of minutes Application Insights starts to have data.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image9.png)

 ***Figure 5***: *Data starts flowing to Application Insights.*

Gian Maria.
