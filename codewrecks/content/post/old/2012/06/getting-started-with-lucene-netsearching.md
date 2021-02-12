---
title: "Getting started with LuceneNET-Searching"
description: ""
date: 2012-06-21T16:00:37+02:00
draft: false
tags: [lucene]
categories: [Tools and library]
---
Previous part of the series

- [Getting Started With Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/06/20/getting-started-with-lucene-net/)

In the previous part I’ve showed how easy is to create an index with lucene.net, but in this post I’ll start to explain how to search into it, first of all what I need is  **a more interesting example, so I decided to download a [dump of stack overflow](http://blog.stackoverflow.com/2009/06/stack-overflow-creative-commons-data-dump/)** , and I’ve extracted the Posts.Xml file (10 GB of XML file), then I wrote this  **simple piece of text to create the lucene index**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (FSDirectory directory = FSDirectory.Open(luceneDirectory))
using (Analyzer analyzerStandard =
    new Lucene.Net.Analysis.Standard.StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_29))
using (IndexWriter indexWriter = new IndexWriter(directory, analyzerStandard, IndexWriter.MaxFieldLength.UNLIMITED))
{
    Int32 i = 0;
    using (XmlReader reader = XmlReader.Create(@"D:\posts.xml"))
    {
        while (reader.Read())
        {
            if (reader.NodeType == XmlNodeType.Element &&
                reader.Name == "row")
            {
                Document luceneDocument = new Document();
                luceneDocument.Add(new Field("Id", reader.GetAttribute("Id"), Field.Store.YES, Field.Index.NO));
                luceneDocument.Add(new Field("content", reader.GetAttribute("Body"), Field.Store.NO, Field.Index.ANALYZED));
                indexWriter.AddDocument(luceneDocument);
                Console.CursorLeft = 0;
                Console.Write("Indexed Documents:" + ++i);
            }
        }
    }

    indexWriter.Optimize();
    indexWriter.Commit();
}

{{< / highlight >}}

This code is really similar to the previous post, the only difference is that the **Directory used to store the Index is a FSDirectory (File System Directory) because I want to create a permanent index on disk** , then I simply use a XmlReader to scan the file (10 GB Xml file needs to be read by an XMLReader because if you try other method you will find performance trouble), and I decided to analyze the attribute “Body” of the &lt;row&gt; node, storing the Id of the post.

Indexing such a huge amount of data needs time, but the most important thing I want to point out is the call to Optimize() before the call to Commit(). Basically  **Lucene.NET indexes are composed by segments of various length, more segments in an index, less performance you have** , but if you callOptimize() method lucene will collapse the index in a single segment, maximizing search performances. Remember that Optimization is a long and time consuming process because lucene needs to read all the index, merge them and rewrite a single file, so it worth calling it during low system usage time (es during the nigth if the system is idle), or after a big change of the index. You can also pass an integer to Optimize, specifying the maximum number of segments you want in the index; as an example you can specify 5 if you want your index to contains at maximum 5 segments (it is a good tradeoff because it can save time and have a good performing index).

In the above example  **the call to Optimize could be avoided entirely** ,  **because if you continue to add documents to the very same index, lucene try to keep the index optimized during writing** , if you start this program you can see lots file of about 7MB length created in the FSDirectory, after a little bit files get chained together so you see less and lager files. The call to optimize is really necessary if you modify the index lots of time closing and reopening the IndexWriter. Remember also that until you do not call Commit, if you open a IndexSearcher on the Index directory you do not see any of the new indexed documents.

 **After the index was created you can search on it simply using an Index reader and a Query Parser.** {{< highlight csharp "linenos=table,linenostart=1" >}}


using (FSDirectory directory = FSDirectory.Open(luceneDirectory))
using (Analyzer analyzerStandard = new Lucene.Net.Analysis.Standard.StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_29))
{
    QueryParser parser = new QueryParser("", analyzerStandard);
    using (IndexSearcher indexSearcher = new IndexSearcher(directory, true))
    {
        var query = parser.Parse("content:child*");
        TopDocs result = indexSearcher.Search(query, 20);
        Console.WriteLine("N° results in index:" + result.TotalHits);
        for (int i = 0; i < result.ScoreDocs.Length; i++)
        {
            var score = result.ScoreDocs&#91;i&#93;.Score;
            Document doc = indexSearcher.Doc(result.ScoreDocs&#91;i&#93;.Doc);
            var Id = doc.Get("Id");
            Console.WriteLine("Match id " + Id + " score " + score);
        }
    }
}
&#91;/sourcecode&#93;
</pre>
</div>

<p>The code is really simple, <strong>I open the directory and create an analyzer, then I need a QueryParser, an object capable of parsing query from string</strong>, that is really useful to parse user inserted strings. In my example <strong>I search all the documents where the Field content contains the word child* </strong>because the character <strong>* (asterisk)</strong> matches any number of chars. This query will match Child, Children, and so on. The query is in the form <strong>fieldname:searchstring</strong> but the first parameter of QueryParser constructor is the default field, this means that if you create the QueryParser in this way</p>

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:C89E2BDB-ADD3-4f7a-9810-1B7EACF446C1:e7073df1-a013-42ed-a230-9be1eedaf989" class="wlWriterEditableSmartContent"><pre style=white-space:normal>

QueryParser parser = new QueryParser("content", analyzerStandard);

{{< / highlight >}}

You can simply parse the query “child\*” instead of specifying “content:child\*” because the QueryParser automatically issue the query to field content. Lucene query syntax permits you to specify more complex query like this ***“+child\* +position\*”***that matches *all documents that contains both child\* and position\ **. You can use AND or and other advanced techniques like for example this query** *“child\* position\*”~10***that *search word child\* and position\* but matches only if the distance between them is less or equals to 10 words*. You can also search for similarity, if you search for * **Children~** *you are searching for terms similar to Children, so you can match terms like Chidren, a misspelled version of the word you are searching.

 **The result of a search is a simple object of type TopDocs that contains all the docs that matched in the ScoreDocs array** , it contains also the total number of matches in the field TotalHits. To show results you can simply cycle inside the ScoreDocs to get information about documents that matched the query. In this example, since I’ve not included the body in the index ( **Field.Store.NO** ) I can only retrieve the field “Id” from the document returned from the query, and I need to reopen the original XML file if I want to know the Body of the post that matches. If you do not want to reopen the original XML file to get the Body of the post, you can change Storage of the content field to Field.Store.COMPRESS.

{{< highlight csharp "linenos=table,linenostart=1" >}}


luceneDocument.Add(new Field("Id", reader.GetAttribute("Id"), Field.Store.YES, Field.Index.NOT_ANALYZED));
luceneDocument.Add(new Field("content", reader.GetAttribute("Body"), Field.Store.COMPRESS, Field.Index.ANALYZED));

{{< / highlight >}}

In*this example I’ve changed the Id from Field.Index.NO to Field.Index.NOT\_ANALYZED, this means that the Id field should not be analyzed, but you can search for exact match. If you leave the value as Field.Index.NO, as in the previous snippet, if you issue a query “Id:100” to find the document with Id = 100 you will get no result*. Content field is changed from Field.Store.NO to Field.Store.COMPRESS, this means that the entire unchanged value of the field is included in the index in compressed format and can be retrieved from the result of a query. Now you can get the original unchanged content calling doc.Get(“content”). The reason why you need to include the content in the index with the Field.Store.COMPRESS is due to the fact that  **indexes lose completely the original structure of the field if you specify Field.Index.ANALYZED, because the index only contains terms and you completely lost the original text**. Clearly such an index will occupy more space, but with compression is a good tradeoff, because you are immediately able to find original text without the need to go to to the original store (our 10 GB xml file in this example).

Just to conclude this second part I want to summarize the various usage of the Field.Store and Field.Index value for document fields.

A combination of  **Field.Store.YES and Field.Index.NO** is used usually to store data inside the document that will not be used to search, it is useful for Database Primary keys, or other metadata that you need to retrieve from the result of a search, but that you do not need to use in a search query.

A combination of  **Field.Store.YES and Field.Index.NOT\_ANALYZED or Field.Index.NOT\_ANALYZED\_NO\_NORMS** is used for fields that you want to use in a search, but should be treated as a single value, as for example Url, Single word, Database Index that you want to use on query, and all identifiers in general. You should use the NOT\_ANALYZED\_NO\_NORMS if you want to save index space and you will not use index boosting (an advanced feature of lucene).

A combination of  **Field.Store.YES (or Field.Store.COMPRESS) and Field.Index.ANALYZED** is used to store text you want to search into and that you want to retrieve from query result. This is useful if the original text is part of a document, or of a large file (as in this example) and retrieving it is a time consuming thing, so it can be better to store it in the index.

A combination of  **Field.Store.NO and Field.Index.ANALYZED** is used to store text you want to search into but you are not interested to retrieve from query result. This is useful if you have the original text in a database and you can retrieve it with a single fast query if needed.

Gian Maria
