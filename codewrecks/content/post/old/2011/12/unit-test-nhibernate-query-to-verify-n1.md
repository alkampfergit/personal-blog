﻿---
title: "Unit test NHibernate query to verify N1"
description: ""
date: 2011-12-30T15:00:37+02:00
draft: false
tags: [Nhibernate,Nunit,Testing]
categories: [Nhibernate]
---
When you work with ORM like nhibernate, having a tool like [nhprof](http://nhprof.com/) is the key of success. But even with NHProfiler you could not prevent people of doing wrong stuff because they do not use it :). I have a simple scenario, a developer changed a method on the server lazily fetching a property of a large resultset. The effect is that the service call, that usually responded in milliseconds starts to respond in 10 seconds.

The reason is really simple, the function loaded about 200 entities from the database and if you are sure you want to access for all 200 entities a property, you should do eager fetching because issuing ~200 queries to the database is not usually a good idea. Then after some time the function started to do timeout, so I inspected again the code and did not find anything strange, but NHprof reveals me that the query was actually fetching another related entity, from a table with millions of row causing timeout. This is due to a modification to a mapping, someone disabled proxy for that class, so NH decided to do a join with the table with millions of row, slowing the method again.

After the problem was fixed, I created some helpers that permits me to write a test that will alert me immediately in the future if such a problem is comeback again.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void verify_xxxx()
{
var sut = new cccccService();
sut.DoSomething(1);
this.NhibernateQueryCount().Should().Be.EqualTo(1);
String query = this.NhibernateGetQueries().First();
query.Should().Not.Contain("relatedlin1_.Id");
}
{{< / highlight >}}

This test is not really a UnitTest, it is more an integration one, but it is able to verify that calling a function on a service class only one query is issued to the database and the query should not eager fetch data from the other table (relatedlin…). This is much more an integration test than a unit test, but it is quite interesting because it permits me to write assertion on number and text of SQL generated by NHibernate, a feature that is really interesting especially if you know that production database is quite big. To achieve this is really simple.

I wrote this simple [test helper](http://www.codewrecks.com/blog/index.php/2010/12/29/test-helper-for-a-single-method/) based on my infrastructure.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class InterceptNhQueriesHelper : ITestHelper
{
public const string nhQueries = "DFCDE96A-ADF7-4C46-A55B-219381364B7F";
private Dictionary<String, Level> _oldLevel = new Dictionary<string, Level>();
#region ITestHelper Members
public void FixtureSetUp(BaseTestFixture fixture)
{
ILogger loggerToForceInitializationOfLoggingSystem = IoC.Resolve<ILogger>();
var repository = LogManager.GetAllRepositories();
Log4NetLogEventSourceAppender interceptorAppender = new Log4NetLogEventSourceAppender();
foreach (var loggerRepository in repository)
{
Hierarchy hierarchy = (Hierarchy)loggerRepository;
if (hierarchy.GetAppenders()
.Count(appender => appender.GetType() == typeof(Log4NetLogEventSourceAppender)) == 0)
{
hierarchy.Root.AddAppender(interceptorAppender);
hierarchy.RaiseConfigurationChanged(EventArgs.Empty);
}
_oldLevel[hierarchy.Name] = hierarchy.Root.Level;
hierarchy.Root.Level = Level.Debug;
var loggers = loggerRepository.GetCurrentLoggers();
foreach (var logger in loggers)
{
Logger realLogger = logger as Logger;
if (realLogger.Name.IndexOf("NHIBERNATE", StringComparison.InvariantCultureIgnoreCase) >= 0)
{
_oldLevel[realLogger.Name] = realLogger.Level;
realLogger.Level = Level.Debug;
if (!realLogger.Appenders.OfType<IAppender>().Any(appender => appender.GetType() == typeof(Log4NetLogEventSourceAppender)))
{
//non ho appender intercettori
realLogger.AddAppender(interceptorAppender);
}
}
}
hierarchy.RaiseConfigurationChanged(EventArgs.Empty);
}
Log4NetLogEventSourceAppender.OnLog += Log4NetLogEventSourceAppender_OnLog;
loggerToForceInitializationOfLoggingSystem.Debug("TESTLOG DEBUG");
loggerToForceInitializationOfLoggingSystem.Info("TESTLOG Info");
loggerToForceInitializationOfLoggingSystem.Error("TESTLOG Error");
}
private BaseTestFixture currentFixture;
private List<String> SqlInstructions = new List<string>();
void Log4NetLogEventSourceAppender_OnLog(object sender, OnLog4NetLogEventArgs e)
{
if (e.LoggingEvent.LoggerName.Equals("nhibernate.sql", StringComparison.OrdinalIgnoreCase))
{
SqlInstructions.Add(e.LoggingEvent.MessageObject as string);
}
}
public void SetUp(BaseTestFixture fixture)
{
currentFixture = fixture;
fixture.SetIntoTestContext(nhQueries, SqlInstructions);
SqlInstructions.Clear();
}
public void TearDown(BaseTestFixture fixture)
{
currentFixture = null;
}
public void FixtureTearDown(BaseTestFixture fixture)
{
var repository = LogManager.GetAllRepositories();
foreach (var loggerRepository in repository)
{
Hierarchy hierarchy = (Hierarchy)loggerRepository;
hierarchy.Root.Level = _oldLevel[hierarchy.Name];
var loggers = loggerRepository.GetCurrentLoggers();
foreach (var logger in loggers)
{
Logger realLogger = logger as Logger;
if (realLogger.Name.IndexOf("NHIBERNATE", StringComparison.InvariantCultureIgnoreCase) >= 0 &&
_oldLevel.ContainsKey(realLogger.Name))
{
realLogger.Level = _oldLevel[realLogger.Name];
}
}
hierarchy.RaiseConfigurationChanged(EventArgs.Empty);
}
}
public int Priority
{
get { return 1; }
}
#endregion
}
{{< / highlight >}}

this helpers seems complex, but basically it simply add during FixtureSetup an appender to log4net, this appender basically raises an event whenever it receives a log.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class Log4NetLogEventSourceAppender : AppenderSkeleton
{
private Object _syncRoot;
 
public Log4NetLogEventSourceAppender()
{
_syncRoot = new object();
}
 
/// <summary>
/// Occurs when [on log].
/// </summary>
public static event EventHandler<OnLog4NetLogEventArgs> OnLog;
 
protected override void Append(LoggingEvent loggingEvent)
{
EventHandler<OnLog4NetLogEventArgs> temp = OnLog;
if (temp != null)
{
lock (_syncRoot)
{
temp(null, new OnLog4NetLogEventArgs(loggingEvent));
}
}
}
 
}
 
public class OnLog4NetLogEventArgs : EventArgs
{
public LoggingEvent LoggingEvent { get; private set; }
 
public OnLog4NetLogEventArgs(LoggingEvent loggingEvent)
{
LoggingEvent = loggingEvent;
}
}
{{< / highlight >}}

This appender permits the helper to intercept all logs and since Nhibernate raise a log with name nhibernate.sql with the SQL Code whenever it raises a query to the database, the helper can filter for those kind of messages and store each query inside a standard String collection.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static class InterceptNhQueriesHelperMethods
{
public static Int32 NhibernateQueryCount(this BaseTestFixtureWithHelper fixture)
{
return fixture.GetFromTestContext<List<String>>(InterceptNhQueriesHelper.nhQueries).Count;
}
 
public static List<String> NhibernateGetQueries(this BaseTestFixtureWithHelper fixture)
{
return fixture.GetFromTestContext<List<String>>(InterceptNhQueriesHelper.nhQueries);
}
}
{{< / highlight >}}

Now I can simply decorate my Test Fixture with a  specific attribute and let the magic happens.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[InterceptNhQueries]
public class XxxFixture : Test.Utilities.BaseTestFixtureWithHelper
{{< / highlight >}}

Inside a test I can use NhibernateQueryCount() to know the number of the queries issued by NH during the test and NhibernateGetQueries() to grab the whole list and assert on how NH interacted with the database during a test.

Gian Maria.