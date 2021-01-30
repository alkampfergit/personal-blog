---
title: "BindingListFind and NotImplementedException"
description: ""
date: 2007-10-12T05:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
BindingList&lt;T&gt; is a great class to do binding to list of custom objects, it implements IBindingList for you, giving the ability to use the BindingList&lt;T&gt; as datasource for the BindingSource control. But when you cast the BindingList&lt;T&gt; to the IBindingList interface and try to call Find() Method you’ll get a NotImplementedException, how can it be possible?. The reason for this can be found [here](http://msdn2.microsoft.com/en-us/library/ms132695.aspx), but the real question is, it is possible to build a better BindingList that supports a generic Find() for properties of a business object?

The answer is “YES”, first of all you need a generic IComparer, and you can find a possible implementation on [this post of my blog](http://www.nablasoft.com/Alkampfer/?p=79), it is quite optimized to cache the runtimeMethodHandle avoiding the need of reflection each time you need an IComparer. With the generic IComparer implementing a better BindingList Is a breeze.

classNablaBindingList&lt;T&gt;  :  BindingList&lt;T&gt;  {  
  
protectedoverridebool  SupportsSearchingCore  {  
get  {  
returntrue;  
        }  
  }  
  
protectedoverrideint  FindCore(PropertyDescriptor  prop,  object  key)  {  
  
if  (key  is  T)  {  
GenericComparer&lt;T&gt;  comparer  =  GenericComparerFactory.GetComparer&lt;T&gt;(prop.Name,  false);  
for  (Int32  index  =  0;  index  &lt;  Items.Count;  ++index)  {  
if  (comparer.Compare(Items[index],  (T)  key)  ==  0)  
return  index;  
              }  
return  -1;  
        }  
thrownewNotSupportedException(“Cannot  compare  Apple  With  Orange”);  
  }  
}

Now I left to the reader the task to support Sorting :D

Alk.
