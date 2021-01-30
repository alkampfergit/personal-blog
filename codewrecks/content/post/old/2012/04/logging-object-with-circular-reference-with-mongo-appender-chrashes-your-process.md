---
title: "Logging object with circular reference with Mongo Appender chrashes your process"
description: ""
date: 2012-04-03T15:00:37+02:00
draft: false
tags: [MongoDb,NoSql]
categories: [NoSql]
---
I’ve blogged some days ago on the possibility to save [log4net logs inside a Mongo database](http://www.codewrecks.com/blog/index.php/2012/03/19/using-mongo-database-to-store-log4net-logs/), but you should be aware that this technique can be  **dangerous if your objects have circular references.** A *circular reference happens when object A reference object B and object B directly or indirectly reference object A again*and this is a  **high risk** when you work with Mongo Serializer.

Mongo Serializer does not likes circular references (it is perfectly acceptable, because documents with circular references cannot be saved into a document database), but the problem is:  **if you try to serialize an object that has a circular reference you will get a StackOverflowException** and your process will crash, as stated in official documentation from MSDN

> Starting with the.NET Framework version 2.0, a  **StackOverflowException object cannot be caught by a try-catch block and the corresponding process is terminated by default**. Consequently, users are advised to write their code to detect and prevent a stack overflow.

If you remember how I modified MongoDb log4net appender, I decided to save into MongoDB complex objects with this code:

{{< highlight csharp "linenos=table,linenostart=1" >}}


if (compositeProperties != null && compositeProperties.Count > 0)
{
    var properties = new BsonDocument();
    foreach (DictionaryEntry entry in compositeProperties)
    {
        BsonValue value;
        if (!BsonTypeMapper.TryMapToBsonValue(entry.Value, out value))
        {
            properties[entry.Key.ToString()] = entry.Value.ToBsonDocument();
        }
        else
        {
            properties[entry.Key.ToString()] = value;
        }
    }
    toReturn["customproperties"] = properties;
}

{{< / highlight >}}

The key point is in *entry.Value.ToBsonDocument(), because if someone store in log4Net global context an object that contains a circular reference, your program will be terminated the next call to log4net*, **because the StackOverflowException could not be caught**.

This is especially annoying when you want to store in your log object that comes from Database with an ORM like NHibernate, because *every object that has a Bag reference, usually get hydrated with a PersistentBag*, an  **internal class by nhibernate, that has a circular reference**. A simple solution to this process is telling MONGO which serializer to use for such a specific types.

The technique is simple, Mongo drivers provide the ability to register custom Serialization provider easily

{{< highlight csharp "linenos=table,linenostart=1" >}}


BsonSerializer.RegisterSerializationProvider(new LoggerBsonSerializerProvider());

{{< / highlight >}}

And this is the code of the class that implements the ISerializationProvider interface

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class LoggerBsonSerializerProvider : IBsonSerializationProvider
{
    public IBsonSerializer GetSerializer(Type type)
    {
        if (type.FullName.Contains("Nhibernate", StringComparison.OrdinalIgnoreCase))
        {
               return BsonNullSerializer.Instance;
        }
        return null;
    }
}

{{< / highlight >}}

The only function you need to  **implement is the GetSerializer** , in this simple example, for all types that contains NHibernate string in it, simply return a BsonNullSerializer. That basically tells Mongo Serializer to ignore that types. This is in my opinion the best approach because **it avoids the risk of serializing NHibernate internal classes that actually can throw a StackOverflowException**. If you want to serialize NHibernate PersistentGenericBag but you do not want to risk a circular reference you can use this code instead.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class LoggerBsonSerializerProvider : IBsonSerializationProvider
{
    public IBsonSerializer GetSerializer(Type type)
    {
        if (type.FullName.Contains("Nhibernate", StringComparison.OrdinalIgnoreCase))
        {
            if (type.TypeImplementsGenericInterface(typeof(IList<>)))
            {
                    return EnumerableSerializer.Instance;
            }
            return BsonNullSerializer.Instance;
        }
        return null;
    }
}
public static Boolean TypeImplementsGenericInterface(this Type typeToCheck, Type interfaceToLookFor)
{
return typeToCheck.GetInterface(interfaceToLookFor.Name) != null;
}

{{< / highlight >}}

The main difference is:, for each NHibernate internal type that implement a generic IList&lt;&gt; I tell Mongo to serialize using the EnumerableSerializer,  **this kind of serializer avoid the circular reference problem, because the PersistentGenericBag is handled as a IList&lt;&gt;** ignoring its real properties. This approach is still not safe, because you *need to be sure that the collection was already loaded from database or the object is not detached, to avoid an exception during logging because the collection cannot be initialized*. This type of exception is catchable, so it can be a minor issue because you can handle it with a simple try catch inside the Mongo Appender.

Gian Maria
