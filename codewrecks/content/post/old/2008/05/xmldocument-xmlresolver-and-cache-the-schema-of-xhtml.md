---
title: "XmlDocument XmlResolver and cache the schema of XHTML"
description: ""
date: 2008-05-19T23:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
I’m working with a class created by my colleague, this class has a function that accept a uri, a string (that represent the content of a page) and tells me if in that string there are some links to an RssFeed. I have a full page content store in files, so I simply load files one by one and then pass to this function.

It seems to me that the execution is quite slow and looking into fiddler I found that almost each file I pass to the function the function download some files related to xml schema.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb6.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image6.png)

Since most of the page I have stored are in XHTMl format, something is happening inside that function to call the dtd for validation. In the code at certain point the function try to load the file in a XMLDocument and it use this code

{{< highlight csharp "linenos=table,linenostart=1" >}}
XmlDocument xml = new XmlDocument();
xml.LoadXml(page);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It turns out that XmlDocument validate the xml against the dtd schema of the xhtml, so each time I load new content the code download again and again the same dsd files of the schema showed above, this seems to me a tremendous waste of time and bandwidth. The solution seems to be easy, create your personalized XmlResolver, a component used internally by the XmlDocument to resolve external reference made from the xml file to external entities. The task was quite difficult because the documentation is not so clear, and because the XmlResolver itself is used in a very strange way. I first try to understand data passed to the functions creating this object

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class CachedXmlResolver : XmlUrlResolver
{
public override object GetEntity(Uri absoluteUri, string role, Type ofObjectToReturn)
{
    return base.GetEntity(absoluteUri, role, ofObjectToReturn);
}

public override Uri ResolveUri(Uri baseUri, string relativeUri)
{
    return base.ResolveUri(baseUri, relativeUri);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I simply call function from the base class, and I want only to understand how the object work…but…surprise, the ResolveUri gives me an exception telling me that it cannot find a file called -//W3C//DTD XHTML 1.0 Strict//EN..what happens…I only transparently delegate work to the base class. After some search I come to a solution, here is the full class

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    public class CachedXmlResolver : XmlUrlResolver
    {
        public override Uri ResolveUri(Uri baseUri, string relativeUri)
        {
            if (relativeUri == "-//W3C//DTD XHTML 1.0 Strict//EN")
                return new Uri("http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd");
            else if (relativeUri == "-//W3C XHTML 1.0 Transitional//EN")         
                return new Uri("http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd");
            else if (relativeUri == "-//W3C//DTD XHTML 1.0 Transitional//EN")
                return new Uri("http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd");
            else if (relativeUri == "-//W3C XHTML 1.0 Frameset//EN")
                return new Uri("http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd");
            else if (relativeUri == "-//W3C//DTD XHTML 1.1//EN")
                return new Uri("http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd");
            return base.ResolveUri(baseUri, relativeUri);
        }

        public override object GetEntity(Uri absoluteUri, string role, Type ofObjectToReturn)
        {
            if (!cache.ContainsKey(absoluteUri))
                GetNewStream(absoluteUri, role, ofObjectToReturn);
            return new FileStream(cache[absoluteUri], FileMode.Open, FileAccess.Read, FileShare.Read);
        }

        private void GetNewStream(Uri absoluteUri, string role, Type ofObjectToReturn) {
            using (Stream stream = (Stream)base.GetEntity(absoluteUri, role, ofObjectToReturn))
            {
                String filename = System.IO.Path.GetTempFileName();
                using (FileStream ms = new FileStream(filename, FileMode.Create, FileAccess.Write))
                {
                    Byte[] buffer = new byte[8192];
                    Int32 count = 0;
                    while ((count = stream.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        ms.Write(buffer, 0, count);
                    }
                    ms.Flush();
                    cache.Add(absoluteUri, filename);
                }
            }
        }

        public static Dictionary<Uri, String> cache = new Dictionary<Uri, String>();

    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a cachedXmlResolver, the secret is in resolveUri, when the caller pass some Well Known PUBLICID of dtd schema form xhtml, the only thing to do is to return the correct uri of the corresponding dtd. In GetEntity I simple create a dictionary of uri and tempfilename, the first time the dtd is requested, it is downloaded into a local temp file, then each subsequent request will take file from the disk and not from the net.

Alk.

Tags: [XmlDocument](http://technorati.com/tag/XmlDocument) [XHTML Validation](http://technorati.com/tag/XHTML%20Validation)

<!--dotnetkickit-->
