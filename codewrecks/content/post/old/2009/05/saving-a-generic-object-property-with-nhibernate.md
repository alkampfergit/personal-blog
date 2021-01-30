---
title: "Saving a generic Object property with nhibernate"
description: ""
date: 2009-05-21T23:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
In a [old post](http://www.codewrecks.com/blog/index.php/2009/05/14/use-xml-field-in-sqlserver-with-nhibernate/) I explained how to save an object in XML format in database with a UserType. Since this technique worked well I decided to use it in another situation. Now I have an object that have a property of type Object, and I want to be able to save xml serialiation of it into database.

First of all I decided that it is better to use two columns, one will store the xml serialization, while the other will contain type name of the object, so I build a simple ICompositeUserType

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public class XmlSerializedObject : ICompositeUserType 
{
    #region Equals member

    bool ICompositeUserType.Equals(object x, object y)
    {
        return (x == y) || ((x != null) && x.Equals(y));
    }

    #endregion

    #region ICompositeUserType Members

    public object Assemble(object cached, NHibernate.Engine.ISessionImplementor session, object owner)
    {
        return cached;
    }

    public object DeepCopy(object value)
    {
        if (value == null) return null;
        if (value is ICloneable) return ((ICloneable) value).Clone();
        throw new NotSupportedException(
            String.Format(
                "You can use XmlSerializedObject only to serialize ICloneable objects. Type {0} does not support ICloneable",
                value.GetType()));
    }

    public object Disassemble(object value, NHibernate.Engine.ISessionImplementor session)
    {
        return value;
    }

    public int GetHashCode(object x)
    {
        return x.GetHashCode();
    }

    public object GetPropertyValue(object component, int property)
    {
        //0 is the object and 1 is the type.
        if (property == 0) return component;
        return component.GetType().FullName;
    }

    public bool IsMutable
    {
        get { return true; }
    }

    public object NullSafeGet(System.Data.IDataReader dr, string[] names, NHibernate.Engine.ISessionImplementor session, object owner)
    {
        if (dr == null) return null;
        if (dr.IsDBNull(dr.GetOrdinal(names[0]))) return null;

        String serializedData = (String) dr[names[0]];
        Type serializedType = Type.GetType((String)dr[names[1]]);
        return XmlHelper.FromXml(serializedData, serializedType);
    }

    public void NullSafeSet(System.Data.IDbCommand cmd, object value, int index, NHibernate.Engine.ISessionImplementor session)
    {
        if (value == null || value == DBNull.Value)
        {
            NHibernateUtil.String.NullSafeSet(cmd, null, index, session);
            NHibernateUtil.String.NullSafeSet(cmd, null, index + 1, session);
        }
        else
        {

            String typeName = TypeUtils.GetTypeNameAssemblyQualified(value);
            NHibernateUtil.String.NullSafeSet(cmd, XmlHelper.ToXml(value), index, session);
            NHibernateUtil.String.NullSafeSet(cmd, typeName, index + 1, session);
        }
    }

    public string[] PropertyNames
    {
        get { return new []{"XmlData", "Type"}; }
    }

    public NHibernate.Type.IType[] PropertyTypes
    {
        get { return new [] {NHibernateUtil.String, NHibernateUtil.String}; }
    }

    public object Replace(object original, object target, NHibernate.Engine.ISessionImplementor session, object owner)
    {
        return original;
    }

    public Type ReturnedClass
    {
        get { return typeof (Object); }
    }

    public void SetPropertyValue(object component, int property, object value)
    {
    }

    #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It works quite well, but it has some drawbacks. First of all since this property is mutable, the object must implement ICLoneable to create a copy of it. This fact has another implication, when the session flushes, NHibernate calls Equals to verify if actual instance is changed from the time it was loaded, now since the copy used to keep the original value is created with Clone, if the object does not implement equals, it would be always considered different from the copy in the cache, and it will be saved at each flush. To avoid this, all objects used in this property must implement equals.

The rest of the code is quite simple. This userType gives me great flexibility, moreover, since the database have mixed access stored+nhibernate, I used a Xml column in sql server, so Iâ€™m able to do XPath query in my stored.

Alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)
