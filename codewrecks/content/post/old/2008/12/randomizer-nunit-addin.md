---
title: "Randomizer nunit addin"
description: ""
date: 2008-12-06T05:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Nunit can be extended in many way writing simple addins, I never tried to write an addin but since Nunit have some limitations I do not like I tried to create a very simple addin that permits me to randomize execution of tests.

Randomization is really an interesting stuff because it helps to find interacting tests since at each execution we run tests in different orders. The code can be found at this subversion repository ([http://dotnetmarcheproject.googlecode.com/svn/trunk/Common/DotNetMarche.NunitExtension](http://dotnetmarcheproject.googlecode.com/svn/trunk/Common/DotNetMarche.NunitExtension "https://dotnetmarcheproject.googlecode.com/svn/trunk/Common/DotNetMarche.NunitExtension")) and it is quite rough but it works.

Basically a Nunit addin is a class that implements IAddin, here is my addin

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    [NUnitAddin(Name ="Randomizer")]
    public class RandomizerAddIn : NUnitTestFixtureBuilder, IAddin 
    {
        public const string RandomizerTestAttribute = "DotNetMarche.NunitExtension.Attributes.RandomizeTestOrderFixtureAttribute";

        #region IAddin Members

        public bool Install(IExtensionHost host)
        {
            IExtensionPoint testCaseBuilders = host.GetExtensionPoint("SuiteBuilders");
            if (testCaseBuilders == null)
            {
                return false;
            }

            testCaseBuilders.Install(this);
            return true;
        }

        #endregion

        public override bool CanBuildFrom(Type type)
        {
            return Reflect.HasAttribute(type, RandomizerTestAttribute, true);
        }

        protected override TestSuite MakeSuite(Type type)
        {
            return new RandomizerTestFixture(type);
        }
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see Iâ€™m inheriting from NunitTestFixtureBuilder class from NUnit framework, and simply add the IAddin interface. The CanBuildFrom is the method that tells to nunit if we can handle a class, I simply search for a custom attribute. To customize the suite you can override the MakeSuite method returning a TestSuite Object. HEre is mine

{{< highlight CSharp "linenos=table,linenostart=1" >}}
class RandomizerTestFixture : TestFixture
    {
        public RandomizerTestFixture(Type fixtureType)
            : base(fixtureType)
        {
            this.fixtureSetUp = NUnitFramework.GetFixtureSetUpMethod(fixtureType);
            this.fixtureTearDown = NUnitFramework.GetFixtureTearDownMethod(fixtureType);
        }

        protected override void DoOneTimeSetUp(TestResult suiteResult)
        {
            base.DoOneTimeSetUp(suiteResult);
            suiteResult.AssertCount = NUnitFramework.GetAssertCount(); 
        }

        protected override void DoOneTimeTearDown(TestResult suiteResult)
        {
            base.DoOneTimeTearDown(suiteResult);
            suiteResult.AssertCount += NUnitFramework.GetAssertCount();
        }

        private List<Test> randomList;

public override System.Collections.IList Tests
{
    get
    {
        return randomList ?? (randomList = RandomizeList()); 
    }
}

private List<Test> RandomizeList()
{
    Random rnd = new Random();
    return base.Tests.Cast<Test>().OrderBy(n => rnd.Next()).ToList();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I simply inherits from the TestFixture standard fixture of nunit, and overriding the Tests collection with a simple LINQ trick I randomize the first time the list is accessed giving the tests in random order. Now I copy the dll into the addins directory where I installed nunit and can write tests like this.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[RandomizeTestOrderFixture]
public class RandomizerFixture
{

    [Test]
    public void TestA()
    {
        Console.WriteLine("TESTA");
    }

    [Test]
    public void TestB()
    {
        Console.WriteLine("TESTB");
    }

    [Test]
    public void TestC()
    {
        Console.WriteLine("TESTC");
    }

    [Test]
    public void TestD()
    {
        Console.WriteLine("TESTD");
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now I fire nunit and look at the console output, basically it works but it has some drawbacks. Since each run the test are in different order the nunit gui have some problems, each run it randomatically add tests to the interface :(

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/12/image-thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/12/image.png)

If you run inside Visual studio with TestDriven.Net you do not have any problem, but the console gui seems not to like the fact that test are always given in different order each run.

alk.

Tags: [Nunit Addin](http://technorati.com/tag/Nunit%20Addin)
