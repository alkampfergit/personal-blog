---
title: "Some details on older post about usertype"
description: ""
date: 2008-10-21T04:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
In [this old post](http://www.codewrecks.com/blog/index.php/2008/05/30/second-iusertype-of-the-day-store-a-list-of-string-in-database-with-nhibernate/) I spoke about a user type that permits you to store a IList&lt;String&gt; property with nhibernate  in a single field of a database with a # separated list of string. That example did not contain the full code of the usertype, so here it is.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 1     class StringListUserType : IUserType
 2     {
 3         private const char cStringSeparator = '#';
 4 
 5         #region Equals member
 6 
 7         bool IUserType.Equals(object x, object y)
 8         {
 9             if (x == null || y == null) return false;
10             IList<String> xl = (IList<String>) x;
11             IList<String> yl = (IList<String>) y;
12             if (xl.Count != yl.Count) return false;
13             Boolean retvalue =  xl.Except(yl).Count() == 0;
14             return retvalue;
15         }
16 
17         #endregion
18 
19         #region IUserType Members
20 
21         public object Assemble(object cached, object owner)
22         {
23             return cached;
24         }
25 
26         public object DeepCopy(object value)
27         {
28             IList<String> obj = (IList<String>)value;
29             List<String> retvalue =obj.ToList();
30 
31             return retvalue;
32         }
33 
34         public object Disassemble(object value)
35         {
36             return value;
37         }
38 
39         public int GetHashCode(object x)
40         {
41             return x.GetHashCode();
42         }
43 
44         public bool IsMutable
45         {
46             get { return true; }
47         }
48 
49         public object NullSafeGet(System.Data.IDataReader rs, string[] names, object owner)
50         {
51             List<String> result = new List<String>();
52             Int32 index = rs.GetOrdinal(names[0]);
53             if (rs.IsDBNull(index) || String.IsNullOrEmpty((String) rs[index]))
54                 return result;
55             foreach (String s in ((String)rs[index]).Split(cStringSeparator))
56                 result.Add(s);
57             return result;
58         }
59 
60         public void NullSafeSet(System.Data.IDbCommand cmd, object value, int index)
61         {
62             if (value == null || value == DBNull.Value)
63             {
64                 NHibernateUtil.String.NullSafeSet(cmd, null, index);
65             }
66             IEnumerable<String> stringList = (IEnumerable<String>) value;
67             StringBuilder sb = new StringBuilder();
68             foreach(String s in stringList) {
69                 sb.Append(s);
70                 sb.Append(cStringSeparator);
71             }
72             if (sb.Length > 0) sb.Length--;
73             NHibernateUtil.String.Set(cmd, sb.ToString(), index);
74         }
75 
76         public object Replace(object original, object target, object owner)
77         {
78             return original;
79         }
80 
81         public Type ReturnedType
82         {
83             get { return typeof(IList<String>); }
84         }
85 
86         public NHibernate.SqlTypes.SqlType[] SqlTypes
87         {
88             get { return new SqlType[] { NHibernateUtil.String.SqlType }; }
89         }
90 
91         #endregion
92     }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

There are a couple of notes in this code, first of all the type IList&lt;String&gt; is a reference type, so the property IsMutable should return false. Then the IUserType.Equals method should  compare the two lists element by element. I'm really not interested about the order of the elements in the list, if I have a list (*One* , *Two*) in my domain it is equal to (*Two*, *One*), so I can use a linq *Except* operator to compare the values. If the order of the string really matters, you can do a compare element by element with a for loop. Remember also that the DeepClone method should return a new list identical to the original one, this because we are working with a reference type.

alk.

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/21/some-details-on-older-post-about-usertype/';</script><script type="text/javascript">var dzone_title = 'Some details on older post about usertype';</script><script type="text/javascript">var dzone_blurb = 'Some details on older post about usertype';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/21/some-details-on-older-post-about-usertype/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/21/some-details-on-older-post-about-usertype/)
