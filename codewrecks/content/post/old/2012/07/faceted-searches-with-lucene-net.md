---
title: "Faceted searches with LuceneNET"
description: ""
date: 2012-07-20T20:00:37+02:00
draft: false
tags: [lucene]
categories: [LuceneNET]
---
- [Getting Started With Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/06/20/getting-started-with-lucene-net/)
- [Searching and more detail on Documents Fields](http://www.codewrecks.com/blog/index.php/2012/06/21/getting-started-with-lucene-netsearching/)
- [Advanced Queries with Lucene.NET](http://www.codewrecks.com/blog/index.php/2012/07/03/advanced-queries-with-lucene-net/)
- [Case Sensitivity in Lucene.NET Searches](http://www.codewrecks.com/blog/index.php/2012/07/05/case-sensitivity-in-lucene-search/)

One of the coolest feature of Lucene.NET is the  **ability to do** [**faceted searches**](http://en.wikipedia.org/wiki/Faceted_classification) **with really few lines of code**. A faceted search  **runs a query on an index and calculate the distribution of the results based on a property of the document**. Let me show a sample result and then you probably will have a better understanding of this concept. Suppose I’m indexing product from the Microsoft Sample database AdventureWorks, each product has an Id a category and a description fields and I offered this simple UI for searching.

[![SNAGHTML1248f1](https://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML1248f1_thumb.png "SNAGHTML1248f1")](https://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML1248f1.png)

 ***Figure 1***: *Result of a faceted search.*

As you can see I can show first X results of the query followed by the distribution count on all categories that contains results. This kind of result is really cool for the user, because you can give the opportunity to drill down into categories so the user can narrow or navigate results to find exactly what he needs.

Latest version of java Lucene has already this capability built in in the main product,  **unfortunately Lucene.NET still misses this functionality but it contains all the primitive that permits you to implement Faceted searches with few lines of code**. First of all I wrote a simple helper class that simplify facets management.

{{< highlight csharp "linenos=table,linenostart=1" >}}


private class FacetValueCache
{
    public String FacetValue { get; set; }

    public CachingWrapperFilter Filter { get; set; }

    public FacetValueCache(String facetValue, CachingWrapperFilter filter)
    {
        FacetValue = facetValue;
        Filter = filter;
    }

    private OpenBitSetDISI GetValueBitset(IndexReader reader)
    {
        return new OpenBitSetDISI(Filter.GetDocIdSet(reader).Iterator(), 10000000);
    }

    public Int32 GetFacetCount(IndexReader reader, Filter queryFilterOnMainQuery)
    {
        var bs = GetValueBitset(reader);
        bs.InPlaceAnd(queryFilterOnMainQuery.GetDocIdSet(reader).Iterator());
        return (Int32) bs.Cardinality();
    }
}

{{< / highlight >}}

In my example the AdventureWorks database has a set of categories, for each categories I have a list of Lucene documents that belongs to that category and **to do faceted searches I need to store this list for each distinct value of category**. FacetValueCache is then used to keep track of two distinct values

- *CategoryName "(Es. bikes / roadbikes)*
- *List of documents that belongs to that category*

The second value is not stored directly, but I use a CachingWrappingFilter that basically  **is a cached version of a QueryFilter that is capable to return a list of document matching a given query**.

The magic is done in the GetFacetCount thanks to the class  **OpenBitSetDISI, that basically is nothing more than a stream of bit used by Lucene to store a list of document indexes** and that contains operator specifically dedicate do to massive operations on list of document indexes. If you have an OpenBitSetDISI you can use the InPlaceAnd operator passing another list of document indexes and then you can call *Cardinality()*method to know the number of document that the two lists have in common.

You should have already understood that is the OpenBitSetDISI class that does all the magic of calculate facets, if you store inside FacetValueCache the list of document indexes that represents documents belonging to a given category,  **you can use InPlaceAnd to intersect with the result of user query, and know how many documents are in common** ; et voilà. Since OpenBitSetDISI class can be created by a QueryFilter thanks to the document iterator returned by the method GetDocIdSet, I store a CachingWrappingFilter inside my FacetValueClass to recreate the bitset when needed.

Ad you can see, in GetFacetCount I simply recreate the bitset for the documents that belongs to that specific category, then I intersect with InPlaceAnd taking the list of document indexes from the QueryFilter passed as argument and finally returns the number of document in common.

Now you can create a GetFacets method that uses this class to do faceted search.

{{< highlight csharp "linenos=table,linenostart=1" >}}


Dictionary<String, List<FacetValueCache>> facetsCacheContainer = new Dictionary<string, List<FacetValueCache>>();

public IEnumerable<KeyValuePair<String, Int32>> GetFacets(Query query, String facetField)
{
    if (!facetsCacheContainer.ContainsKey(facetField))
    {
        List<FacetValueCache> cache = new List<FacetValueCache>();
        var allDistinctField = FieldCache_Fields.DEFAULT.GetStrings(reader, facetField).Distinct();

        foreach (var fieldValue in allDistinctField)
        {
            var facetQuery = new TermQuery(new Term(facetField, fieldValue));
            var facetQueryFilter = new CachingWrapperFilter(new QueryWrapperFilter(facetQuery));
            cache.Add(new FacetValueCache(fieldValue, facetQueryFilter));
        }
        facetsCacheContainer.Add(facetField, cache);
    }

{{< / highlight >}}

I used a Dictionary to cache the list of FacetValueCache objects related to the field I’m using to do facet results. Creating the list of FacetValueCache is really trivial, thanks to *FieldCache\_Fields* I can get all values of a given field in the index, then I use LINQ Distinct() operator to have a distinct list of all the possible values of that field. The call to FieldCache\_Fields is quite fast because Lucene.NET caches the result in memory. For each distinct field I can create the corresponding FacetValueCache object using a QueryWrapperFilter based on a simple TermQuery that retrieve all documents that belong to that facet value. Now I can calculate facets.

{{< highlight csharp "linenos=table,linenostart=1" >}}


//now calculate facets.
var mainQueryFilter = new CachingWrapperFilter(new QueryWrapperFilter(query));
var facetDefinition = facetsCacheContainer[facetField];
return facetDefinition.Select(fd =>
    new KeyValuePair<String, Int32>(fd.FacetValue, fd.GetFacetCount(reader, mainQueryFilter)));

{{< / highlight >}}

First step is creating the CachingWrapperFilter for the query issued by the user, then retrieve the list of FacetValueCache associated to that field (Es. Category), and then with a simply LINQ function I return to the user a list of KeyValuePair&lt;String, Int&gt; and the game is done. As you can see faceted searches with Lucene.NET is a matter of few lines of code and can really give fantastic results to the user.

[* **You can find the code here.** *](http://sdrv.ms/MctxOX)

Gian Maria.
