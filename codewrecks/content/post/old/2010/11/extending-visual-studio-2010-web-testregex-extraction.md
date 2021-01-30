---
title: "Extending Visual Studio 2010 Web TestndashRegex extraction"
description: ""
date: 2010-11-08T08:00:37+02:00
draft: false
tags: [Testing,Visual Studio,Web Test]
categories: [Testing]
---
In a [previous post](http://www.codewrecks.com/blog/index.php/2010/11/02/extending-visual-studio-2010-web-testcustom-loop/) I showed how to create a custom loop that permits you to create a loop in a web performance test to iterate from the char â€˜aâ€™ to char â€˜zâ€™, now I want to be able to create an inner loop that

1. for each loop extract all the names of the customers that satisfy the search
2. for each name ask for detail

I need another custom loop that is able to extract strings from the body of a response and iterate for each string. Here is the full code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class RegexLoop : ConditionalRule
{
private Int32 CurrentMatch { get; set; }
private String LastUrl { get; set; }
private MatchCollection Matches { get; set; }
 
// Methods
public override void CheckCondition(object sender, ConditionalEventArgs e)
{
 
if (CurrentMatch < Matches.Count)
{
e.WebTest.Context[ContextParameterName] =
Matches[CurrentMatch].Groups[GroupName].Value;
e.IsMet = true;
CurrentMatch++;
return;
 
}
 
e.IsMet = false;
 
}
 
public override void Initialize(object sender, ConditionalEventArgs e)
{
CurrentMatch = 0;
Matches = System.Text.RegularExpressions.Regex.Matches(
e.WebTest.LastResponse.BodyString,
Regex,
RegexOptions.IgnoreCase);
}
 
public override string StringRepresentation()
{
return "Regex condition " + Regex;
}
 
[Description("Name of context parameter where the current value should be set"),
DisplayName("Context parameter"), IsContextParameterName(true)]
public string ContextParameterName { get; set; }
 
[Description("Regex"),
DisplayName("Regex")]
public String Regex { get; set; }
 
[DisplayName("GroupName"), Description("GroupName")]
public String GroupName { get; set; }
 
 
}
{{< / highlight >}}

 **Listing 1:** *The full code of the RegexLoop plugin class*

This plug-in has two property, the first Regex is used to define the regex to use, the other one is the name of Contextparameter used to store the result of the regex. This plugin simply iterates to each match of the regex, and permits you to create a loop based on text of the last request. This plugin is really simple, during initialization I execute the regex against the last response to grab a MatchCollection

{{< highlight csharp "linenos=table,linenostart=1" >}}
public override void Initialize(object sender, ConditionalEventArgs e)
{
CurrentMatch = 0;
Matches = System.Text.RegularExpressions.Regex.Matches(
e.WebTest.LastResponse.BodyString,
Regex,
RegexOptions.IgnoreCase);
}
{{< / highlight >}}

 **Listing 2:** *The initialization function*

Thanks to the e.WebTest.LastReponse.BodyString Iâ€™m able to access the body of the last response and execute the regex against it. The main loop is now straightforward to write

{{< highlight csharp "linenos=table,linenostart=1" >}}
public override void CheckCondition(object sender, ConditionalEventArgs e)
{
 
if (CurrentMatch < Matches.Count)
{
e.WebTest.Context[ContextParameterName] =
Matches[CurrentMatch].Groups[GroupName].Value;
e.IsMet = true;
CurrentMatch++;
return;
 
}
 
e.IsMet = false;
}
{{< / highlight >}}

 **Listing 3:** *The main loop, iterate for each match*

Now I can modify the test presented in the old post to insert an inner loop that is able to interate to all customers that satisfy the filter for each request.

[![SNAGHTML5672a1](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML5672a1_thumb.png "SNAGHTML5672a1")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML5672a1.png)

 ***Figure 1***: *Insert a loop based on a regular expression thanks to RegexLoop plugin*

I inserted another loop inside the first one, after the search request, and insert a regular expression that is able to find all â€œselectâ€ button of the gridview, I asked the regexloop to insert the value in the CurrentCustomer context variable to use in the subsequent request

[![SNAGHTML583c07](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML583c07_thumb.png "SNAGHTML583c07")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML583c07.png)

 **Fgirue 2:** *Use the CurrentCustomer context variable in the inner loop request*

Now you can execute the test and verify the outcome, Iâ€™m expecting an external loop to search for all alphabet letters, then for each response an inner loop for each customer, as visible in  **Figure 3**.

[![SNAGHTML5b64ad](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML5b64ad_thumb.png "SNAGHTML5b64ad")](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML5b64ad.png)

 ***Figure 3***: *The result of the test, you can verify that all loops behave correctly.*

Thanks to few lines of code now Iâ€™m able to execute loops based on content of a web response, that can be used to create complex web performance test in Visual Studio 2010.

alk.
