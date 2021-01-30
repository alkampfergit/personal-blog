---
title: "Do not trust user input"
description: ""
date: 2020-01-28T21:00:37+02:00
draft: false
tags: [Security]
categories: [security]
---
It is time to start blogging a little bit about security, because injection is still high in OWASP TOP 10 and this implies that  **people still trust their users**. Remember, you should not trust your users, never, never, never, because for 10.000 good users there could be 1 bad user, and he/she is enough to damage your organization.

Here you have a really bad, bad, bad, bad, piece of code that is meant to allow product retrieval from northwind database Products table.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-5.png)

 ***Figure 1***: *Standard piece of code that suffer from SQL Injection.*

I hear you screaming something like: if you use Nhbernate, Entity Framework or parameterized commands the problem will go away, never ever build sql string from raw user output. Legit, but my question is: *What would be your first fix for code in  **Figure 1?** If your answer regards how you create the query to the database, the answer is only partially correct.*

The real problem of function in  **Figure 1** is that productId is an integer in the database, but the method admits a string as parameter, this  **basically allows anything to be passed as productId.** This kind of stupid errors are simple to made and since everything works as expected often are never corrected.

 **Now my question is: how dangerous is the above code?** Rest assured that such code leads to a full compromise of your database and potentially could compromise your entire system. Any script kiddie can use SqlMap to test if the url is vulnerable

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-6.png)

 ***Figure 2***: *A simple call and sqlmap find that the url is vulnerable*

Voilà, the url is vulnerable, the attacker can do almost everything to your database trough your application, exfiltrate data, deleting and modifying data  **and if you have the bad habit of using server admin (like sa) in your connection string, every database is compromised. The attacker can also use the –privileges options to understand the privilege of code running the injection.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-7.png)

 ***Figure 3***: *Here are all privilege that sqlmap can use, it seems that someone access the database with an administrator connection string, too bad.*

The –current-user option list the current user, actually I’m running the.NET core application in a console with my Windows User, and **indeed sqlmap is able to get the current user of the system.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-8.png)

 ***Figure 4***: *Current user detection on the system*

Believe me, if database engine is very old or it is bad configured, you can even transfer files to and from the system or open a shell and compromise the entire system ([https://niiconsulting.com/checkmate/2014/01/from-sql-injection-to-0wnage-using-sqlmap/](https://niiconsulting.com/checkmate/2014/01/from-sql-injection-to-0wnage-using-sqlmap/)). **You should trust me, you really do not want to find yourself in this situation.** >  **A single entry point vulnerable to SQL Injection could compromise the entire system** Since the real flaw is accepting a string for product id, a much more secure version is obtained simply declaring the parameter as Int32.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-9.png)

 ***Figure 5***: *A real secure version of the API*

Even if code in  **Figure 5** still contains a query created with string concatenation (that should be changed immediately after changing parameter type because it is a bad error) productId parameters is now declared as integer and the attacker cannot use SQL Injection any more.  **This solution is better because it not only protects you from known sql injection tricks, but it limits user input to an integer, reducing any parameter manipulation technique he/she can use.** Anything that is not an integer is simply not accepted.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image_thumb-10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/01/image-10.png)

 ***Figure 6***: *This is what an attacker find when he/she tries to send something that is not an integer to the system.*

You can now run again sqlmap against the api and you can verify that the endpoint is not vulnerable anymore.

> Remember, limiting what your users can send to your code to the minimum value set that allows the code to work greatly limits the risk of  receiving a dangerous payload.

Gian Maria.
