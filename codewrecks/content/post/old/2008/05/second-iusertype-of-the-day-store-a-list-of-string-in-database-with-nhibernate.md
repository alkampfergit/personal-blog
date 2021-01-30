---
title: "Second IUserType of the day 8211 Store a list of string in database with NHIbernate"
description: ""
date: 2008-05-30T07:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
I have an object that has 4 properties of IList&lt;String&gt; type. You can natively map these properties in a separate table with this simple mapping

{{< highlight xml "linenos=table,linenostart=1" >}}
<bag name="keys" access="field" cascade="all-delete-orphan" table="Keys" fetch="join">
    <key column="deps_id" />
    <element column="deps_key" type="String" />
</bag>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok, this is a simple mapping that store all the keys into another table with two columns, one is the foreign key to the main object, the other is a string column to store the data. But a similar mapping does not satisfy me, because I need to create 4 more table to store string coming from my 4 IList&lt;String&gt; properties…too bad.

The solution is…again….IUserType. The solution is store the strings in a single column, combining the strings in one with a separator that does not happens to be part of any string, as an example, if the collection contains (“Key1”, “Key2”) I want to be stored as “Key1#Key2”, here is the get part of the usertype

{{< highlight xml "linenos=table,linenostart=1" >}}
public object NullSafeGet(System.Data.IDataReader rs, string[] names, object owner)
{
    List<String> result = new List<String>();
    Int32 index = rs.GetOrdinal(names[0]);
    if (rs.IsDBNull(index) || String.IsNullOrEmpty((String) rs[index]))
        return result;
    foreach (String s in ((String)rs[index]).Split(cStringSeparator))
        result.Add(s);
    return result;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If the data in database is null, or is an empty string I return an empty List&lt;String&gt;, but if the data is not empty I split the string with the separator, and then add each single string in the list. The set part is similar

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public void NullSafeSet(System.Data.IDbCommand cmd, object value, int index)
{
    if (value == null || value == DBNull.Value)
    {
        NHibernateUtil.String.NullSafeSet(cmd, null, index);
    }
    IEnumerable<String> stringList = (IEnumerable<String>) value;
    StringBuilder sb = new StringBuilder();
    foreach(String s in stringList) {
        sb.Append(s);
        sb.Append(cStringSeparator);
    }
    if (sb.Length > 0) sb.Length--;
    NHibernateUtil.String.Set(cmd, sb.ToString(), index);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If the value is null I set null value, if not I simply cast the original value as an IEnumerable&lt;String&gt;, that is sufficient for me to enumerate all the string, store them in a StringBuilder, and finally remove the trailing separator and store the string in database. Here is a Test

{{< highlight csharp "linenos=table,linenostart=1" >}}
...
Domain d = new Domain();
d.BaseUri = new Uri("http://www.nablasoft.com");
d.ContentBlackList.Add("Key1");
d.ContentBlackList.Add("Key2");
...{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This piece of code produces this SQL

{{< highlight sql "linenos=table,linenostart=1" >}}
INSERT INTO Domain (doma_baseUrl, doma_contentBlackList, doma_Id) 
VALUES (@p0, @p1, @p2); 
@p0 = 'http://www.nablasoft.com/', @p1 = 'Key1#Key2', @p2 = '28857095-f642-4d11-875a-714eb35f0537'{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the [Uri is translated into a string](http://www.codewrecks.com/blog/index.php/2008/05/30/today-menu-nhibernate-user-type/) and the two keywords are combined into one, in this way I can store all the 4 properties in the same table, having a clearer structure of the database.

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [IUserType](http://technorati.com/tag/IUserType)

<!--dotnetkickit-->

<script type="text/javascript"><!--
digg_bodytext = 'I have an object that has 4 properties of IList&lt;String&gt; type. You can natively map these properties in a separate table with this simple mapping';
//--></script>  
<script src="http://digg.com/tools/diggthis.js" type="text/javascript"></script>
