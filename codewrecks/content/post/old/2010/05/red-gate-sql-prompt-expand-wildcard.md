---
title: "Red Gate Sql Prompt Expand wildcard"
description: ""
date: 2010-05-18T08:00:37+02:00
draft: false
tags: [Tools]
categories: [Tools and library]
---
One of the feature that I loved most from [Red Gate](http://www.red-gate.com/) [Sql Prompt](http://www.red-gate.com/products/sql_prompt/index.htm) is the ability to expand wildcards on queries.

Suppose I write this little query:

{{< highlight csharp "linenos=table,linenostart=1" >}}
SELECT  *
FROM    dbo.Items
WHERE   item_scan_id = 2
{{< / highlight >}}

When I press play the query is very slow because the Item table has a column that stores large BLOB data, so I want to recover all the columns except that one that contains binary data. With Sql Prompt you can simple put the cursor after the \* and press tab

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image12.png)

And Sql Prompt will expand the query for you, now I can simply comment the image column

{{< highlight csharp "linenos=table,linenostart=1" >}}
SELECT  item_id ,
item_title ,
item_area ,
item_price ,
item_regularprice ,
item_available ,
item_scan_id ,
--item_image ,
item_imageUrl
FROM    dbo.Items
WHERE   item_scan_id = 2
{{< / highlight >}}

This is really a cool feature I use almost every day.

alk.
