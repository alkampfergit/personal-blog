---
title: "Querying NHibernate user type with HQL or criteria"
description: ""
date: 2009-03-31T04:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Some time ago I posted a link about a [user type](http://www.codewrecks.com/blog/index.php/2008/10/21/some-details-on-older-post-about-usertype/) to store list of strings in a single database field. In a project of mine I have another usertype very similar, that stores list of integers into a single string database field in a # separated value, like #1#8#23# (note that the character # appears at the begin and the end of the string). Now Suppose you need to made some query on it like â€œselect all Domains where activeCustomerList is not empty and contains at least one id:

{{< highlight sql "linenos=table,linenostart=1" >}}
IList<Domain> res = session
.CreateQuery("from Domain D where D.ActiveCustomerList != \"\"")
.List<Domain>();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In HQL the criteria needs to be expressed in string format, so I simply check for domain where the ActiveCustomerList is not an empty string, if you need to use Criteria API the situation is little different.

{{< highlight xml "linenos=table,linenostart=1" >}}
IList<Domain> res = session.CreateCriteria(typeof(Domain))
  .Add(Restrictions.Not(
      Restrictions.Eq("ActiveCustomerList", new List<Int32>())))
     .List<Domain>();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With criteria API you need to specify that you want the field not to be equal to a real empty string of IntegerList. This happens because the Criteria API works on the model on the entity, so if the property is of type List&lt;Int32&gt; for an equality operator it need to compare it with the result of applying the UserType to the Empty Integer List. In HQL you can also express some interesting query, as for example â€œAll domains that contains and active customer with ID 9â€

{{< highlight sql "linenos=table,linenostart=1" >}}
IList<Domain> res = session
.CreateQuery("from Domain D where D.ActiveCustomerList like '%#9#%'")
.List<Domain>();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is  a simple like operator, the only problem is that the % at the begin and the end of the like will makes any index ineffective, so the query can be slow for a high number of record. Doing this with Criteria API is probably impossible because the Like Restriction accepts only strings, and we have no way to pass a sample object. Iâ€™ll keep investigating but for now Iâ€™m using the HQL version

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)
