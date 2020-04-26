---
title: "Validate User Input Step 4"
description: "Always limit what a user can send to your API for better security"
date: 2020-04-26T20:14:37+02:00
draft: false
tags: ["security"]
categories: ["security"]
---

This is the fourth article in a series of post dealing on why it is important to strictly validate user input.

1. [Do not trust user input part 1](http://www.codewrecks.com/blog/index.php/2020/01/28/do-not-trust-user-input-enforce-whitelists-narrow-allowable-input/)
1. [Do not trust user input part 2](http://www.codewrecks.com/blog/index.php/2020/01/29/do-not-trust-user-input-part-2/)
1. [Do not trust user input part 3](http://www.codewrecks.com/blog/index.php/2020/02/19/do-not-trust-user-input-part-3/)

In this fourth part I will examine another problematic piece of code, obviously vulnerable to sql injection: an API to search in products.

{{< highlight csharp "linenos=table,hl_lines=6,linenostart=1" >}}
[SwaggerResponse(typeof(IEnumerable<Product>))]
[HttpGet]
[MapToApiVersion("1.0")]
public IActionResult SearchProducts(String searchString)
{
    var query = DataAccess.CreateQuery($"Select * from dbo.Products where productName like '%{searchString}%'");
    var products = query.ExecuteBuildEntities<Product>(Product.Builder);
    return Ok(products);
}
{{< / highlight >}}

As you can see, leaving user input flow unconstrained in your business logic, where it is used to  create a SQL query with string concatenation is a bad idea. **You can simply fire SQLMAP to test the API and you can verify that it's indeed vulnerable.** 

![Sql map found vulnerable url](../images/sql-map-against-search.png)

***Figure 1:*** *As you can see, searchString is vulnerable to injection*

If you look at original piece of code, you can see that **I've highlighted line 6**, where SQL Query is composed with simple string concatenation. **That is the reason why the method is vulnerable to SQL Injection** and should be absolutely fixed using SqlCommand or whatever other proven technique to perform query against a sql server (Ex. ORM) 

> Using string concatenation to create SQL Queries is a bad practice to avoid at all cost. Your code could be vulnerable to SQL Injection and the entire system could be compromised.

But if you read my previous posts, you already understand that line 6 is not the only cause of errors. Yes, indeed line 6 is THE vulnerable code, but the error is **leaving unconstrained user input flow into your business logic**. You should always apply some sort of whitelisting if possible to allow only for well formed input to proceed down the call.

In previous examples the solution was easy: product id is an integer and customer id is a five letter code so we can always constraint input to be one of the expected type (an int or five letters code). When input has a well defined shape it is simple to reject every malformed version. **Now that we have a search function, it seems legit to accept a simple string without any special formatting**; after all user can search for any combination of characters.

Well, this is not entirely true, no real user will use big search string, and we can suppose that standard search strings are under 50 chars. It is interesting to see how limiting the length of search string to 50 characters will impact Sql Injection. Lets modify the function in this way.

{{< highlight csharp "linenos=table,hl_lines=6-9,linenostart=1" >}}
[SwaggerResponse(typeof(IEnumerable<Product>))]
[HttpGet]
[MapToApiVersion("1.0")]
public IActionResult SearchProducts(String searchString)
{
    if (searchString?.Length > 50)
    {
        searchString = searchString.Substring(0, 50);
    }
    var query = DataAccess.CreateQuery($"Select * from dbo.Products where productName like '%{searchString}%'");
    var products = query.ExecuteBuildEntities<Product>(Product.Builder);
    return Ok(products);
}
{{< / highlight >}}

With this new function we can verify that this limitation seems to affect the capability of SQLMAP to perform SQL Injection.

![Sql map is unable to fingerprint the db](../images/sqlmap-unable-to-fingerprint.png)

***Figure 2:*** *Sql map is unable to fingerprint the db*

> Simply limiting the length of allowable string can shield from some common injection problems.

As I told in previous post of the series, **I'm not telling you that you can write really bad code (like combining sql query from user string) and rely only on user data validation**. What I'm telling to you is: **if you limit what a user can send into your system, you are limiting the way he/she can abuse that input to damage the system itself**. The above piece of code is really bad, you should IMMEDIATELY change they way you perform the query, but limiting user input nevertheless is giving you an extra layer of protection.

Raising the number of allowed chars to 100 makes SQLMAP detects that the parameter is vulnerable to injection, but when I try to get the list of database, I got an error..

![Sql map is unable to map database list](../images/sqlmap-unable-to-map.png)

***Figure 3:*** *Sql map is unable to map database list*

Since 100 is a good limit for a real search made by a real user, the best approach is creating a special dto that will contains all search parameter and apply in that DTO all the check and length limits. I want to stress out again that you should **immediately change code that combine string to create sql query**, but you need also to double check user input.

> If you do not have clear whitelist / regex for user input, as in search API where the user can search for anything, at least set a li limit to the length of allowable strings. This will give an attacker less room to abuse user input.

Another useful technique consists to apply blacklist to your parameters. SQL Injection attacks are well known and you surely can detect if searchString parameter is going to be abused. **The obvious problem with Blacklisting, is that you should always keep the detection engine up-to-date, because bad guys never sleep and you can find yourself  vulnerable in the future if you do not update blacklist detection engine**

To conclude this post, even if you are using  SqlCommand to prevent Sql Injection or even if you are not using SQL (No Sql based products), leaving user input to flow unconstrained to your business logic is usually not a good idea. You could never know if in the future someone will find some bug / techniques to abuse your code.

> Strict user input validation should always be your first line of defense.

Remember: whenever you are accepting input from the user, always try to limit what you accepts to the minimum acceptable 
set of values.

Gian Maria