---
title: "Pass a serialized object in querystring with less chars"
description: ""
date: 2009-11-11T09:00:37+02:00
draft: false
tags: [Net]
categories: [NET framework]
---
Iâ€™ve some legacy code where stuff have to be passed with querystring, because we need to issue Get request to the server, and I need to pass various set of parameters for some reporting functions, but those parameters have 20 field, and are somewhat used as a tree. I decided to serialize everything and pass the result with querystring using HttpUtility.UrlEncodingâ€¦ the result was frustrating because the url are simply too long.

So I begin investigating on how to reduce data size of serialized object to be encoded with UrlEncode. This is the first solution

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (MemoryStream ms = new MemoryStream())
{
    BinaryFormatter f = new BinaryFormatter();
    f.Serialize(ms, param);
    serialized =HttpUtility.UrlEncode(ms.ToArray());
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

For a typical object it uses 3264 charachters.. ouch too much, so I try with compression

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (MemoryStream ms = new MemoryStream())
using (GZipStream gzstream = new GZipStream(ms, CompressionMode.Compress))
{
    BinaryFormatter f = new BinaryFormatter();
    f.Serialize(gzstream, param);
    gzstream.Flush();
    gzstream.Close();
    serialized = HttpUtility.UrlEncode(ms.ToArray());
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With compression I decreased the size to 2204 chars, still too much but If I look at the output string it is a really mess of escaping chars. UrlEncoding is not so good in encoding binary stream, a better solution is Base64

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (MemoryStream ms = new MemoryStream())
using (GZipStream gzstream = new GZipStream(ms, CompressionMode.Compress))
{
    BinaryFormatter f = new BinaryFormatter();
    f.Serialize(gzstream, param);
    gzstream.Flush();
    gzstream.Close();
    serialized = HttpUtility.UrlEncode(Convert.ToBase64String(ms.ToArray()));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I gzipped the serialized stream, then convert in Base64 and finally encoded with UrlEncode, the result is 1402 chars, really better but I want a string less than 1000 chars if possible. Since I know that DataContractSerializer produces a very compact string, I simply used it with a little trick

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (StringWriter sw = new StringWriter())
{
    DataContractSerializer serializer = new DataContractSerializer(param.GetType());
    XmlWriterSettings settings = new XmlWriterSettings();
    settings.OmitXmlDeclaration = true;
    settings.Indent = true;
    settings.NewLineOnAttributes = true;
    using (XmlWriter writer = XmlWriter.Create(sw, settings))
    {
        serializer.WriteObject(writer, param);
    }
    using (MemoryStream ms = new MemoryStream())
    using (GZipStream gzstream = new GZipStream(ms, CompressionMode.Compress))
    {
        Byte[] allcontent = Encoding.UTF8.GetBytes(sw.ToString());
        gzstream.Write(allcontent, 0, allcontent.Length);
        gzstream.Flush();
        gzstream.Close();
        serialized = HttpUtility.UrlEncode(Convert.ToBase64String(ms.ToArray()));
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I use DataContractSerializer to have a xml serialized stream, then I encode in UTF8 with Gzip compression, and finally I convert to Base64 and UrlEncode it, the result is 948 chars :) quite good, because now Iâ€™m under 1000 chars, respect the first version with plain binary serialization that was 3264 chars.

Alk.

Tags: [Microsoft.Net](http://technorati.com/tag/Microsoft.Net)
