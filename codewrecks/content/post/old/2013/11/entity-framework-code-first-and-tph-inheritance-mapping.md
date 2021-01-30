---
title: "Entity Framework Code First and TPH Inheritance mapping"
description: ""
date: 2013-11-28T08:00:37+02:00
draft: false
tags: [Entity Framework]
categories: [Entity Framework]
---
The major pain when you  **switch from two similar tools (from NH to EF in this specific scenario)** is that you need to  **learn again how to obtain the same results, but in a different way**. Yesterday I was mapping a hierarcy of objects in Entity Framework, I’ve a scenario where Table Per Type was the right solution and I’ve managed to create the fluent mapping in really short time, but when it was time to use Table Per Hierarchy the situation got worse.

If you simply map TPH, EF wants to use a discriminator nvarchar column called “Discriminator” where he store the name of the class to discriminate. This is not efficient and usually a **simple integer would be a really better solution,** so I started looking on how to specify a different type for the discriminator column. After a little googling I’ve found this.

{{< highlight csharp "linenos=table,linenostart=1" >}}


 public class UserGoldMap : EntityTypeConfiguration<UserGold>
    {
        public UserGoldMap ()
        {
           this.Map(u =>  u.Requires("Discriminator").HasValue(1).HasColumnType("int"));
           //rest of the mapping
        }
    }

{{< / highlight >}}

In the map of concrete types **you can use the u.Requires with the name of the discriminator column**. My first concern is the naming of the API, because I never could imagine to specify the discriminator column with a call to a method called Requires. I’m pretty sure that if I need to do such mapping again in 10 days, I’ve surely forgot the right call, because is everything but intuitive.

Apart this annoying fact, once I’ve modified the mapping my continuous test runner was still red, but the error now is:

> System.Data.MetadataException: Schema specified is not valid. Errors:
> 
> MaxLength facet isn’t allowed for properties of type int.

Probably EF put a MaxLength constraint upon Discriminator column, because it originally declare as nvarchar(128) and it ignores the fact that I’ve changed the type in the mapping to an int column. The solution was trivial, **just avoid using Discriminator as column name, you can use as an example UserType and everything went good**.

I must admit that EF is now a really better product that it was in the past, but in my opinion it still has *not-so-meaningful*names for fluent API and some strange behaviour that can surprise you as a user.

Gian Maria.
