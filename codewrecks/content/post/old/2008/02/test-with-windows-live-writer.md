---
title: "Test with windows live writer"
description: ""
date: 2008-02-09T02:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
After some months, I decided that Microsoft Word maybe is not the best app to blog, so I come back to Window Live Writer, but now I had to choose the plugin to insert code. I have some old plugin for the beta version, this post is a try to understand if they works again well.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
        private void DoBind() {
            Int32 count = GetCount();
            String Query =
                PrepareQuery(CurrentOrder, AscendingOrder, MyGridView1.CustomPageIndex, MyGridView1.PageSize, count);
            using (SqlDataAdapter da = new SqlDataAdapter(Query, "server=localhost\\sql2000;Integrated Security=SSPI;Database=Northwind")) {
                DataSet ds = new DataSet();
                da.Fill(ds, "Customers");
                MyGridView1.RecordCount = count;
                MyGridView1.DataSource = ds.Tables[0].DefaultView;
                MyGridView1.DataBind();
            }
        }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a sample code.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/02/image-thumb.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/02/image.png)

This is a simple paste image

alk.
