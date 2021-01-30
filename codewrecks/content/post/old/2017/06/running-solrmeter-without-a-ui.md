---
title: "Running SolrMeter without a UI"
description: ""
date: 2017-06-06T20:00:37+02:00
draft: false
tags: [Solr]
categories: [Solr]
---
## What is SolrMeter

[**SolrMeter**](https://github.com/tflobbe/solrmeter) **is a nice Java program that allows you to test performances of your Solr installation under heavy load**. This tool is not capable of handling very high load with coordination of multiple clients, nor it can test installation with multiple Solr Machines with a round robin to distribute queries across all machines, but  **it does a really decent work in helping you to have some raw numbers about how your Solr installation perform**.

> SolrMeter can really helps you to understand how Solr perform especially if you need to compare different schema.xml solution, or different hardware or core configurations.

Using the tool is straightforward: you just need to follow the [tutorial here](https://github.com/tflobbe/solrmeter/blob/wiki/Usage.md), just compile the latest version with Maven, then it is just a matter of creating some files containing: the queries you want to issue (param q=) ,filter queries you want to use (param fq=) and finally a series of fields used for faceting.

In settings menu you can simply configure everything you need. The first tab allows you to specify all files that contains data to generate the query, as well as the address of the core/collection you want to test.

[![SolrMeter configuration to issue queries to a SolrCore](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb9.png "A typical solMeter configuration")](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image9.png)

 ***Figure 1***: *A typical SolrMeter configuration*

Now you can just specify how many query per second you want to issue to your server, press play and the test starts.

[![How to specify number of query per seconds and then running the test pressing start button.](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb10.png "Run solr Test")](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image10.png)

 ***Figure 2***: *Choose query per seconds and then run the test*

## What type of data you can grab from SolrMeter

 **The tool gives you lots of information and graphs that can allow you to understand how well your Solr installation performs** with the set of queries you are issuing to the server. A typical Graph you can look at is the distribution of average response time of the query during the run.

[![Query history graph shows you the average execution time of a query during time](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb11.png "Query History")](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image11.png)

 ***Figure 3***: *Query History*

In  **Figure 3** I can see that the average query time for the first 10 seconds is about 375 ms, while for subsequent queries the average response time is under 50 ms. Another interesting graph is distribution of the queries execution time during the load.

[![This graph shows the distribution of response time for queries](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb12.png "Average response time graph")](http://www.codewrecks.com/blog/wp-content/uploads/2016/01/image12.png)

 ***Figure 4***: *Average response time for queries*

In X axes you have execution time, in Y axes you have number of queries. From the  **Figure 4** graph you can verify that almost of the queries were executed under 500ms, with some high peak of some queries that needed 12 seconds to be executed.

## Running without a UI

There are other cool features about SolrMeter, but I **want to show you a feature that is less known and that is really useful, the ability to run without a UI**. Once you’ve setup a test load with UI, you can choose file/export to export the actual SolrMeter configuration to a file.

> Exporting configuration to a file generates a nice XML file with all the options configured with the UI.

Once you have exported the configuration file, you can copy it, along with SolrMeter jar file and all the various configuration files (the ones with queries, filters, etc) to your target server with SSH (solr is usually installed in a Linux machine without UI).

 **Once all the files were copied, it is really simple to edit the main XML configuration files if you need to change something.** You can update the address of the core to test, he location of the various configuration files, etc.

Running SolrMeter in the very same machine that is running Solr is not usually a good advice, but there are scenarios where running without a UI is the only way to go. As an example, consider an installation where you have your Solr Machines and a web application server installed on Linux without an UI and in an isolated environment where you can access only with SSH. In this scenario, to run a load test you should run the test from the Web Application machine, to really simulate a real scenario from the web application machine to the Solr Machine.

> In many scenario you should run your Load test from the machine that is accessing solar, and it has no UI.

Now you need to create an xml file, usually named solrmeter.smc.xml that contains all solrmeter configuration for the run. Here is a possible content.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
<comment>Solr Meter Configuration File. Generated at 15-gen-2016</comment>
<entry key="solr.query.queryMode">standard</entry>
<entry key="headless.performQueryOperations">true</entry>
<entry key="solr.update.documentsToCommit">100</entry>
<entry key="executor.optimizeExecutor">ondemand</entry>
<entry key="solr.server.configuration.httpAuthUser"/>
<entry key="statistic.refreshTime">2000</entry>
<entry key="solr.queryMethod">GET</entry>
<entry key="guice.headlessModule">com.plugtree.solrmeter.HeadlessModule</entry>
<entry key="statistic.configuration.filePath">statistics-config.xml</entry>
<entry key="headless.numUpdates">100</entry>
<entry key="solr.query.useFacets">true</entry>
<entry key="solr.query.useFilterQueries">true</entry>
<entry key="solr.server.configuration.followRedirect">false</entry>
<entry key="solr.query.addRandomExtraParams">true</entry>
<entry key="solr.queriesFiles">C:\Develop\xxxxxx\SolrMeter\Test1\Set1_Queries.txt</entry>
<entry key="solrConnectedButton.pingInterval">5000</entry>
<entry key="statistic.timeRange.range501_1000">true</entry>
<entry key="solr.query.filterQueriesFile">C:\Develop\xxxxxx\Tools\SolrMeter\Test1\Set1_FilterQueries.txt</entry>
<entry key="guice.solrMeterRunModeModule">com.plugtree.solrmeter.SolrMeterRunModeModule</entry>
<entry key="solr.update.timeToCommit">10000</entry>
<entry key="guice.standalonePresentationModule">com.plugtree.solrmeter.StandalonePresentationModule</entry>
<entry key="statistic.timeRange.range0_500">true</entry>
<entry key="solr.documentIdField">id</entry>
<entry key="solr.update.solrAutocommit">false</entry>
<entry key="solr.documentFieldsFile">C:\Develop\xxxxxx\Tools\SolrMeter\Test1\Set1_fields.txt</entry>
<entry key="solr.testTime">1</entry>
<entry key="files.charset">UTF-8</entry>
<entry key="statistic.timeRange.range1001_2000">true</entry>
<entry key="solr.server.configuration.allowCompression">true</entry>
<entry key="solr.server.configuration.soTimeout">60000</entry>
<entry key="headless.outputDirectory">./solrmeter-headless</entry>
<entry key="statistic.showingStatistics">all</entry>
<entry key="solr.query.echoParams">false</entry>
<entry key="solr.query.extraParameters">indent=true,debugQuery=false</entry>
<entry key="executor.queryExecutor">random</entry>
<entry key="solr.searchUrl">http://localhost:8983/solr/MyCore</entry>
<entry key="guice.modelModule">com.plugtree.solrmeter.ModelModule</entry>
<entry key="solr.query.extraParams">C:\Develop\xxxxxx\Tools\SolrMeter\Test1\Set1_extraparams.txt</entry>
<entry key="solr.server.configuration.maxTotalConnections">1000000</entry>
<entry key="statistic.timeRange.range2001_2147483647">true</entry>
<entry key="solr.errorLogStatistic.maxStored">400</entry>
<entry key="guice.statisticsModule">com.plugtree.solrmeter.StatisticsModule</entry>
<entry key="executor.updateExecutor">random</entry>
<entry key="solr.updatesFiles"/>
<entry key="headless.performUpdateOperations">false</entry>
<entry key="headless.numQueries">100</entry>
<entry key="solr.load.queriespersecond">5</entry>
<entry key="solr.search.queryType"/>
<entry key="solr.server.configuration.maxRetries">1</entry>
<entry key="solr.addUrl">http://localhost:8983/solr/techproducts</entry>
<entry key="solr.load.updatespersecond">1</entry>
<entry key="solr.server.configuration.defaultMaxConnectionsPerHost">100000</entry>
<entry key="solr.queryLogStatistic.maxStored">1000</entry>
<entry key="solr.query.facetMethod">fc</entry>
<entry key="solr.server.configuration.connectionTimeout">60000</entry>
</properties>
{{< / highlight >}}

As you can see you have various option to configure and all of them are really self-explanatory. If  **you are interested, in this** [**github issue**](https://github.com/tflobbe/solrmeter/issues/94) **lots of the option are explained.** The most important options are the address of core and the path of files that contains queries. Now you only need to run solrmeter in headless mode with the following command line (note the solrmeter.runMode=headless):

{{< highlight bash "linenos=table,linenostart=1" >}}


java -Dsolrmeter.runMode=headless -Dsolrmeter.configurationFile=solrmeter.smc.xml -jar solrmeter-0.3.1-SNAPSHOT-jar-with-dependencies.jar

{{< / highlight >}}

Then wait for the test to finish and you will find all the output in the folder you specify with the headless.outputDirectory settings. Now you only need to grab the result, put in an excel spreadsheet and do whatever you want with the data.

Thanks to the headless mode, you can run SolrMeter even in scenario where you have not an Ui, and most important you can automate the test with a script, because you have not the need to interact with a UI.

Gian Maria.
