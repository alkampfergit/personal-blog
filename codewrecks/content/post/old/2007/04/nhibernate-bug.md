---
title: "Nhibernate bug"
description: ""
date: 2007-04-26T10:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
I replicated a bug in nhibernate. I have a simple mapping for a simple class

{{< highlight sql "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-mapping 
    xmlns="urn:nhibernate-mapping-2.2" 
    namespace="Ca1"
    assembly="Ca1"
    default-lazy="false"
    default-access="property">

    <class name="Ca1.Cliente" table="Clienti" >
        <id name="Id" column="Id" type="int" unsaved-value="0">
            <generator class="identity" />
        </id>
        <property name="Nome" type="String"     column="Nome" insert="true" update="true" />
        <property name="Indirizzo" type="String" column="Indirizzo" not-null="false" insert="true" update="true" />
        <property name="LocalizedData" type="string" update="false"
                      formula='(SELECT ClientiLoc.loctext FROM ClientiLoc
                      WHERE ClientiLoc.clieid = Id and 
                                  ClientiLoc.lang = :CultureFilter.LangId)'/>
    </class>
</hibernate-mapping>{{< / highlight >}}

The only particular issue is that LocalizedData Property is a formula and takes data from another table that contains localized data, the current locale is specified as a filter. The problem originates from the following simple code

{{< highlight xml "linenos=table,linenostart=1" >}}
using (NHibernate.ISession session = Helpers.CreateSession()) {
    using (NHibernate.ITransaction tran = session.BeginTransaction()) {

        IFilter flt = session.EnableFilter("CultureFilter");
        flt.SetParameter("LangId", "it");
        ICriteria criteria = session.CreateCriteria(typeof(Ca1.Cliente));

        //criteria.Add(NHibernate.Expression.Expression.Like("Nome", "Gian%"));
        criteria.Add(NHibernate.Expression.Expression.Eq("LocalizedData", "loc_it"));
        criteria.Add(NHibernate.Expression.Expression.Like("Nome", "Gian%"));

        IList<Ca1.Cliente> result = criteria.List<Cliente>();
        Console.WriteLine("Retrieved {0} objects", result.Count);
    }
}{{< / highlight >}}

This code simply creates a criteria filter to select a *cliente*entity that has both the name like ‘Gian%’ and the localized italian version equal to “loc\_it”. All works well and the query generated intercepted by the sql profiler is.

{{< highlight sql "linenos=table,linenostart=1" >}}
exec sp_executesql N'SELECT this_.Id as Id0_0_, this_.Nome as Nome0_0_, this_.Indirizzo as Indirizzo0_0_, (SELECT ClientiLoc.loctext FROM ClientiLoc
                      WHERE ClientiLoc.clieid = this_.Id and 
                                  ClientiLoc.lang = @p0) as formula0_0_ FROM Clienti this_ WHERE (SELECT ClientiLoc.loctext FROM ClientiLoc
                      WHERE ClientiLoc.clieid = this_.Id and 
                                  ClientiLoc.lang = @p1) = @p2 and this_.Nome like @p3',
N'@p0 nvarchar(2),@p1 nvarchar(2),@p2 nvarchar(6),@p3 nvarchar(5)',@p0=N'it',@p1=N'it',@p2=N'loc_it',@p3=N'Gian%'
{{< / highlight >}}

The sql is quite messy, the query is OK but has a strange duplicated parameter ‘it’ even if I put only criteria for localized query. The real problem originates if the two criteria are inverted in order.

{{< highlight csharp "linenos=table,linenostart=1" >}}
criteria.Add(NHibernate.Expression.Expression.Like("Nome", "Gian%"));
criteria.Add(NHibernate.Expression.Expression.Eq("LocalizedData", "loc_it"));{{< / highlight >}}

This simple change breaks the query:

{{< highlight sql "linenos=table,linenostart=1" >}}
exec sp_executesql N'SELECT this_.Id as Id0_0_, this_.Nome as Nome0_0_, this_.Indirizzo as Indirizzo0_0_, (SELECT ClientiLoc.loctext FROM ClientiLoc
                      WHERE ClientiLoc.clieid = this_.Id and 
                                  ClientiLoc.lang = @p0) as formula0_0_ FROM Clienti this_ WHERE this_.Nome like @p1 and (SELECT ClientiLoc.loctext FROM ClientiLoc
                      WHERE ClientiLoc.clieid = this_.Id and 
                                  ClientiLoc.lang = @p2) = @p3',
N'@p0 nvarchar(2),@p1 nvarchar(2),@p2 nvarchar(5),@p3 nvarchar(6)',@p0=N'it',@p1=N'it',@p2=N'Gian%',@p3=N'loc_it'{{< / highlight >}}

Even is sql is quite messy you can notice that the parameters order is wrong. The second criteria ClientiLoc.lang = @p2 is wrong because @p2 parameter does not contain the ‘it’ value but the ‘Gian%’ value.

This problem happens every time I have a formula property that use a filter. To work correctly, every criteria on filter property must be the first criteria in the criteria collection.

Alk.
