---
title: "How to fix 'No matching creator found' mongodb error after upgrade"
description: "If you upgraded MongoDb C# driver to the latest version and suddenly tests start failing and code start throwing strange error, it is possible that you where affected by a change in immutable serializer strategy class."
date: 2020-08-15T08:00:00+02:00
draft: false
tags: ["MongoDb"]
categories: ["NoSql"]
---

Even if Release changes seems to have no breaking changes in MongodDb Driver latest upgrade, it is possible that your code could be affected by a change in the driver and you **starts having strange exception with code that works perfectly with an older version of the driver**.

> I've a big project where after updating from 2.7.3 driver to 2.11.0 MongoDb driver I've started having all sort of weird errors that disappear restoring 2.7.3 of the driver.

## Real cause of the problem

My **problem is present only in classes that have all properties with private setters**, a special type of classes that is handled differently from MongoDB driver. These classes are called Immutable in the driver and are affected by an IClassConvention class called **ImmutableTypeClassMapConvention that was changed recently**.

I do not want to give you the gritty detail on how this class works, MongoDb driver is a nice but complex piece of software, but you can do a really simple test to verify if your error is due to this specific change. **Take the class that give deserialization errors and make at least one public setter in a property.** If your code starts working again you are indeed hit by a change in ImmutableTypeClassMapConvention.

> I have more than one problematic class that is affected by this change and I've discovered at least three different root cause, but all of them can be solved by the same technique.

I've also [opened a bug on Jira](https://jira.mongodb.org/browse/CSHARP-3186?filter=-2) and have a stupid [sample project that can replicate the problem](https://github.com/alkampfergit/MongoDbDriverExperiments/tree/master/Bugs/CSHARP-3186). In that sample I've highlighted a typical situation: we have a class with X properties, then after some time we add another property, all setters are private, we added a parameter to the constructor. This is supposed to work, when you will deserialize objects saved without that property, you will simply have null as value. **This approach is valid if you add property to an object and it is ok for you to have default value when you deserialize document that has no that property**.

The magic happens because MongoDb driver uses reflection to actually set all properties that have a private setters. The object in Db has X properties but C# class has X+1 properties and constructor has X+1 parameters, **the driver cannot use the new constructor (we have less properties in the object serialized in the database), but it proceed to use private setter through reflection**. If all properties are private, class is handled by the new version of  ImmutableTypeClassMapConvention that just throw an exception because it is not able to find a suitable constructor.

In my example in [github](https://github.com/alkampfergit/MongoDbDriverExperiments/tree/master/Bugs/CSHARP-3186) I replicate the problem with a hierarchy of objects. What I'm doing id:

1. Save data in database
2. Then remove a property of a nested object (this simulate a document saved in the past when the property was not in the object)
3. Try to reload the object, we got an exception.

## How you can do a quick fix

Actually I've explored two quick solution to the problem, first one is leaving at least one property with a public getter, **this actually made the class not immutable so it is not affected by the aforementioned convention and everything seems to work again**.

> Changing a class in such a way is not a good solution, semantic of the class is ruined (I like immutable object) and I should do this for every class that is saved in database. 

A better approach is checking out code of MongoDB CSharp driver, copy and paste old version of ImmutableTypeClassMapConvention into your project, then **change the default convention pack to use old version.**

{{< highlight csharp "linenos=table,linenostart=1" >}}

public static class ConventionRegistryHelper
{
    public static void ReplaceDefaultConventionPack()
    {
        ConventionRegistry.Remove("__defaults__");
        ConventionRegistry.Register("__defaults__", DefaultJarvisConventionPack.Instance, t => true);
    }
}

public class DefaultJarvisConventionPack : IConventionPack
{
    // private static fields
    private static readonly IConventionPack __defaultConventionPack = new DefaultJarvisConventionPack();

    // private fields
    private readonly IEnumerable<IConvention> _conventions;

    // constructors
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultConventionPack" /> class.
    /// </summary>
    private DefaultJarvisConventionPack()
    {
        _conventions = new List<IConvention>
        {
            new ReadWriteMemberFinderConvention(),
            new NamedIdMemberConvention(new [] { "Id", "id", "_id" }),
            new NamedExtraElementsMemberConvention(new [] { "ExtraElements" }),
            new IgnoreExtraElementsConvention(false),
            new OldImmutableTypeClassMapConvention(),
            //new ImmutableTypeClassMapConvention(),
            new NamedParameterCreatorMapConvention(),
            new StringObjectIdIdGeneratorConvention(), // should be before LookupIdGeneratorConvention
            new LookupIdGeneratorConvention()
        };
    }

    // public static properties
    /// <summary>
    /// Gets the instance.
    /// </summary>
    public static IConventionPack Instance
    {
        get { return __defaultConventionPack; }
    }

    // public properties
    /// <summary>
    /// Gets the conventions.
    /// </summary>
    public IEnumerable<IConvention> Conventions
    {
        get { return _conventions; }
    }
}
{{< / highlight >}}

OldImmutableTypeClassMapConvention is the old code of the ImmutableTypeClassMapConvention taken from driver source before the change, you can find [everything here](https://github.com/alkampfergit/MongoDbDriverExperiments/tree/master/Bugs/CSHARP-3186).

## Final consideration

Is the solution of replacing default convention good? Absolutely not, I can spot a couple of problems: first of all I'm not 100% sure that using the old version is completely safe, all tests in the driver are done with the new class; second each upgrade of the driver is not 100% safe. To be sure that nothing is wrong **I should go to the source code, verify if the default convention pack is still the same, also I need to verify is the immutable class convention is not changed again.**

> Actually, using the old version of the immutable class convention forces you to do a check each time you upgrade the driver again

But for now this is the only way I had to update driver in my project and feels safe not to have to change lots of classes.

Gian Maria.