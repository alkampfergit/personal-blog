---
title: "Use Xml field in SqlServer with nhibernate"
description: ""
date: 2009-05-14T07:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Xml fields in sql server are really useful, you can use xpath or xQuery to filter and impose condition on part of the xml fragment. Today we decided to store some data in an XML field of a table, and since this table was accessed both by nhibernate and both from T-Sql code, I begin to think on how to map this situation on NHibernate.

I immediately think to a usertype that is able to store data using XMLSerialization, here is the class, It took to me 10 minutes to create it,

{{< highlight sql "linenos=table,linenostart=1" >}}
public class XmlFieldUserType<T> : IUserType where T : ICloneable
{
    #region Equals member

    bool IUserType.Equals(object x, object y)
    {
        return (x == y) || ((x != null) && x.Equals(y));
    }

    #endregion

    #region IUserType Members

    public object Assemble(object cached, object owner)
    {
        return cached;
    }

    public object DeepCopy(object value)
    {
        if (value == null) return null;

        return ((T)value).Clone();
    }

    public object Disassemble(object value)
    {
        return value;
    }

    public int GetHashCode(object x)
    {
        return x.GetHashCode();
    }

    public bool IsMutable
    {
        get { return true; }
    }

    public object NullSafeGet(System.Data.IDataReader rs, string[] names, object owner)
    {
        Int32 index = rs.GetOrdinal(names[0]);
        if (rs.IsDBNull(index))
        {
            return null;
        }

        return XmlHelper.FromXml<T>((String)rs[index]);
    }

    public void NullSafeSet(System.Data.IDbCommand cmd, object value, int index)
    {
        if (value == null || value == DBNull.Value)
        {
            NHibernateUtil.String.NullSafeSet(cmd, null, index);
        }
        else
        {
            NHibernateUtil.String.Set(cmd, XmlHelper.ToXml(value), index);
        }

    }

    public object Replace(object original, object target, object owner)
    {
        return original;
    }

    public Type ReturnedType
    {
        get { return typeof(Uri); }
    }

    public NHibernate.SqlTypes.SqlType[] SqlTypes
    {
        get { return new SqlType[] { NHibernateUtil.String.SqlType }; }
    }

    #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I use a simple XmlHelper class that serialize to and from XML string, and thanks to this class writing the usertype is a breeze, since Xml serialization needs to know the type of the class you operate with, this user type is generic, here is a typical use.

{{< highlight xml "linenos=table,linenostart=1" >}}
<property name="DetailData"
          type="NHibernateExt.XmlFieldUserType`1[[MyProject.DetailData, MyProject]], NHibernateExt"
           column="link_detail" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the standard way to specify a class with generics. Now when I save the class here is the SQL generated.

{{< highlight sql "linenos=table,linenostart=1" >}}
INSERT INTO MyTable (link_url, link_sha256, link_target_id, link_details) VALUES (@p0, @p1, @p2, @p3); select SCOPE_IDENTITY(); @p0 = 'http://www.nablasoft.com', @p1 = 'BD827105DDFBEE299C04B461A322FFC21A1CC919D2FDB5A3E1CCC78B3D3BF93F', @p2 = '0', @p3 = '<DetailData
  UserName="Alkampfer"
  Title="Nablasoft HomePAge"
  Description="Not avaliable"
  Category="MySite">
  <Tags>one</Tags>
  <Tags>two</Tags>
  <Tags>three</Tags>
</DetailData>'{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now I can simply use the DetailData property of the class, working with a full object, but when the object gets saved, the DetailData property is simply serialized into an xml stream.

alk.

Tags: [nhibernate](http://technorati.com/tag/nhibernate) [Xml Serialization](http://technorati.com/tag/Xml%20Serialization)
