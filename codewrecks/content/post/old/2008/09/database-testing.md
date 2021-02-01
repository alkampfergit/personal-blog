---
title: "Database Testing"
description: ""
date: 2008-09-30T07:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Tests and Databases are two words that does not fit well together. Usually tests involving database interaction suffers by these smells

1. [Interacting Test](http://xunitpatterns.com/Erratic%20Test.html): since each test can modify data in database it is highly possible that data written by a test can make another test fail. Moreover if more than one developer use the same database to run the test you can face a  **Test Run War** smell, where two or more unrelated tests are run concurrently on the same resources.
2. [Slow test](http://xunitpatterns.com/Slow%20Tests.html): Writing and reading from a database can involve reading and writing on disk, and this can make your test run slower.
3. [High Test Maintenance cost](http://xunitpatterns.com/High%20Test%20Maintenance%20Cost.html): It is not simple to write test for database, moreover tests are susceptible of schema change, and a large amount of tests could fail even after a simple schema change.

Among these, there are other little smells around tests that involve databases, so it is a good starting point trying to understand if we can keep database out of tests. Lets examine the most obvious situations where a database is involved in a test.

- Test of a stored procedure: In this situation the database is unavoidable, since the purpose of the test is verifying some T-SQL or PL-SQL code. In this situation you should keep all the tests inside a specific namespace, and use categorization if supported by the test framework you use, moreover the test can be marked as Explicit (nUnit) and they should not be run except when explicitly requested. This because database tests are slow, and the ability to choose if run them or not is valuable.
- The [Sut](http://xunitpatterns.com/SUT.html) loads and stores data into database. This is a typical situation where database is used for [back-door-manipulation](http://xunitpatterns.com/Back%20Door%20Manipulation.html), since it is used to send input data to the sut and to verify output data. This happens when the software does not have a good separation between various layers. You can avoid database if the Data Access Layer is accessed with a [Separated Interface](http://martinfowler.com/eaaCatalog/separatedInterface.html) pattern. Ex. If the SUT use the Customer table to read/write data, you can create an interface called ICustomerDao that encloses all the functionalities to access the database, then the Sut should interact only with the ICustomerDao object obtained through a factory. If you have control of the factory in your test, you can inject a [mock](http://xunitpatterns.com/Mock%20Object.html) object avoiding the use of a database.
- Settings of the application are stored in database: sometimes some basic settings of the application are stored in database, and these settings are necessary to setup the fixture of the test. This situation is a slightly variation of the preceding one, because settings can be considered as inputs of the Sut. The solution is to abstract settings from the database, I usually use a [Registry](http://martinfowler.com/eaaCatalog/registry.html) pattern, creating a ISettingRegistry interface that can be accessed through a static class. With this trick I create a DatabaseSettingRegistry to be used in production but I can inject mock object when I'm testing the application.
- Test Mapping of NHibernate or other ORM. To verify that the mapping is working as expected (Expecially when you deal with inheritance or complex mappings) you need to use database, but thanks of the ability of NHibernate to work with multiple database, you can use lightweight database engine such as [sqlLite](http://sourceforge.net/projects/sqlite-dotnet2), that have some advantages over a full instance of sql server or oracle.

If you isolate all code related to Data Access in a separate layer, and you communicate with this layer only with interfaces you are able to use mock instead of the real classes, avoiding the database at all in your test. Moreover you should not remember that designing a project in this way does not make only your code more testable, but the overall architecture will be probably cleaner.

alk.

Tags: [Database](http://technorati.com/tag/Database) [Testing](http://technorati.com/tag/Testing)

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/09/30/database-testing/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/09/30/database-testing/)
