---
title: "Write clearer Unit Tests"
description: ""
date: 2011-03-25T09:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
One of the purpose of Unit Testing is writing small test that verify small functionality. When a test fails it should be immediately clear what is wrong, and reading the test should immediately convey the purpose of the test. Consider this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void Smoke_Test_Of_XXXFilter()
{
GetYYYYParam param = new GetYYYYParam();
param.ForDateXXXRange(
new DateTime(2011, 01, 01),
new DateTime(2011, 02, 01));
_sut.GetYYYY(param);
}
{{< / highlight >}}

I've removed the name of the Entity, this is a DAL test that use a Filter Object to specify a Date Range filter for XXX property, and it just call the function without verifying anything. The purpose of this test, as the name implies, is just calling the GetYYYY function with only a filter on the XXXX Date param and verify that it should not raise any exception. This is needed because the query is quite complicated and this test just verify that it runs without exception. But the question is, I can write in a more clearer way?

In my opinion the two hardcoded dates are not really clear, a reader of this test could ask for several question about these date: are they important for test test? Is there any relationship between them? Is important that the year is the same year of this current year? and so on. I prefer rewriting the test in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void Smoke_Test_Of_XXXFilter()
{
GetYYYYParam param = new GetYYYYParam();
param.ForDateXXXRange(
NotImportantDateParamOne,
AnotherNotImportantDateParam_GreaterThanNotImportantDateParamOne);
_sut.GetYYYY(param);
}
{{< / highlight >}}

It is matter of personal opinion, but for me this test is clearer. The first date parameter is now called  **NonImportantDateParamOne** , that immediately makes clear that this parameter could be really any DateTime value. The second one has a longer name,  **AnotherNonImportantDateParam\_GreaterThanNonImportantDateParamOne** , while I tend to prefer shorter variable names in standard routines, for unit testing I'd like to have constant with a very clear name. Since in the filter procedure there is a check on parameter validity that rejects a DateRange if end date is greater than start date, the second parameter of the call can be Any date greater than first parameter, and the long name immediately convey this concept.

Alk.
