---
title: "Query untyped object inside a Mongo Db log4net mongoappender"
description: ""
date: 2012-05-25T16:00:37+02:00
draft: false
tags: [NoSql]
categories: [NoSql]
---
I’ve blogged about  **using MongoDb to store log4net logs** , but the original appender has a little problem, it stores a BsonDocument inside the MongoCollection, and does not use any C# object and when it is time to query data you cannot use the new LINQ Mongo provider that is included in [newest C# drivers (1.4](http://www.mongodb.org/display/DOCS/CSharp+Language+Center)), because data is completely untyped.

This is usually not a big problem, because you can query a collection using  **simple JSON-like query** , but if you are used to standard LINQ provider, probably you will get a little bit lost on how to create the JSON query to retrieve the data you need. *This is the scenario I need to solve*: I have a stupid Winform that is able to show some information from a standard Log4Net Sql database (using the adonetappender) and I want to be able to use the very same interface to load data from mongo database. First of all I need to *load* *all distinct value for the property  **level** and  **loggerName** *, because I have a combo where the user can filter for Severity (ERROR, WARN, INFO, Etc.) and a list of checkboxes used to filter for loggerName. Luckily enough, mongo offer such a functionality out of the box.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var db = server.GetDatabase(bsDatabase.Current as string);
var collection = db.GetCollection(bsCollections.CurrencyManager.Current as string);
var allLevel = collection.Distinct("level");

{{< / highlight >}}

The code is really simple, I create a connection to the database and then retrieve a reference to collection that was selected in the interface from the user, then *I use the  **Distinct()** method of MongoCollection object, passing the name of the property you need, and Mongo gave you the distinct list of every value of that property*. This permits me to populate the user interface with few lines of code.

Now it is time to think  **how to create a query to retrieve all the document with a certain level of logging and belonging to a list of possible loggerName**. In my software I usually use Castle Log4net Integration, this means that loggerName property is equals to the name of the class that issue the log and usually the user wants to see logs belonging to one or more class, something like: *all ERROR from classa or classb and severity ERROR*. Mongo has a QueryBuilder helper class that makes easy to create such a query with a  **little help from intellisense and without the need to dirty your hand directly with JSON** {{< highlight csharp "linenos=table,linenostart=1" >}}


var query = Query.And(
                    Query.EQ("level", "ERROR"),
                    Query.Or(
                        Query.EQ("loggerName", "classa"),
                        Query.EQ("loggerName", "classb")
                    )
                );

{{< / highlight >}}

Now I need to make this code dynamic, because I need to create a query that retrieve logs  **belonging to an unknown number of loggerName** , **such as “classa”, “classb” and “classc”** , because user interface contains a CheckBoxList of every loggerName present into the database, and the user can choose any number of elements to search from, so I need to dynamically create the list of condition to create a dynamic query.

{{< highlight csharp "linenos=table,linenostart=1" >}}


List<IMongoQuery> mainQueries = new List<IMongoQuery>();
if (!String.IsNullOrWhiteSpace(cmbLevel.Text))
{
    mainQueries.Add(Query.EQ("level", cmbLevel.Text));
}
if (cbList.CheckedIndices.Count > 0)
{
    List<IMongoQuery> listOfLoggerNameQueries = new List<IMongoQuery>();
    foreach (Int32 index in cbList.CheckedIndices)
    {
        String value = cbList.Items[index].ToString();
        listOfLoggerNameQueries.Add(Query.EQ("loggerName", value));
    }
    mainQueries.Add(Query.Or(listOfLoggerNameQueries.ToArray()));
}
var finalQuery = Query.And(mainQueries.ToArray());

{{< / highlight >}}

Code is really simple, because  **it simply create a list of IMongoQuery object that contains all the first-level condition that will be combined**  **in the last instruction with the Query.And() helper**. Since I can select more than one loggerName from the checkboxList I can simply  **iterate through all CheckedIndices and create a Query.EQ(“loggerName”, value) condition for every checked name in the UI, then I can combine all these condition with Query.Or() to produce a single IMongoQuery that is added to the main list**.

After you have the query you can use to retrieve records.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var cursor = collection.Find(finalQuery);
Int32 limit;
if (!Int32.TryParse(txtLogNum.Text, out limit))
{
    limit = 50;
}
cursor.SetFields("level", "loggerName", "message", "exception", "customproperties", "timestamp");
cursor.SetSortOrder(SortBy.Descending("timestamp"));
cursor.Limit = limit;

{{< / highlight >}}

Finally the method  **MongoCollection.Find()** returns a cursor that actually does not contains any data,  you can now add Sorting, pagination and specify all the properties you want to return directly on the curso, and when you iterate through all element with a foreach data will be retrieved from the database. This is really similar to a LINQ query, where no data is retrieved if you call Where(), Select() etc, but only when you iterate the query or you call a not deferred operator like List().

With this simple code I’m able to build a simple form to have a quick visualization of all the logs stored inside a Mongo Database even if the appender store untyped objects.

Gian Maria.
