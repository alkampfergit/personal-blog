---
title: "The simpliest thing that could possibly work"
description: ""
date: 2007-07-25T10:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
I have a simple class in my domain to solve a particular problem, it must be able to store the value of a generic parameter, so it can contains actually everything. Without Domain Model and ORM the obvious solution can be a serialization in a ntext or a xml field in sql2005, but I really do not want to handle serialized field into the db from the beginning. For the first release of the project I need only to store String or Integer number in this class, so I decided to follow the principle of “*the simpliest thing that could possibly work*” , I was in the middle of a TDD session so I came out with a simple solution. My entity has two important fields

publicvirtualString  RawValue  {  
get  {  return  mRawValue;  }  
        }  
privateString  mRawValue  =  String.Empty;  
  
privateString  mActualContentType;

mActualContentType is the String representation of the type contained in the parameter (for this version can only be “System.String”, or “System.Int32”), this field is private because it must not be seen from external code. The real content is converted into a string, so the caller can access the RawValue property if needed, for example to show the content to a textbox for the end user to modity. To set/get values I use two methods: the first is used to set the value.

publicvirtualvoid  SetValue(object  value)  {  
TypeConverter  converter  =  TypeDescriptor.GetConverter(value);  
if  (converter  ==  null  ||!converter.CanConvertTo(typeof(String)))  {  
thrownewApplicationException(String.Format(“Type  T  does  not  implement  TypeConverter”,  value.GetType().FullName));  
    }  
    mRawValue  =  converter.ConvertToString(null,  System.Globalization.CultureInfo.InvariantCulture,  value);  
    mActualContentType  =  value.GetType().FullName  +  ‘,’  +  value.GetType().Assembly.GetName().Name;  
}

As you can see only types that support the TypeConverter conventions can be stored in the field, when the user set a value I simply populate the fields mRawValue and mActualContentType. The class has a couple of method called GetValue&lt;T&gt;, and GetValue() that permits the caller to retrieve the value of the parameter in a typed or untyped fashion. The mapping is straightforward , I simply map these two fields in two columns of nvarchar sql type.

&lt;propertyname=“mRawValue“column=“flda\_content“type=“string“access=“field“  /&gt;  
&lt;propertyname=“mActualContentType“access=“field“column=“flda\_fulltypename“type=“string“  /&gt;

Surely this probably is not the best solution, but is the simpliest thing that could possibly work for meâ€¦all went good until the requisite changed and I need to do query to retrieve parameters based on particular value. The situation is the following, I use Criteria Query through all the software so I’d like not to resort to HQL, and standard criteria does not work. The problem is that Nhibernate knows that mRawValue field is a string, so if I store the integer value 5 into the object, when it gets saved to database it become ‘5’, and I cannot use Criteria query to compare with integer values, I need to find the way to create a Criteria for Nhibernate to handle this situation, the solution in the next post. Stay Tuned.

Alk.
