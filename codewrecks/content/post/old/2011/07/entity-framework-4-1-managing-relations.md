---
title: "Entity Framework 41 managing relations"
description: ""
date: 2011-07-12T06:00:37+02:00
draft: false
tags: [EF Code First,EF41]
categories: [Entity Framework]
---
[Part 1: First Steps](http://www.codewrecks.com/blog/index.php/2011/07/11/entity-framework-4-1-first-steps/)

In previous post I showed how you can persist an object to the database thanks to EF41 and few lines of code, now it is time to understand how to manage relations. First of all create another class called weapon and then create a property of type Weapon into the Warrior class.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image2.png)

 ***Figure 1***: *New model, the warrior has a property called ActiveWeapon of type Weapon*

Now I can write the following code to save a warrior to the database with an associated weapon.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Warrior Caramon;
using (var db = new BattlefieldContext())
{
Caramon = new Warrior { Name = "Caramon", ExperiencePoints = 342553 };
Caramon.ActiveWeapon = new Weapon() { Damage = 10, Size = 3 };
db.Warriors.Add(Caramon);
db.SaveChanges();
}
{{< / highlight >}}

But if I ran previously the code of the first part of the sample, I got this exception because the database was already created.

> The model backing the ‘BattlefieldContext’ context has changed since the database was created. Either manually delete/update the database, or call Database.SetInitializer with an IDatabaseInitializer instance. For example, the DropCreateDatabaseIfModelChanges strategy will automatically delete and recreate the database, and optionally seed it with new data.

This happens because the database already exists, and the schema is not compatible with this new version of the classes. So we need to add this line of code in the project to make EF update the db schema to reflect the change in object model.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Database.SetInitializer<BattlefieldContext>(
new DropCreateDatabaseIfModelChanges<BattlefieldContext>());
{{< / highlight >}}

This single line of code tells EF to recreate the database if the model has changed and the schema of the db is outdated. This will actually Drop and recreate the database, so if you need to maintain the data you should manage the update with other tool as a DatabaseProject or some third party tool. If you intercept the queries done to the db you should see something like this.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image3.png)

 ***Figure 2***: *The query issued to verify if the actual database structure is good for the current model*

This query simply check if the database structure is up to date. Now back to the code to add the warrior with the weapon, as you can see I create a weapon and assigned to the ActiveWeapon property of the Warrior object. This is a really important concept, I do not care about ForeignKey or Id, I simply assign an object to another object and EF takes care for me of this. The query issued to insert the object into the database is the following one.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image4.png)

 ***Figure 3***: *Inserting a Warrior with a Weapon into the database*

As you can see we have two distinct queries, the first one is used to insert the Weapon into the database and retrieve the generated identity (the id of the object), immediately followed by an INSERT into the Weapon table, where the ActiveWeapon\_id is set to the value of the id of the weapon generated in the previous query.

This is the advantage of using an ORM tool, you design object using standard object relations in mind, and the ORM has the duty of persisting this model into a database. As you can verify from Figure 4, the Warrior table has a column ActiveWeapon\_id to store the foreign key to the Weapon table.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image5.png)

 ***Figure 4***: *Database schema generated to persist the Warrior-Weapon model*

The cool part is that I did not write any single line of code related to the persistence of the Weapon class, I just added the class, added the relation to the Warrior object and all the rest is managed by EF41.

Alk
