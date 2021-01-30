---
title: "Installing SonarQUBE on windows and SQL Server"
description: ""
date: 2015-10-30T17:00:37+02:00
draft: false
tags: [Agile]
categories: [Agile]
---
Installing SonarQube on windows machine with Sql Server express as back end is quite simple, but here is some information you should know to avoid some common problem with database layer (or at least avoid problem I had :) )

> Setting up Sonar Qube in Windows is easy, but sometimes you can encounter some problem to have it talk to Sql Server database.

First of all I avoid using integrated authentication in SQL Server, because I find easier to setup everything with a standard sql user. After all my instance of SQL Express is used only for the instance of Sonar. So I **create a user called sonar with a password, and remove the check for password expiration**.

[![](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb20.png "Avoid password expiration")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image20.png)

 ***Figure 1***: *Avoid password expiration*

Then you should open Sql Server Configuration Manager, and you  **must enable the TCP Procol**.

[![](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb21.png "Enable TCP/IP protocol in Sql Server Configuration Manager")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image21.png)

 ***Figure 2***: *Enable TCP/IP protocol in Sql Server Configuration Manager*

Now I found that Java drivers are a little bit grumpy on connecting with my database, so I decided to  **explicitly disable dynamic port and specify the 1433 port directly**. Just double click the TCP/IP protocol shown in  **Figure 2** to open properties for TCP/IP protocol.

[![](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb22.png "Disable dynamic ports and specify 1433 as TCP Port")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image22.png)

 ***Figure 3***: *Disable dynamic ports and specify 1433 as TCP Port*

Now create a new database called Sonar, and set user sonar as owner of the database. Place specific attention to case of Database Name. I choose Sonar with capital S.

[![](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb23.png "Create a new database called Sonar with sonar user as owner")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image23.png)

 ***Figure 4***: *Create a new database called Sonar with sonar user as owner*

Now be sure to select the correct Collation, remember that  **you should use a collation that is Case Sensitive and Accent Sensitive, like SQL\_Latin1\_General\_CP1\_CS\_AS**.

[![](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb24.png "Specify the right Collation for the database. It should be CS and AS")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image24.png)

 ***Figure 5***: *Specify the right Collation for the database. It should be CS and AS*

Now, just to be sure that everything is ok, **try to connect from Management Studio using the port 1433 and with user *sonar* **. To specify port you should use a comma between server name and the port.

[![](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb25.png "Try to connect to the server with user sonar and port 1433")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image25.png)** Figure 6: ***Try to connect to the server with user sonar and port 1433*

Verify that you can see Sonar database. If you are able to connect and see Sonar Db you have everything ready. Remember to download JDBC driver for MsSql at [this address](http://sourceforge.net/projects/jtds/), once downloaded  **be sure to right click the zip file and in properties section unblock the file.** Then unzip the content and copy the file  **jtds-1.3.1.jar** into subfolder extensions\jdbc-driver\mssql of your Sonar Installation (the mssql folder usually does not exists and you should manually create it).

Now you should edit conf/sonar.properties file and add connection string to the database.

{{< highlight bash "linenos=table,linenostart=1" >}}


sonar.jdbc.username=sonar
sonar.jdbc.password=xxxxxxxxxx
sonar.jdbc.url=jdbc:jtds:sqlserver://localhost/Sonar;SelectMethod=Cursor;instance=sqlexpress

{{< / highlight >}}

 **Place specific attention to database name in connection string because it is CASE SENSITIVE** , as you can see I specified sqlserver://localhost/Sonar with capital S exactly as database name. Since you are using Accent Sensitive and Case Sensitive collation is  **super important that the name of the database is equal in casing to the name used in connection string.** If you specify wrong casing, you are not able to start Sonar and you will find this error in the sonar log.

> The error: The database name component of the object qualifier must be the name of the current database. Happens if you use wrong casing in Db Name in connection string

You should be able now to start Sonar without any problem.

Gian Maria
