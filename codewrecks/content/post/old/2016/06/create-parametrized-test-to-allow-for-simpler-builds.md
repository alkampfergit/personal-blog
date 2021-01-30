---
title: "Create Parametrized test to allow for simpler Builds"
description: ""
date: 2016-06-25T08:00:37+02:00
draft: false
tags: [build,Testing]
categories: [Testing]
---
When it is time of running unit test in a TFS or TeamCity Build, often you face the problem to  **run tests with options different from those one used in Developer Machine**. As an example we have tons of tests that requires a MongoDb and and ElasticSearch or Solr integration.

While it is quite normal for developers to have everything installed in local dev box,  **it could be annoying to provide MongoDb and ElasticSearch installed on all agent machines.** This approach complicates the setup of a build servers and create a situation that is less manageable.

While there is the ability to create a dedicated pool composed only by agent that have MongoDb and ElasticSearch installed, I prefer being able to run my test in all test agents, without any restriction.

The best solution is having parametrized tests, so you can execute tests with differnet parameters during the build, as an example you should parametrize connection strings.

> Having parametrized tests greatly improve the ability to run test during build without creating complex requirement for agents.

In.NET environment it is quite common to use app.settings file to contain all connection strings, here it is an example taken from one of our project.

All Tests use  **ConfigurationManager object to access connectionstring from configuration file** , and there is a single point where we specified all connection strings used by tests.

> The obvious problem of storing setting in app.config is that this file is source controlled, and it is not possible to have different settings for different machine / developers.

 **A possible solution to this approach is using a powershell script that modifies all the configuration files in bin directories before running the test**. Here is a naive approach with PowerShell.

{{< highlight powershell "linenos=table,linenostart=1" >}}


param(
    [string] $baseMongoConnection = "mongodb://admin:xxxxxx##localhost/{0}",
    [string] $connectionQueryString = "?authSource=admin",
    [string] $configuration = "debug"
)

##Logging tests
$configFileName = "..\Logging\Jarvis.Framework.LoggingTests\bin\$configuration\Jarvis.Framework.LoggingTests.dll.config"
Write-Output "Config File Name Is: $configFileName"

$xml = (Get-Content $configFileName)
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='testDb']/@connectionString" -value "$baseMongoConnection$connectionQueryString"

$xml.save($configFileName)

##main tests
$configFileName = "..\Jarvis.Framework.Tests\bin\$configuration\Jarvis.Framework.Tests.dll.config"
Write-Output "Config File Name Is: $configFileName"

$xml = (Get-Content $configFileName)
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='eventstore']/@connectionString" -value ($baseMongoConnection -f "jarvis-framework-es-test" + $connectionQueryString)
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='saga']/@connectionString" -value ($baseMongoConnection -f "jarvis-framework-saga-test" + $connectionQueryString)
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='readmodel']/@connectionString" -value ($baseMongoConnection -f "jarvis-framework-readmodel-test" + $connectionQueryString)
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='system']/@connectionString" -value ($baseMongoConnection -f "jarvis-framework-system-test" + $connectionQueryString)
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='engine']/@connectionString" -value ($baseMongoConnection -f "jarvis-framework-engine-test" + $connectionQueryString)
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='rebus']/@connectionString" -value ($baseMongoConnection -f "jarvis-rebus-test" + $connectionQueryString)

$xml.save($configFileName)

function Edit-XmlNodes {
param (
     $doc = $(throw "doc is a required parameter"),
    [string] $xpath = $(throw "xpath is a required parameter"),
    [string] $value = $(throw "value is a required parameter"),
    [bool] $condition = $true
)    
    if ($condition -eq $true) {
        $nodes = $doc.SelectNodes($xpath)
        foreach ($node in $nodes) {
            if ($node -ne $null) {
                if ($node.NodeType -eq "Element") {
                    $node.InnerXml = $value
                }
                else {
                    $node.Value = $value
                }
            }
        }
    }
}


{{< / highlight >}}

Do not shoot the pianist :), this is a quick and dirty script that can edit configuration files, but this is not a good approach.

1) If a developer want to change this setting in its machine, it is really complex to instruct VS to run this script with parameter before running the test  
2) It lead to unnecessary complicated builds, **because you need to run this script before running the test and it introduces another point of failure**.  
3) It is not possibile to have agent dependant settings, I cannot specify that Agent X should run the test against mongo instance Y.

> A better solution is to use Environment Variables to override app.config connection string, and create a Nunit SetupFixture that is executed before the first test.

NUnit has the ability to run a global setup that is run before the very first is run, and it is the perfect place where you can put logic to change configuration of the tests.  **In the following example the init script check some environment variables, then changes the connectionstring.** {{< highlight csharp "linenos=table,linenostart=1" >}}



[SetUpFixture]
public class GlobalSetup
{
    [SetUp]
    public void ShowSomeTrace()
    {
        var overrideTestDb = Environment.GetEnvironmentVariable("TEST_MONGODB");
        if (String.IsNullOrEmpty(overrideTestDb)) return;

        var overrideTestDbQueryString = Environment.GetEnvironmentVariable("TEST_MONGODB_QUERYSTRING");
        var config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
        var connectionStringsSection = (ConnectionStringsSection)config.GetSection("connectionStrings");
        connectionStringsSection.ConnectionStrings["eventstore"].ConnectionString = overrideTestDb.TrimEnd('/') + "/jarvis-framework-es-test" + overrideTestDbQueryString;
        connectionStringsSection.ConnectionStrings["saga"].ConnectionString = overrideTestDb.TrimEnd('/') + "/jarvis-framework-saga-test" + overrideTestDbQueryString;
        connectionStringsSection.ConnectionStrings["readmodel"].ConnectionString = overrideTestDb.TrimEnd('/') + "/jarvis-framework-readmodel-test" + overrideTestDbQueryString;
        connectionStringsSection.ConnectionStrings["system"].ConnectionString = overrideTestDb.TrimEnd('/') + "/jarvis-framework-system-test" + overrideTestDbQueryString;
        connectionStringsSection.ConnectionStrings["engine"].ConnectionString = overrideTestDb.TrimEnd('/') + "/jarvis-framework-engine-test" + overrideTestDbQueryString;
        connectionStringsSection.ConnectionStrings["rebus"].ConnectionString = overrideTestDb.TrimEnd('/') + "/jarvis-rebus-test" + overrideTestDbQueryString;
        config.Save();
        ConfigurationManager.RefreshSection("connectionStrings");
    }
}

{{< / highlight >}}

This approach has numerous advantages:

1) It works even for developers workstations, if you want to use a different connection string just populate corresponding Environment Variable and you are ready to go  
2) You can simply define variables that are valid for all agents on the build definition, or setup environment variables different for each build agent, so each build agent will run tests against different Mongo instances/database.

This means that one of the best approach is parametrizing the tests with defaults that are good for developer machines, then allow override of configuration with Environment Variables to allow easy configuration for Build Agents.

Gian Maria
