---
title: "Entity Framework 5 First StepsndashMapping"
description: ""
date: 2012-09-27T09:00:37+02:00
draft: false
tags: [Entity Framework]
categories: [Entity Framework]
---
In [previous article](http://www.codewrecks.com/blog/index.php/2012/09/25/entity-framework-5-0-first-steps-and-impressions/?preview=true) I’ve explained how simple is starting to use EF5 to access a database and use Database-Migrations to create a database suitable to contain your entities (with a simple Update-Command from the package manager console). When you show this technique to programmers the first complain they have is “ **the structure of the generated tables is not suitable to me** ”.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/09/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/09/image8.png)

 ***Figure 1***: *Database generated with previous code example*

Suppose you want to  **specify maximum length of the various columns, specify not null columns and you want them to be named with a convention** (yes, I know, still in 2012 DBA rules :)), finally  **you do not want to use Identity columns** , because all customer you will save in this database comes from a legacy CMR application and you want to be able to use the very same id of the CRM system.

If you want to customize how the table is generated but you want to be completely free on how you name entities properties or context dbSet you need to specify a custom mapping that does not use standard convention over configuration. First  **you must create a mapping class for your Customer class**  **(you can also do this with Attributes) to specify how properties will be mapped on database tables and columns**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class CustomerMap : EntityTypeConfiguration<Customer>
{
    public CustomerMap()
    {
        // Primary Key
        this.HasKey(t => t.Id);
        // Properties
        // Table & Column Mappings
        this.ToTable("Customer");
        this.Property(t => t.Id)
           .HasColumnName("cust_Id")
           .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);
        this.Property(t => t.Name)
           .HasColumnName("cust_Name")
           .HasMaxLength(100)
           .IsRequired();
        this.Property(t => t.Address)
           .HasColumnName("cust_Address")
           .HasMaxLength(200);
    }
}

{{< / highlight >}}

You can put this class wherever you want, I usually put it into a subfolder named Mappings and I usually call this class with the same name of the entity with the suffix Map.  **Now you should only specify in your DbContext that this mapping is available**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    modelBuilder.Configurations.Add(new CustomerMap());
}

{{< / highlight >}}

 **By overriding OnModelCreating you can add your custom mapping to the Configurations collection** , now if you issue another Update-Database you can verify that the table is now created the way you want.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/09/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/09/image9.png)

 ***Figure 2***: *New structure of the table that respect the CustomerMap class*

Now you can see that the table is called Customer, columns are named with your convention and length and not null are created correctly. This is really good  **because if the DBA or some convention impose you some naming rules on database tables and column you are free to use business-friendly names in your entities**.

Older post on EF5:

- [EF 5.0 First steps and impressions](http://www.codewrecks.com/blog/index.php/2012/09/25/entity-framework-5-0-first-steps-and-impressions/?preview=true)

[Code sample can be found here.](http://sdrv.ms/PhysAl)

Alk.
