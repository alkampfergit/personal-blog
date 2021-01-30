---
title: "Index documents content with Solr and Tika"
description: ""
date: 2014-06-24T06:00:37+02:00
draft: false
tags: [Solr,tika]
categories: [Solr]
---
I’ve blogged in the past about [indexing entire folders of documents with solr and Tika](http://www.codewrecks.com/blog/index.php/2013/05/25/import-folder-of-documents-with-apache-solr-4-0-and-tika/) with Data Import Handler. This approach has pro and cons. On the  **good side, once you’ve understand the basics, setting everything up and running is a matter of a couple of hours max, on the wrong side, using a DIH gives you little controls over the entire process**.

As an example, I’ve had problem with folder with jpg images, because the extractor crashes due to a missing library. If you do not configure correctly the import handler, every error stops the entire import process. Another problem is that document content is not subdivided into pages even if Tika can give you this kind of information. Finally,  **you need to have all of your documents inside a folder to be indexed**.  **In real situation it is quite often preferable to have more control over the index process. Lets examine how you can use tika from your C# code**.

The **easiest way is directly invoking the tika.jar file with Java** , it is quick and does not requires any other external library, just install java and uncompress tika in a local folder.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public TikaDocument ExtractDataFromDocument(string pathToFile)
{

    var arguments = String.Format("-jar \"{0}\" -h \"{1}\"", Configuration.TikaJarLocation, pathToFile);

    using (Process process = new Process())
    {
        process.StartInfo.FileName = Configuration.JavaExecutable;
        process.StartInfo.Arguments = arguments;
        process.StartInfo.WorkingDirectory = Path.GetDirectoryName(pathToFile);
        process.StartInfo.WindowStyle = ProcessWindowStyle.Minimized;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.ErrorDialog = false;
        process.StartInfo.CreateNoWindow = true;
        process.StartInfo.RedirectStandardOutput = true;
        var result = process.Start();
        if (!result) return TikaDocument.Error;
        var fullContent = process.StandardOutput.ReadToEnd();
        return new TikaDocument(fullContent);
    }

}

{{< / highlight >}}

This snippet of code simply  **invoke Tika passing the file you want to analyze as argument, it uses standard System.Diagnostics.Process.NET object and intercept all standard output to grab Tika output**. This output is parsed with an helper object called TikaDocument that takes care of understanding how the document is structured. If you are interested in the code you can find everything in the included sample, but it is just a matter of HTML parsing with HtmlAgilityToolkit. ES.

{{< highlight bash "linenos=table,linenostart=1" >}}


Meta = new MetaHelper(meta);
var pagesList = new List<TikaPage>();
Pages = pagesList;
Success = true;
FullHtmlContent = fullContent;
HtmlDocument doc = new HtmlDocument();
doc.LoadHtml(fullContent);
FullTextContent = HttpUtility.HtmlDecode(doc.DocumentNode.InnerText);

var titleNode = doc.DocumentNode.SelectSingleNode("//title");
if (titleNode != null) 
{
    Title = HttpUtility.HtmlDecode(titleNode.InnerText);
}
var pages = doc.DocumentNode.SelectNodes(@"//div[@class='page']");
if (pages != null)
{
    foreach (var page in pages)
    {
        pagesList.Add(new TikaPage(page));
    }
}
var metaNodes = doc.DocumentNode.SelectNodes("//meta");
if (metaNodes != null)
{
    foreach (var metaNode in metaNodes)
    {

{{< / highlight >}}

Thanks to TikaDocument class you can index content of single pages, in my example I simply send to Solr the entire content of the document (I do not care subdividing document into pages). This is the XML message for standard document update

{{< highlight csharp "linenos=table,linenostart=1" >}}


public System.Xml.Linq.XDocument SolarizeTikaDocument(String fullPath, TikaDocument document)
{
    XElement elementNode;
    XDocument doc = new XDocument(
        new XElement("add", elementNode = new XElement("doc")));

    elementNode.Add(new XElement("field", new XAttribute("name", "id"), fullPath));
    elementNode.Add(new XElement("field", new XAttribute("name", "fileName"), Path.GetFileName(fullPath)));
    elementNode.Add(new XElement("field", new XAttribute("name", "title"), document.Title));
    elementNode.Add(new XElement("field", new XAttribute("name", "content"), document.FullTextContent));
    return doc;
}

{{< / highlight >}}

To mimic how DIH works, you can use File System Watcher to monitor a folder, and index the document as soon some of the documents gets updated or added. In my sample I only care about file being added to the directory,

{{< highlight csharp "linenos=table,linenostart=1" >}}


static void watcher_Created(object sender, FileSystemEventArgs e)
{
    var document = _tikaHandler.ExtractDataFromDocument(e.FullPath);
    var solrDocument = _solarizer.SolarizeTikaDocument(e.FullPath, document);
    _solr.Post(solrDocument);
}

{{< / highlight >}}

This  **approach is more complex than using a plain DIH but gives you more control over the entire process and it is also suitable if documents are stored inside databases or in other locations**.

Code is available here: [http://sdrv.ms/17zKJdL](http://sdrv.ms/17zKJdL "http://sdrv.ms/17zKJdL")

Gian Maria.
