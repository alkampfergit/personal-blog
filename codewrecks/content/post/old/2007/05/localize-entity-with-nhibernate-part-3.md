---
title: "Localizable Entities With Nhibernate Part 3"
description: ""
date: 2007-05-22T23:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Now that the Entity object works as expected the only issue remaining is the integration with NHibernate. First Step is creating mapping file to store the object in the database. Database structure is very simple, just a table for the Entity class plus another table for localized resources.

![](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2007/05/052307-0636-localizable1.png)

Against this database schema we can map the Entity class with this mapping file.

&lt;?xmlversion=“1.0“encoding=“utf-8“  ?&gt;  
&lt;hibernate-mappingxmlns=“urn:nhibernate-mapping-2.2“  
assembly=“Example1“  
namespace=“Example1“  
default-lazy=“false“&gt;  
  &lt;classname=“Entity“table=“Entity“&gt;  
        &lt;idname=“Id“unsaved-value=“0“&gt;  
              &lt;generatorclass=“native“  /&gt;  
        &lt;/id&gt;  
  
        &lt;propertyname=“SomeCode“column=“somecode“type=“Int32“  /&gt;  
        &lt;mapname=“Resources“table=“EntityResources“lazy=“false“fetch=“join“&gt;  
  
              &lt;keycolumn=“entityid“  /&gt;  
              &lt;composite-indexclass=“Registry.LangCode,  Registry“&gt;  
                    &lt;key-propertyname=“Code“column=“langcode“access=“property“  /&gt;  
              &lt;/composite-index&gt;  
  
              &lt;composite-elementclass=“EntityResources“&gt;  
                    &lt;propertyname=“Name“column=“name“  /&gt;  
                    &lt;propertyname=“Description“column=“description“  /&gt;  
              &lt;/composite-element&gt;  
        &lt;/map&gt;  
  &lt;/class&gt;  
&lt;/hibernate-mapping&gt;

Dictionary properties are mapped with the element &lt;map&gt; on the database table EntityResources, then we needs to specify the key tag that contains the foreign key, in our model the column *entityid*. Keys of the dictionary are instances of LangCode class, so we need to specify a &lt;composite-index&gt; tag with class attribute, inside the composite-index nhibernate we need to specify which columns of the table are used to build the key part of the dictionary with the element &lt;key-property&gt;. In this example the LangCode is composed only by language code, so it maps to the single column langcode. For the element we needs also to specify a &lt;composite-element&gt;, but now this class maps to the two column Name and Description of the table. This completes the mapping.

To conclude this tutorial it is interesting to show some HQL queries that can be used to manage this particular entity. A main disadvantage of this mapping scheme is that when we load a list of Entity objects used only to show data to the user, each instance of the Entity class will contains all resources for each language supported, this waste a lot of memory and also retrieve too much data from database. If we are sure that all the objects have resources for current language, and the current language will not change for the lifetime of the object, we can do a HQL query to retrieve only the resource for current language, this avoid to load localization data for language that will be not necessary.

from  Entity  as  E  left  join  fetch  E.Resources  as  res  where  INDEX(res)  =  ‘it’

This query uses the special syntax INDEX() that permits to specify criteria for the key of a dictionary. The purpose of this query is to retrieve all entities but only with the ‘it’ resource. The left join fetch is used to use an eager fetch strategy, if a simple join would be used, NHibernate would have done a first select to retrieve the entity list, and subsequently a single select for each entity to retrieve the resource corresponding to ‘it’ language.

As usual you can search inside the description or name property, but you must pay attention. A query like this

select  distinct  from  Entity  as  E  join  E.Resources  as  res  where  res.Description  like  ‘des%’

actually search for entities that have one of its localization resource with a value like des%. Suppose that an entity has two resources: the ‘it’ has Description property equal to “Descrizione” and ‘de’ has Description property equal to “Schilderung”. If current language is de and you run the previous query, the previous entity is returned, because it has the ‘it’ resource that satisfy the match, but when you show the Description property to screen it shows “Shilderung” because ‘de’ is the current language. This kind of experience can be frustrating for the user that really does not understand why this object had matched the filter. To avoid this problem the INDEX(res) = :langcode filter should be included for each query that does a filtering on localizable properties of the entity.

For those interested in performances, the previous HQL query produce this SQL (Captured with profiler)

select  distinct  entity0\_.Id  as  Id0\_,  entity0\_.somecode  as  somecode0\_

from  Entity  entity0\_  inner  join  EntityResources  resources1\_  on  entity0\_.Id=resources1\_.entityid

where  (resources1\_.description  like  ‘des%’)

As you can see the query is efficient because it join directly the two tables and does not suffer for the n-select problem. Please do not forget to use *select distinct* on HQL query because if it’s not specified and an entity has more than one resource that matches the filter, the query returns duplicate results.

I hope this little tutorial can help anyone that needs to use localizable entities with NHibernate.

Alk.

[Localizable entities with Nhibernate Part 1](http://www.nablasoft.com/Alkampfer/?p=41)

[Localizable entities with Nhibernate Part 2](http://www.nablasoft.com/Alkampfer/?p=42)

[Example Code](http://www.nablasoft.com/files/localization.7z).
