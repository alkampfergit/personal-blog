---
title: "How to format code blogging with word 2007"
description: ""
date: 2007-05-02T02:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
Today I was trying to blog with word 2007 and I found some difficulties with code. First of all I suggest you to install a [Visual Studio Plugin](http://www.jtleigh.com/people/colin/blog/) that enable a “copy source as HTML” option that permits you to copy the code as HTML and this makes the life easier. The problem is that simply pasting the code into word will produce some strange results

3”’ &lt;summary&gt;

4”’ classe base per la definizione di proprietÃ  comuni

5”’ &lt;/summary&gt;

6”’ &lt;remarks&gt;&lt;/remarks&gt;

7  &lt;TypeConverter(GetType(ExpandableObjectConverter))&gt; \_

8Public  
Class BaseDefinition

9  
  17       &lt;NotifyParentProperty(True)&gt; \_

18Public  
Property CssClass() As  
String

19Get

20Return mCssClass

21End  
Get

22Set(ByVal value As  
String)

23                 mCssClass = value

24End  
Set

25End  
Property

The code above has two problems, the first is that spacing between lines is too big, and then in HTML there are some &lt;BR/&gt; tags that completely makes code unreadable. After some investigation I found that it is possible to force word to generate better HTML making two substitutions. The first is substitute ^p character with ^l, the ^l character does not generate &lt;P&gt; tags but a simple &lt;BR/&gt; and this makes lines spacing smaller.

3”’ &lt;summary&gt;  
    4”’ classe base per la definizione di proprietÃ  comuni  
    5”’ &lt;/summary&gt;  
    6”’ &lt;remarks&gt;&lt;/remarks&gt;  
    7  &lt;TypeConverter(GetType(ExpandableObjectConverter))&gt; \_  
    8Public  
Class BaseDefinition  
    9  
  17       &lt;NotifyParentProperty(True)&gt; \_  
  18Public  
Property CssClass() As  
String  
  19Get  
  20Return mCssClass  
  21End  
Get  
  22Set(ByVal value As  
String)  
  23                 mCssClass = value  
  24End  
Set  
  25End  
Property  
  
Now you need to substitute also the space character with ^s (unifying space) this (do not ask me why) makes word not to generate the weird &lt;BR /&gt; tag.

3”’  &lt;summary&gt;  
    4”’  classe  base  per  la  definizione  di  proprietÃ   comuni  
    5”’  &lt;/summary&gt;  
    6”’  &lt;remarks&gt;&lt;/remarks&gt;  
    7  &lt;TypeConverter(GetType(ExpandableObjectConverter))&gt;  \_  
    8PublicClass  BaseDefinition  
    9  
  10”’  &lt;summary&gt;  
  11”’  Ã¨  necessario  questo  attributo  per  far  siche  il  designer  si  accorga  del    
  12”’  cambiamento  della  proprietÃ   e  fare  in  modo  che  venga  serializzata  
  13”’  &lt;/summary&gt;  
  14”’  &lt;value&gt;&lt;/value&gt;  
  15”’  &lt;returns&gt;&lt;/returns&gt;  
  16”’  &lt;remarks&gt;&lt;/remarks&gt;  
  17        &lt;NotifyParentProperty(True)&gt;  \_  
  18PublicProperty  CssClass()  AsString  
  19Get  
  20Return  mCssClass  
  21EndGet  
  22Set(ByVal  value  AsString)  
  23                    mCssClass  =  value  
  24EndSet  
  25EndProperty  
  
Now the code looks really better but a last problem remains, the code with line numbering cannot be copied and pasted from the blog into visual studio. Even if you remove the numbering, word substitutes all occurrence of double ‘ chars with ” character, so the resulting VB.Code is not valid. At this time I really do not understand how to tell word to leave the ‘ code unchanged.

Alk.
