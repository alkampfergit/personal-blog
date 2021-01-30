---
title: "Take care when you use RegExp constructor in javascript"
description: ""
date: 2014-01-30T12:00:37+02:00
draft: false
tags: [Javascript]
categories: [Programming]
---
I’m not a javascript guru when it is time to write regular expressions, but this morning I have a bug on a piece of code, and the bug was related to a regex declared in this way.

{{< highlight jscript "linenos=table,linenostart=1" >}}


var noMatchRegex = new RegExp("[\r\n\s;,$]+");

{{< / highlight >}}

This regex basically should match a carriage return or a space or ; char, etc, but it appears not working sometimes. After a quick test I confirmed that the problem happens when I have string that contains the character ‘s’. This sounds me strange, but a quick look in Chrome Watch Expression gave me this results

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/01/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/01/image3.png)

 ***Figure 1***: *Regex view from Watch Expression of chrome.*

This suggested me that the regular expression has something strange and quickly realized that the problem happens because *the person who wrote the code, used a regex taken from the literal notation, but passed inside RegExp constructor, that accepts a string*. There is a subtle difference in using the literal notation or passing the regex as string to RegExp constructor. The second alternative requires you to escape the \ character. If you declare the regex with new RegExp(“[\s]”), you are creating a regex that has a \s charater in it and is not valid. You should declare the above regex in this way

{{< highlight jscript "linenos=table,linenostart=1" >}}


var noMatchRegex = new RegExp("[\\r\\n\\s;,$]+");

{{< / highlight >}}

*Escaping the character \ produces the expected result*, as you can verify from Watch Expression

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/01/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/01/image4.png)

 ***Figure 2***: *Correct declaration of the regex*

Now you can see that the literal notation of the regex is /[\r\n\s;,$+/ and it is correct.

Gian Maria.
