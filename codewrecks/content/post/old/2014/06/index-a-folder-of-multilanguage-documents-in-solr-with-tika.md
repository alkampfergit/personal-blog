---
title: "Index a folder of multilanguage documents  in Solr with Tika"
description: ""
date: 2014-06-14T13:00:37+02:00
draft: false
tags: [Solr,tika]
categories: [Solr]
---
Previous Posts on the serie

- [Import folder of Documents with Apache Solr 4.0 and Tika](http://www.codewrecks.com/blog/index.php/2013/05/25/import-folder-of-documents-with-apache-solr-4-0-and-tika/)
- [Highlight matched test inside documents indexed with Solr And Tika](http://www.codewrecks.com/blog/index.php/2013/05/27/hilight-matched-text-inside-documents-indexed-with-solr-plus-tika/)

Everything is up and running, but now  **requirements change, documents can have multiple languages (italian and english in my scenario) and we want to do the simplest thing that could possibly work**. First of all I change the schema of the core in solr to support language specific fields with wildcards.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image12.png)

 ***Figure 1***: *Configuration of solr core to support multiple language field.*

This is a simple modification, all fields are indexed and stored (for highlighting) and multivalued. Now we can leverage another interesting functionality of Solr+Tika, an **update handler that identifies the language of every document that got indexed**. This time we need to modify * **solrconfig.xml** *file, locating the section of the /update handler and modify in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}


<requestHandler name="/update" class="solr.UpdateRequestHandler">
   <lst name="defaults"> <str name="update.chain">langid</str>
   </lst>
</requestHandler>

<updateRequestProcessorChain >
  <processor name="langid" class="org.apache.solr.update.processor.TikaLanguageIdentifierUpdateProcessorFactory"><lst name="defaults">  <bool name="langid">true</bool>  <str name="langid.fl">title,content</str>  <str name="langid.langField">lang</str>  <str name="langid.fallback">en</str>  <bool name="langid.map">true</bool>  <bool name="langid.map.keepOrig">true</bool></lst>
  </processor>
  <processor class="solr.LogUpdateProcessorFactory" />
  <processor class="solr.RunUpdateProcessorFactory" />
</updateRequestProcessorChain>

{{< / highlight >}}

I use a TikaLanguageIndentifierUpdateProcessorFactory to identify the language of documents, this runs for every documents that gets indexed, because it is injected in the chain of UpdateRequests. The configuration is simple and you can find [full details in solr wiki](https://wiki.apache.org/solr/LanguageDetection). Basically I want it to analyze both the title and content field of the document and enable mapping of fields. This means that  **if the document is detected as Italian language it will contain content\_it and title\_it fields not only content field**. Thanks to previous modification of solr.xml schema to match dynamicField with the correct language all content\_xx files are indexed using the correct language.

This way to proceed consumes memory and disk space, because for each field I have the original Content stored as well as the content localized, but it is needed for highlighting and makes my core simple to use.

Now I want to be able to  **do a search in this multilanguage core** , basically I have two choices:

- Identify the language of terms in query and query the correct field
- Query all the field with or.

Since detecting language of term used in query gives a lots of false positive, the secondo technique sounds better. Suppose you want to find italian term “tipografia”, You can issue query: * **content\_it:tipografia OR content\_en:tipografia**.*Everything works as expected as you can see from the following picture.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image13.png)

 ***Figure 2***: *Sample search in all content fields.*

Now  **if you want highlights in the result, you must specify all localized fields** , you cannot simply use Content field. As an example, if I simply ask to highlight the result of previous query using original *content* field, I got no highlight.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image14.png)

 ***Figure 3***: *No highlighting found if you use the original Content field.*

This happens because the match in the document was not an exact match, I ask for word *tipografia* but in my document the match is on the term *tipografo,*thanks to language specific indexing Solr is able to match with stemming, this a typical full text search. The problem is, when is time to highlight, if you specify the content field, solr is not able to find any match of word *tipografia* in it, so you got no highlight.

 **To avoid problem, you should specify all localized fields in hl parameters** , this has no drawback because a single document have only one non-null localized field and the result is the expected one:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/06/image15.png)

 ***Figure 4***: *If you specify localized content fields you can have highlighting even with a full-text match.*

In this example when is time to highlight Solr will use both content\_it and content\_en. In my document content\_en is empty, but Solr is able to find a match in content\_it and is able to highlight with the original content, because content\_it has stored=”true” in configuration.

Clearly using a single core with multiple field can slow down performances a little bit, but probably is the easiest way to deal to index Multilanguage files  automatically with Tika and Solr.

Gian Maria.
