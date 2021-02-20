---
title: "Extending Visual Studio 2010 web test-Custom loop"
description: ""
date: 2010-11-02T14:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Testing]
---
Suppose you have a very simple page that permits you to search customers in northwind database and visualize orders, a classic master-detail page.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image.png)

* ***Figure 1***: A classic Master-Detail page*

Now suppose that you need to create a VS web test to search for each letter of the alphabet, and for each result page you should visit order details. Thanks to VS 2010 we have another construct for Web test called Loop, but there is no out-of-the-box loop condition to iterate with all the letters of the alphabet, so I need to build a custom one. To create a plugin for loop test you need simply to inherit from the [ConditionalRule](http://msdn.microsoft.com/en-us/library/microsoft.visualstudio.testtools.webtesting.conditionalrulereference.aspx) class and write a little bit of code:

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class CharLoop : ConditionalRule
{
// Fields
private ForLoopComparisonOperator _comparisonOperator;
private string _contextParameterName;
private Int32 _incrementValue;
private Char _initialValue;
private Char _terminatingValue;
 
// Methods
public override void CheckCondition(object sender, ConditionalEventArgs e)
{
 
Char num = Convert.ToChar(e.WebTest.Context[this._contextParameterName]);
num = (Char)(num + _incrementValue);
e.WebTest.Context[this._contextParameterName] = num;
switch (this._comparisonOperator)
{
case ForLoopComparisonOperator.LessThan:
e.IsMet = num < this._terminatingValue;
return;
 
case ForLoopComparisonOperator.LessThanOrEqual:
e.IsMet = num <= this._terminatingValue;
return;
 
case ForLoopComparisonOperator.GreaterThan:
e.IsMet = num > this._terminatingValue;
return;
 
case ForLoopComparisonOperator.GreaterThanOrEqual:
e.IsMet = num >= this._terminatingValue;
return;
}
e.IsMet = false;
}
 
public override void Initialize(object sender, ConditionalEventArgs e)
{
if (e.WebTest.Context.ContainsKey(this._contextParameterName))
{
e.WebTest.Context[this._contextParameterName] = this._initialValue - this._incrementValue;
}
else
{
e.WebTest.Context.Add(this._contextParameterName, this._initialValue - this._incrementValue);
}
}
 
public override string StringRepresentation()
{
return string.Format(CultureInfo.CurrentCulture,
"Initialvalue{0} increment {1} context {2} terminating {3}",
new object[] {
this._initialValue,
this._incrementValue,
this._contextParameterName, str,
this._terminatingValue });
}
 
// Properties
[Description("Operator to compare to compare the value with the actual one"),
DisplayName("Comparison operator"), DefaultValue(0)]
public ForLoopComparisonOperator ComparisonOperator
{
get
{
return this._comparisonOperator;
}
set
{
this._comparisonOperator = value;
}
}
 
[Description("Name of context parameter where the current value should be set"),
DisplayName("Context parameter"), IsContextParameterName(true)]
public string ContextParameterName
{
get
{
return this._contextParameterName;
}
set
{
this._contextParameterName = value;
}
}
 
[Description("Value to increment, it should be an integer"),
DisplayName("Increment Value")]
public Int32 IncrementValue
{
get
{
return this._incrementValue;
}
set
{
this._incrementValue = value;
}
}
 
[DisplayName("Initial value"), Description("Initial Value")]
public Char InitialValue
{
get
{
return this._initialValue;
}
set
{
this._initialValue = value;
}
}
 
[DisplayName("terminating value"), Description("terminating value")]
public Char TerminatingValue
{
get
{
return this._terminatingValue;
}
set
{
this._terminatingValue = value;
}
}
}
{{< / highlight >}}

This class is based on the classic for Loop with integer values, and it iterate simply from a starting char to an ending char. Now if you reference the project that contains this class into a test project, you can use this loop in your test.

[![SNAGHTML171375c](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML171375c_thumb.png "SNAGHTML171375c")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML171375c.png)

* ***Figure 2***: adding a custom rule for a loop in web test.*

With this sample I want to iterate from the letter â€˜a' to letter â€˜z' incrementing each time by 2 chars, so I'll have the sequence a,c,e,g,i... Then I need to specify the Context parameter property, the property that will store the value of the sequence during each iteration, in Figure 3 you will see all the properties specified for our loop.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image1.png)

* ***Figure 3***: full configuration for the Loop iteration.*

Now you can use that ContextParameter into a POST Variable

[![SNAGHTML173e8a1](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML173e8a1_thumb.png "SNAGHTML173e8a1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML173e8a1.png)

* ***Figure 4***: Use the variable in loop to pass parameter with post.*

If you run the test you can verify that it iterates in your sequence doing a series of requests, each one for each value of the loop.

[![SNAGHTML175a154](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML175a154_thumb.png "SNAGHTML175a154")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML175a154.png)

* ***Figure 5***: During test execution, for each iteration a different request was issued.*

Thanks to this new feature of Visual Studio 2010 web test and very few lines of code, we are able to create, with little effort, an interesting test that can be used in load testing to simulate a series of search. In a subsequent post I'll explain how to add another custom loop to select the detail page of each customer that satisfies the filter.

alk.
