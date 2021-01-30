---
title: "Using Mongo Database to store Log4Net logs"
description: ""
date: 2012-03-19T09:00:37+02:00
draft: false
tags: [log4net,MongoDb]
categories: [NoSql,Tools and library]
---
One of the most simple and useful way to introduce a  **Documents Database** like  **Mongo** in your organization is to use as Log Storage. If you use [**log4Net**](http://logging.apache.org/log4net/) you can download a [Mongo appender](http://maddemcode.com/net/log4net-mongodb-appender/) capable of storing logs inside mongo with few lines of code and you are ready to go.

The original appender is really good but I’ve done a little modification to make it capable of storing complex item in extended properties, just locate the function LogginEventToBSON and modify the section that stores Composite Properties with following code

{{< highlight csharp" line="1 "linenos=table,linenostart=1" >}}

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
}{{< / highlight >}}

The only modification I did to the original code is trying to convert the value stored in Composite properties to a [**BsonValue**](http://api.mongodb.org/csharp/1.0/html/44377175-3ea2-aaf7-7fae-89637c6d9ec2.htm) and if the conversion does not succeeds I convert the entire object to a [**BsonDocument**](http://api.mongodb.org/csharp/1.0/html/3a31e174-4df4-91f3-6760-02078b53ddb1.htm) and store the entire object to  **Mongo**. The original code stores extended properties with ToString(), this has two disadvantages, the first is that you are actually losing the type of the data and you are not able to store complex objects. With this modification if you add an Int32 as extended property, it will be stored as numeric value inside the database.

Using  **Mongo** as  **Log Storage** gives you lots of advantages, first of all Document Databases are really fast in inserting stuff, then they are  **Not Schema Bound** so you do not need to define a schema to contain your logs. This feature in conjunction with the ability of  **Log4Net** to store extended properties in the context permits you to write code like this one.

{{< highlight csharp" line="0">log4net.GlobalContext.Properties["CurrentItem "linenos=table,linenostart=1" >}}
log4net.GlobalContext.Properties["CurrentItem"] = item;{{< / highlight >}}

With this simple line of code each subsequent log will have in Mongo Database an associated object of type item, until you will not remove the object from the GlobalContext.

[![Complex objects are stored inside the log](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb21.png "Complex objects are stored inside the log")](http://www.codewrecks.com/blog/wp-content/uploads/2012/03/image21.png)

 ***Figure 1***: *Your log contains all data from extended properties*

As you can see from Figure 1 the log has now a complex object associated with it. This capability is awesome because you simply need to store complex objects inside GlobalContext and they will be stored inside the log as customproperties without needing additional lines of code.

Clearly you can now use all the advanced query capability of  **Mongo** to view/filter/mapreduce logs using these additional properties.

Gian Maria.
