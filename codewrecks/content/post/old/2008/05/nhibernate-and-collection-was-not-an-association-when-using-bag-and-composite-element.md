---
title: "NHIbernate and quotcollection was not an associationquot when using bag and composite-element"
description: ""
date: 2008-05-20T05:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Look at this mapping

{{< highlight xml "linenos=table,linenostart=1" >}}
<bag name="searchDefinition" access="field" cascade="all-delete-orphan" table="RawSearchDefinition" fetch="join">
    <key column="ParentObjectId" />
    <composite-element class="RawSearchDefinition">
        <property name="ExcludeKeyword" column="raws_excludeKeyword" type="String" />
        <property name="IncludeKeyword" column="raws_includeKeyword" type="String" />
    </composite-element>
</bag>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It seems ok but it has a subtle error, when you try to save the object,  a “*collection was not an association*” error will arise. This error is derived from the cascade=”all-delete-orphan”, this attribute is used for real entity object not value ones. A mapping with composite element does not need cascade, the RawSearchDefinition is a value object, its lifecycle will span that of the owner.

The solution is simply to remove cascade attribute, that is not required.

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)

<!--dotnetkickit-->
