---
title: "A generic IComparerT that works with reflection"
description: ""
date: 2007-07-02T06:00:37+02:00
draft: false
tags: [Languages,Nhibernate]
categories: [Languages,Nhibernate]
---
Today I was speaking with a colleague about creating a generic IComparer&lt;T&gt; that is able to compare two object based on a property discovered through reflection. Such object will be very useful to sort or find object inside collection of objects when you work with a domain model. In a domain we usually have a lot of objects such as customer, order, and so on, and it happens to have an homogeneous collection of objects in memory that needs to be sorted. Implementing an IComparer object for each combination of property and type is really boring so it useful to create a class capable to compare object based on reflection. A first implementation of the IComparer&lt;T&gt;::Compare() method could be the following

publicint  Compare(T  x,  T  y)  {  
      PropertyInfo  propertyInfo  =  typeof(T).GetProperty(SortColumn);  
IComparable  obj1  =  (IComparable)propertyInfo.GetValue(x,  null);  
IComparable  obj2  =  (IComparable)propertyInfo.GetValue(y,  null);  
return  (obj1.CompareTo(obj2));  
}

This implementation works as expected, but it has bad performance, this because it use reflection to find propertyInfo at each calls of the Compare() method. Since we are dealing with homogeneous collections I know in advance that the collection contains objects of a same type, so a better strategy is to cache the MethodInfo related to the GetterPart of the property into the constructor of the comparer object.

publicclassGenericIComparer&lt;T&gt;  :  IComparer&lt;T&gt;  {  
  
privatereadonlyMethodBase  methodInfo;  
  
internal  GenericIComparer(MethodBase  methodInfo,  Boolean  reversed)  {  
this.methodInfo  =  methodInfo;  
              mReversed  =  reversed;  
        }  
  
public  GenericIComparer(String  propname)  
              :  this(propname,  false)  {  
        }  
  
public  GenericIComparer(String  propname,  bool  mReversed)  :  
this(typeof(T).GetProperty(propname).GetGetMethod(),  mReversed)  {  }  
  
publicbool  Reversed  {  
get  {  return  mReversed;  }  
set  {  mReversed  =  value;  }  
        }  
privateBoolean  mReversed  =  false;  
  
        #region  IComparer&lt;T&gt;  Members  
  
publicint  Compare(T  x,  T  y)  {  
IComparable  obj1  =  (IComparable)methodInfo.Invoke(x,  null);  
IComparable  obj2  =  (IComparable)methodInfo.Invoke(y,  null);  
  
Int32  result  =  (obj1.CompareTo(obj2));  
return  mReversed  ?  -result  :  result;  
        }  
  
        #endregion  
  }

This version support a property called Reversed that is used to compare in reverse order. As you can see this class grab the methodInfo related to the getter part of the property in the constructor, to reduce calls to GetProperty() function. As you can see this class has an internal constructor that accepts a MethodBase passed from the caller, this is necessary to go a step further into the optimization, a factory class that optimize the creation of GenericIComparer objects.

publicstaticclassGenericComparerFactory  {  
  
privatereadonlystaticDictionary&lt;Type,  Dictionary&lt;String,  RuntimeMethodHandle&gt;&gt;  comparers  =  
newDictionary&lt;Type,  Dictionary&lt;string,  RuntimeMethodHandle&gt;&gt;();  
  
publicstaticGenericIComparer&lt;T&gt;  GetComparer&lt;T&gt;(string  propertyName,  bool  reversed)  {  
//Check  if  the  type  array  for  this  comparer  was  created.  
if  (!comparers.ContainsKey(typeof(T)))  
                    comparers.Add(typeof(T),  newDictionary&lt;string,  RuntimeMethodHandle&gt;());  
if  (!comparers[typeof(T)].ContainsKey(propertyName))  
                    comparers[typeof(T)].Add(  
                          propertyName,    
typeof(T).GetProperty(propertyName).GetGetMethod().MethodHandle);  
return  (GenericIComparer&lt;T&gt;)  newGenericIComparer&lt;T&gt;(    
MethodInfo.GetMethodFromHandle(comparers[typeof(T)][propertyName]),  reversed);  
        }  
  
publicstaticGenericIComparer&lt;T&gt;  GetComparer&lt;T&gt;(string  propertyName)  {  
return  GetComparer&lt;T&gt;(propertyName);  
  
        }  
  }

This class hold a dictionary of propertyName, RuntimeMethodHandle objects for each type. The RuntimeMethodHandle is a further optimization to save memory used to store MethodInfo objects. A MethodInfo object is a big object to store into memory, so it has a readonly property called *MethodHandle* that will return a IntPtr that uniquely identify that method info. The GenericComparerFactory can reduce the use of the memory, storing into the dictionary a IntPtr object, and recreating the MethodInfo object with the GetMethodFromHandle() function of the MethodInfo object only when it is necessary. With these optimization the GenericIComparer has a small memory footprint and maximum performance.

Alk.
