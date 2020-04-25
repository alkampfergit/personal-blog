---
title: "Validate User Input Step 4"
description: "Always limit what a user can send to your API for better security"
date: 2020-04-25T19:14:37+02:00
draft: true
tags: ["security"]
categories: ["security"]
---

This is the fourth article in a series about how you should never trust user input.

1. [Do not trust user input part 1](http://www.codewrecks.com/blog/index.php/2020/01/28/do-not-trust-user-input-enforce-whitelists-narrow-allowable-input/)
1. [Do not trust user input part 2](http://www.codewrecks.com/blog/index.php/2020/01/29/do-not-trust-user-input-part-2/)
1. [Do not trust user input part 3](http://www.codewrecks.com/blog/index.php/2020/02/19/do-not-trust-user-input-part-3/)

In this fourth part I have another problematic piece of code, that is obviously vulnerable to sql injection.

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

This type of sql injection is more subtle, is is a time based Sql Injection, but sadly enough, anyone can simply fire SQLMAP and test your url.

![Sql map found vulnerable url](../images/sql-map-against-search.png)

***Figure 1:*** *As you can see, searchString is vulnerable to injection*

If you look at original piece of code, you can see that I've highlighted line 6, where SQL Query is composed with simple string concatenation. That is the reason why the method is vulnerable to SQL Injection.

In all previous example, I always told you that the real problem is allowing unconstrained input from the user, not only how you compose the query. It is still clear that if you are generating sql with string composition you have a big problem, but allowing for unconstrained input is even a bigger problem.

In previous examples I have clearly well defined input, product id is an integer while customer id is a five letter code. Now that we have a search function, it seems legit to accept a simple string, because we have no white list for search, user can search for any combination of characters.

Well, this is not entirely true, no real user will use big search string, thus a first check could be limiting the search to the first 50 characters.

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

We could argue that sometimes the user can do a legitimate search with more than 50 chars, but generally speaking, there is no reason to accept an unconstrained string as input. Limiting search string to 50 chars seems to break SQL Injection.

![Sql map is unable to fingerprint the db](../images/sqlmap-unable-to-fingerprint.png)

***Figure 2:*** *Sql map is unable to fingerprint the db*

As I told in previous post of the series, I'm not telling you that you can write really bad code (like combining sql query from user string) and rely only on user data validation. What I'm telling to you is: if you limit what a user can send into your system, you are limiting the way he can abuse that input to damage the system itself.

I've tried also limiting to 100 chars and it seems that SQLMAP is able to identify Sql Server, it found that the parameter is indeed vulnerable to sql injection, but when I try to get the list of database, it encounter errors.

![Sql map is unable to map database list](../images/sqlmap-unable-to-map.png)

***Figure 2:*** *Sql map is unable to map database list*

Since 100 is a good limit for a real search made by a real user, I can create a special dto that does everything for me.