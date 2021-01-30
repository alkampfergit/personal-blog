---
title: "Unit Test class that makes use of HttpWebRequest thanks to Visual Studio fakes library"
description: ""
date: 2013-05-04T08:00:37+02:00
draft: false
tags: [Unit Testing]
categories: [Visual Studio]
---
Thanks to [Visual Studio Fakes](http://msdn.microsoft.com/en-us/library/hh549175.aspx) is it possible to isolate your unit test and testing *difficult to test code*. Today I need to test a class that issues some Web Request around the internet and I’m concerned about  **testing the SUT when the web response contains some specific code like 404** (Not Found) or something.

If you simply right-click the reference to system assembly in your project and Add a fakes assembly, you probably will be annoyed by the fact that when you try to create a ShimHttpWebRequest you are not able to do it. When some shim are not available, the reason is usually due to  **some limitation of fakes library, so types are skipped when shims and stub code are generated** (during compilation).

Apart not being able to use a shim of HttpWebRequest,  **when you add a fakes assembly to Visual Studio test project, you are actually asking to the fakes library to create a stub and a shim for every class of that assembly** , and this can be a problem because

1. Your build time increase
2. Some classes probably will not be generated due to Fakes Limitation

Solution is simple, just locate the System.Fakes files under Fakes directory of your test project, they usually contain only the name of the assembly and nothing more. This is the default and basically it means: Create a shim and a stub for every type in that assembly. You should change that file to  **specify only the types you are really going to use in your Unit Tests**. Es.

{{< highlight xml "linenos=table,linenostart=1" >}}


<Fakes xmlns="http://schemas.microsoft.com/fakes/2011/" Diagnostic="true">
  <Assembly Name="System" Version="4.0.0.0"/>
  <StubGeneration>
    <Clear />
  </StubGeneration>
  <ShimGeneration>
    <Clear />
    <Add FullName="System.Net.WebRequest!"/>
    <Add FullName="System.Net.HttpWebRequest!"/>
    <Add FullName="System.Net.HttpWebResponse!"/>
  </ShimGeneration>
</Fakes>

{{< / highlight >}}

This code is actually instructing the Fakes library on what class you are going to use. In the above example I’m telling that I’m not going to use any Stub and I want to use Shim for WebRequest, HttpWebRequest and HttpWebResponse. If you specify **only the classes you are really going to isolate, build time will be shorter, and there is much more possibility that shims gets generated**.

Remember also that when you create fake library for System assembly you actually will get two distinct fakes configuration, one for system, and the other for Mscorlib.fakes. I usually modify the mscorlib.fakes in such a way.

{{< highlight xml "linenos=table,linenostart=1" >}}


<Fakes xmlns="http://schemas.microsoft.com/fakes/2011/">
  <Assembly Name="mscorlib" Version="4.0.0.0"/>
  <StubGeneration>
    <Clear />
  </StubGeneration>
  <ShimGeneration>
  </ShimGeneration>
</Fakes>

{{< / highlight >}}

For some reason, I need not to clear ShimGeneration for Mscorlib entirely, because it will makes Unit Test stop with StackOverflowException in my system even if I’m not going to use any class for mscorlib.

Now I can write shim for HttpWebResponse

{{< highlight csharp "linenos=table,linenostart=1" >}}


ShimHttpWebResponse res = new ShimHttpWebResponse();
res.StatusCodeGet = () => HttpStatusCode.NotFound;

{{< / highlight >}}

This simple snippet created a fake response to identify a NotFound (404) web response. I can now proceed to isolate call to WebRequest to return that instance and write Unit Tests that isolates calls to WebRequest classes. A full possible test is the following.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Test]
public void Verify_behavior_on_404()
{
    using (ShimsContext.Create())
    {
        SolrServer sut = new SolrServer("http://nonexistent.url.it/solr/blbalba");
        sut.Logger = NullLogger.Instance;
        ShimHttpWebResponse res = new ShimHttpWebResponse();
        res.StatusCodeGet = () => HttpStatusCode.NotFound;

        ShimWebException wex = new ShimWebException();
        wex.ResponseGet = () => res;

        ShimHttpWebRequest.AllInstances.GetResponse = url => { throw (WebException) wex; };
        sut.RawSearch("*:*", "id,name", 0, 100);
    }
}

{{< / highlight >}}

With these few lines of code I’m telling that each request to all instance of HttpWebRequest should throw a specific WebException that will behave as I want. This absolutely invaluable if you need to test various response such of 403 if you are trying to simulate authentication or 500 if you need to simulate some particular error of called service. The good part of this kind of test is that  **the Sut was absolutely not designed to be unit tested**. Here is the code in the Sut that is issuing call to Solr server

{{< highlight csharp "linenos=table,linenostart=1" >}}


HttpWebRequest oRequest = (HttpWebRequest)WebRequest.Create(fullUrl);
if (Logger.IsDebugEnabled) Logger.Debug("Solar query " + fullUrl);
oRequest.Method = "GET";
HttpWebResponse oResponse = null;
try
{
    oResponse = (HttpWebResponse)oRequest.GetResponse();
}
catch (WebException e)

{{< / highlight >}}

As you can see the code directly create an HttpWebRequest and issue a GET Request, but  **thanks to fakes library during the test the call to GetResponse are detoured to my test code**.

*Remember also that after Visual Studio Quarterly Update 2 fakes library is now available even in Premium edition and not only Ultimate.*

Gian Maria
