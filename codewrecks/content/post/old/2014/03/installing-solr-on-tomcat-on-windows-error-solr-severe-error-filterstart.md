---
title: "Installing Solr on Tomcat on windows Error solr SEVERE Error filterStart"
description: ""
date: 2014-03-07T08:00:37+02:00
draft: false
tags: [Solr]
categories: [Solr]
---
If you are used in installing Solr in Windows environment and you install for the first time a  **version greater than 4.2.1** you can have trouble in letting your Solr server to start. The symptom is:  **service is stopped in Tomcat Application Manager and if you press start you got a simple error telling you that the application could not start**.

To troubleshoot these kind of problems, you can go to Tomcat Log directory and looking at Catilina log, but usually you probably find a little information there.

> Mar 06, 2014 7:02:07 PM org.apache.catalina.core.StandardContext startInternal  
>  SEVERE: Error filterStart  
>  Mar 06, 2014 7:02:07 PM org.apache.catalina.core.StandardContext startInternal  
>  SEVERE: Context [/solr47] startup failed due to previous errors

The reason of this is a change in the logging subsystem done in version 4.2.1, that is explained in the installation guide: [* **Switching from Log4J back to JUL** *](https://wiki.apache.org/solr/SolrLogging#Using_the_example_logging_setup_in_containers_other_than_Jetty). I’ve blogged about this problem in the past, but it seems to still bite some person so it worth spending another post on the subject. The solution is in the above link, but essentially **you should open the folder where you unzipped solr distribution, go to the *solr/example/ext* and copy all jar files you find there inside Tomcat Lib subdirectory **.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image1.png)** Figure 1: ***Jar files needed by Solr to start*

After you copied these jar files into Tomcat lib directory  **you should restart Tomcat and now Solr should starts without problem**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image2.png)

 ***Figure 2***: *Et Voilà, Solr is started.*

Gian Maria.
