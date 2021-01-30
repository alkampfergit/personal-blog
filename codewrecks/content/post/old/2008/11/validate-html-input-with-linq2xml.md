---
title: "Validate HTML input with Linq2XML"
description: ""
date: 2008-11-17T11:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
Suppose you have a very simple page where user can add comments to an issue, user can enter plain text and also they can use th HTML tag &lt;b&gt; to render in bold some text. In the [example code](http://www.codewrecks.com/blog/storage/validatesample.zip) you can see a very simple implementation (default.aspx). It use a xml file for back end storage (so you can run the example without a database) and in Default.aspx all the text that was entered by the user was stored in a CData section of the XML STorage file. When the comments are rendered on the page we simply output all the content. The result is good but have some problems. First of all you can use every html tag, such as &lt;i&gt; moreover, if some hacker enter the text â€œyou were &lt;script&gt;alert(‘hacked’);&lt;/script&gt;â€ into the textbox, all the user that read the page will execute that script, this is a  simple sample of cross site scripting attack.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image8.png)

Here is the content of the storage file

{{< highlight sql "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<Comments>
  <Comment>
    <Author>Hacker</Author>
    <CommentText><![CDATA[you where <script>alert('hacked');</script>]]></CommentText>
  </Comment>
</Comments>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In Default2.Aspx there is a simple solution to mitigate this problem, trying to remove all node that are not &lt;b&gt;, but with this solution if a user enter â€œthis is a &lt;b&gt;good comment&lt;/b&gt; with &lt;i&gt;italic text&lt;/i&gt;â€œ, we have a big problem, the part in the &lt;i&gt;&lt;/i&gt; tag gets completely removed. Moreover if some hacker gets a way to change your storage file, or can insert some data in database you still have problem. A better solution was showed in Default3.aspx. Since I consider data in the file as *untrusted input* because it is under direct control of the user I need to sanitize the comment before I can render text to the user. The goal is having a SanitizeComment function that gets a html fragment as input and return a new fragment with all tags removed, except those that are permitted.

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 private String SanitizeComment(String commentText)
 2 {
 3   try
 4   {
 5       XElement doc = XElement.Parse("<span>" + commentText + "</span>");
 6       doc.Descendants().Where(elem => elem.Name != "b")
 7         .ToList().ForEach(elem =>
 8          {
 9              elem.AddAfterSelf(new XText((String)elem));
10              elem.Remove();
11          });
12 
13       String retvalue = doc.ToString();
14       return retvalue;
15   }
16   catch (System.Xml.XmlException)
17   {
18       return AntiXss.HtmlEncode(commentText);
19   }
20 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code use Linq2Xml; first of all in line 5 I create a XElement with a concatenation of a &lt;span&gt; tag and the original content of the comment. Then I select in line 6 all the XML nodes that have a name different from â€œbâ€,(the only permitted tag in the output). Then for each of the unpermitted nodes I simply add a new XML node of type XText after the node, and then remove the original node.

If some XMLException occurs, it means that the input is not a well formed XML fragment, so I default to use the AntiXss HtmlEncode function that avoid any cross site scripting risk.

Here is a result of the page when the storage file contains this comments.

{{< highlight sql "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<Comments>
  <Comment>
    <Author>Hacker</Author>
    <CommentText><![CDATA[you where <script>alert('hacked');</script>]]></CommentText>
  </Comment>
  <Comment>
    <Author></Author>
    <CommentText><![CDATA[this is a <b>good comment</b>]]></CommentText>
  </Comment>
  <Comment>
    <Author></Author>
    <CommentText><![CDATA[this is a <b>good comment</b> with <i>italic text</i> and <b>again Bold<i> italicbold</i></b>]]></CommentText>
  </Comment>
</Comments>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can see that the content of the file contains dangerous html code, but here is what is rendered by Default3.aspx that calls SanitizeComment function.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image9.png)

As you can notice the alert(â€˜hackedâ€™) was shown without the &lt;script&gt; tag, moreover all the text between &lt;i&gt; and &lt;/i&gt; gets no removed. SanitizeComment function leaves only the tag &lt;b&gt; and remove all other unwanted tags.

[sample code here.](http://www.codewrecks.com/blog/storage/validatesample.zip)

alk.

Tags: [Linq2XML](http://technorati.com/tag/Linq2XML) [Security](http://technorati.com/tag/Security) [Validation](http://technorati.com/tag/Validation)
