---
title: "Google probably does not like cloudflare"
description: ""
date: 2012-09-01T13:00:37+02:00
draft: false
tags: [Blogging]
categories: [EverydayLife]
---
I’ve signed up months ago for a [Cloudflare](http://www.cloudflare.com/) during a refactoring of my web site, at the same time I changed the theme of the blog, cleaned up a little bit the HTML of the page and optimized few stuffs. I was very satisfied of the gain of performance I got with Cloudflare, but after a month stats of blog started to went down.

*The trend was continuous, each week traffic is slightly less than previous week and all traffic loss is mostly from Google organic*. I started thinking that  **the change to HTML structure I’ve done during refactoring is the root cause of this** , after a month I realized that wordpress version is old and since this information is visible even in Google Webmaster tools I suspected that Google is penalizing me for having an old version of wordpress (maybe it has some security bug) so I upgraded, but nothing changed.

It is very difficult to understand how modification to a site reflect your SEO,  **because modification is not immediately visible, you should wait at least a month to verify if your change really improve SEO** of your site and my  **biggest error was to do a lot of modification at once, so I was really puzzled because I really have no idea on what I’ve changed that could impact SEO at such a level**. Since Google changed also the algorithm in the same period someone suggested me that this can be the reason and probably the loss of traffic is not related to my change to the blog, but [Occam’s razor](http://en.wikipedia.org/wiki/Occam's_razor) principle told me: if before the refactoring traffic from Google organic was relative constant and it started to decrease after the refactoring, surely the refactoring is cause of the problem.

After 5 months Google organic traffic to my site is 45% less comparing the same period of last year and I really start to think to undo all modifications, reverting the site to the very same state it was before I’ve started to loss traffic. This could be a really drastic way, but at least I could  understand if the refactoring was the real cause. Before taking this radical solution I did some research and I stumbled upon some postss that suggests me that cloudflare somewhat affected my Google ranking of the page.

- W[hy the traffic Drop after cloudflare Google hates me.](http://www.pauldavidolson.com/blog/768/why-the-traffic-drop-after-cloudflare-google-hates-me/)
- [Should you use Cloudflare, I’m not Anymore](http://www.pauldavidolson.com/blog/1068/should-you-use-cloudflare-im-not-anymore/)
- [Cloudflare Observation](http://www.jonesjerry.com/web-development/cloudflare-observations.html)

These observation sounds really strange to me, because  **actually my site runs really faster with Cloudflare**  **and I know that Google favor faster sites over slower ones** , so I never doubted of Cloudflare, but one aspect worried me: CloudFlare manipulates your pages, because it is not only a CDN and it is probably the biggest change I’ve done during refactoring, so I decided to try to completely disable it. Now almost a month is passed, and this weeks stats are higher than the previous week. In Figure 1 you can spot when I disabled CloudFlare.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image11.png)

 ***Figure 1***: *The red arrow points to the moment I’ve disabled CloudFlare, this picture represents only Google organic traffic source.*

A month is passed after I’ve disabled Cloudflare and Google (organic) traffic source seems to be increased. I do not really know if this is the real reason, but if I take a big picture from the day I’ve optimized my blog doing all modification until now I got this.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image12.png)

 ***Figure 2***: *The whole trend of Google (organic) traffic to my blog, the change in trend is when I’ve disabled Cloudflare*

I really do not understand the reason, but it seems clear to me that after a month after I enabled Cloudflare Google organic traffic started to decrease, and one month after I’ve disabled it the trend of Google is now going up again.

It can be a coincidence, but I’m started to be convinced that Cloudflware had a negative impact on how Google consider my site. Now I’ll need to wait at least a month more to verify how everything is going.

Gian Maria.
