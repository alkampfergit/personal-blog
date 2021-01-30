---
title: "Terminating a fluent interface"
description: ""
date: 2008-10-28T06:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
I  usually use a fluent interface to make assertion on data on database, a typical assertion looks like

{{< highlight sql "linenos=table,linenostart=1" >}}
DbAssert.OnQuery("select *  from tablename")
   .That("column1", Is.EqualTo(15))
   .That("column2", Is.EqualTo(90))
   .That("column2", Is.EqualTo(99))
   .ExecuteAssert();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This makes me possible to express simple database assertion to verify database conditions expressed by a series of Nunit.Constraints on field of a query, it is very useful when I have to test stored procedures or verify that NHibernate mappings works as expected. If you look closely to the syntax it terminate with a *ExecuteAssert* call that actually does the assertion. This kind of syntax makes me a little worried, because you can write an assertion like this

{{< highlight sql "linenos=table,linenostart=1" >}}
DbAssert.OnQuery("select *  from tablename")
   .That("column1", Is.EqualTo(15))
   .That("column2", Is.EqualTo(90))
   .That("column2", Is.EqualTo(99));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a perfectly valid code, it created a  **DbAssert** object but never execute it, thus the assertion always succeed and never fail because it gets never executed. A possibility is to make the object DbAssert****disposable, so you can use inside a using, but the syntax will get worse. A viable solution is a little modification

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private static DbAssert theQuery;

public static DbAssert OnQuery(String query)
{
    if (theQuery != null) Assert.Fail("");
    return theQuery = new DbAssert(query);
}
...
public void ExecuteAssert()
  {
     theQuery = null;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code checks if it is a previous query created and if one query is still there, you are in situation where the previous database assertion was not executed, so you can make the test fail. This solution is still not so good because it fails the test immediatly following the one that forget to execute the assertion, but at least you know that something is wrong.

The final solution is to create a real Nunit constraint to have this syntax

{{< highlight sql "linenos=table,linenostart=1" >}}
Assert.That("select *  from tablename",
  DbAssert.CreateConstraint()
   .That("column1", Is.EqualTo(15))
   .That("column2", Is.EqualTo(90))
   .That("column2", Is.EqualTo(99)));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I still have a fluent interface to specify the assertion, but now everything is included into an Assert.That, it makes not possible to forget the call to ExecuteAssert, the error contains all fields that have not expected result. Then you can do some simple hack to intercept the original message of the original criterion to have a failing output like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
  Expected:   Expected: "column1 = 15"
  But was:  150
  Expected: "column2 = 90"
  But was:  98{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But if you use a Greater Than or some other constraint the result is

{{< highlight csharp "linenos=table,linenostart=1" >}}
  Expected:   Expected: "column1 greater than 150"
  But was:  15
  Expected: "column2  =  980"
  But was:  98{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the error detail contains all the field that does not match as well as detailed information. With this little helper I can write concise assertion on database data.

Alk.

Tags: [NUnit](http://technorati.com/tag/NUnit) [Testing](http://technorati.com/tag/Testing) [Fluent Interface](http://technorati.com/tag/Fluent%20Interface)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/28/terminating-a-fluent-interface/';</script><script type="text/javascript">var dzone_title = 'Terminating a fluent interface.';</script><script type="text/javascript">var dzone_blurb = 'Terminating a fluent interface.';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/28/terminating-a-fluent-interface/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/28/terminating-a-fluent-interface/)
