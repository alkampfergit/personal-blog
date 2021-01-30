---
title: "A good log can really helps you to write better application"
description: ""
date: 2008-09-25T05:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Actually Iâ€™m working on a project that have a windows service that does a lot of calculation, invokes external servers, and stuff like these. Since we have no user interface, how can you know when error occurred and how can you be informed on the detail of the error? The solution is to create a good infrastructure of logging.

Thanks to [Log4Net](http://logging.apache.org/log4net/index.html) writing such a layer is incredible simple. I build a static class called GeneralLogger, then create a series of method to log information such as AnalyzerError, AnalyzerVerbose, WebError, WebVerbose etc etc. Other programmers find very easy to use this logging infrastructure, they simply call the appropriate function and the game is done. If you have to log some information from the service you call AnalyzerXXX if you want to log from the asp.net front end application you call WebXXX

My first config file used file listener, and I create a specific configuration to send each type of log to a different file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<appender name="AnalyzerVerboseAppender" type="log4net.Appender.FileAppender">
    <param name="File" value="Analyzer.Verbose.log" />
    <param name="AppendToFile" value="true" />
    <layout type="log4net.Layout.PatternLayout" >
        <conversionPattern value="%date [%thread] %-5level %logger %ndc - %message%newline" />
    </layout>
    <filter type="log4net.Filter.LevelRangeFilter">
        <levelMin value="DEBUG" />
        <levelMax value="DEBUG" />
    </filter>
</appender>

<appender name="AnalyzerInfoAppender" type="log4net.Appender.FileAppender">
    <param name="File" value="Analyzer.Info.log" />
    <param name="AppendToFile" value="true" />
    <layout type="log4net.Layout.PatternLayout" >
        <conversionPattern value="%date [%thread] %-5level %logger %ndc - %message%newline" />
    </layout>
    <filter type="log4net.Filter.LevelRangeFilter">
        <levelMin value="INFO" />
        <levelMax value="INFO" />
    </filter>
</appender>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And so on, I create for each combination of logger and level a different file, this makes my life easier, I constantly check the xxx.error.log and sometimes I look also info and warning to understand what is wrong.

After some days I realized that using file for logging is a bad thing, first, the files are on the server, so I need to downlad them locally to handle them, moreover it is impossible to answer at question like.

*How many times this error happens? Find all the error that contains a string in the message, and so on.*

Sooner or later you realize that the only way to use logging effectively is to store them in a table of a database, so you can have full sql query capabilities to filter, aggregate and consult all logs. Thanks again to log4Net, the solution is really simple.

{{< highlight xml "linenos=table,linenostart=1" >}}
<!--Database appender-->
<appender name="AdoNetAppender_SqlServer" type="log4net.Appender.AdoNetAppender">
    <connectionType value="System.Data.SqlClient.SqlConnection, System.Data, Version=2.0.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089" />
    <connectionString value="data source=10.8.0.1\sql2005;initial catalog=RepManagementDev;integrated security=false;User ID=sa;Password=ottagono" />
    <commandText value="INSERT INTO Log.Log4Net ([Date],[Level],[Logger],[Message], [exception]) VALUES (@log_date, @log_level, @logger, @message, @ex)" />
    <parameter>
        <parameterName value="@log_date" />
        <dbType value="DateTime" />
        <layout type="log4net.Layout.PatternLayout" value="%date{yyyy'-'MM'-'dd HH':'mm':'ss'.'fff}" />
    </parameter>
    <parameter>
        <parameterName value="@log_level" />
        <dbType value="String" />
        <size value="50" />
        <layout type="log4net.Layout.PatternLayout" value="%level" />
    </parameter>
    <parameter>
        <parameterName value="@logger" />
        <dbType value="String" />
        <size value="255" />
        <layout type="log4net.Layout.PatternLayout" value="%logger" />
    </parameter>
    <parameter>
        <parameterName value="@message" />
        <dbType value="String" />
        <size value="4000" />
        <layout type="log4net.Layout.PatternLayout" value="%message" />
    </parameter>
    <parameter>
        <parameterName value="@ex" />
        <dbType value="String" />
        <size value="20000" />
        <layout type="log4net.Layout.ExceptionLayout" />
    </parameter>
</appender>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The real power of this configuration is that you can specify whatever query you like, and you can add how many parameters you want to that query. This configuration permits you to choose exactly what you want in the log table.

Having log on database gives me these advantages

1) I can query log table with full SQL syntax

2) I can query the log table from remote server, retrieving only the data I need instead of downloading the whole file.

3) I can show the log easily on a backoffice page in the web Front End.

4) I can create daily scheduling to email when log of ERROR category are written to disk.

Alk.

Tags: [Log4Net](http://technorati.com/tag/Log4Net) [.Net Framework](http://technorati.com/tag/.Net%20Framework)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/09/25/a-good-log-can-really-helps-you-to-write-better-application/';</script><script type="text/javascript">var dzone_title = 'A good log can really helps you to write better application';</script><script type="text/javascript">var dzone_blurb = 'A good log can really helps you to write better application';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/09/25/a-good-log-can-really-helps-you-to-write-better-application/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/09/25/a-good-log-can-really-helps-you-to-write-better-application/)
