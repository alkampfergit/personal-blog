---
title: "Using Pex in more complex environment a tale of"
description: ""
date: 2009-08-10T02:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Some post ago I [blogged](http://www.codewrecks.com/blog/index.php/2009/06/16/pex-to-the-rescue/) about [Pex](http://research.microsoft.com/en-us/projects/Pex/), in that post I showed how to use pex to test a routine that does string manipulation, now that I have build a Msbuild Task (as blogged in this [post](http://www.codewrecks.com/blog/index.php/2009/08/01/writing-extension-for-msbuild/)) I want to try pex to analyze that task and find errors. If you simply run pex again the Execute method of the task you will obtain an error like this.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image1.png)

For those that know well [MsBuild](http://msdn.microsoft.com/en-us/library/ms171452.aspx) this error occours because the BuildEngine was not initialized, and this is obvious, because Pex have no idea on how to create a valid PeekTask to test. Pex is very good in telling you what is wrong, and how to correct,

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image2.png)

From the Testability tab pex is telling me that it guess how to build the task, it correctly suggest me that I need to specify the IBuildEngine and the ITaskHost. Clearly pex can build a specific factory method for you

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image3.png)

Since pex needs to do a series of steps to enable your mstest project to run Pex specific tests, it gives you a preview of all operation that it will perform if you press ok

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image4.png)

It even take care of adding everything is needed to run the pex test. It specifically creates a factory for the object that pex will use to test the object itself. This is needed because pex does not know how to build correctly an object, so it ask you to create a method that accepts simple parameters and creates an object. I edited the factory method in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
public static partial class XmlPeekFactory
{
    private static IBuildEngine engineStub = MockRepository.GenerateStub<IBuildEngine>();
    private static ITaskHost hostStub = MockRepository.GenerateStub<ITaskHost>();
    [PexFactoryMethod(typeof(XmlPeek))]
    public static XmlPeek Create(
        string value_s,
        string value_s1,
        bool value_b,
        string value_s2)
    {
        XmlPeek xmlPeek = new XmlPeek();
        xmlPeek.XPath = value_s;
        xmlPeek.FilePath = value_s1;
        xmlPeek.FailIfError = value_b;
        xmlPeek.Value = value_s2;
        ((Task)xmlPeek).BuildEngine = engineStub;
        ((Task)xmlPeek).HostObject = hostStub;
        return xmlPeek;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Please not the Attribute PexFactoryMethod(typeof(XmlPeek)) that is used internally by pex to understand how to create an instance of XmlPeek. To solve dependencies to IBuildEngine and ITaskHost I simply creates a couple of stub with rhino mocks. Now if I run pex again I encounter this problem

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image5.png)

Well, actually pex is complaining that he found a System.Io.File.Exists call, so it cannot generate tests because accessing file from the test is not permitted. This happens because files are part of the *environment*, and you must not interact with the environment during a pex test, since pex cannot modify the environment itself. The only things that I can do is to test directly the Peek function that does XPath logic instead of testing the PeekTask class. Again you can find that pex does not xnow well the concept of Xml and XElement, but now we know the trick and we can create a very simple factory like this.

{{< highlight xml "linenos=table,linenostart=1" >}}
[PexFactoryMethod(typeof(XElement))]
public static XElement Create(XElement other_xElement1, object annotation_o)
{
    XElement xElement = XElement.Parse("<root><anode attribute='test' /></root>");
    return xElement;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

and run pex again you can verify that pex indeed find a couple of errors.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image6.png)

OOpps, I forgot completely to test if the xpath string was in correct format and I forgot to test for null arguments like a null Xpath. To solve this problem I simply trap the XPAthException returning null to the caller. Running pex again I can verify that it does not find any other errors.

At the end of this little sample I came to this consideration

1. pex is really flexible, thanks to the concept of object factory you can create a factory method that will be used to test your object
2. pex is still rough, since it does not know anything about XML and it cannot really test methods that deal with xml
3. pex is good in finding some standard programming mistake, as not to validate properly parameters of function

in the end it seems to me that pex can give you good added value to spot out common mistakes.

alk.

Tags: [Pex](http://technorati.com/tag/Pex)
