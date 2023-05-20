---
title: "Some interesting links for SQL Server 2012 data tools"
description: ""
date: 2011-11-28T08:00:37+02:00
draft: false
tags: []
categories: [Sql Server]
---
I love Database Project, introduced with Visual Studio 2008, and with SQL server 2012 they will be replaced by the Data Tools (codename Juneau), so I have a couple of links to share about this argument.

In [this link](http://blogs.msdn.com/b/ssdt/archive/2011/11/21/sql-server-data-tools-ctp4-vs-vs2010-database-projects.aspx) you can find a table that compares all the features. As you can see, actually, one of the most missed feature in my opinion is the Data Generation and Database Unit Testing support. The important stuff is that, as stated in the blog, *SSDT can be used side-by-side with VSDB if your application relies on features not included in SSDT CTP4*, so at least if you have Database Projects where you use Unit Test you can still use them with no problem.

If you are going to convert existing Database Project into SSDT you should read [this post](http://blogs.msdn.com/b/ssdt/archive/2011/11/21/top-vsdb-gt-ssdt-project-conversion-issues.aspx) that list the most common issues you can face during the conversion.

If you are moving from CTP3 to CTP4, you should read [this post](http://blogs.msdn.com/b/ssdt/archive/2011/11/21/uninstalling-ssdt-ctp3-code-named-juneau.aspx), that basically explain how to uninstall CTP3. Clearly I strongly suggest people to install CTP in Virtual Machine so you should not need this, but just in case you installed CTP3 in production machine :), it will be handy.

Finally [here is a list of the new feature](http://blogs.msdn.com/b/ssdt/archive/2011/11/21/what-s-new-in-sql-server-data-tools-ctp4.aspx)s of the CTP4.

Enjoy Denali.

Gian Maria.
