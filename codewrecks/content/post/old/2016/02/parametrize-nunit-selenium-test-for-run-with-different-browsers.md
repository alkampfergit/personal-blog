---
title: "Parametrize NUnit Selenium Test to run with different browsers"
description: ""
date: 2016-02-19T15:00:37+02:00
draft: false
tags: [Nunit,Testing]
categories: [Testing]
---
Parametrizing NUnit Tests is a new feature introduced with [version 2.5](http://nunit.org/index.php?p=parameterizedTests&amp;r=2.5) and this feature can be really useful in a variety of scenarios, but when it is time to use Selenium this is a killer feature.

I’m not going to cover Selenium WebDriver component, but basically it allows to write tests that can drive a Browser to execute test against your web application. In this scenario  **a killer feature is being able to specify the list of the browsers to use in a way that is completely indipendent from your test**.

Thanks to the [ValueSourceAttribute](http://nunit.org/index.php?p=valueSource&amp;r=2.6.4) obtaining this result is really simple. First of all I create a base class for the test that creates different Selenium Web Drivers based on a string specified as argument.

{{< highlight csharp "linenos=table,linenostart=1" >}}


 public class SeleniumTestFixtureBase
    {
        protected IWebDriver WebDriver;
        public void Initialize(String browser)
        {
            switch (browser.ToLower())
            {
                case "chrome":
                    DirectoryInfo chromeDriverLocation = new DirectoryInfo(@".");
                    WebDriver = new ChromeDriver(chromeDriverLocation.FullName);
                    break;
                case "firefox":
                    WebDriver = new FirefoxDriver();
                    break;
                default:
                    throw new NotSupportedException("Browser " + browser + " not supported");
            }
        }
    }

{{< / highlight >}}

This is really trivial, and for this example I’m going to support only chrome and firefox. Then  **I create a json configuration file where I specify every parameter** needed by Unit Tests.

> Using an external json file to specify parameters for your Unit Test makes trivial passing those parameters for every runner (VS, TeamCity, GUI, command line runner).

This is a simple configuration file that contains only the list of the browsers I want to use. Remember to ask Visual Studio to copy this file in output folder when it changes.

{{< highlight jscript "linenos=table,linenostart=1" >}}


{
  "Selenium": {
    "BrowsersToTest": ["Firefox", "Chrome", "IE"]
  }
}

{{< / highlight >}}

I’ve choosen Json because it is easy to write and easy to parse. Now it is time to create my attribute based on ValueSourceAttribute; it will read the above configuration file and provide the list of the browsers I want to use.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class BrowserList : ValueSourceAttribute
    {
        private static IEnumerable Browsers;
        public BrowserList()
            : base(typeof(BrowserList), "Browsers")
        {
            Browsers = GetBrowserFromConfig();
        }
        private static IEnumerable GetBrowserFromConfig()
        {
            var settings = File.ReadAllText("testParameters.json");
            var config = (JObject) JsonConvert.DeserializeObject(settings);
            var seleniumSettings = config["Selenium"];
            var browsers = (JArray)seleniumSettings["BrowsersToTest"];
            return browsers
               .Select(b =&gt; b.ToString())
               .ToArray();
        }
    }

{{< / highlight >}}

Again, this is a simple and trivial class that simply looks for a testParameters.json in the test run directory and search for the Selenium.BrowserToTest array, that containing the list of the browser to use as test.

> Thanks to ValueSourceAttribute we can drive and parametrize the test with a simple external file.

Thanks to those two classes, I can simply specify for each test the Browsers List I want to use.

{{< highlight csharp "linenos=table,linenostart=1" >}}


    [TestFixture]
    public class ParametrizedSeleniumTest : SeleniumTestFixtureBase
    {
        [Test]
        public void Test_Browsers([BrowserList] String browser)
        {
            base.Initialize(browser);
            WebDriver.Navigate().GoToUrl("http://www.microsoft.com");
            WebDriver.Close();
        }
    }

{{< / highlight >}}

Using BrowserList attribute I’m asking Nunit to create an instance of that attribute to get the list value to be bind to that specific parameter. For each value a different test is created. Now if I build my project I can verify from VS Test Runner that indeed I have three different test to run.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image8.png)

 ***Figure 1***: *My test running with different versions of browsers*

If I run the tests, as I’m expecting, the IE based test fails because I’ve not configured my test to use IE Driver.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image9.png)

 ***Figure 2***: *Test output with Visual Studio Test Runner.*

Now remove the IE from the list of Browsers to use in the testParameters.json and rebuild the solution. The IE version of the test now is disappeared from Test Runner.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image10.png)

 ***Figure 3***: *Changing test configuration parameter and rebuilding will update test list*

> This technique does not depend on anyhthing, and can be used to run test with different configuration if you need (dev machine, different build machines, etc).

Thanks to this technique you can specify whitch browser to use with a simple configuration file and  **this is a killer feature if you are planning to run test during the build**. You can simply modify your testParameters.json file before running the test in your Build to choose which browser to use, or disable completely selenium testing specifying an empty array.

Another option is keeping the list of browsers to use as a comma separated string stored in an Environment Variable, something like

SELENIUM\_BROWSERS=Ie,chrome,firefox

With such a technique you  **can run the test and let the environment specify whitch browser are available to use for testing in that environment**.

Gian Maria.
