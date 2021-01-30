---
title: "Writing a custom assertion for SharpTestEx"
description: ""
date: 2011-03-22T15:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Actually [SharpTestEx](http://sharptestex.codeplex.com/) is my favorite way to make assertions in Unit testing. It has a lot of advantages, first of all it permits to write really clear assertions, then it works on the main Unit testing framework, so I can use the same assertion syntax for nunit and for MStest or MbUnit etc etc.

Another cool advantages is how simple is to extend the syntax, the IEnumerableConstraint has the Contain assertion to verify that an element is contained in a IEnumerable sequence of objects. Now I want to be able to write a ContainAny that accepts a lambda to specify a condition that must be satisfied by at least one of the elements of the collection.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static IAndConstraints<IEnumerableConstraints<T>> Contain<T>(
this IEnumerableConstraints<T> constraint,
Func<T, Boolean> checkFunction)
{
constraint.AssertionInfo.AssertUsing(
new Assertion<IEnumerable<T>, Func<T, Boolean>>(
"Contain",
checkFunction,
a => (a != null) && a.Any(checkFunction),
mi =>
string.Format("{0} {1} {2} {3}.{4}",
"Sequence",
"Should",
mi.AssertionPredicate,
Messages.FormatValue(mi.Expected),
mi.CustomMessage)));
return ConstraintsHelper.AndChain(constraint);
}
{{< / highlight >}}

The code is really simple, it is based on the Assertion&lt;Source, Func&gt; class that permits to send to the assertion engine an assertion that verify something. The third parameter of the Assertion constructor accepts a predicate that will be used to validate the assertion itself. In our example I use the Any linq method to verify that at least any of the element of the collection satisfy the original lambda.

now I want to verify that a list of uri does not contain any element with mail in the address

{{< highlight csharp "linenos=table,linenostart=1" >}}
list.Should().Not.ContainAny(u => u.AbsoluteUri.Contains("mail"));
{{< / highlight >}}

Simple and readable. In case of failure the error is.

{{< highlight csharp "linenos=table,linenostart=1" >}}
failed: SharpTestsEx.AssertException : Sequence Should Not Contain System.Func`2[System.Uri,System.Boolean].
{{< / highlight >}}

Since this is really not so clear, I changed the assertion function a little bit.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static IAndConstraints<IEnumerableConstraints<T>> ContainAny<T>(
this IEnumerableConstraints<T> constraint,
Expression<Func<T, Boolean>> checkFunction)
{
constraint.AssertionInfo.AssertUsing(
new Assertion<IEnumerable<T>, Expression<Func<T, Boolean>>>(
"Not contain any element that satisfy predicate",
checkFunction,
a => (a != null) && a.Any(checkFunction.Compile()),
mi =>
string.Format("{0} {1} {2} {3}.{4}",
"Sequence",
"Should",
mi.AssertionPredicate,
Messages.FormatValue(mi.Expected),
mi.CustomMessage)));
return ConstraintsHelper.AndChain(constraint);
}
{{< / highlight >}}

The only difference is that now the function accepts an Expression tree, and uses Compile() method to create a real Function&lt;T, Boolean&gt; method used to search into the sequence. Now when the test fails it writes:

{{< highlight csharp "linenos=table,linenostart=1" >}}
failed: SharpTestsEx.AssertException : Sequence Should Not Not contain any element that satisfy predicate u => u.AbsoluteUri.Contains("mail").
{{< / highlight >}}

I really love SharpTestEx.

alk.
