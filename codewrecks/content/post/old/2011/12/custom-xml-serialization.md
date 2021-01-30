---
title: "Custom XML Serialization"
description: ""
date: 2011-12-01T08:00:37+02:00
draft: false
tags: [Nhibernate,NoSql,Sql Server]
categories: [Nhibernate]
---
Another advantage of sto[ring properties of entities into a state object](http://www.codewrecks.com/blog/index.php/2011/06/13/leverage-the-concept-of-state-of-your-entities/) based on a Dictionary, is the ability to easily serialize objects in custom formats. As an example I create an XML serializer that is capable to serialize an entity in a custom XML format.

I used this simple serializer to create a NHibernate User Type that permits me to save a child entity in a single XML column of SQL Server, a feature useful when you need to save objects which schema changes quite often and you do not want to keep database schema updated, or you need to store dynamic data into the DB. I now that all of you are screaming “USE NO SQL DB”, like [Raven](http://ravendb.net/), but it is not simple to introduce new technologies into existing projects, and only to justify the need to save the 2% of objects.

Thanks to the custom serializer and the ability to do [DeepCloning](http://www.codewrecks.com/blog/index.php/2011/11/29/using-a-state-object-to-store-object-property-values/), writing such a User Type is really simple. First of all, I’ve implemented a method called EquivalentTo that permits me to compare two entities based on their state, this makes trivial writing the Equals Method of the UserType

{{< highlight csharp "linenos=table,linenostart=1" >}}
bool IUserType.Equals(object x, object y)
{
if (ReferenceEquals(x, y)) return true;
if (x == null || y == null) return false;
 
if (x is BaseEntity)
return ((BaseEntity)x).IsEquivalentTo(y as BaseEntity);
 
return x.Equals(y);
}
{{< / highlight >}}

Same consideration for the IUserType.DeepCopy method, based on the Clone method of the base class. Saving and loading the object is just a matter of using the BaseEntity serialization methods.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public object NullSafeGet(System.Data.IDataReader rs, string[] names, object owner)
{
Int32 index = rs.GetOrdinal(names[0]);
if (rs.IsDBNull(index))
{
return null;
}
String databaseContent = (String)rs[index];
return Deserialize(databaseContent);
 
}
 
internal Object Deserialize(String content)
{
XElement element =  XElement.Parse(content);
return element.DeserializeToBaseEntity();
}
 
public void NullSafeSet(System.Data.IDbCommand cmd, object value, int index)
{
if (value == null || value == DBNull.Value)
{
NHibernateUtil.String.NullSafeSet(cmd, null, index);
}
else
{
NHibernateUtil.String.Set(cmd, Serialize(value), index);
}
 
}
 
internal String Serialize(Object obj)
{
if (!(obj is BaseEntity))
throw new ArgumentException("Only BaseEntity based entities could be serialized with this usertype", "obj");
return (obj as BaseEntity).SerializeToXml().ToString();
}
{{< / highlight >}}

The advantage of this approach, is that I have another base entity class called BaseExpandoEntity that permits to store into state object property by name, it is like a dynamic object, but I used it in.NET 3.5 where dynamics still does not exists. This kind of entity is clearly not really OOP, it is not well encapsulated, because you can set property of any name from external code and it is used mainly as a DataClass, just to store information in database without the need to be schema or class bounded. Now suppose to have a class called Father that has a property of type SpecificNotes, based on this BaseExpandoEntity and saved in database with the above User Type, you can write this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Father d1 = new Father () {...};
d1.SpecificNotes.SetProperty("Ciao", "mondo");
d1.SpecificNotes.SetProperty("Age", 80);
Repository.Father.Save(d1);
{{< / highlight >}}

In the above code, the Father class has a property called SpecificNotes mapped as XML in database, I can store two new properties with the SetProperty and this is what is saved to database.

{{< highlight csharp "linenos=table,linenostart=1" >}}
INSERT INTO Father
(Id,
xxx,
yyy,
SpecificNotes)
VALUES      (1,
...,
...,
<SpecificNotes fname="Myproject.Entities.SpecificNotes, Myproject.Entities" ><Ciao>mondo</Ciao>
<Age type="System.Int32">80</Age></SpecificNotes>' )
{{< / highlight >}}

Now suppose you want to retrieve from the database all Father objects that have a SpecificNote with a  property named *Ciao* with value ‘*mondo’*, how could you issue the query since the object is stored as XML? The solution is creating a custom Criteria Operator. I do not want to bother you with the details, but the key method is something like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
public override NHibernate.SqlCommand.SqlString ToSqlString(
NHibernate.ICriteria criteria,
ICriteriaQuery criteriaQuery,
IDictionary<string, NHibernate.IFilter> enabledFilters)
{
string objectPropertyColumnName = criteriaQuery
.GetColumnsUsingProjection(criteria, PropertyName)[0];
 
StringBuilder criteriaText = new StringBuilder();
criteriaText.Append(objectPropertyColumnName);
criteriaText.Append(".value('(/*/");
criteriaText.Append(XmlCriterionParameters.ChildPropertyName);
criteriaText.Append(")[1]', 'nvarchar(max)')");
switch (XmlCriterionParameters.CriteriaOperator)
{
case CriteriaOperator.Equal:
criteriaText.Append("=");
break;
case CriteriaOperator.Like:
criteriaText.Append(" like ");
break;
default :
throw new NotSupportedException("Still not supported operator");
}
 
criteriaText.AppendFormat("'{0}'", Value);
return new SqlString(criteriaText.ToString());
 
}
{{< / highlight >}}

In this example I’ve implemented only “=” and “like” operators, but it is enough for this sample. Now I can issue the following query.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Query query = Query.CreateXml("SpecificNotes", "Ciao", CriteriaOperator.Equal, "mondo");
var result = Repository.Father.GetByCriteria(query);
{{< / highlight >}}

This snippet used a Query Model to specify the query, but as you can see the important aspect is that I’m able to create an XML criterion on the “SpecificNotes” sub object, where the expando property “Ciao” is Equal to the value “mondo”. Here is the query that was issued to the DB

{{< highlight csharp "linenos=table,linenostart=1" >}}
SELECT...
FROM   Father this_
WHERE  this_.SpecificNotes.value('(/*/Ciao)[1]', 'nvarchar(max)') = 'mondo'
{{< / highlight >}}

This is quite a primitive query, because of the /\*/ that basically mean I’m searching for a property Ciao contained in any subobject, but you can modify your Custom Criterion to adapt the XPath to your need; the important aspect is that I’m now able to store and retrieve transparently my expando objects from a standard SQL server thanks to the great flexibility of NHibernate.

Gian Maria.
