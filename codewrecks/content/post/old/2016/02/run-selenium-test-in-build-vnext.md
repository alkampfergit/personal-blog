---
title: "Run Selenium Test in build vNext"
description: ""
date: 2016-02-20T10:00:37+02:00
draft: false
tags: [Nunit,Testing]
categories: [Testing]
---
Previous Articles:

- [Parametrize NUnit Selenium Test to run with different browsers](http://www.codewrecks.com/blog/index.php/2016/02/19/parametrize-nunit-selenium-test-for-run-with-different-browsers/)

To run a Selenium test in a build vNext there are some modification to do apply to previous example. Let’s see how simple is running our Selenium Tests in a VSTS Build vNext.

The first modification requires  **adding a reference to PhantomJS, an Headless browser based on webkit that is capable of browsing a site and run javascript without a UI**. Since we are interested in running test in a build server, this is a requirement if the agent runs as a service and has not access to a UI. To use PhantomJS just reference [PhantomJS](https://www.nuget.org/packages/PhantomJS/) package on nunit and modify your base class to support this browser.

{{< highlight csharp "linenos=table,linenostart=1" >}}


switch (browser.ToLower())
{
    case "chrome":
        DirectoryInfo chromeDriverLocation = new DirectoryInfo(@".");
        WebDriver = new ChromeDriver(chromeDriverLocation.FullName);
        break;
    case "firefox":
        WebDriver = new FirefoxDriver();
        break;
    case "phantomjs":
        WebDriver = new PhantomJSDriver();
        break;

{{< / highlight >}}

Using Phantomjs is just a matter of creating a PhantomJSDriver with Selenium WebDriver test and the game is done. Now add “phantomjs” to test config file and you should be able to run the test.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image11.png)

 ***Figure 1***: *Selenium test that uses Phantomjs headless browser to run test.*

Now it is time to change the ValueSourceAttribute, to allow overriding the list of browser with an Environment Variable. While the Json Configuration file to configure tests is a really simple and useful solution for developers, running tests on their machines,  **when I need to run tests on a bulid server I want to be able to specify the list of browser with a build Variable**.

In build vNext, each variable you add to the build will be copied in an environment variable with the same name of the variable, converted in uppercase and with dot char substituted with underscore. If I use variable Selenium.BrowsersToTest the environment variable is called: SELENIUM\_BROWSERSTOTEST

Here is the new code of the ValueSourceAttribute that use that environment variable to find list of browsers to use.

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
        var envVar = Environment.GetEnvironmentVariable("SELENIUM_BROWSERSTOTEST");
        if (!String.IsNullOrEmpty(envVar))
        {
            return envVar.Split('|', ',', ';', ':');
        }
        else
        {
            var settings = File.ReadAllText("testParameters.json");
            var config = (JObject)JsonConvert.DeserializeObject(settings);
            var seleniumSettings = config["Selenium"];
            var browsers = (JArray)seleniumSettings["BrowsersToTest"];

            return browsers
               .Select(b =&gt; b.ToString())
               .ToArray();
        }
    }
}

{{< / highlight >}}

The only change is that the attribute searches an envorinment variable called SELENIUM\_BROWSERSTOTEST to grab list of browser. If the variable is not present, it use json configuration file as showed in previous article. Now we can choose browser list directly from build definition.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image12.png)

 ***Figure 2***: *Specifying browser list with Build Variables.*

Variables can be specified a Queue Time, this allow the user to change browserslist event when queueing a new build. Here is the result of a run

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image13.png)

 ***Figure 3***: *Outcome of the test using browsers list from build variable*

Previous build outcome of  **Figure 3** is obtained  **running the test with an agent that does not run as a service, because it should be able to launch browser and access UI**. If I queue the same build with Hosted Agent, or with an Agent that is running as a service, here is the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image14.png)

 ***Figure 4***: *Failure running selenium tests*

The problem with  **queued agent is that he has no firefox installed, but even with firefox installed, it would not be able to run the test because hosted agent runs as a service and has no access to UI**. To solve this problem we can modify our ValueSourceAttribute

{{< highlight csharp "linenos=table,linenostart=1" >}}


  public class BrowserList : ValueSourceAttribute
    {
        private static IEnumerable Browsers;

        public BrowserList()
            : base(typeof(BrowserList), "Browsers")
        {
        }

        static BrowserList()
        {
            Browsers = GetBrowserFromConfig();
            if (!Environment.UserInteractive)
            {
                Browsers = Browsers
                   .Where(b =&gt; b.ToLower() == "phantomjs")
                   .ToArray();
            }
        }

        private static IEnumerable GetBrowserFromConfig()
        {
            var envVar = Environment.GetEnvironmentVariable("SELENIUM_BROWSERSTOTEST");
            if (!String.IsNullOrEmpty(envVar))
            {
                return envVar.Split('|', ',', ';', ':');
            }
            else
            {
                var settings = File.ReadAllText("testParameters.json");
                var config = (JObject)JsonConvert.DeserializeObject(settings);
                var seleniumSettings = config["Selenium"];
                var browsers = (JArray)seleniumSettings["BrowsersToTest"];

                return browsers
                   .Select(b =&gt; b.ToString())
                   .ToArray();
            }
        }
    }

{{< / highlight >}}

A couple of modification are worth of notice, the first one is that initialization of browser list is done in static constructor, and it will be executed once for each test run.

 **Then, if the test is not executing in a UserInteractive session, the attribute remove all browsers except phantomjs, the only ones that is guaranteed to run without having access to a UI.** With this simple trick we avoid to run tests that will fail because they could not run. To understand which browser can run with agent running as a service you can simply try to run all of them and verify which ones returns error. Actually some browser can run in headless mode (without UI) so they can be used even if the agent has no access to the UI, so use this technique to remove all browsers that does not supports this mode.

To verify that everything works, I changed configuration of my Visual Studio Agent to run as a service instead that running interactively and queued a new build. Here is the result of the Tests.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/02/image15.png)

 ***Figure 5***: *Now only phantomjs test is run because agent is running as a service*

Gian Maria.
