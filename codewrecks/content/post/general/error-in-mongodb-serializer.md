---
title: Error in mapping MongoDb classes after updating to 2.10 driver
description: Why using server code and a database when all you need is a static code generator?
date: 2020-07-02T10:17:25+02:00
draft: false
tags: ["MongoDB"]
categories: ["NoSql"]
---

After updating a big project from MongoDb C# driver 2.7 to latest 2.10 version I started having lots of error on Integration tests.

{{< highlight csharp >}}
MongoDB.Bson.BsonSerializationException
  HResult=0x80131500
  Message=Creator map for class TestMongoBug.TestArray has 2 arguments, but none are configured.
  Source=MongoDB.Bson
  StackTrace:
   at MongoDB.Bson.Serialization.BsonCreatorMap.Freeze()
   at MongoDB.Bson.Serialization.BsonClassMap.Freeze()
   at MongoDB.Bson.Serialization.BsonClassMap.LookupClassMap(Type classType)
   at MongoDB.Bson.Serialization.BsonClassMapSerializationProvider.GetSerializer(Type type, IBsonSerializerRegistry serializerRegistry)
   at MongoDB.Bson.Serialization.BsonSerializerRegistry.CreateSerializer(Type type)
   at System.Collections.Concurrent.ConcurrentDictionary`2.GetOrAdd(TKey key, Func`2 valueFactory)
{{< / highlight >}}

The stack trace is especially strange, because it **reveals that the error happens when the BsonClkassMap is trying to create mapping for the object**. The error message is also really strange

> Creator map for class  has 2 arguments, but none are configured.

This points me to some error in constructors of the class and after some tests **I've managed to understand what is the code that triggered the error**. 

{{< highlight csharp "linenos=table,hl_lines=3,linenostart=1" >}}
public class TestArray
{
    public TestArray(String id, IEnumerable<String> values)
    {
        Id = id;
        Values = values.ToArray();
    }

    public String Id { get; private set; }

    public String[] Values { get; private set; }
}
{{< / highlight >}}

If you look closely to line 3 (the constructor) you can notice that **it accepts a parameter called values of type IEnumerable<String> and the class has a property called Values of type String[]**. The problem was probably due (I didn't check driver's code) to a combination of

1. Value property has private setter
2. In the constructor the type is different

Confirmation of the theory is simple, **if I make setter public the error is gone, if I use the very same type (string[]) for value param in the constructor the error is also gone**.

The annoying stuff is that the code was in production for YEARS and I have TONS of C# classes serialized into MongoDb with 2.7 version of the driver, now all my tests are green (after I fixed 5 classes with these problems), but in my opinion this is a bug or at least a regression.

If you encounter the very same error you have another way to solve this problem, **manually map the class with BsonClassMap.RegisterClassMap<T> mapping everything without calling AutoMap**.

Gian Maria.