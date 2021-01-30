---
title: "Install Solr 43 pay attention to log libraries"
description: ""
date: 2013-05-29T18:00:37+02:00
draft: false
tags: [Solr]
categories: [Solr]
---
After I configured Solr 4.3 on a Virtual Machine (side by side with a 4.0) it refuses to start, and the only error I have in catilina log files is

* **SEVERE: Error filterStart** *

This leaved me puzzled, but thanks to Alexandre and the exceptional Solr Mailing list I was directed toward the solution.  **Solr 4.3 changed logging mechanism;** and in this link [http://wiki.apache.org/solr/SolrLogging#What\_changed](http://wiki.apache.org/solr/SolrLogging#What_changed "http://wiki.apache.org/solr/SolrLogging#What_changed") you can read about what changed and how to enable logging for Solr 4.3.

It turns out that I’ve entirely missed this step

- *Copy the jars from <tt>solr/example/lib/ext</tt> into your container’s main lib directory. For tomcat this is usually <tt>tomcat/lib</tt>. These jars will set up SLF4J and log4j.*

And this is the only reason why my Solr Instance refused to start, after libs are inside Tomcat/lib everything works as expected. It could be not your problem, but once logging libraries are there, surely you will get a better log that will help you troubleshoot why Solr refuses to start.

Gian Maria
