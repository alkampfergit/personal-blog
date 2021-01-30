---
title: "Change how MongoDb C Driver serialize Guid in new driver version"
description: ""
date: 2016-04-15T16:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
We have code based on the old legacy mongo driver that uses MemberSerializationOptionsConvention class to serialize all Guid as plain strings. This option is really useful because  **saving Guid in Bson format is often source of confusion (CSUUID, … ) for.NET users.** On the contrary, having saving Guid as plain string solves some pain and made your Bson really more readable.

Here is the old code that runs with the old legacy driver.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var conventions = new ConventionPack
    {
        new MemberSerializationOptionsConvention(
            typeof (Guid),
            new RepresentationSerializationOptions(BsonType.String)
            )
    };
ConventionRegistry.Register("guidstring", conventions, t =&gt; true);

{{< / highlight >}}

 **In the new Driver, these classes are removed, so we need to find a different way to serialize Guid as strings**. Here is a possible solution.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static void RegisterMongoConversions(params String[] protectedAssemblies)
{
    var guidConversion = new ConventionPack();
    guidConversion.Add(new GuidAsStringRepresentationConvention(protectedAssemblies.ToList()));
    ConventionRegistry.Register("guidstring", guidConversion, t =&gt; true);
}

{{< / highlight >}}

This class uses a custom class called GuidAsStringRepresentationConvention, used to instruct Mongo serializer to serialize Guid as plain String. This class accepts a list of string that represents a list of protected assemblies. The reason behind it is that  **we do not want this convention to be applied to every type loaded into memory** , and we want to avoid to change how Guid are serialized for types stored in assembly we do not have control to.

Here is the code of the class.

{{< highlight csharp "linenos=table,linenostart=1" >}}


/// <summary>
/// A convention that allows you to set the serialization representation of guid to a simple string
/// </summary>
public class GuidAsStringRepresentationConvention : ConventionBase, IMemberMapConvention
{
    private List protectedAssemblies;

    // constructors
    /// <summary>
    /// Initializes a new instance of the  class.
    /// </summary>  
    public GuidAsStringRepresentationConvention(List protectedAssemblies)
    {
        this.protectedAssemblies = protectedAssemblies;
    }

    /// <summary>
    /// Applies a modification to the member map.
    /// </summary>
    /// The member map.
    public void Apply(BsonMemberMap memberMap)
    {
        var memberTypeInfo = memberMap.MemberType.GetTypeInfo();
        if (memberTypeInfo == typeof(Guid))
        {
            var declaringTypeAssembly = memberMap.ClassMap.ClassType.Assembly;
            var asmName = declaringTypeAssembly.GetName().Name;
            if (protectedAssemblies.Any(a =&gt; a.Equals(asmName, StringComparison.OrdinalIgnoreCase)))
            {
                return;
            }

            var serializer = memberMap.GetSerializer();
            var representationConfigurableSerializer = serializer as IRepresentationConfigurable;
            if (representationConfigurableSerializer != null)
            {
                BsonType _representation = BsonType.String;
                var reconfiguredSerializer = representationConfigurableSerializer.WithRepresentation(_representation);
                memberMap.SetSerializer(reconfiguredSerializer);
            }
        }
    }
}

{{< / highlight >}}

The code is really simple, it scan each memberMap to verify if the memberMap is of type GUID, but if the type is declared in a protected assembly, simply return, because we want to leave serialization as-is.  **If the type is not in a protected assembly and is of type GUID, we simply change the representation of the serialization to be a BsonType.String.** The result is that now, each property of type GUID, will be serialized as plain string into MongoDb.

Gian Maria.
