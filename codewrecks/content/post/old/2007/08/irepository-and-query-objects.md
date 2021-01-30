---
title: "IRepositoryT and query objects"
description: ""
date: 2007-08-05T22:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
When you use a generic Interface for repository pattern there is always the problem of Query object. If you use nhibernate you can use Criteria API, but if you want to make your code not dependent by the ORM used, you often need to implement your Criteria Query. The most annoying problem with this approach is duplication of code, this because  you usually create your query object and the concrete repository must translate from the Custom Query Object to the query object supported by the ORM framework.

A different approach is possible if you define such an Interface:

publicinterfaceIQueryBuilder  {  
IQueryBuilder  Equal(String  propertyName,  object  value);  
IQueryBuilder  LessThan(String  propertyName,  object  value);  
IQueryBuilder  Greater(String  propertyName,  object  value);  
}

This is only an example, the real interface should expose all supported criterion. Now we create the concrete QueryBuilder, for example a Nhibernate repository.

publicclassQueryBuilder&lt;T&gt;  :  IQueryBuilder  {  
  
privateICriteria  \_criteria;  
  
public  QueryBuilder(ISession  \_session)  {  
        \_criteria  =  \_session.CreateCriteria(typeof  (T));  
  }  
  
internalIList&lt;T&gt;  Execute()  {  
IList&lt;T&gt;  result  =  \_criteria.List&lt;T&gt;();  
return  result;  
  }  
  
  #region  IQueryBuilder  Members  
  
publicIQueryBuilder  Equal(String  propertyName,  object  value)  {  
        \_criteria.Add(Expression.Eq(propertyName,  value));  
returnthis;  
  }  
  
publicIQueryBuilder  LessThan(String  propertyName,  object  value)  {  
        \_criteria.Add(Expression.Lt(propertyName,  value));  
returnthis;  
  }  
  
publicIQueryBuilder  Greater(String  propertyName,  object  value)  {  
        \_criteria.Add(Expression.Gt(propertyName,  value));  
returnthis;  
  }  
  
  #endregion  
}

As you can see the implementation is straightforward, you only delegate all the work to the real Criteria object, no intermediate custom Query Object is necessary, here is the function of the Generic repository:

publicIList&lt;T&gt;  GetByQuery(Proc&lt;IQueryBuilder&gt;  configurator)  {  
QueryBuilder&lt;T&gt;  qb  =  newQueryBuilder&lt;T&gt;(\_session);  
  configurator(qb);  
return  qb.Execute();  
}

The trick is to use delegate. GetByQuery() method of the generic repository does not accept a query object, instead he need a function that is able to configure a query object through the IQueryBuilder interface, only three lines of code. The caller code is very concise too:

IList&lt;Customer&gt;  AllCustomers  =  \_customerRepo.GetByQuery(  
delegate(IQueryBuilder  qb)  {  
        qb.Equal(“AddressInfo.City”,  cityname);  
  });

As you can see with anonymous delegate configuring a query is really a breeze. But the best thing of the whole stuff is the ability to test with mock object.

IRepository&lt;Customer&gt;  mockrepo  =  mockery.CreateMock&lt;IRepository&lt;Customer&gt;&gt;();  
IQueryBuilder  querybuilder  =  mockery.CreateMock&lt;IQueryBuilder&gt;();  
…  
Expect.Call(querybuilder.Equal(“AddressInfo.City”,  “ROME”))  
 .Return(querybuilder);  
Expect.Call(mockrepo.GetByQuery(null))  
 .Constraints(newPredicateConstraint&lt;Proc&lt;IQueryBuilder&gt;&gt;(  
delegate    (Proc&lt;IQueryBuilder&gt;  builder)  {  
        builder(querybuilder);  
returntrue;  
  }))  
 .Return(Ret);

As you can see you can create the repository and the querybuilder with rhino mock, and you can first set the expectation on the IQueryBulder mock, then with PredicateConstraint you can set up your anonymous delegate used to call the delegate passed by the code under test. With this technique you can not only simulate the repository, but also you can check that the code under test configures the query correctly. The major problem with criteria API is that properties of the object are passed as string, with this technique you can check easily that all properties are spelled correctly.

Alk.
