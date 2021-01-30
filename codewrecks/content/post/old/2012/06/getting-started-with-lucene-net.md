---
title: "Getting Started with Lucenenet"
description: ""
date: 2012-06-20T16:00:37+02:00
draft: false
tags: [lucene,searching]
categories: [Tools and library]
---
I started working with [Lucene.Net](http://incubator.apache.org/lucene.net/) and I should admit that is a real powerful library, but it is really huge and needs a little bit of time to be mastered completely. Probably one of the best resource to keep in mind is the [FAQ](http://wiki.apache.org/lucene-java/LuceneFAQ), because it contains really most of the more common question you can have on Lucene and it is a good place to start. Another good place is the [Wiki](http://wiki.apache.org/lucene-java/FrontPage?action=show&amp;redirect=FrontPageEN) that contains other useful information and many other link to relevant resources.

Getting started with lucene.net is really simple, after you grabbed the bits and placed a reference in your project you are ready to search in your “documents”. Lucene has a set of basic concepts that you need to grasp before starting using it, basically it has  **Analyzers** that elaborate  **documents** to create  **indexes** that are stored  **Directory** and permits fast search; searches are done with  **IndexSearcher** that are capable of searching data inside a directory previously populated by analyzers and indexes. Now lets see how you can index two long string of text:

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (RAMDirectory directory = new RAMDirectory())
using (Analyzer analyzer = new Lucene.Net.Analysis.Standard.StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_29))
{
    String test = "la marianna la va in campagna......";
    String test2 = "Lorem Ipsum è un testo segnaposto.....";
    using (IndexWriter ixw = new IndexWriter(directory, analyzer))
    {

        Document document = new Document();

        document.Add(new Field("Id", test.GetHashCode().ToString(), Field.Store.YES, Field.Index.NOT_ANALYZED, Field.TermVector.NO));
        document.Add(new Field("content", test, Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS));
        ixw.AddDocument(document);

        document = new Document();
        document.Add(new Field("Id", test2.GetHashCode().ToString(), Field.Store.YES, Field.Index.NOT_ANALYZED, Field.TermVector.NO));
        document.Add(new Field("content", test2, Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS));
        ixw.AddDocument(document);
        ixw.Commit();

{{< / highlight >}}

The code can seem complex, but it is simpler than you can think if you observe it carefully. First of all we need to  **create a Directory** where we want to store the index, for this sample I use a RAMDirectory that simply stores everything in RAM and it is really fast and useful if you need to do quick search into text and you do not want to maintain the index for future searches. After the Directory you need to create an  **Analyzer**  **that is the component capable of analyzing the text**. Notice how both Directory and Analyzer are in a using clause, because you need to dispose them when you do not need them anymore.

Then I have two long strings to index, so I created an  **IndexWriter** that will use the directory and the analyzer previously created and finally  **I called AddDocument() adding documents to the index.** In Lucene a Document is nothing more than a bunch of  **Key and Value** pairs, that contains data you want to go into the index. The complexity of creating a document is deciding what to do with each pair because you need to tell exactly to lucene what you want to be indexed and/or included in the index. If you look at the  **Field** constructor the first two parameters are the name and value of the field, but they are followed by some specific Lucene enum values.

The first one is storage information, it can be  **YES, COMPRESS** or  **NO** , and basically tells lucene if the content of the field should be stored in the index (YES), stored but compressed (COMPRESS) or not stored (NO). You need to store content in document only if you are interested in retrieving it during a search. Suppose that you are writing an indexing system for data stored in an external Relational Database where you have a  **table with two column called Id and Content** , if you want to index that table with Lucene to find id of documents that contains specific text, you want to store in the index the original Id of the Database  Row to retrieve it with a  search. When you will issue a search you will be able to retrieve that value from the document returned from the query.

The  **second parameter is an enum that tells Lucene if the field should be analyzed** , in my example the Id field (I used the hashcode of the string to create an  unique id for this quick example, but in the previous scenario is is the id of a table in database) is not analyzed, because I do not need to search inside its content.  **The final constant specify to lucene if we want to store in the index the position of the various world that are contained in the text** , again for the Id field I do not need to analyze anything. For the content field I decided to store it in the index (Field.Store.YES) because I want the original text to be included in the index, I want it to be analyzed (Field.Index.Analyzed) because I want to search text inside it and finally I want to store count of terms with positions and offsets (Field.TermVector.WITH\_POSITIONS\_OFFSETS).

Finally I call Commit() method of the IndexWriter to make it flush everything to the Directory, if you forget to call Commit and you will open an IndexSearcher that pints to the same RAMDirectory, probably you will not find all the documents indexed, because the IndexWriter  **caches results in memory and does not write directly to the directory each time AddDocument is called.** In the next post I’ll show how easy is to search inside a lucene Index Directory.

Gian Maria.
