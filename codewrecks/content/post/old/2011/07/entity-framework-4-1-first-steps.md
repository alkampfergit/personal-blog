---
title: "Entity Framework 41 first steps"
description: ""
date: 2011-07-11T13:00:37+02:00
draft: false
tags: [EF41]
categories: [Entity Framework]
---
I use NHibernate since its first versions and I really love it :), but after Entity Framework 4.1 is out, I started to consider using EF for people that actually does know anything of ORM and still work with dataset or use handwritten SQL CRUD, but could not use open source project or prefer using MS technologies.

I tend not to agree with this path, but sometimes it is easier to tell people, â€œhey, just install this update of Microsoft and you can use EF code first, or if you want a designer you can simple add a new EF Model to the projectâ€. People tend to consider less work using something that is already included in the framework, instead of going toward some external open source library. I must also admit that using EF 4.1 is quite fun (I used in really little projects, but 4.1 version gave me a good impression).

If you want to use EF4.1 in your application you need to do very little steps, suppose you have this class to persist.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/07/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/07/image.png)

You need to reference the Ef4.1 assembly and then create a *Context* to be able to persist this class.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class BattlefieldContext : DbContext
{
public DbSet<Warrior> Warriors { get; set; }
}
{{< / highlight >}}

This is really simple, just create a class named BattlefieldContext, inherit from [DbContext](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28SYSTEM.DATA.ENTITY.DBCONTEXT%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true), then insert a public property of type [DbSet](http://msdn.microsoft.com/en-us/library/gg696460%28v=VS.103%29.aspx)&lt;YourEntityThatYouWantToPersist&gt;.

Now go to app.config (or web.config) and create the connectionstring to the database with the same name of the context class (thus it is named BattlefieldContext)

{{< highlight csharp "linenos=table,linenostart=1" >}}
<connectionStrings>
<add
name="BattlefieldContext"
providerName="System.Data.SqlClient"
connectionString="Server=localhost\sql2008;Database=Battlefield;Trusted_Connection=true;"/>
</connectionStrings>
{{< / highlight >}}

Now write the code that insert a Warrior into the database.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Warrior Raistlin;
using (var db = new BattlefieldContext())
{
Raistlin = new Warrior { Name = "Raistlin", ExperiencePoints=342553 };
db.Warriors.Add(Raistlin);
db.SaveChanges();
}
{{< / highlight >}}

Run these few lines of code, everything works, but waitâ€¦. you never created the database but no exception occurs. This happens because the current user has administrative rights on the Sql Server, so, after the connection to the database engine was opened, EF41 verified that the Battlefield database did not exists, so he created one to persist the Warrior class.

[![SNAGHTML4edfe4](http://www.codewrecks.com/blog/wp-content/uploads/2011/07/SNAGHTML4edfe4_thumb.png "SNAGHTML4edfe4")](http://www.codewrecks.com/blog/wp-content/uploads/2011/07/SNAGHTML4edfe4.png)

Generation of the database is straightforward, EF41 generates a table with a column for each property of the object that needs to be persisted, and he got special care for property named Id, because it is the primary key in the table. Since the Id property is an integer, the default convention creates a primary key with Identity Specification turned on. If you read all rows in the table you can verify that the warrior Raistlin was really saved into database.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/07/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/07/image1.png)

You should admit that using EF41 in such a simple scenario is damn simple and efficient, very few lines of code and you are ready to use it.

alk.

Tags: [EF41](http://technorati.com/tag/EF41) [EntityFramework](http://technorati.com/tag/EntityFramework)
