---
title: "Writing a Custom Criteria in Nhibernate"
description: ""
date: 2007-07-26T00:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
In the [preceding post](http://www.nablasoft.com/Alkampfer/?p=93) I showed you a simple class that store in database string or integer values, now I need to create a criteria to do searches in database. NHibernate Criteria API are really good and they are extendible, to create a new criteria simply create a class that inherits from AbstractCriterion. I need to create a Criteria that permits to specify an operator to use (lessthen, greater, equal, etc) specify the type of the data we want to search for, and the two properties of the entity that store respectively the RawData in string format or in integer format, and the type name of the data contained in database.

publicclassUntypedSearchCriteria  :  AbstractCriterion  {  
  
privateCriteriaOperator  mInnerOperator;  
privateobject  mOperatorValue;  
privateType  mRealObjType;  
privateString  mPropertyName;  
privateString  mTypePropertyName;

The five inner field of the criteria have the following meanings

- mInnerOperator: is a custom enum to specify the operator I want to use (lessthan, greaterthan, etc)
- mOperatorValue is the value of the comparison
- mRealObjType is the clr type of the data we want to search in database
- mPropertyName is the name of the property that store the raw data
- mTypePropertyName is the name of the property of the object that store the type description

The first Method to override is the * **GetTypedValues()** *used from Nhibernate to know type and value of the parameter of the query. The purpose of a Criteria is to generate a fragment of SQL code to perform the serach, all done without resort to a specific database syntax. The GetTypedValues() permits you to use parameter. To create my operator I need two parameter, the first is the value to check for, the other is the description of the type. If the user ask for LessThen 500 for a string field I need to create a SQL fragment like * **CAST (rawproperty AS INT) &gt; 500 and typename like ‘System.Int32%’** *. With such a condition we retrieve only the data of the current format that store values that satisfy my condition.

publicoverride  NHibernate.Engine.TypedValue[]  GetTypedValues(  
              NHibernate.ICriteria  criteria,    
              NHibernate.Expression.ICriteriaQuery  criteriaQuery)  {  
  
returnnewTypedValue[]  {  
newTypedValue(GetITypeFromCLRType(mRealObjType),  mOperatorValue),  
newTypedValue(NHibernateUtil.String,  mRealObjType.FullName  +  “%”)};  
        }

GetTypedValue() method needs to return an array of * **TypedValue** *object that is able to contain both the type and the value for a parameter. First of all I use an helper function to get the Nhibernate IType from the real type of the CLR, then I insert the parameter that filter for the object type.

privatestaticIType  GetITypeFromCLRType(Type  type)  {  
if  (type  ==  typeof(String))  
return  NHibernate.NHibernateUtil.String;  
elseif  (type  ==  typeof(Int32))  
return  NHibernate.NHibernateUtil.Int32;  
else  
thrownewArgumentException(“Cannot  handle  type  “  +  type.FullName);  
        }

That’s all for the parameter of the query, as you can see the NhibernateUtil cames to help because contains fields and method to obtain instance of concrete nhibernate type name. Now comes the fun part the building of the query, done overriding the method * **ToSqlString()** *, that must return a SqlString, an object of nhibernate that encapsulate the concept of a query.

1publicoverride  NHibernate.SqlCommand.SqlString  ToSqlString(  
    2        NHibernate.ICriteria  criteria,  
    3ICriteriaQuery  criteriaQuery,  
    4        System.Collections.IDictionary  context)  {  
    5  
    6//retrieve  with  projection  the  real  name  of  the  property.  
    7String[]  PropertyColumn  =  criteriaQuery.GetColumnsUsingProjection(criteria,  mPropertyName);  
    8String[]  resolvedTypeColumns  =  criteriaQuery.GetColumnsUsingProjection(criteria,  mTypePropertyName);  
    9Dialect  dialect  =  criteriaQuery.Factory.Dialect;  
  10ISQLFunction  cf  =  (ISQLFunction)  dialect.Functions[“cast”];  
  11  
  12String  conversionRendered  =  cf.Render(newobject[]  {  PropertyColumn[0],  GetSqlTypeFromCLRType(mRealObjType)  },  criteriaQuery.Factory);  
  13//Now  we  have  the  cast  operation  required.  
  14return  CreateQueryString(resolvedTypeColumns[0],  conversionRendered);  
  15  }

Lines 7 and 8 use the GetColumnsUsingProjection() method of the ICriteria object passed as a parameter from nhibernate, this method translate property and field name to the name of the column specified in the mappings since the SQL fragment we need to create must speak about real database columns. In line 9 I get a reference to current dialect, this is needed to perform a cast. When I need to search for integer field, since the rawdata column is of a string type I need to perform a cast, but cast operation could be different for different database engine, so I need to ask to the dialect to perform the cast for me, following the specification of the current database. Dialect object has a Functions property that is a Dictionary of String, ISQLfunction object, it contains a series of function supported from the database, since I want to do a Cast there is no surprise that I ask for dialect.Functions[“cast”]. When you have the instance of the ISQLFunction the method * **Render()** *permits you to render SQL fragment related to that function. The Render method accepts two parameters, the array of the real parameter needed to the function and a reference to the current ISessionImplementorFactory object used internally to the function. Cast function need two parameter, the column to cast and the type of the cast that must be specified with a string that nhibernate could convert to a SqlType, so I create another helper function.

privatestaticString  GetSqlTypeFromCLRType(Type  type)  {  
if  (type  ==  typeof(String))  
return“String(4000)”;  
elseif  (type  ==  typeof(Int32))  
return“Int32”;  
else  
thrownewArgumentException(“Cannot  handle  type  “  +  type.FullName);  
}

For the string I really could to no cast, but to keep code uniform I decide to cast even the string to a nvarchar(4000). Finally we must discuss the CreateQueryString method that really build the query.

privateSqlString  CreateQueryString(String  typePropertyColumn,  string  conversionRendered)  {  
SqlStringBuilder  sb  =  newSqlStringBuilder();  
  sb.Add(conversionRendered)  
       .Add(GetSqlOperator(mInnerOperator))  
       .AddParameter()  
       .Add(“  and  “)  
       .Add(typePropertyColumn)  
       .Add(“  like  “)  
       .AddParameter();  
return  sb.ToSqlString();  
}

As you can see the query is build with a * **SqlStringBuilder** *object, this is necessary because we used parameters in our query (remember the parameters in GetTypedValues?). To build the query we simply use the add and continue to add fragment of standard ANSI SQL code, when you need to insert a parameter simply call * **AddParameter()** *but remember to call it in the same logical order you return the parameter in GetTypedValues(). The function GetSqlOperator() is simply a translation of my operator enum in the real SQL comparison operator “&gt;”, “&lt;” etc.

Here you are, you have build a full functioning and Dialect aware Criteria Operator for nhibernate.

Alk.
