---
title: "Using SaveOrUpdate in Entity Framework"
description: ""
date: 2013-12-20T18:00:37+02:00
draft: false
tags: [EF5,Nhibernate]
categories: [Entity Framework]
---
This is a common question for people that **used NHibernate before using EF**. The problem is, I have an object and I do not want to care about if this is a new object that needs to be added for the first time to the database, or it is an object that needs update or if it was already attached to the context, etc.  **I want to call a single Upsert method called SaveOrUpdate and let the ORM takes care of the rest.** Since I use NHibernate a lot, I’ve come out in the past with the following simple code that can helps you to have similar functionalities in EF.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static void SaveOrUpdate
    (this ObjectContext context, TEntity entity)
    where TEntity : class
{
    ObjectStateEntry stateEntry = null;
    context.ObjectStateManager
       .TryGetObjectStateEntry(entity, out stateEntry);

    var objectSet = context.CreateObjectSet();
    if (stateEntry == null || stateEntry.EntityKey.IsTemporary)
    {
        objectSet.AddObject(entity);
    }

    else if (stateEntry.State == EntityState.Detached)
    {
        objectSet.Attach(entity);
        context.ObjectStateManager.ChangeObjectState(entity, EntityState.Modified);
    }
}

public static ObjectContext GetObjectContext(this DbContext c)
{
    return ((IObjectContextAdapter)c).ObjectContext;
}

public static void SaveOrUpdate
    (this DbContext context, TEntity entity)
    where TEntity : class 
{
    context.GetObjectContext().SaveOrUpdate(entity);
}

{{< / highlight >}}

This is some common code you can find around in the internet and  **thanks to extension method, it permits you to call SaveOrUpdate directly on your DbContext object and make your life easier**. The principle on witch this code is based is simple, first of all a DbContext object can be cast to [IObjectContextAdapter](http://msdn.microsoft.com/en-us/library/system.data.entity.infrastructure.iobjectcontextadapter%28v=vs.113%29.aspx) that has a property called [ObjectContext](http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext%28v=vs.110%29.aspx) that give you direct access to the real manager of the lifecycle of objects.

From that object you have access to the [ObjectStateManager](http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.objectstatemanager%28v=vs.110%29.aspx) of the DbContext, that can be used to verify status of the entity thanks to the TryGetObjectStateEntry. *If the object has no state entry of if the stateEntity has an EntityKey that IsTemporary, it means that this object should be added so you can call AddObject to the correct ObjectSet obtained from a call to the CreateObjectSet&lt;T&gt; of ObjectContext object. If the entity is in status Detatched I decided to attach and inform EF that the entity is in state Modified.*

It is quite rude, but it works. The only problem with it is when you have inheritance, if you call SaveOrUpdate passing a derived class you can incur in the error

> There are no EntitySets defined for the specified entity type xxx If xxx is a derived type, use the base type instead.  
>  Parameter name: TEntity

This can be easily solved specifying the base type as type parameter in the call of SaveOrUpdate and everything should work as expected.

Gian Maria.
