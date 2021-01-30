---
title: "Minimize test complexity"
description: ""
date: 2009-06-09T05:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
I have a function that does these steps

1) it accepts a string parameter let it call P     
2) Manipulate that parameter P, transforming in P1 with an algorithm that is contained in a specific class      
3) uses P1 it to ask for database instance of some classes and does a lot of manipulations and database operations

Now I want only to test that the class calls the algorithm to transform P in P1. All other functions of that sut are already verified, I first begun with a skeleton test I used previously to test the sut, this skeleton makes heavy use of Mocks and stubs objects to FULLY simulate the database.

In the end I have a test that works, but it was too complex, mainly because it is full of stub expectation. Moreover it is Fragile, because if Iâ€™ll change the way how this test interact with the DB, Iâ€™ll need also to change expectations. So I changed the test in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void VerifyThatBlaBla()
{
    IParamTransformer pt = MockRepository.GenerateStub<IParamTransformer>();
    try
    {
        using (IoC.Override(typeof(IParamTransformer), pt))
        {
            MySut sut = new MySut();
            sut.PerformStuff("MyParameter");
        }
    }
    catch (System.Data.Common.DbException)
    {
        //Ignore everything.
    }
    pd.AssertWasCalled(obj => obj.TransformParam(Arg<String>.Is.Equal("MyParameter"));

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

MySut is the class I need to test, it internally calls IoC.Resolve&lt;IParamTransformer&gt;(), to take a parameter transformer. Thanks to [AAA syntax of Rhino Mocks](http://ayende.com/Blog/archive/2008/05/16/Rhino-Mocks--Arrange-Act-Assert-Syntax.aspx) I simply create a mock, use an internal override function to instruct the IoC component to return my mock when asked to resolve a IParamTransformer, then invoke sut method. Since I know that the test calls the DAL with transformed parameter I simply ask in the test to catch every DbException, ignore it and then assert that the TransformParam is called. The test is quick because I used SqlLite to have a Db in memory, the sut resolve the IParamTransformer, calls for parameter transformation, then calls the db; the db call failed because the test db is empty so a DbException is thrown. Now the exception is ignored and I finally verify that function TransformParam was called.

This test is less than half length respect to the first version that fully mimics the DAL with mock objects. I think that it is really clearer, because it is focused on â€œwhat I want to testâ€ without distracting the reader with greedy details.

A still better solution could be a refactoring of the original class, making it more testable, but I think that this is enough.

Alk.

Technorati Tags: [Unit Testing](http://technorati.com/tags/Unit+Testing)
