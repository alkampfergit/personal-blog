---
title: "Overriding the Equals Method for object used as a key in hashtable"
description: ""
date: 2008-08-14T06:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
Overriding the Equals method is not a stuff for the fainted-hearts; it could seems absolutely a simple thing to do, but there are a lot of subtleties that had to be keep in mind.

Here is a typical implementation of Equals for a Customer entity made by [Resharper](http://www.jetbrains.com/resharper/) (R# permits you to define equals with a single click)

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    public class Customer : IEquatable<Customer>
{
    public String Name { get; set; }
    public String Surname { get; set; }

    public bool Equals(Customer obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return Equals(obj.Name, Name) && Equals(obj.Surname, Surname);
    }

    public override bool Equals(object obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (obj.GetType() != typeof (Customer)) return false;
        return Equals((Customer) obj);
    }

    public override int GetHashCode()
    {
        unchecked
        {
            return ((Name != null ? Name.GetHashCode() : 0)*397) ^ (Surname != null ? Surname.GetHashCode() : 0);
        }
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It seems really reasonable, is a standard implementation that uses the two properties of the Customer Object. The GetHashCode *must be also*overridden, because the rule is that “If two object are equals, they must have the same hashcode”. R# use a simple strategy, it use the GetHashCode from the base properties used in equality, multiplying with 397 to avoid Hash pollution. This makes you sure that if two objects are equal, their hashcode will be equal too.

Then run this snippet of code.

{{< highlight xml "linenos=table,linenostart=1" >}}
Hashtable table = new Hashtable();
table.Add(c,c);
Console.WriteLine("table.ContainsKey(c)={0}", table.ContainsKey(c));
c.Name = "STILLANOTHERNAME";
Console.WriteLine("table.ContainsKey(c)={0}", table.ContainsKey(c));
Console.WriteLine("table.ContainsValue(c)={0}", table.ContainsValue(c));

Dictionary<Customer, Customer> dic = new Dictionary<Customer, Customer>();
dic.Add(c, c);
Console.WriteLine("dic.ContainsKey(c)={0}", dic.ContainsKey(c));
c.Name = "CHANGEDAGAIN!!!";
Console.WriteLine("dic.ContainsKey(c)={0}", dic.ContainsKey(c));
Console.WriteLine("dic.ContainsValue(c)={0}", dic.ContainsValue(c));

SortedDictionary<Customer, Customer> dic2 = new SortedDictionary<Customer, Customer>();
dic2.Add(c, c);
Console.WriteLine("dic2.ContainsKey(c)={0}", dic2.ContainsKey(c));
c.Name = "CHANGED ANOTHER TIME!!!";
Console.WriteLine("dic2.ContainsKey(c)={0}", dic2.ContainsKey(c));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

What does it print?? for the hashtable the result is

table.ContainsKey(c)=True  
table.ContainsKey(c)=False  
table.ContainsValue(c)=True

It is perfectly reasonable, we add the same customer object as key and value, but then we change one of its property, its hash code change because the name property is changed, so ContainsKey(c) returns false because an hashcode comparison is done, but ContainsValue(c) is true, because it is implemented with a simple iteration where each contained object is compared with equals with one passed as arguments.

When you override Equals and GetHashCode() in such a way pay a lot of care in using object as a key into an hashtable, or keep in mind that when you change a property of the Customer, its hashCode changes and then key comparison is used against the old hashcode.

But what is the output of the remaining of the snippet?

dic.ContainsKey(c)=True  
dic.ContainsKey(c)=False  
dic.ContainsValue(c)=True

dic2.ContainsKey(c)=True  
dic2.ContainsKey(c)=True

This is due to the fact that a Dictionary&lt;K, T&gt; internally use hashcode, while the SortedDictionary use some sort of tree (maybe a red-black or an AWL) and it’s not affected by how GetHashCode is implemented. This can lead to problem, because the behavior changes with the inner implementation. When you use HashTable you know that the hash code is used…but for Dictionary you could be surprised.

An object that redefine equality operator should be used as key in IDictionary object with great care.

A possible solution is to implement a special IEqualityComparer&lt;Customer&gt;.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class CustomerReferenceComparer : IEqualityComparer<Customer>
{
    static System.Reflection.MethodInfo getHash =
                typeof(object).GetMethod("InternalGetHashCode", BindingFlags.Static | BindingFlags.NonPublic);
    #region IEqualityComparer<Customer> Members

    public bool Equals(Customer x, Customer y)
    {
        return Object.Equals(x, y);
    }

    public int GetHashCode(Customer obj)
    {
        return (Int32)getHash.Invoke(null, new object[] { obj });
    }

    #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It use a little hack, it calls the InternalGetHashCode from the class Object, so the hash is computed in standard way. This IEqualityComparer treats customer instances as they do have not redefined Equals and GetHashCode, because it relies on the implementation of the Object class. Now you can write this code.

{{< highlight xml "linenos=table,linenostart=1" >}}
Dictionary<Customer, Customer> newdic = 
   new Dictionary<Customer, Customer>(new CustomerReferenceComparer());
newdic.Add(c, c);
Console.WriteLine("dic.ContainsKey(c)={0}", newdic.ContainsKey(c));
c.Name = "CHANGEDAGAIN!!!";
Console.WriteLine("dic.ContainsKey(c)={0}", newdic.ContainsKey(c));
Console.WriteLine("dic.ContainsValue(c)={0}", newdic.ContainsValue(c));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And you do not need to worry about how the Customer redefines GetHashCode(), because you are giving to the dictionary yours IEqualityComparer&lt;Customer&gt; object that use your logic.

Alk.

Tags: [.NET Equality](http://technorati.com/tag/.NET%20Equality)

<!--dotnetkickit-->
