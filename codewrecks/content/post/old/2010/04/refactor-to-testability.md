---
title: "Refactor to testability"
description: ""
date: 2010-04-07T13:00:37+02:00
draft: false
tags: [RhinoMock,Testing]
categories: [Testing]
---
One of the reason why people do not write tests, is that some code is difficult to test, and one of the main reason for this difficulty is coupling. The obvious solution is to write loosely coupled code from the beginning, but if you are working with legacy code this option is not applicable.

The problem is that if you have no test and the code is difficult to test you avoid to refactor; after all, if everything works as expected, why you should introduce bug with refactoring? The reason is that sometimes [technical debt](http://en.wikipedia.org/wiki/Technical_debt) is so high, that code is unmanteniable, and you are forced to refactor.

One of the worst piece of code to test is the following one.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image1.png)

ResultdatabaseInserter is a  **static class** that takes a block of data and perform massive insert/update/delete operation on a database with millions of records. The problem is not what the method to, but the fact that it is static.

The InsertData method has about 60 unit tests that verify that the complex massive operation are good, but it is used in some core section of the software. If the class XX uses InsertData static method to save the result of data elaboration you are in trouble, because usually you use the [four phase test](http://xunitpatterns.com/Four%20Phase%20Test.html).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image2.png)

If you start writing code that makes assertion on data in DB you surely will find problems. The first operation I usually do in this scenario is making the ResultdatabaseInserter class not static,  **convert the InsertData method to a virtual one** , and change every part of the code where you call the function, because it is not static anymore. To simplify the process I create a public property in every object that uses  **InsertData** function.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/04/image3.png)

The advantage of this approach is clear: first of all I do not modify the behavior of the code, because I did not modify code in the InsertData method, and then with lazy creation Iâ€™m able to get rid of initialization problem, if no one populate the DatabaseInserter property, the object simply creates an instance of the default inserter.

This modification did not introduce bugs, because I actually did not change the code, but now with this little modification Iâ€™m able to write this function in a fixture.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private SutClass CreateSut()
{
Sutclass sut;
using (AutoMockingContainer  container = new AutoMockingContainer())
{
container.Register(Component.For<SutClass>()
.ImplementedBy<SutClass>().LifeStyle.Transient);
sut = container.Resolve<SutClass>();
}
return sut;
}
{{< / highlight >}}

This function uses the AutoMockingContainer helper class that create a mock for every dependencies of the original class. The result is a new instance of SutClass where every dependency is resolved by a Mock ([thanks to RhinoMock](http://www.ayende.com/projects/rhino-mocks.aspx)) Now my test code look like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
SutClass sut = CreateSut();
... //prepare the sut, set expectation on mock etc etc
sut.Analyze(AnalyzerSources.Proximity, pageDataForAnalyzers);
AnalysisBlockData analysisBlockData = (AnalysisBlockData)
sut.DatabaseInserter.GetArgumentsForCallsMadeOn(
a => a.InsertData(null, null))
.First()[1];
Assert.That(analysisBlockData.ClieId, Is.EqualTo(clieId));
{{< / highlight >}}

I omitted the setup part, where I mock repository and create parameter to be passed to SUT; the real important stuff is in line 4, where I retrieve the argument passed to the InsertData function of my Mocked ResultDatabaseInserter and make assertion on it. With this little refactoring Iâ€™m able to completely avoid a call to the database, and thanks to Rhino Mock Iâ€™m able to setup assertion on parameter passed to any mock.

This is a standard example on how to refactor your code and use a [Test Double](http://xunitpatterns.com/Test%20Double.html) to make testing simpler.

Alk.

Tags: [RhinoMock](http://technorati.com/tag/RhinoMock) [Testing](http://technorati.com/tag/Testing)
