---
title: "Case insensitive key dictionaries and MongoDb C# serializers"
description: "If you need case insensitive key dictionary in C# and you serialize object into MongoDb, you need to write your own serializer."
date: 2022-05-18T08:00:00+02:00
draft: false
tags: ["MongoDb"]
categories: ["MongoDb"]
---

First of all, every C# programmer should know that Dictionary<Tkey, Tvalue> class (as well as other collections) have a special constructor that can be used to specify the **serializer used to compare keys in the dictionary**. The most obvious situation is where you have a string key **and you want the dictionary to be case insensitive during key search**.

{{< highlight csharp "linenos=table,linenostart=1" >}}
  public SortedDictionary<string, StringProperty> StringProperties { get; private set; } 
    = new SortedDictionary<string, StringProperty>(StringComparer.OrdinalIgnoreCase);
{{< / highlight >}}

The above code is inside a class where I need to keep a dictionary of StringProperty class, using a Sorted dictionary where the key **must be case insensitive**. This allows me to write code like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
  myclass.StringProperties["BLAH"] = new StringProperty....
  ...
  myclass.StringProperties["blah"]
{{< / highlight >}}

If you omit the StringComparer.OrdinalIgnoreCase in dictionary constructor **in the third line of your code you will have an exception because there is no element in dictionary with the key blah**. Everything is ok until you save the object in MongoDb, because when you deserialize the object, all Dictionary properties are deserialized with a dictionary with default constructor, and the above code does not works anymore. This is annoying because you have a class that **is not the same after MongoDb deserialization**.

Whenever you encounter such a problem in MongoDb, the solution is to create a Custom serializer, but for complex stuff is not an easy task. Luckily enough if you look **ad MongoDb C# driver source, you can find that there is a nice base helper class that can solve all of your problem.** Thanks to that base class you can write a custom serializer with few lines of code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class CaseInsensitiveSortedKeyDictionarySerializer<TKey, TValue> :
        DictionarySerializerBase<SortedDictionary<TKey, TValue>, TKey, TValue>
{
    protected override ICollection<KeyValuePair<TKey, TValue>> CreateAccumulator()
    {
        return Activator.CreateInstance(
            typeof(SortedDictionary<TKey, TValue>),
            new object[] { StringComparer.OrdinalIgnoreCase }) as SortedDictionary<TKey, TValue>;
    }
}
{{< / highlight >}}

This class is super simple because **DictionarySerializerBase class allows you to override only how the underling dictionary is created**, solving all of my problems. You can create other serializer for basic Dictionary<TKey, TValue> not only for SortedDictionary, and you can use the most suitable constructor for the dictionary type you need.

You can easily use that serializer with a simple attribute in class property

{{< highlight csharp "linenos=table,linenostart=1" >}}
  [BsonSerializer(typeof(CaseInsensitiveSortedKeyDictionarySerializer<string, StringProperty>))]
  public SortedDictionary<string, StringProperty> StringProperties
{{< / highlight >}}

Now even after deserialization my class still have **case insensitive key based dictionary property**.

Gian Maria.
