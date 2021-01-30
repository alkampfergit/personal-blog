---
title: "About ParameterMarkerFormat"
description: ""
date: 2007-09-05T23:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
Some time ago I wrote a [post about a generic data access](http://www.nablasoft.com/Alkampfer/?p=62) helper based on an article of [Ayende](http://www.ayende.com). In that article I did a mistake in the use of ParameterMarkerFormat and I think that is time to correct it. In that article I showed a little routine to get the parameter name based on type of provider, but I used in wrong part of the code. This is the correct function AddPArameterToCommand

publicstaticvoid  AddParameterToCommand(  
DbCommand  command,  
DbProviderFactory  factory,  
  System.Data.DbType  type,  
String  name,  
object  value)  {  
  
DbParameter  param  =  factory.CreateParameter();  
  param.DbType  =  type;  
  param.ParameterName  =  name;  
  param.Value  =  value;  
  command.Parameters.Add(param);  
}

As you can see this is only a wrapper to create and configure the command with a DbProviderFactory, in the old code the name of the parameter is created with the GetParameterName, this was not correct since the name of the parameter is the same for all provider. What changes is the query itself, while in sql server I create a query like “SELECT COUNT(\*) FROM Customers WHERE City =  @city” in oracle the same query whould be “SELECT COUNT(\*) FROM Customers WHERE City =  :city”. The name of the parameter object is *city* in both case, but the name of the parameter in query text is different. The ParameterMarkerFormat should serve this purpose, it should be @{0} for sql server and :{0} for oracle so you can build your query dynamically and use the correct name of the parameter for each provider. The problem is that sql server returns {0} for ParameterMarkerFormat and obviously this does not work. I want this test to pass:

[Test]  
publicvoid  TestDbHelper()  {  
Int32  CustomerCount  =  Nablasoft.Helpers.DataAccess.ExecuteScalar&lt;Int32&gt;(  
delegate(DbCommand  command,  DbProviderFactory  factory)  {  
              command.CommandType  =  System.Data.CommandType.Text;  
              command.CommandText  =  “SELECT  COUNT(\*)  FROM  Customers  WHERE  City  =  “  +  
DataAccess.GetParameterName(command,  “city”);  
              Nablasoft.Helpers.DataAccess.AddParameterToCommand(  
                    command,  factory,  System.Data.DbType.String,  “city”,  “London”);  
        });  
Assert.AreEqual(6,  CustomerCount);  
}

This test is run against a northwind database, as you can see the query text is build dynamically thanks to the DataAccess.GetParameterName() helper function. In a real production code all queries should be created in advance, to avoid concatenating strings each time a query is to be run. For this code to work you need to find the right format of the parameter name from the command, here is the code.

privatestaticString  GetParameterFormat(DbCommand  command)  {  
  
if  (!mParametersFormat.ContainsKey(command.GetType()))  {  
        mParametersFormat.Add(  
              command.GetType(),  
              command.Connection.GetSchema(“DataSourceInformation”)  
                   .Rows[0][“ParameterMarkerFormat”].ToString());  
  }  
return  mParametersFormat[command.GetType()];  
}

As you can see I use a simple dictionary called mParametersFormat that cache the formats to avoid calling the slow function Connection.GetSchema, this is not enough for this code to work, because sql server returns me the wrong {0} format, the obvious solution is create a static constructor that preload my cache,

static  DataAccess()  {  
  mParametersFormat  =  newDictionary&lt;Type,  String&gt;();  
  mParametersFormat.Add(typeof(SqlCommand),  “@{0}”);  
}

This makes the above test to work, fixing the bug of sql server. I searched a lot in the internet for this issue but seems that ParameterMarkerFormat is a strange beast not used by many people, as you can see it is more simplier adding all your needed format in static constructor without use the PArameterMarkerFormat at all.

Alk.
