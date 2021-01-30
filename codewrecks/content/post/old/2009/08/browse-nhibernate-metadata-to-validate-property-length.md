---
title: "Browse NHibernate metadata to validate property Length"
description: ""
date: 2009-08-23T10:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
One of the most basic validation rule for Entities that are stored in databases, is to be sure that String Properties are not too long for the corresponding field in database. There are a lot of validation framework over there, most of them using attributes to specify constraints on properties or fields, but what happens if someone changes a mapping setting a different length for a field?

Iâ€™m a great fan of database generation with NHibernate, so here is a typical mapping of mine.

{{< highlight xml "linenos=table,linenostart=1" >}}
<hibernate-mapping xmlns="urn:nhibernate-mapping-2.2"
                         assembly="DotNetMarche.Validator.Tests"
                         namespace="DotNetMarche.Validator.Tests.Extras.NHibernate">

    <class name="EntityBase" table="EntityBase" lazy="false">
        <id name="Id" column="id" type="System.Int32" unsaved-value="0">
            <generator class="native" />
        </id>

        <property name="MyName" column="code" type="System.String" length="50"/>
        <property name="AnotherProperty" column="name" type="System.String"/>
    </class>

</hibernate-mapping>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a class for unit testing a specific routine, it has a property called MyName that have length specified in the mapping, now I want to create a Validator that is able to automatically create rules from the mapping. The goal is automatically find maximum string length from mapping, thus avoiding the extra work to create attributes for each property, and moreover if you change the mapping, the rule changes accordingly. Here is a routing that does this.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static Core.Validator GetValidatorFromSession(ISessionFactory sessionFactory)
{
    var allDefindedClasses = sessionFactory.GetAllClassMetadata();
    Core.Validator validator = new Core.Validator();
    foreach (KeyValuePair<string, IClassMetadata> pair in allDefindedClasses)
    {
        IClassMetadata metadata = pair.Value;
        foreach (string propertyName in metadata.PropertyNames)
        {
            IType propertyType = metadata.GetPropertyType(propertyName);
            StringType st = propertyType as StringType;
            if (st != null)
            {
                if (st.SqlType.Length > 0)
                {
                    validator.AddRule(Rule.For(metadata.GetMappedClass(EntityMode.Poco))
                       .OnMember(propertyName)
                         .MaxLength(st.SqlType.Length)
                         .Message(String.Format(
                                "Property {0} have a maximum length of {1}", 
                                    propertyName,
                                      st.SqlType.Length)));
                }
            }
        }
    }
    return validator;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to IClassMetadata class exposed from Nhibernate, we can inspect the content of mapping browsing nhibernate object model in memory. In this situation I iterate for each mapped class, then for each property I check if it is a String property and look for maximum length. If it is different from zero it means that there is some maximum length specified in the mapping, so I create a corresponding rule. This simple code makes this test pass.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Core.Validator validator = ValidatorFromMetadata.GetValidatorFromSession(Factory);
EntityBase eb = new EntityBase() {MyName = new string('X', 51)};
ValidationResult res = validator.ValidateObject(eb);
Assert.That(res.Success, Is.False);
Assert.That(res.ErrorMessages[0], Is.EqualTo("Property MyName have a maximum length of 50"));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This verifies that the validator reflects rules contained in nhibernate mappings.

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [Validation](http://technorati.com/tag/Validation)
