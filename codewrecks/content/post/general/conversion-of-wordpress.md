---
title: "Moving old posts from WordPress to Hugo"
description: "When you move to Hugo, sooner of later you should migrate every old content to it, so you can get rid of databases and other annoying things"
date: 2021-02-03T19:00:00+02:00
draft: false
tags: ["blogging"]
categories: ["general"]
---

It was almost one year from my switch from WordPress to Hugo and I'm really really satisfied from the result. After some months the only thing that bother me is **the fact that I still need to maintain an instance of WordPress just to keep old posts**. The only thing that prevented me to migrate was the loss of comments, but actually, after looking to all of my old blog posts, I've not such a big amount of comments that worth migrating, **the only thing that is important to me is the ability to keep my old post without comments** so I can get rid of WordPress. I'm sorry for all of you that spent time commenting on my blog, but migrating the comments would be a huge work.

Also, after some analysis, I've realized that I've very little comments on my site and Disqus now does not allow to remove ads, so I removed comments entirely, if you want to comment you can directly **start a discussion on GitHub repository of my blog**, so I can get rid of another not-so-useful part of my blog.

Once I accepted that I can loose old comments, the only thing that remains to do was **writing a small tool that can convert all WordPress post to Markdown**. The code is bad and ugly, you can find it [on this repository on GH](https://github.com/alkampfergit/blog-transfer). I've used a couple of .NET lbraries, the first read all posts from a WordPress Blog reading all the content in HTML, then I have a converter from HTML to Markdown converter. **In the middle I have to write some code to handle html and try to remove all bad formatting for code I've used in the past**. In latest period I've used a nice plugin that write code in pre tag then format with JavaScript, but **older posts used some weird syntax highlighter that output a real bad HTML with lots of hardcoded style**. Markdown converter found very difficult to convert that code, so I pre manipulated HTML to convert bad HTML to Good HTML :). 

Finally, once the blog is converted, I can always do some global find and replace to **manually fix some other error that can arise after conversion**. One Saturday morning was enough to convert everything, you can find all old post clicking on [CATEGORIES](/categories/) link. 

During conversion I've created a series of redirect rule for IIS (actually this blog is hosted on Windows) that **allows me to redirect all old url to new url, something like this**.

{{< highlight xml "linenos=table,linenostart=1" >}}
<rule name="Reroute850" stopProcessing="true">
    <match url = "blog/index.php/2009/11/26/vsdbcmd-exe-overriding-variable-value" />
    <action type = "Redirect" url = "post/general/old/2009/11/vsdbcmd-exe-overriding-variable-value" redirectType = "Temporary" />
</rule>
{{< / highlight >}}

The problem was that I hit the 250kb limit for web.config, so I included only part of the url, most recent one, issuing a permanent redirect to the new location. Nevertheless I was able to quickly setup a redirect that works as long as I keep everything on a iis machine.

I'm quite satisfied from the result, I got rid of WordPress, Database, Backup, maintenance, upgrade and so on while keeping alive all my old posts with minimal effort.

Gian Maria.
