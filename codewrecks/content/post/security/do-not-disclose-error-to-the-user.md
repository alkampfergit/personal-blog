---
title: "Do Not Disclose Errors to the User"
description: "Returning too much information about error to the user is usually a bad idea."
date: 2020-07-03T22:13:30+02:00
draft: false
tags: ["security", "programming"]
categories: ["security"]
---

This is the fourth article in a series of post dealing on why it is important to strictly validate user input.

1. [Do not trust user input part 1](http://www.codewrecks.com/blog/index.php/2020/01/28/do-not-trust-user-input-enforce-whitelists-narrow-allowable-input/)
1. [Do not trust user input part 2](http://www.codewrecks.com/blog/index.php/2020/01/29/do-not-trust-user-input-part-2/)
1. [Do not trust user input part 3](http://www.codewrecks.com/blog/index.php/2020/02/19/do-not-trust-user-input-part-3/)
1. [Validate User Input part 4](http://localhost:1313/post/security/validate-user-input-4/)

In the last post we analyzed how it is not fully possible to limit user input in some functions like search. The user could almost search for every character and it is not easy to impose a maximum length. Nevertheless **imposing a maximum length of the string to 50 characters seems to break Sql Injection.**

> Remember, Sql injection is only one of the possible attack, the most obvious one. The purpose of these posts is raise awareness on how important is to whitelist user input when possible, and apply every possible restriction.

The real goal is prevent not only the types of attack that you already know, but even the future ones. **If you let the user input flow uncontrolled in your code you are vulnerable**. 

In this post I want to discuss another typical area where too much information is flowing, lets take the very first function that accepts a string as product Id.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[SwaggerResponse(typeof(Product))]
[HttpGet]
[MapToApiVersion("1.0")]
public IActionResult GetProductString(String productId)
{
    var query = DataAccess.CreateQuery($"Select * from dbo.Products where productId = {productId}");
    var product = query.ExecuteBuildSingleEntity<Product>(Product.Builder);
    return Ok(product);
}
{{< / highlight >}}

As we saw on the first blog post, this code is indeed vulnerable to Sql Injection.

![SQLMAP output shows that the url is vulnerable](../images/sqlmap-on-the-run.png)
***Figure 1:*** *Output of SQLMAP reveals SQL Injection vulnerability*

Now let's check what is the answer of the server when you pass a string instead of a number (product id is a number)-

![Error shown to the user](../images/error-shown-to-the-user.png)
***Figure 2:*** *Raw error shown to the user"

What you see in **Figure 2** is a standard SqlException returned to the user, a bad practice that reveals too much information to an attacker. This kind of errors is not only giving hint to the attacker to a possible vulnerability, but it is **also used by automated tool to actually exploit the vulnerability**.

> An attacker will use every piece of information you are returning to abuse your API, even the average [time the function need to answer](https://nvisium.com/blog/2015/06/25/time-based-username-enumeration.html). 

For this reason all frameworks usually have some sort of setting that prevent any information to flow to the user, such as giving a general error page result, but lets modify a little bit the previous function.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[SwaggerResponse(typeof(Product))]
[HttpGet]
[MapToApiVersion("1.0")]
public IActionResult GetProductStringNoException(String productId)
{
    try
    {
        var query = DataAccess.CreateQuery($"Select * from dbo.Products where productId = {productId}");
        var product = query.ExecuteBuildSingleEntity<Product>(Product.Builder);
        return Ok(product);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error performing lookup by product id. {message}", ex.Message);
        return Ok(null);
    }
}
{{< / highlight >}}

I'm not an advocate of try/catch block directly in the API, you should trap an handle exception with middleware or some global hangler, but the above code has two important changes:

1. It does not let exception details to the user
1. It logs the error with standard logging system.

**Developers MUST learn how to troubleshoot problems using logs** and, most importantly, the code will behave the same both while developing and in production. Now the question is, does such modification affect SQL injection?

![SqlMap behavior with exception trapped.](../images/sql-map-output-when-exception-is-trapped.png)
***Figure 3:*** *SQLMAP behave a little bit differently if you trapped all exception*

From **Figure 3** you can verify that **SQLMAP is finding a little more difficulties exploiting the injection, now that errors are trapped and a simple null is returned**. This means that some of the techniques used are not effective anymore and are based on what the service is returning.

If you let SQLMAP try other Sql Injection techniques, **it will still find the API to be vulnerable and it is able to exploit**. Nevertheless avoiding returning errors to the user somewhat makes the API slightly more difficult to exploit.

Avoiding returning error is not a defense used primarly against a tool, **is a defense mainly used against humans, because a human can use error response value to deduce some important consideration about your API.** For this reason you should always avoid returning any error information to the user, either the API return a valid value or it must return a generic error.

Gian Maria.