---
title: "A pattern to access DB with IDataReader"
description: ""
date: 2007-06-18T04:00:37+02:00
draft: false
tags: [General,Sql Server]
categories: [General,Sql Server]
---
Some days ago I [posted](http://www.nablasoft.com/Alkampfer/?p=62) about an helper class to easy the access to database. I took original code by ayende and do slightly modifications to make database indipendent. A natural extension to that class is the ability to retrieve a datareader with some data. An initial solution is simply call the core *Execute()* function with this code.

Nablasoft.Helpers.DataAccess.Execute(  
delegate(DbCommand  command,  DbProviderFactory  factory)  {  
                          command.CommandType  =  System.Data.CommandType.Text;  
                          command.CommandText  =  “SELECT  CompanyName  FROM  Customers  WHERE  CustomerId  =  @id”;  
                          Nablasoft.Helpers.DataAccess.AddParameterToCommand(  
                                command,  factory,  System.Data.DbType.String,  “id”,  “ANATR”);  
//now  access  the  datareader.  
using(IDataReader  dr  =  command.ExecuteReader())  {  
Assert.IsTrue(dr.Read());  //Check  if  the  datareader  contains  data.  
Assert.AreEqual(“Ana  Trujillo  Emparedados  y  helados”,  (String)dr[“CompanyName”]);  
                          }  
                    });

The code simply creates a delegate that prepares the command, and then retrieves a IDataReader with ExecuteReader(). The code above was easy to read but it has a problem, if the caller forget to dispose the IDataReader object a connection leak will show up. In past experiences I found that dealing with connection leaks, especially in web application can be a nightmare, so I’d like to wrap the creation of DataReader in a way that permits to the caller not worry about disposing any resource he uses. This poses a problem, actually the template pattern work with this sequences of operations

*1) Create the connection and a transaction  
2) Create the command and enlist in the current transaction  
3) Call the delegates passed by the caller, the delegates prepare the command and does something with it  
4) Using clause dispose command, connection and check for exeption to rollback transaction.*

I should modify the pattern of the template, point 3 should be splitted

*3a) call the delegate passed by the caller, this delegate prepare the command  
3b) call ExecuteDataReader() on prepared command  
3c) Call another delegate that access IDataReader object  
3d) Dispose the IDataReader.*

This pattern forced the caller to create two anonymous delegates, one to prepare the command, and the other to access the IDataReader, this makes the code less readable. A better solution is to create an helper function like this

1publicstaticvoid  ExecuteReader(  
    2VoidFunc&lt;DbCommand,  DbProviderFactory,  Func&lt;IDataReader&gt;&gt;  commandPrepareFunction)  {  
    3  
    4                    Execute(delegate(DbCommand  command,  DbProviderFactory  factory)  {  
    5//The  code  to  execute  only  assures  that  the  eventually  created  datareader  would  be  
    6//closed  in  a  finally  block.  
    7IDataReader  dr  =  null;  
    8try  {  
    9                                commandPrepareFunction(command,  factory,  
  10delegate()  {  
  11                                                                              dr  =  command.ExecuteReader();  
  12return  dr;  
  13                                                                        });  
  14                          }  
  15finally  {  
  16if  (dr  !=  null)  dr.Dispose();  
  17                          }  
  18                    });  
  19            }

This function accepts a delegate with three arguments, the first is the command to retrieve data, second parameter is DbFactory class to create parameters for the command and at last we have another delegate function with no parameter that returns a IDataReader. This function creates an anonymous delegate at line 4, the body of the delegate simply call the caller supplied delegate (line 9) and creates another anonymous delegate for the third parameter, the function is called with a try-finally block to ensure that the datareader will be disposed. The trick is that the creation of the IDAtaReader object now is moved to the infrastructure code, so I can dispose it. Let’s look at how the caller can use this helper function to access data.

[Test]  
publicvoid  TestDbHelperDataReader()  {  
              Nablasoft.Helpers.DataAccess.ExecuteReader(  
delegate(DbCommand  command,  DbProviderFactory  factory,  Func&lt;IDataReader&gt;  getDatareader)  {  
//First  prepare  the  command  
                          command.CommandType  =  System.Data.CommandType.Text;  
                          command.CommandText  =  “SELECT  CompanyName  FROM  Customers  WHERE  CustomerId  =  @id”;  
                          Nablasoft.Helpers.DataAccess.AddParameterToCommand(  
                                command,  factory,  System.Data.DbType.String,  “id”,  “ANATR”);  
//now  access  the  datareader.  
IDataReader  dr  =  getDatareader();  
Assert.IsTrue(dr.Read());  //Check  if  the  datareader  contains  data.  
Assert.AreEqual(“Ana  Trujillo  Emparedados  y  helados”,  (String)  dr[“CompanyName”]);  
                    });  
        }

As you can see the code is really simple and straightforward. The caller first prepares the command, and then once the command is ready to be executed it calls the getDatareader() delegate passed as argument to obtain a datareader for accessing data. What I like of this pattern is that the caller do not have the burden to close the IDataReader because this is done in the infrastructure function. Code with a lot of using or try-finally blocks is less readable, and moreover an inexperienced programmer could forget to dispose a datareader. With this pattern the caller should only prepare the DbCommand and access the DataReader, no using, no try catch, no way to make a leak. With this pattern we can also make an helper class to work with DataSets.

publicstaticvoid  ExecuteDataset(  
VoidFunc&lt;DbCommand,  DbProviderFactory,  Func&lt;DataSet&gt;&gt;  commandPrepareFunction)  {  
  
              Execute(delegate(DbCommand  command,  DbProviderFactory  factory)  {  
//The  code  to  execute  only  assures  that  the  eventually  created  datareader  would  be  
//closed  in  a  finally  block.  
using  (DataSet  ds  =  newDataSet())  {  
                          commandPrepareFunction(command,  factory,  
delegate()  {  
using  (DbDataAdapter  da  =  factory.CreateDataAdapter())  {  
                                                                              da.SelectCommand  =  command;  
                                                                              da.Fill(ds);  
                                                                        }  
return  ds;  
                                                                  });  
                    }  
  
              });  
        }

This function is a copy of the previous one, it simply uses the command prepared by the caller to insert as selectCommand for a DataAdapter and fill a dataset. The using  clauses are needed to be sure that everything is diposed correctly. Here is how you can retrieve data

delegate(DbCommand  command,  DbProviderFactory  factory,  Func&lt;DataSet&gt;  getDataSet)  {  
                          command.CommandText  =  “SELECT  \*  FROM  Customers”;  
DataSet  Result  =  getDataSet();  
Assert.AreEqual(1,  Result.Tables.Count);  
Assert.AreNotEqual(0,  Result.Tables[0].Rows.Count);  
                    });

Again the caller has not the burden of dispose anything. If you like this you can access code [here](https://www.codewrecks.com/blog/wp-content/uploads/2007/06/dataaccess.zip).

Alk.
