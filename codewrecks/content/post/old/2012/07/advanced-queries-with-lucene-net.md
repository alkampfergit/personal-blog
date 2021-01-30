---
title: "Advanced queries with LuceneNET"
description: ""
date: 2012-07-03T05:00:37+02:00
draft: false
tags: [lucene]
categories: [NET framework]
---
Previous part of the series

- [Getting Started With Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/06/20/getting-started-with-lucene-net/)
- [Searching and more detail on Documents Fields](http://www.codewrecks.com/blog/index.php/2012/06/21/getting-started-with-lucene-netsearching/)

In the previous parts I created a  **lucene.NET index that contains information about StackOverflow posts content** and I showed some basic searches. Suppose I create a new index where documents were created with these options

{{< highlight csharp "linenos=table,linenostart=1" >}}


luceneDocument.Add(new Field("Id", reader.GetAttribute("Id"), Field.Store.YES, Field.Index.NOT_ANALYZED));
luceneDocument.Add(new Field("content", reader.GetAttribute("Body"), Field.Store.COMPRESS, Field.Index.ANALYZED));

{{< / highlight >}}

With this document I’m able to retrieve the original content because I’ve specified lucene.NET to store original content inside the index in compressed format (Field.Store.COMPRESS), so I can write a stupid routine to search from a simple console application.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (FSDirectory directory = FSDirectory.Open(luceneDirectory))
using (Analyzer analyzerStandard = new Lucene.Net.Analysis.Standard.StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_29))
{
    QueryParser parser = new QueryParser("content", analyzerStandard);
    String searchString;
    while (!String.IsNullOrWhiteSpace(searchString = RequestGetStringToUser()))
    {
        using (IndexSearcher indexSearcher = new IndexSearcher(directory, true))
        {
            Query query = null;
            try
            {
                query = parser.Parse(searchString);
            }
            catch (ParseException pex)
            {
                Console.WriteLine("search string is not correct");
                continue;
            }

            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            TopDocs result = indexSearcher.Search(query, 3);
            stopWatch.Stop();
            Console.WriteLine("N°" + result.TotalHits + " found in  " + stopWatch.ElapsedMilliseconds + " ms. Press a key to look at top results");
            Console.Read();
            if (result.ScoreDocs.Length > 0)
            {
                for (int i = 0; i < result.ScoreDocs.Length; i++)
                {
                    var score = result.ScoreDocs&#91;i&#93;.Score;
                    Document doc = indexSearcher.Doc(result.ScoreDocs&#91;i&#93;.Doc);
                    var Id = doc.Get("Id");
                    var content = doc.Get("content");
                    Console.Clear();
                    Console.WriteLine("Result N°" + i);
                    Console.WriteLine("Post id " + Id + " score " + score);
                    Console.WriteLine(content);
                    Console.ReadKey();
                }
            }
            else
            {
                Console.WriteLine("No result found!");
            }
        }
    }
}
&#91;/sourcecode&#93;
</pre>
</div>

<p>The big advantage of Lucene indexing is the opportunity for the user to specify complex search queries with a natural syntax and letting lucene taking care of everything thanks to the <strong>QueryParser</strong> object. Then only task for the programmer is handling the eventual ParseException that can be raised if the user use a bad syntax for the query (Ex +-format). Now you can fire the program and try some searches, like for example <strong><em>Format* </em></strong>and here is the output.</p>

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:C89E2BDB-ADD3-4f7a-9810-1B7EACF446C1:75a2778c-445f-4e16-9f97-34dd8f356c28" class="wlWriterEditableSmartContent"><pre style=white-space:normal>

Insert search string:Format*
N°141649 found in  39 ms. Press a key to look at top results

{{< / highlight >}}

The amazing stuff is the speed of the response,  **it actually took 39 milliseconds to find that there are 141649 documents in the index that satisfy our query and to return information about the top 10**. The secret of this speed is in how the index is constructed internally, and the  **TopDocs** returned object that does not contains any document data but only information about how to retrieve matching documents. In fact you need to retrieve the document inside a for cycle to show results to the user.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/07/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/07/image.png)

 ***Figure 1***: *The results can now contain the original body of the post because it is included in the index.*

With such a simple console application you can explore all the different query you can issue. Remember that this example uses a QueryParser that was constructed specifying  **Content** as the default field to search **,** so the user can use a simpler syntax es:

-  **Format AND MIME** : Contains the word Format and MIME in the document.
- **Format\* AND MIME **: Contains the word MIME and a word that starts with Format
-** Forma? **: Contains a word that starts with Forma and have another char at the end
-** Forma?????**: contains a word that starts with Forma and contains another five char (es. *Forma* **TTING** )
-  **Format OR MIME** : Contains the word MIME or the word Format.
-  **Format AND NOT MIME** : Contains the word Format but not the word MIME

Boolean condition can be specified even with plus and minus symbols Es.

-  **Format MIME** : if you omit any boolean condition it is the same of the OR condition, this search string is *equivalent to Format OR MIME*
-  **+Format +MIME** : the plus sign is the same of AND, this search is *equivalent to Format AND MIME*
-  **+Format -MIME** : Contains the word Format but not the word MIME (prefixed with minus sign). Since the plus sign is not mandatory it is equivalent to  **Format -MIME** Clearly you can use parenthesis to alter the precedence Es:

-  **Format and (MIME OR Email)** : Contains the word Format and the word MIME or EMail. With such a query if the index contains many documents, probably the first returned will contains both the words MIME and Email because percentage of match is higher.
- **+Format\* –MIME +(email or message) **: Contains a word that starts with Format, does not contain the word MIME but contains email or message.

Then you have some advanced syntax to satisfy more specific searches

-** “MIME Format”**: with “ you are enforcing an exact phrase, it matches a document if contains the exact text *MIME Format*
-  **disambiguation~** : The tilde character tells to do a non-exact search so it can match a word that it is similar to disambiguation. This kind of query took more time to execute, because the index is not optimized to satisfy such a query.
-  **“Format Mime”~3** : Should contains the word Format and Mime and the relative position between the two should not exceed three terms.

As you can see you can express quite complex queries but usually you get surprised that a query like **\*ormat **should not work and gave exception when parsed. The exact exception is

> Cannot parse ‘\*ormat’: ‘\*’ or ‘?’ not allowed as first character in WildcardQuery

To make this query run  **you should activate an option into the QueryParser calling SetAllowLeadingWildcard()**  **method** passing true as single argument. Once you have set this option you can search with leading wildcard, but the response time is really slower, because for a standard index it requires a full traversal of the index itself. As an example searching for **\*ormat **takes 6957 milliseconds on my system while Forma\* takes only 22 milliseconds (the index is in a Fast Solid State Disk).

Gian Maria.,
