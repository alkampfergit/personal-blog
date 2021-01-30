---
title: "Entity Framework error 3002 on views when model updated"
description: ""
date: 2012-01-25T09:00:37+02:00
draft: false
tags: [Entity Framework]
categories: [Entity Framework]
---
One of the most annoying problem with the first version of entity Framework is that you have barely no option other than go with “Database First approach”, and when you start mapping database views your life started to become difficult.

The first obvious problem is that the designer, during the import phase from database, try to detect in the view any not-null column and make it part of the primary key of the entity. If you decide to live with it (and having entities with lot of field used as primary keys), you probably will incur in the error 3002 when you update a view and then update the model from database.

The problem happens if you change the definition of the view, and a column that was not null, became nullable by the modification. What it happens is usually that the designer still mark the corresponding property of the entity as primary key a situation that is not admitted if the field in the database is NULL. If this is your situation you can usually fix it going to “mapping details” of the view that raise the error.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image7.png)

 ***Figure 1***: *A view with error, the StartDate becomes nullable in the view, but the entity still uses it at key*

The problem is depicted in  **Figure 1** , you can see in the left that StartDate is not a key of the database model, because I changed the view and now the StartDate admit NULL value, but in the right part, the model still uses that property as a key.

The fix is easy, just select the StartDate property in the model, then in properties windows set to false the  **EntityKey** property, set the  **Nullable** property to true and the error should go away.

Gian Maria.
