---
title: "Object does not match target type"
description: ""
date: 2007-07-02T04:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
This error (Object does not match target type) sometimes happens when you bind a GridView to a list of object returned from a nhibernate Query. It is generated when the first object of the list is a Nhibernate proxy, and it is due to the fact that the GridView uses reflection to inspect the list of objects stored in his datasource to find propertyInfo suitable to access property values of the objects in the list

Suppose that you have a code path like this

ISession  ss  =  SessionHelper.GetSession();  
NorthwindTest.Entities.Customer  c  =  ss.Load&lt;NorthwindTest.Entities.Customer&gt;(“ALFKI”);  
ICriteria  criteria  =  ss.CreateCriteria(typeof  (NorthwindTest.Entities.Customer));  
IList&lt;NorthwindTest.Entities.Customer&gt;  result  =  criteria.List&lt;NorthwindTest.Entities.Customer&gt;();  
GridView1.DataSource  =  SafeList(result);  
GridView1.DataBind();

If the object NorthwindTest.Entities.Customer has support for Lazy load (Lazy=”true” in the mapping) then the second line of the snippet above load a proxy from database, since ISession.Load() loads a proxy of the object and not the real object. Since this is the first object on the list, the gridview inspect the nhibernate proxy to get all the propertyinfo objects he needs to do the binding. Now we have a problem, because when the grid bind the second line it tries to use the propertyInfo of a derived class on a base class, thus generating the error Object does not match target type”.

The solution is really simple, if the object support the ICloneable interface you can use this function.

publicIList&lt;T&gt;  SafeList&lt;T&gt;(IList&lt;T&gt;  input)  where  T  :  class,  ICloneable  {  
//Symply  check  the  type  of  the  first  element.  
if  (input.Count  &gt;  0)  input[0]  =  (T)  input[0].Clone();  
return  input;  
}

It simply check if the list has at least one element, and then clone the first element, this make a clone of the Proxy, since the proxy does not redefine the clone() method, actually cloning a proxy return a reference to a base class.

Alk.
