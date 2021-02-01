---
title: "Test helper for a single method"
description: ""
date: 2010-12-29T15:00:37+02:00
draft: false
tags: [Nunit,Testing]
categories: [Testing]
---
I've build during years a test helper infrastructure that permits me to decorate a test fixture with some custom attributes that are capable to execute code before and after fixture setup/teardown or test setup/teardown. Now my dear friend Ugo needs for [Dexter](http://dexterblogengine.codeplex.com/) a modified version of this framework to be able to apply attributes directly to tests.

Basically Ugo needs to change the principal during each test, and he want to be able to write code like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[PrincipalForTest("Alkampfer", new [] {"Administrator", "User"})]
[Test]
public void VerifyPrincipalForTestSingleMethod()
{
Assert.That(Thread.CurrentPrincipal.IsInRole("Administrator"));
Assert.That(Thread.CurrentPrincipal.IsInRole("User"));
}
 
[PrincipalForTest("Alkampfer", new[] { "Group" })]
[Test]
public void VerifyPrincipalForTestSingleMethodSingleGroup()
{
Assert.That(Thread.CurrentPrincipal.IsInRole("Group"));
}
{{< / highlight >}}

Now the PrincipalForTestAttribute is a standard ITestHelperAttribute defined in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class PrincipalForTestAttribute : Attribute, ITestHelperAttribute
{
public int Order
{
get { return 1; }
}
 
public ITestHelper Create()
{
return new PrincipalForTestHelper(UserName, Roles);
}
 
public String UserName { get; set; }
 
public String[] Roles { get; set; }
 
public PrincipalForTestAttribute(string userName, string[] roles)
{
UserName = userName;
Roles = roles;
}
}
{{< / highlight >}}

All the dirty work is made by the PrincipalForTestHelper.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class PrincipalForTestHelper : ITestHelper
{
public String UserName { get; set; }
 
public String[] Roles { get; set; }
 
public void FixtureSetUp(BaseTestFixture fixture)
{
}
public void SetUp(BaseTestFixture fixture)
{
IPrincipal currentPrincipal = Thread.CurrentPrincipal;
GenericIdentity identity = new GenericIdentity(UserName);
GenericPrincipal newPrincipal = new GenericPrincipal(identity, Roles);
Thread.CurrentPrincipal = newPrincipal;
fixture.ExecuteAtTheEndOfTest(() => Thread.CurrentPrincipal = currentPrincipal);
}
{{< / highlight >}}

Now my problem is how to be able to execute code of this helper only for the test where this attribute is applied to, and the solution is available only with Nunit 2.5.7 or above, because the concept of TestContext permits me to know test method name from the SetUp method.

First of all in the constructor of the test class I need to scan all methods looking for ITestHelperAttribute

{{< highlight csharp "linenos=table,linenostart=1" >}}
foreach (MethodInfo methodInfo in type.GetMethods())
{
var customMethodAttributes = methodInfo.GetCustomAttributes(true);
IOrderedEnumerable<ITestHelperAttribute> testHelperAttributes =
customMethodAttributes.OfType<ITestHelperAttribute>()
.OrderBy(th => th.Order);
if (testHelperAttributes.Count() > 0)
{
List<ITestHelper>  helpers = new List<ITestHelper>();
MethodHelpers.Add(methodInfo.Name, helpers);
foreach (ITestHelperAttribute attribute in testHelperAttributes)
{
helpers.Add(attribute.Create());
}
}
}
{{< / highlight >}}

Basically I'm creating all the test helpers for each method, now during test setup I'm able to verify the name of the test that is going to be executed, and call the appropriate helpers if they are present.

{{< highlight csharp "linenos=table,linenostart=1" >}}
protected override void OnSetUp ( )
{
foreach ( ITestHelper helper in Helpers ) {
helper.SetUp ( this );
}
if (MethodHelpers.ContainsKey(TestContext.CurrentContext.Test.Name))
{
foreach (ITestHelper helper in MethodHelpers[TestContext.CurrentContext.Test.Name])
{
helper.SetUp(this);
}
}
base.OnSetUp ( );
}
{{< / highlight >}}

In the first foreach I'm calling SetUp() method for every helper associated with the fixture (it should be executed for each test) and then I verify if the MethodHelpers dictionary contains some test helpers for the current test. The key here is that I'm able to know the test method name from TestContext.CurrentContext.Test.Name thanks to new Nunit's functionality.

In order for this to work with TestDriven.Net you need to copy latest nunit testrunner in the appropriate Testdriven.net Folder (C:\Program Files (x86)\TestDriven.NET 3\NUnit\2.5)

Alk.
