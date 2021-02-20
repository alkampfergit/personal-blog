---
title: "An helper class to access databases with ado"
description: ""
date: 2007-06-04T09:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
A while ago I read an [exceptional post by Ayende](http://ayende.com/Blog/archive/2007/05/27/Reflections-on-the-Naked-CLR.aspx), I found it very interesting, and I decided to use his technique with some projects, but I choose to do a little modification to make the code works with every type of database, not only with SqlServer. Here is my version. All  real code is made by ayende, I simply do some changes to make it database agnostic.

publicstaticvoid  Execute(VoidFunc&lt;DbCommand,  DbProviderFactory&gt;  functionToExecute)  {  
DbProviderFactory  factory  =  DbProviderFactories.GetFactory(  
        MainConnectionString.ProviderName);  
using  (DbConnection  connection  =  factory.CreateConnection())  {  
        connection.ConnectionString  =  MainConnectionString.ConnectionString;  
        connection.Open();  
DbTransaction  tx  =  connection.BeginTransaction();  
try  {  
using  (DbCommand  command  =  factory.CreateCommand())  {  
                    command.Connection  =  connection;  
                    command.Transaction  =  tx;  
                    functionToExecute(command,  factory);  
              }  
              tx.Commit();  
        }  
catch  {  
              tx.Rollback();  
throw;  
        }  
finally  {  
              tx.Dispose();  
        }  
  }  
}

The modification from the original ayende’s code is the following: instead to directly create a SqlConnection I use *DbProviderFactories* to create a *DbProviderFactory*, with this object I can create connection and parameter based on the provider name specified in the app config. The connectionstring is taken from a property MainConnectionString that simply use ConfigurationManager to get the connection from the app.config, this property returns a ConnectionStringSettings object that not only stores the effective connection string, but contains also some other properties, such as *ProviderName*, used to specify the provider. The rest of the code is the same of exceptional Ayende’s example. The delegate I use to execute the query accepts both a DbCommand and a DbProviderFactory that must be used to create parameter for the command. I also inserted another helper function that adds a parameter to the command choosing the right name at runtime based on the provider type (this is necessary because for Oracle parameter names are to be prefixed with :, sql server use @, etc...).

privatestaticDictionary&lt;Type,  String&gt;  mParametersFormat  =  newDictionary&lt;Type,  String&gt;();  
  
privatestaticString  GetParameterFormat(DbCommand  command)  {  
if  (!mParametersFormat.ContainsKey(command.GetType()))  {  
        mParametersFormat.Add(  
              command.GetType(),  
              command.Connection.GetSchema(“DataSourceInformation”)  
                   .Rows[0][“ParameterMarkerFormat”].ToString());  
  }  
return  mParametersFormat[command.GetType()];  
}  
  
publicstaticvoid  AddParameterToCommand(  
DbCommand  command,  
DbProviderFactory  factory,  
  System.Data.DbType  type,  
String  name,  
object  value)  {  
  
DbParameter  param  =  factory.CreateParameter();  
  param.DbType  =  type;  
  param.ParameterName  =  String.Format(GetParameterFormat(command),  name);  
  param.Value  =  value;  
  command.Parameters.Add(param);  
}

As you can see I store the format of the parameter in a dictionary indexed by command type. For each different type of commands (SqlCommand, OleDbCommand) I store the ParameterMarkerFormat string that is retrieved with DbConnection.GetSchema() function. This caching could be avoided if we are sure to use the same db in every part of the application (an assumption that is easily true since it is very strange to create an application that stores some data in a sql server and some other data in a different engine, for example Oracle). The *ParameterMarkerFormat* is a sting that can be used with String.Format to create the right parameter name for the current provider, for example with sql server is “{0}”, while for an access database is “?”, because access only supports positional parameters. Here is an example that use the class to find all customers living in London from the NorthWind database.

Int32  CustomerCount  =  Nablasoft.Helpers.DataAccess.Execute&lt;Int32&gt;(  
delegate(DbCommand  command,  DbProviderFactory  factory)  {  
        command.CommandType  =  System.Data.CommandType.Text;  
        command.CommandText  =  “SELECT  COUNT(\*)  FROM  Customers  WHERE  City  =  @city”;  
        Nablasoft.Helpers.DataAccess.AddParameterToCommand(  
              command,  factory,  System.Data.DbType.String,  “city”,  “London”);    
return  (Int32)command.ExecuteScalar();  
  });

*The connection* in the app.config is the following. As you can see the query text use a parameter name prefixed

&lt;connectionStrings&gt;  
  &lt;add  
name=“MainDatabase“  
connectionString=“Database=Northwind;Server=localhost\SQL2000;User  Id=sa;Password=ottaedro\_2006@“  
providerName=“System.Data.SqlClient“/&gt;  
  &lt;/connectionStrings&gt;

Now the helper is database independent. I want to thank Ayende for it’s great example, his code is really amazing.

Alk.
