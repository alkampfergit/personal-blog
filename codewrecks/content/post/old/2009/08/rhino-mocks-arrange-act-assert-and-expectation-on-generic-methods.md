---
title: "Rhino Mocks Arrange Act Assert and expectation on generic methods"
description: ""
date: 2009-08-27T04:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
I have a project where some actions are to be scheduled by an external library. Each action can be instantiated by a constructor or by a static factory method, and I want to verify with the test that: all action declares static factory method and inside the factory methods all objects are resolved by a call to IoC.Resolve&lt;T&gt;. Since all the actions are in a specific assembly into a specific namespace, I wrote this test.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
Assembly asm = Assembly.Load("MyProject.Analyzer");
foreach (Type type in asm.GetTypes())
{
    if (type.Namespace == "Myproject.Analyzer.Command" && !type.IsAbstract && !type.IsNested)
    {
        MethodInfo factory = type.GetMethod("CreateCommand", BindingFlags.Public | BindingFlags.Static);
        Assert.That(factory, Is.Not.Null, "Il comando {0} non ha il metodo factory", type.FullName);
        Object res = factory.Invoke(null, null);
        Assert.That(res, Is.TypeOf(type));
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This test is simple, it load the assembly with actions, then iterate trough all types, and if the type belong to a specific namespace, it verify the presence of a static public method called â€œCreateCommandâ€, then call that method and verify that the return object is of correct type.

This test is flawed, because if you mistype the name of the namespace as I did (typed Myproject instead of MyProject) the test will succeed because no type is inspected. This is the typical situation where the test have complex code (reflection) and the test passed, not because it verifies the correct expectations, but because the test itself is bugged :). The solution is simple.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
Int32 typeCount = 0;
Assembly asm = Assembly.Load("RepManagement.Analyzer");
foreach (Type type in asm.GetTypes())
{
    if (type.Namespace == "RepManagement.Analyzer.Command" && !type.IsAbstract && !type.IsNested)
    {
        typeCount++;
         //Do your assertion here
        }

    }
}
Assert.That(typeCount, Is.GreaterThan(0));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In this way we are sure that at least one type is analyzed.

But the test is still not so good, it not only tests the presence of the Factory Method, but it depends from the IoC engine, since all factories methods relay on method IoC.Resolve&lt;ActionType&gt;(). So I need a way to*verify that each factory method call the right IoC method and return the object created by the IoC engine*. A possible solution is this test

{{< highlight xml "linenos=table,linenostart=1" >}}
if (type.Namespace == "MyProject.Analyzer.Command" && !type.IsAbstract && !type.IsNested)
{
    IWindsorContainer mock = MockRepository.GenerateStub<IWindsorContainer>();
    using (IoC.OverrideGlobalContainer(mock))
    {
        MethodInfo factory = type.GetMethod("CreateCommand", BindingFlags.Public | BindingFlags.Static);
        Assert.That(factory, Is.Not.Null, "Il comando {0} non ha il metodo factory", type.FullName);
        Object retvalue = Activator.CreateInstance(type);
        mock.Expect(c => c.Resolve(type)).Return(retvalue);

        Object res = factory.Invoke(null, null);
        Assert.That(res, Is.EqualTo(retvalue));
    }

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But it does not work, because in factory method my commands does not call IoC.Resolve(typeof(xxxx)) but IoC.Resolve&lt;xxxx&gt;(), where xxxx is the type of the command, here is the typical implementation.

{{< highlight xml "linenos=table,linenostart=1" >}}
public static SchedulableWebReview CreateCommand()
{
   SchedulableWebReview action = BaseServices.IoC.Resolve<SchedulableWebReview>();
   return action;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now I can change all factory methods to call other method, but I really do not like to do this. The test should be write in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
MethodInfo factory = type.GetMethod("CreateCommand", BindingFlags.Public | BindingFlags.Static);
Assert.That(factory, Is.Not.Null, "Il comando {0} non ha il metodo factory", type.FullName);
Object retvalue = Activator.CreateInstance(type);
mock.Expect(c => c.Resolve<???>()).Return(retvalue);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But since the type is known only a run-time, it is not possible to write this expectation natively or at least I did not know it (*what do you write instead of ???* *in the snippet above*? ). You can be tempted to use c.Resolve&lt;Object&gt;, but this does not work, since in this way rhino mocks *expects a real call to Resolve&lt;Object&gt; and will not match a call such as Resolve&lt;SchedulableWebReview&gt;()*. A possible solution is the following one

{{< highlight xml "linenos=table,linenostart=1" >}}
using (IoC.OverrideGlobalContainer(mock))
{
    MethodInfo factory = type.GetMethod("CreateCommand", BindingFlags.Public | BindingFlags.Static);
    Assert.That(factory, Is.Not.Null, "Il comando {0} non ha il metodo factory", type.FullName);

    ParameterExpression parameter = Expression.Parameter(typeof(IWindsorContainer), "c");
    MethodInfo resolveGeneric =
        typeof(IWindsorContainer).GetMethod(
        "Resolve",
        BindingFlags.Instance | BindingFlags.Public,
        null,
        new Type[] { },
        new ParameterModifier[] { });
    MethodInfo resolveThisType = resolveGeneric.MakeGenericMethod(type);
    Expression body = Expression.Call(parameter, resolveThisType);

    Expression<Function<IWindsorContainer, Object>> test2 =
        Expression.Lambda<Function<IWindsorContainer, Object>>(body, parameter);
    Object returnObject = Activator.CreateInstance(type);
    mock.Expect(test2.Compile()).Return(returnObject);

    Object res = factory.Invoke(null, null);
    Assert.That(res, Is.EqualTo(returnObject));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The solution was to recreate with ExpressionTree the real lambda that you cannot create at compile time, it is quite simple, and is composed by these steps

1. Create the ParameterExpression of type IWindsorContainer
2. Get the Resolve&lt;T&gt;() methodInfo with reflection
3. Use the MakeGenericMethod to create a MethodInfo for Resolve&lt;Type&gt; where type is passed at runtime
4. Create a MethodCallExpression that represents a call to this method.
5. Create the lambdaExpression

Now I create an instance of the Command type with Activator.CreateInstance, and finally thanks to the Compile() method of lambda expression Iâ€™m able to set the expectation :). Finally I invoke the factory method, and set an assertion that verifies that return value of the factory method is the object set as return in the expectation.

I do not know if this method is really good but it works. It has the drawback of using the Compile() method of the LambdaExpression, that is really slow at runtime, and can slow down your unit test suite. In my computer the whole test (with 18 commands to test, thus 18 calls to Compile()) runs in 1.50 secs, but most of the time is spent initializing the test. If I run the whole test fixture class (10 tests) it runs in 1.60 secs, and if I remove this test and run the 9 remaining test execution time is 1.50 approx, and this is fine.

alk.

Tags: [Unit Test](http://technorati.com/tag/Unit%20Test) [Rhino Mock](http://technorati.com/tag/Rhino%20Mock)
