---
title: "Nhibernate query only properties and many-to-one"
description: ""
date: 2010-08-11T09:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
{{< highlight csharp "linenos=table,linenostart=1" >}}
 
{{< / highlight >}}

If you does not know Query only properties of NHibernate you better take a look to [this post](http://ayende.com/Blog/archive/2009/06/10/nhibernate-ndash-query-only-properties.aspx), I must admit that they are really useful to make simpler query without changing the object model. Iâ€™ve this object model

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image2.png)

This is how the domain was build, we decided to set a IList&lt;DomainRegistrations&gt; in the NickName class, and make this relation unidirectional. Now I need to issue a query to recover only Id and Url of all NickNameDomainRegistration object belonging to a certain NickName.

The obvious solution is, Load the NickName fetching NickNameDomainRegistration, then grab the information you need. But I do not like this approach, because the Note field can be really long, and I do not want fetching unnecessary data from database. Moreover I have index on database on Id, Url, and the foreign key to nick name, so I really want to issue a projection that only query those fields. The structure of the project is based on ICriteria for issuing query, and I want a simple way to express the query. Thanks to Query only properties I can add this line to the mapping of NickNameDomainRegistration

{{< highlight csharp "linenos=table,linenostart=1" >}}
<many-to-one name="NickName" access="none" class="NickName" column="budr_buniId" />
 
{{< / highlight >}}

Thanks to the access=â€noneâ€ I can tell nhibernate that NickNameDomainRegistration has a property of type NickName even if the POCO object does not have it. Now I can issue a query for NickNameDomainRegistration with a  condition of â€œNickName.Id == idâ€. Everything works fine, but running the whole set of unit test I noticed that some other test has failed.

Examining the tests, I found that association to NickNameDomainRegistration is no more saved into the database. This is due to the fact, that now nhibernate think that the relation should be managed from the &lt;many-to-one&gt; part, even if the &lt;set&gt; in NickName is mapped as Inverse=â€trueâ€

The solution is changing the mapping, telling nhibernate that we really do not want the query only property to be used in insertion and update of the relation.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<many-to-one name="NickName" access="none" class="NickName" column="budr_buniId"
update="false" insert="false"  />
{{< / highlight >}}

Now all of my tests passes again, and I look at generated query with [NHProfiler](http://nhprof.com/).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image3.png "image")](http://nhprof.com/)

Iâ€™m still having problem, because it issue a inner join on table BuzzNickName (the table that contains the NickName entity) that is unnecessary, because no field of NickName is nor needed nor used in the filter. To obtain a real good query you need to add another query only property with this definition.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<property name="NickNameId" access="none" column="budr_buniId" type="System.Guid"
insert="false" update="false" />
{{< / highlight >}}

Now I can use the NickName property if I need to filter for some property of NickName (ES, NickName.Name == â€œxxxâ€) but I use the NickNameId property to filter for owner NickName. This will produce the query.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image4.png "image")](http://nhprof.com/)

That is the query I want.

Alk.
