---
title: "Principle of least privilege"
description: "Running every piece of code with the same level of privilege is the root of many problems."
date: 2020-07-04T08:13:30+02:00
draft: false
tags: ["security", "programming"]
categories: ["security"]
---

This is the fourth article in a series of post dealing on why it is important to strictly validate user input.

1. [Do not trust user input part 1](http://www.codewrecks.com/blog/index.php/2020/01/28/do-not-trust-user-input-enforce-whitelists-narrow-allowable-input/)
1. [Do not trust user input part 2](http://www.codewrecks.com/blog/index.php/2020/01/29/do-not-trust-user-input-part-2/)
1. [Do not trust user input part 3](http://www.codewrecks.com/blog/index.php/2020/02/19/do-not-trust-user-input-part-3/)
1. [Validate User Input part 4](http://localhost:1313/post/security/validate-user-input-4/)
1. [Do not disclose errors to the User part 5](http://www.codewrecks.com/post/security/do-not-disclose-error-to-the-user/)

## A brief recap 

Let's return to the beginning, the very first version of the vulnerable function.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[SwaggerResponse(typeof(Product))]
[HttpGet]
[MapToApiVersion("1.0")]
public IActionResult GetProductVulnerable(String productId)
{
    var query = DataAccess.CreateQuery($"Select * from dbo.Products where productId = {productId}");
    var product = query.ExecuteBuildSingleEntity<Product>(Product.Builder);
    return Ok(product);
}
{{< / highlight >}}

As a remind this is a typical result of database enumeration with SqlMap to verify that this function is indeed vulnerable.

![SqlInjection listed all databases of the server](../images/sql-injection-vulnerability.png)
***Figure 1:*** *SqlInjection listed all databases of the server*

Given this situation, if I'm asking you what is the worst error that you find in this situation what would be your answer? Let's examine the possibilities:

A first response could be: **you are issuing a SQL query with direct string composition**. While this answer is technically correct, it is surely not the worst problem in the above example. If you fix the query you can still be vulnerable to other attacks unknown as today.

A better response is: **You are accepting any string as user input, giving the attacker the room to send EVERY sequence of chars**. Applying a whitelist, if possible, greatly reduce the surface of attack.

An even better response is: **SqlMap is enumerating ALL DATABASES in the instance, probably the server is configured to access Sql Server as administrator (sa)**. This is absolutely the most serious error, because you are actually exposing the entire database server to the attacker, so if your application is compromises due to an error, you have the entire database server compromised.

> As far as I know, this is the most common error, accessing resources with user with the highest level of privilege.

The principle of least privilege requires that a piece of code should operate with the minimum permissions needed to complete the task. Obviously if you are accessing database with admin user (sa) you are violating this principle.

## Mitigation of the problem

At least an application should connect to a database (or to any other resources) with a permission level that prevent access to resources of other applications. A first solution is creating a northwind user in Sql Server, giving it every permission to northwind database but no permission to other database. In this situation, an Attacker cannot compromise other resources.

![Sql error when Sql injection is trying to enumerate tables of other databases](../images/sql-map-enumeration-failed.png)
***Figure 2:*** *Sql error when Sql injection is trying to enumerate tables of other databases*

This modification prevent any vulnerability to access data from other applications. 

## Better approach to the problem.

If you really works to an application that should be really secure, previous approach is not usually enough because a single error on an API could compromise the entire database. The problem is that SqlMap and other exploit tools have real superpower, like *--sql-shell* option that can allow you to open a real shell to your database.

![Inserting data in Sql with SqlMap](../images/sql-shell-insert-product.png)
***Figure 3:*** *Inserting data in Sql with SqlMap*

This is surely something you do not want, being able to manipulate data in your database is really a dangerous thing. To apply further mitigation you should connect to your database with different connection strings. At least you should have dedicated connection string with different user to

- Read data of public tables
- Write data to public tables
- read/write to private/sensitive tables
- Perform administrative tasks (like creating tables, etc)

With this approach, every time you need to issue a standard read query you can use this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[SwaggerResponse(typeof(Product))]
[HttpGet]
[MapToApiVersion("1.0")]
public IActionResult GetProductVulnerable(String productId)
{
    var query = DataAccess.CreateReadOnlyQuery($"Select * from dbo.Products where productId = {productId}");
    var product = query.ExecuteBuildSingleEntity<Product>(Product.Builder);
    return Ok(product);
}
{{< / highlight >}}

Now whatever unknown vulnerability this code could have, at least the query is done with readonly privilege and cannot access some tables like the user table. In your product there are always some sensitive tables that contains really sensitive data, it makes sense that you have a separate connection to access those tables. If you really need to perform access to those tables you have a dedicated connection and you access with syntax like 

```csharp
DataAccess.CreateSystemQuery("...");
```

You can then put whatever restriction you want on that specific method, you can add rules that disallow the use of that method in some controllers, you can dump every access to that method, etc. Differentiating Sql Connection string with different user will add an extra layer of protection that will greatly reduce attack surface if an unknown vulnerability will be discovered.