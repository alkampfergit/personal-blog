---
title: "Index your blog using tags and lucenenet"
description: ""
date: 2012-08-25T08:00:37+02:00
draft: false
tags: [lucene]
categories: [LuceneNET]
---
- [Getting Started With Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/06/20/getting-started-with-lucene-net/)
- [Searching and more detail on Documents Fields](http://www.codewrecks.com/blog/index.php/2012/06/21/getting-started-with-lucene-netsearching/)
- [Advanced Queries with Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/07/03/advanced-queries-with-lucene-net/)
- [Case Sensitivity in Lucene.NET Searches](http://www.codewrecks.com/blog/index.php/2012/07/05/case-sensitivity-in-lucene-search/)
- [Faceted searches with Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/07/20/faceted-searches-with-lucene-net/)
- [Assign Tag To Lucene documents](http://www.codewrecks.com/blog/index.php/2012/08/21/assign-tag-to-lucene-documents/)

In the last part of my series on Lucene **I show how simple is adding tags to document to do a simple tag based categorization** , now it is time to explain how you can automate this process and how to use some advanced characteristic of lucene. First of all I write a specialized analyzer called TagSnowballAnalyzer, based on standard SnowballAnalyzer plus a series of keywords associated to various tags, here is how I construct it.

{{< highlight csharp "linenos=table,linenostart=1" >}}


TagSnowBallAnalyzer tagSnowball = new TagSnowBallAnalyzer("English");
tagSnowball.AddTag("Nhibernate", "orm", 5);
tagSnowball.AddTag("HQL", "orm", 3);
...

{{< / highlight >}}

With the above code*****I’m telling my analyzer that the word NHibernate is related to tag “orm” with a  weight of 5 and the keyword HQL is related to the same tag with a  weight of 3 and so on*. Now that **the analyzer has a series of words associated to tags** and it can use this information to automatically add tags to document during the analysis process. *All the work is done inside a specialized TagFilter that is capable of adding tag as synonym during the tokenization process*.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class TagFilter : TokenFilter
{
    public IDictionary<String, Tag> tags;

    public TagFilter(TokenStream inStream, IDictionary<String, Tag> tags)
        : base(inStream)
    {
        currentTagStack = new Stack<Tag>();
        termAttr = (TermAttribute)AddAttribute(typeof(TermAttribute));
        posIncrAttr = (PositionIncrementAttribute)AddAttribute(typeof(PositionIncrementAttribute));
        payloadAttr = (PayloadAttribute)AddAttribute(typeof(PayloadAttribute));
        this.tags = tags;
    }

    private Stack<Tag> currentTagStack;
    private State currentState;
    private TermAttribute termAttr;
    private PositionIncrementAttribute posIncrAttr;
    private PayloadAttribute payloadAttr;

    /// <summary>
    /// This is the function that I need to increment the token and return other token
    /// </summary>
    /// <returns></returns>
    public override bool IncrementToken()
    {
        if (currentTagStack.Count > 0)
        {
            //Still have synonym to return
            Tag tag = currentTagStack.Pop();
            RestoreState(currentState);
            termAttr.SetTermBuffer(tag.ConvertToToken());
            posIncrAttr.SetPositionIncrement(0);
            payloadAttr.SetPayload(new Payload(PayloadHelper.EncodeInt(tag.Weight)));
            return true;
        }
        //verify if the base stream still have token 
        if (!input.IncrementToken())
            return false;

        //token was incremented
        String currentTerm = termAttr.Term();
        if (tags.ContainsKey(currentTerm))
        {
            var tag = tags[currentTerm];
            currentTagStack.Push(tag);
        }
        currentState = CaptureState();
        return true;
    }
}

{{< / highlight >}}

There are various code around the net on how to add synonyms with weight, [like described in this stackoverflow question](http://stackoverflow.com/questions/1248039/synonyms-using-lucene), standard java lucene code has a [SynonymTokenFilter](http://lucene.apache.org/core/old_versioned_docs/versions/3_0_1/api/all/org/apache/lucene/wordnet/SynonymTokenFilter.html) in the codebase, but  **this example shows how simple is to write a Filter to add tags as synonym of related words**.   First of all *the filter was initialized with a dictionary of keyword and Tags, where Tag is a simple helper class that stores Tag string and relative weight*, it also have a ConvertToToken() method that returns the tag enclosed by | (pipe) character. The use of pipe character is done to explicitly mark tags in the token stream, any word that is enclosed by pipe is by convention a tag.

The above code is a standard customization of a TagFilter, a component that is capable to filter tokens during the analysis process. *All the work is done inside the IncrementToken method*. Lets start to examine this method from the middle:  **a call to IncrementToken() method of base class permits toadvance to the next term** , if there is another term in the stream * **I grab its value with a call to termAttr.Term() method** *. The base token has no properties, but it contains only attributes managed by external objects, this permits to add whatever attribute you want without changing base code or adding property to a base token class. Once I got a reference to the string representing the next token it is time to handle tag management.

 **If the current word is associated to a tag I push related tag on the stack and returns the current token without any modification.** When the method return another call is done to IncrementToken() method to grab the next token;  **now I have a Tag into the stack meaning that the previous word was associated to that tag**. I should pop the tag from the stack, call RestoreState() method on base class and finally call SetTermBuffer() passing a converted token (token surronded by pipe character) to set the tag as the value of the next token. The call to SetTermBuffer actually set the value of the current term and the following call to SetPositionIncrement() tells the analyzer that this new term has the same position in the stream as the previous one. **Actually what I’ve done with this code is inserting a synonym of the previous token**.  **This is a standard technique you can use even if you have an english dictionary and want to do analysis based on synonym**.

Finally I call SetPayload() method to add weight of the tag as payload to the current term. The payload is basically a stream of bytes that is associated to a term, it is stored inside the index and can be used during the query process. To easy the handling of this stream of bytes the PayloadHelper class should be used to save and retrieve values avoiding raw manipulation of payload stream.( If you run the sample with a debugger and step through the code everything will be clear). Now you can use this new filter inside the custom analyzer.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public override TokenStream TokenStream(string fieldName, TextReader reader)
{
    TokenStream stream = new StandardTokenizer(Lucene.Net.Util.Version.LUCENE_29, reader);
    stream = new StandardFilter(stream);
    stream = new LowerCaseFilter(stream);
    if (this.stopSet != null)
    {
        stream = new StopFilter(true, stream, this.stopSet);
    }
    //Now synonym
    stream = new SnowballFilter(stream, this.name);
    return new TagFilter(stream, tags);
}

{{< / highlight >}}

This code is inside my custom analyzer and it is the standard constructor of Snowball Analyzer but in the last line it adds my new TagFilter to the list of filters to do tag analysis. **Now suppose to feed the string *“I usually use nhibernate in all of my projects”* to this analyzer, here is the resulting token stream **.

1:[i] 2:[usual] 3:[use]** 4:[nhibern] 4:[|orm|] **5:[in] 6:[all] 7:[of] 8:[my] 9:[project]

As you can see the word nhibernate was stemmed by snowball filter but the key fact is that in position 4 of the resulting stream there are two words:** first one is the original word *nhibernate* present in the stream **,** second one is the tag I’ve inserted as synonym **. Since both word occupy the position number 4 of the resulting stream, they are equivalent in the index and they are to all extent managed like synonym.

Now I need another class to manage my payload during query, this is necessary because I want use my payload to alter match score of documents during query process.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class TagWeightSimilarity : DefaultSimilarity
{
    public override float ScorePayload(int docId, string fieldName, int start, int end, byte[] payload, int offset, int length)
    {
        if (payload != null)
            return PayloadHelper.DecodeInt(payload, offset);
        return 1;
    }
}

{{< / highlight >}}** TagWeightSimilarity is a class that use the payload in a term to return a value that will be used during score calculation **. If you look in the sample code you will find this code for a typical tag query.

{{< highlight csharp "linenos=table,linenostart=1" >}}


indexSearcher.SetSimilarity(new TagWeightSimilarity());

Query query = new PayloadTermQuery(
    new Term("content", "|orm|"),
    new SumPayloadFunction());

{{< / highlight >}}

As you can see I set the similarity in the index searcher and use a** specific query of type PayloadTermQuery, a specialized version of standard TermQuery that accepts not only a term but also a class that is capable to combine payload value **. Class SumPayloadFunction  is really simple and it contains only a ScorePayload() method called for each match to combine the various payload values. In this example I simply sum together all the payload so each document score is affected by how many words associated to tags and relative weight.

Finally** I want also to assign tag fields to the document as explained in the last article **, this is really simple because I’ve used the same logic to create another filter called NoTagRemover that basically removes all tokens except those one that have an associated tag. All tags are returned as a single string with format tag|weight and it can be used during document creation to add each tag as separate field.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var tokens = analyzer.GetTagFinder(new StringReader(content));
TermAttribute termAttribute = (TermAttribute)tokens.AddAttribute(typeof(TermAttribute));
Dictionary<String, List<Tag>> tags = new Dictionary<String, List<Tag>>();
while (tokens.IncrementToken())
{
    String term = termAttribute.Term();
    String[] termPart = term.Split('|');
    String tagstring = termPart[0];
    Int32 weight = Int32.Parse(termPart[1]);
    if (!tags.ContainsKey(tagstring))
    {
        tags.Add(tagstring, new List<Tag>());
    }
    Tag tag = new Tag() { TagName = tagstring, Weight = weight };
    tags[tagstring].Add(tag);
}

//now I have all the tags, so I can add tag to the document.
foreach (var tagEntry in tags)
{
    //I store the sum+ of all the weight of the tags.
    var allTags = tagEntry.Value;
    Int32 maxWeight = allTags.Sum(t => t.Weight);
    document.Add(new NumericField(tagEntry.Key, Field.Store.YES, true).SetIntValue(maxWeight));
}

{{< / highlight >}}

This code is really simple, just tokenize the input stream with NoTagFilter, for each tag split it based on | character and sum all the weights together for each tags.** At the end of the process you have a list of tags with associated weight so you can add them as NumericField to the document **(as explained in last article). Finally it is time to issue query, like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}


Query query = new PayloadTermQuery(
    new Term("content", "|orm|"),
    new SumPayloadFunction());

{{< / highlight >}}

I’m basically searching for** all documents that contains terms associated with tag orm**, and I can search “|orm|” directly inside the content of the document, because tags are stored inside the index as synonym. This produces the following result.

*<font size="2">Found Match for id=6 score=3,989792 tags=[orm:13]<br>
      <br>Found Match for id=1 score=1,476607 tags=[orm:5] </font>*

Found Match for id=2 score=1,033625 tags=[nosql:5] [orm:5]

Found Match for id=6 score=0,7087715 tags=[orm:3]

As you can see the  **score is greater than 1 because it is altered by the payload** , the first result has a score of 3,9 and has an associated orm tag with final weight of 13 because it contains several words associated with orm tag. The third document has two tags: orm and nosql, because it contains words associated to nosql tag but everything is done automatically, you need only to associate specific words to tags. You can also use standard numeric query to query for tags associated to the whole document

*<font size="2">query = NumericRangeQuery.NewIntRange(&quot;orm&quot;, 10, Int32.MaxValue, true, true);</font>*

This is the same technique shown in the old post. *As for every customization done in lucene it is a good practice to create a specific Query Parser that is capable of parsing a query to make simpler to issue a query*. If*I want to find documents that contains words associated to the tag orm I need to issue a PayloadTermQuery searching for "|orm|” in content field*. The use of pipe characters is used to distinguish between regular terms of the field and tags that were injected by custom analyzer, but it is a really bad practice to expose this fact to the user because the use of pipe/synonym/payload are all internal details that should be hidden to final user.  **Here is the GetFieldQuery method of a customized queryparser that does the trick** {{< highlight csharp "linenos=table,linenostart=1" >}}


public override Lucene.Net.Search.Query GetFieldQuery(string field, string queryText)
{
    //if field is tag issue a standard query tag.
    if (field.Equals("tag", StringComparison.OrdinalIgnoreCase)) {
        return new PayloadTermQuery(
                new Term("content", "|" + queryText + "|"),
                new SumPayloadFunction());
    }

    //if field is a base field, use standard query parser routine.
    if (field.Equals("content", StringComparison.OrdinalIgnoreCase) ||
        field.Equals("id", StringComparison.OrdinalIgnoreCase))
    {
        return base.GetFieldQuery(field, queryText);
    }

    //all other fields are tags.
    Int32 value = Int32.Parse(queryText);
    return NumericRangeQuery.NewIntRange(field, value, value, true, true);
}

{{< / highlight >}}

The PayloadTermquery is generated only if the user ask to search into a field called tag. **Actually the inner document does not contain such a field, because tags are stored as synonyms inside the content field** , but thanks to this customized query parser the user can issue a query like * **“tag:orm”** *  and it gets translated to the right query.

<font size="2"><em>Query [tag:orm] is translated to: content:|orm|<br>
      <br>Found Match for id=6 score=3,989792 tags=[orm:13]</em></font>

Found Match for id=1 score=1,476607 tags=[orm:5]

Found Match for id=2 score=1,033625 tags=[nosql:5] [orm:5]

Found Match for id=6 score=0,7087715 tags=[orm:3]

As you can see searching for  **tag:orm** produces the right content:|orm| query that uses my customized tags system.

[Sample code can be found Here.](http://sdrv.ms/PIfvWA)

Gian Maria
