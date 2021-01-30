---
title: "Argotic Rss Library for NET"
description: ""
date: 2008-05-28T09:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
I need to work with rss, so I wandered a little bit in the net and found [Argotic](http://www.codeplex.com/Argotic/) library. At the first glance the library is really good, but a simple thing appears to be missing (or probably I did not find in the documentation)

I need to examine a large set of feed to grab all the link, but I do not know if the feed is rss or atom or whathever else, I decided to support atom and Rss, and I created this little piece of code that use GenericSyndicationFeed to load the feed from the uri, then check the format and create the correct feed component.

{{< highlight xml "linenos=table,linenostart=1" >}}
GenericSyndicationFeed genFeed = GenericSyndicationFeed.Create(rssUri);
List<Uri> result = new List<Uri>();
switch (genFeed.Format)
{
    case SyndicationContentFormat.Rss:
        RssFeed rssFeed = genFeed.Resource as RssFeed;
        foreach (RssItem item in rssFeed.Channel.Items)
        {
            result.Add(item.Link);
        }
        break;
    case SyndicationContentFormat.Atom:
        AtomFeed atom = genFeed.Resource as AtomFeed;
        foreach (AtomEntry item in atom.Entries)
            foreach (AtomLink link in item.Links)
                result.Add(link.Uri);
        break;
    default:
        throw new ArgumentException("The uri is not a known feed format");
        break;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code is simple but it lack one functionality, the Create factory function for GenericSyndicationFeed accepts only an Uri, and does not permit to directly specify a stream, for example if you already downloaded the rss content. The overall library is really good.

Alk.

Tags: [Argotic](http://technorati.com/tag/Argotic)

<!--dotnetkickit-->
