---
title: "Entity Framework 50 first steps and impressions"
description: ""
date: 2012-09-25T08:00:37+02:00
draft: false
tags: [EF5,Entity Framework]
categories: [Entity Framework]
---
I’m mostly a NHibernate user, but EF code first approach is intriguing, especially  **in situation where the customer prefer to use only Microsoft Stack libraries** , thus EF 5.0 is a good approach to write quickly an Efficient data access module in really few clicks.  **Enabling EF5 on your own project is as simple as adding a reference with Nuget, go to package manager and type** *<font size="3">install-package EntityFramework</font>*

and the game is done. Now you can start writing a simple class that will represent a table in the database.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class Customer
{
    public Int32 Id { get; set; }

    public String Name { get; set; }

    public String Address { get; set; }
}

{{< / highlight >}}

Now you need a  **class that inherits from DbContext to access the database and to expose all the classes** you want to be saved/loaded from your database.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class SampleContext : DbContext
{
    public DbSet<Customer> Customers { get; set; }
}

{{< / highlight >}}

Now you should add a connection string to Sql server database you want to use, this is really simple because **by convention the context you created looks for a connection string in configuration file named exactly as the class** name, in this example SampleContext

{{< highlight xml "linenos=table,linenostart=1" >}}


  <connectionStrings>
    <add name="SampleContext" 
         connectionString="Database=Samples;Server=(local);Integrated Security=SSPI" 
         providerName="System.Data.SqlClient" />
  </connectionStrings>

{{< / highlight >}}

Actually I’ve no database called Samples in my local server so I wanted to create one with the correct structure to save my simple Customer class, but  **I can create automatically a database with the right schema to contain my data thanks to EF database-migrations**. To enable migrations you should simple type Enable-Migrations on package manager console

*<font size="2">PM&gt; Enable-Migrations </font>*

Checking if the context targets an existing database…

*<font size="2"></font>*

Code First Migrations enabled for project FirstSteps.

Now you should have another folder called Migrations with a Configuration.cs files in your project, you can  **edit this file changing the value of AutomaticMigrationEnabled from false to true to enable automatic migrations**. Now you can issue Update-Database command in your package manager console.

*<font size="2">PM&gt; update-database </font>*

Specify the ‘-Verbose’ flag to view the SQL statements being applied to the target database.

*<font size="2"></font>*

No pending code-based migrations.

Applying automatic migration: 201209150928099\_AutomaticMigration.

Running Seed method.

Et voilà you have your database generated and ready to use. As you can see from Figure 1, the convention used is to create a table with the very same name of the DbSet properties exposed by your data context and a column for each property of the class.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/09/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/09/image6.png)

 ***Figure 1***: *Newly generated database with database-migration of EF5*

Everything is created by convention over configuration, as an example  **if you have a property called Id, corresponding table column will be the primary key for the table** , and if the value is an integer automatically the column is generated with Identity Set to true.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/09/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/09/image7.png)

 ***Figure 2***: *Id column was generated with Identity specification equal to true*

Now you can access database simply creating an instance of SampleContext (do not forget to dispose it when you finished using it) and thanks to LINQ provider you can issue query on it, because  **all DbSet properties you expose are IQueryable** so you can use to simply access all Customers with a simple Foreach.

{{< highlight csharp "linenos=table,linenostart=1" >}}


 using (var context = new SampleContext())
 {
      Console.WriteLine("LISTING CUSTOMERS");
      foreach (var customer in context.Customers)
      {
           Console.WriteLine("Id: {0}\t{1} ({2})", customer.Id, customer.Name, customer.Address);
       }
}

{{< / highlight >}}

With  **really few lines of code you have created entity classes, corresponding database and can write/load data on it**.

Alk.
