---
title: "Today Menu NHibernate User Type"
description: ""
date: 2008-05-30T07:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Ok, today I faced a really simple problem, I have a domain class with a property of type uri, that seems to be not natively supported by NHibernate. Whenever you face a problem of this type the solution is IUserType, [here is the full file](http://www.codewrecks.com/blog/storage/uriusertype.zip), it is so simple to write a user type that I really does not check with google, after I write my class I found that other people had already created it, but it is worth to take a look to some particular piece of code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public object NullSafeGet(System.Data.IDataReader rs, string[] names, object owner)
{
    Int32 index = rs.GetOrdinal(names[0]);
    if (rs.IsDBNull(index))
    {
        return null;
    }
    try
    {
        return new Uri(rs[index].ToString());
    }
    catch (FormatException)
    {
        //The uri is malformed, maybe it is worth to doing something else.
        return null;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The NullSafeGet is called to retrieve the value from database columns in a null safe way, first of all get the index of the data into resultset, then check if it is null, (if is null return null is ok) then if some data is contained into the resultset you can try to create the uri trapping the FormatException. If you prefer you can call Uri.TryCreate that probably is a better solution respect trapping the exception :D

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public void NullSafeSet(System.Data.IDbCommand cmd, object value, int index)
{
    if (value == null || value == DBNull.Value)
    {
        NHibernateUtil.String.NullSafeSet(cmd, null, index);
    }
    Uri uri = (Uri)value;
    NHibernateUtil.String.Set(cmd, uri.AbsoluteUri, index);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The NullSafeSet has the duty to transform data from the original.net type (Uri) to something that can be stored in database, since I need to work only with AbsoluteUri, I store into the database the AbsoluteUri value or the Uri. Then we need to tell nhibernate the types involved

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Type ReturnedType
{
    get { return typeof(Uri); }
}

public NHibernate.SqlTypes.SqlType[] SqlTypes
{
    get { return new SqlType[] { NHibernateUtil.String.SqlType }; }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The ReturnedType tells nhibernate the.Net type handled by this UserType, the SqlTypes is used to tell nhibernate the structure of the data in the table, in this example a string is sufficient to store the AbsoluteUri and so I returned an array with only a string type.

alk.

Tags: [NHibernate UserType](http://technorati.com/tag/NHibernate%20UserType) [Uri and NHibernate](http://technorati.com/tag/Uri%20and%20NHibernate)

<!--dotnetkickit-->
