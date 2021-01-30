---
title: "Assign ldquotagrdquo to lucene documents"
description: ""
date: 2012-08-21T20:00:37+02:00
draft: false
tags: [lucene]
categories: [LuceneNET]
---
- [Getting Started With Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/06/20/getting-started-with-lucene-net/)
- [Searching and more detail on Documents Fields](http://www.codewrecks.com/blog/index.php/2012/06/21/getting-started-with-lucene-netsearching/)
- [Advanced Queries with Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/07/03/advanced-queries-with-lucene-net/)
- [Case Sensitivity in Lucene.NET Searches](http://www.codewrecks.com/blog/index.php/2012/07/05/case-sensitivity-in-lucene-search/)
- [Faceted searches with Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/07/20/faceted-searches-with-lucene-net/)

One of the good aspect of working with lucene.NET is that  **it is really similar to a NoSql database, because it permits you to store “document” where a document is a generic collection of fields**. Lucene has the ability to store not only textual field, but also Numeric Fields to solve interesting scenarios because you are not limited in storing and searching only for text.  **Suppose you want to categorize all posts of a blog where each post can have one or more Tag and a pertinence value associated to that Tag**. The technique used to determine the Tags to associate to a Blog post is not the subject of this discussion, what I need is only a technical way in Lucene.NET to add tags with an integer value to a document and issue query on them. For the sake of this discussion we can say that blog user decide one or more tag word to associate to the post and give a value to 1 to 10 to determine how pertinent the tag is to the post. We can add tags to document that represent a post with this simple code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


document.Add(new NumericField("orm", Field.Store.YES, true).SetIntValue(5));
document.Add(new NumericField("cqrs", Field.Store.YES, true).SetIntValue(7));

{{< / highlight >}}

The above snippet of code **states that this blog post is pretty related to ORM and CQRS**. The important aspect is that each document can have different field inside a document because a document is Schemaless as NoSql databases. You can now query this index in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}


Query query = NumericRangeQuery.NewIntRange("orm", 5, 10, true, true);

{{< / highlight >}}

This query will retrieve all the documents that have an associated tag named “orm” with pertinence value in range [5 to 10]. You can clearly compose query to express more complex criteria es: *all post that are pertinent to orm with a value of 5 to 10 and pertinent to cqrs with a value of 1 to 10* and so on.

{{< highlight csharp "linenos=table,linenostart=1" >}}


BooleanQuery bquery = new BooleanQuery();
bquery.Add(NumericRangeQuery.NewIntRange("orm", 5, 10, true, true), BooleanClause.Occur.MUST);
bquery.Add(NumericRangeQuery.NewIntRange("cqrs", 1, 10, true, true), BooleanClause.Occur.MUST);

{{< / highlight >}}

As you see it is really simple to  **build a BooleanQuery using BooleanClause.Occur.MUST to create AND composition or BooleanClause.Occur.SHOULD if you want to compose with logical OR**. To make everything simpler you can inherit from QueryParser to build a specialized parser for tag of your blog.

{{< highlight csharp "linenos=table,linenostart=1" >}}


class QueryParserForTagged : QueryParser
{
    public QueryParserForTagged(Lucene.Net.Util.Version version, String field, Analyzer analyzer)
        : base(version, field, analyzer) { 
    }

    public override Lucene.Net.Search.Query GetFieldQuery(string field, string queryText)
    {
        //if field is a base field, use standard query parser routine.
        if (field.Equals("title", StringComparison.OrdinalIgnoreCase) ||
            field.Equals("content", StringComparison.OrdinalIgnoreCase)
        {
            return base.GetFieldQuery(field, queryText);
        }
        //all other fields are tags.
        Int32 value = Int32.Parse(queryText);
        return NumericRangeQuery.NewIntRange(field, value, value, true, true);
    }

    protected override Query GetRangeQuery(string field, string part1, string part2, bool inclusive)
    {
        //if field is a base field, use standard query parser routine.
        if (field.Equals("title", StringComparison.OrdinalIgnoreCase) ||
            field.Equals("content", StringComparison.OrdinalIgnoreCase)
        {
            return base.GetRangeQuery(field, part1, part2, inclusive);
        }

        //all other fields are tags.
        Int32 valueMin = Int32.Parse(part1);
        Int32 valueMax = Int32.Parse(part2);
        return NumericRangeQuery.NewIntRange(field, valueMin, valueMax, inclusive, inclusive);
    }
}

{{< / highlight >}}

The logic is really simple, if the field is one of the standard fields (title or content in this example) simply use the basic QueryParser capability, each field that is not a standard field of the document is by convention a tag and generates a NumericRangeQuery so **you can issue a query like “*NHibernate cqrs:[5 TO 10]*" to find all post that contains the word nhibernate but have also an associated tag whose value is from 5 to 10**.

Alk.
