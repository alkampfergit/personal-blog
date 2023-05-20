---
title: "Really strange error in production server a tale of named pipes"
description: ""
date: 2008-08-27T06:00:37+02:00
draft: false
tags: []
categories: [General]
---
I have a production server with an asp.net application, it run for months without errors. 10 days ago the elmah page begins to shows an error that occurred in a lot of pages.

The application uses a standard ado.net Data access Layer, but a module uses nhibernate, and it turns out that all the errors happened when a page use some function in this module. I tried to access some pages in the site that uses nhibernate, and every page raises an error of type.

{{< highlight csharp "linenos=table,linenostart=1" >}}
System.Web.HttpUnhandledException: Exception of type 'System.Web.HttpUnhandledException' was thrown. ---> NHibernate.ADOException: cannot open connection ---> System.Data.SqlClient.SqlException: An error has occurred while establishing a connection to the server.  When connecting to SQL Server 2005, this failure may be caused by the fact that under the default settings SQL Server does not allow remote connections. (provider: Named Pipes Provider, error: 40 - Could not open a connection to SQL Server)
   at System.Data.SqlClient.SqlInternalConnection.OnError(SqlException exception, Boolean breakConnection)
   at System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj)
   at System.Data.SqlClient.TdsParser.Connect(ServerInfo serverInfo, SqlInternalConnectionTds connHandler, Boolean ignoreSniOpenTimeout, Int64 timerExpire, Boolean encrypt, Boolean trustServerCert, Boolean integratedSecurity, SqlConnection owningObject)
   at System.Data.SqlClient.SqlInternalConnectionTds.AttemptOneLogin(ServerInfo serverInfo, String newPassword, Boolean ignoreSniOpenTimeout, Int64 timerExpire, SqlConnection owningObject)
   at System.Data.SqlClient.SqlInternalConnectionTds.LoginNoFailover(String host, String newPassword, Boolean redirectedUserInstance, SqlConnection owningObject, SqlConnectionString connectionOptions, Int64 timerStart)
   at System.Data.SqlClient.SqlInternalConnectionTds.OpenLoginEnlist(SqlConnection owningObject, SqlConnectionString connectionOptions, String newPassword, Boolean redirectedUserInstance)
   at System.Data.SqlClient.SqlInternalConnectionTds..ctor(DbConnectionPoolIdentity identity, SqlConnectionString connectionOptions, Object providerInfo, String newPassword, SqlConnection owningObject, Boolean redirectedUserInstance)
   at System.Data.SqlClient.SqlConnectionFactory.CreateConnection(DbConnectionOptions options, Object poolGroupProviderInfo, DbConnectionPool pool, DbConnection owningConnection)
   at System.Data.ProviderBase.DbConnectionFactory.CreatePooledConnection(DbConnection owningConnection, DbConnectionPool pool, DbConnectionOptions options)
   at System.Data.ProviderBase.DbConnectionPool.CreateObject(DbConnection owningObject)
   at System.Data.ProviderBase.DbConnectionPool.UserCreateRequest(DbConnection owningObject)
   at System.Data.ProviderBase.DbConnectionPool.GetConnection(DbConnection owningObject)
   at System.Data.ProviderBase.DbConnectionFactory.GetConnection(DbConnection owningConnection)
   at System.Data.ProviderBase.DbConnectionClosed.OpenConnection(DbConnection outerConnection, DbConnectionFactory connectionFactory)
   at System.Data.SqlClient.SqlConnection.Open()
   at NHibernate.Connection.DriverConnectionProvider.GetConnection(){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The astonishing thing is that all parts that use standard ado.net goes well, only nhibernate suffers from this error. After an inspection on web.config I see that the only difference is that ado.net dal uses this connection string.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Database=databasename;Server=localhost\instancename;Integrated Security=SSPI{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

while nhibernate uses this connection string

{{< highlight csharp "linenos=table,linenostart=1" >}}
Database=databasename;Server=127.0.0.1\instancename;Integrated Security=SSPI{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Clearly I think that using localhost or 127.0.0.1 does not make any difference, but when I changed to localhost, the error disappeared and the application works perfectly….when I revert to 127.0.0.1 the exception comes back again, so it is the cause…but why??

After a little search I stuble [upon this post](http://weblogs.asp.net/jgalloway/archive/2005/12/02/432062.aspx), that explains that (local) is not the same as localhost, the first uses named pipes and the latter use tcp. Since my exception message told me that the error is in the named pipe, it turns out that using 127.0.0.1 probably uses named pipes instead of tcp.

Now the error seems gone away, but I wonder

1) why the software ran fine for almost one year without problems (maybe some windows update?)

2) why using 127.0.0.1 should be different from using localhost in the connection string. (It violates the principle of least surprise)

3) why if I reboot the server the named pipe starts to work again….but almost after some days it begin not to work anymore until I reboot the machine (I try this on a preproduction site used to test the server).

alk.

