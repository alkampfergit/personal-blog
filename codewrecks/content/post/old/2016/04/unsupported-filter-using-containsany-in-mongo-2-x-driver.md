---
title: "ldquoUnsupported filterrdquo using ContainsAny in Mongo 2x driver"
description: ""
date: 2016-04-26T16:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
Porting code from Legacy driver to new driver syntax is quite annoying for.NET MongoDb driver. In the new Drivers almost everything is changed, and unless you want to still use old legacy syntax creating a mess of new and old syntax, you should convert all the code to the new syntax.

One of the annoying problem is ContainsAny in LINQ compatibility driver. In old drivers, if you have an object that contains an array of strings, and you want to filter for objects that have at least one of the value contained in a list of allowed values you had to resort to this syntax.

{{< highlight csharp "linenos=table,linenostart=1" >}}


  return Containers.AllUnsorted
               .Any(c =&gt; c.PathId.Contains(containerIdString) &amp;&amp;
                c.Aces.ContainsAny(aceList));

{{< / highlight >}}

In this situation Aces properties is an HashSet&lt;String&gt; and aceList is a simple String[], the last part of the query uses the ContainsAny extension method from Legacy MongoDb driver.  **That extension was needed in the past because the old driver has no full support for LINQ Any syntax**.

The problem that arise with the new driver is, after migrating code, the above code still compiles because it references the Legacy Drivers, but it throws an “Unsupported Filter” during execution.  **The solution is really simple, the new driver now support the whole LINQ Any syntax, so you should write:** {{< highlight csharp "linenos=table,linenostart=1" >}}


return Containers.AllUnsorted.Any(c =&gt; c.PathId.Contains(containerIdString) &amp;&amp;		c.Aces.Any(a =&gt; aceList.Contains(a)));

{{< / highlight >}}

As you can see, you can now write the Query with standard LINQ syntax without the need to resort to ContainsAny.

While I really appreciate that in the new Drivers LINQ support is improved, it is quite annoying that the old code still compiles but it throws at run-time.

Gian Maria.
