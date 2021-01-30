---
title: "Loading data from Sql Server to Solr with a Data Import Handler"
description: ""
date: 2013-04-29T15:00:37+02:00
draft: false
tags: [Solr]
categories: [Solr]
---
[Apache Solr](http://lucene.apache.org/solr/) is an exceptional engine for Enterprise Search based on Lucene and usually the first question I got is:  **how can I integrate Solr with an existing Sql Server data storage to power up searches**.

Solr is used not as a primary data store because it is a Search Platform whose primary purpose is giving the ability to do complex searches with blazing performance. This means that you usually have your data in a primary data store, Es. Sql Server and you need to move data to a Solr server to power up your searches.

Quite often you do not need real-time update, you can simply update your solr server nightly, or at given interval (update each X hours). In this scenario  **there is not the need to setup a mechanism that immediately replicate modification of Primary data store to Solr and you can rely on DIH:** [**Data Import Handler**](http://wiki.apache.org/solr/DataImportHandler). Suppose you have your data inside a Sql Server inside a table called tag; the first operation you need to do is locating all jar libraries that are needed to use DIH with Solr.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image14.png)

 ***Figure 1***: *Copy all needed library inside the lib folder of core home directory*

I use Solr with multi core configuration, my solr test instance is installed in c:\solr\TestInstance and inside that root directory I have multiple cores used to run different schema and configurations. Inside each core  **you should create a lib directory to store all jar files are needed for that specific core**. To run DIH you need to copy *apache-solr-dataimporthandler* and *apache-solr-dataimporthandler-extras* taken from solr main distribution (zipped file you download from Apache Solar site). I’ve added also sqljdbc4.jar that contains classes needed to connect to a SqlServer database from java jdbc.

First step is creating the Data Import configuration file, to specify how you want to import data inside your Solr.

{{< highlight xml "linenos=table,linenostart=1" >}}


dataConfig>  <dataSource type="JdbcDataSource" 		driver="com.microsoft.sqlserver.jdbc.SQLServerDriver" 		url="jdbc:sqlserver://10.0.0.102;databaseName=Dictionary;" 		user="sa" 		password="xxxxxxxx" 		batchSize="5" /> 
    <document name="TestDocument">  
        <entity name="TestEntity" query="SELECT * FROM tag">  		<field column="Id" name="id" />
            <field column="Term" name="term" />  
            <field column="Name" name="name" />  
        </entity>  
    </document>  
</dataConfig> 

{{< / highlight >}}

I usually call this file data-import.xml but you can use whatever name you want.  **DataSource node is used to specifies class of the driver to use, connection string with username and password** and other option, Es batchSize to specify how many row at a time should be fetched from the data store. Once you have defined a DataSource you should at least specify one Document containing one entity, where each entity is composed at least by a query and a series of fields. The query is the simple SQL code that will be issued to the Data Store and  **fields are used to specify mapping from column of the query and field in schema.xml of that core**.

This is the minimal configuration that is used to load data from Sql Server to Solr, after you created this file you need to specify the handler inside the solrconfig.xml file.

{{< highlight xml "linenos=table,linenostart=1" >}}


<requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler">     
<lst name="defaults">    	<str name="config">data.import.xml</str>  </lst>    
</requestHandler>  

{{< / highlight >}}

Now everything is in place, you can go to the Dataimport section of the core you configured and you can execute the import handler.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image15.png)

 ***Figure 2***: *Import data with standard solr web interface.*

You can now check that after the import solr contains data you expect.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image16.png)

 ***Figure 3***: *Simple \*:\* query to verify that data was really imported from the DIH*

Thanks to few xml lines of code you are able to import data from Sql Server to Solr without the need to write a single line of code.

Gian Maria.
