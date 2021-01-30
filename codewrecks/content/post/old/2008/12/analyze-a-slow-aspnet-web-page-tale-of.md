---
title: "Analyze a slow aspnet web page tale of"
description: ""
date: 2008-12-05T10:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Asp.net is a great environment to quickly develop sites, but if you does not know what you are doing you can get hurt with poor performances.

Today I was analyzing a web page of a site because a developer reported to me that it is really really slow (more than 10 seconds to render), here it is how I proceed in similar situation

 **1) Check the size of the page** I fired [Fiddler](http://www.fiddlertool.com/fiddler/) and loaded the page with IE, then I look at the size of the page. Developers tends to forget that size of the page is important, to save bandwidth but also avoiding the loss of time needed to build and serve a long HTML stream. The result was a 450kb compressed page with a 1.5 MB of uncompressed HTMLâ€¦this is really unacceptable.

The cause was a misuse of the viewstate, the developer loaded a datatable, and stored it entirely into the viewstate to access it again during pagination events. I change the logic so the datatable is retrieved from database when pagination occurred and removed it from the viewstate. Compressed page size dropped to 45k with a 200k uncompressed size.

 **2) Is viewstate really needed in the page?** Next stuff was disable the gridview viewstate. I could do this optimization because the page only does postback during pagination, and the data are always retrieved from the database. The page still works great but now compressed sized dropped to 31k (169k of uncompressed). Now the rendering time is 2 seconds.

 **3) Look at how you use the database.** First of all I fire a sqlserver profiler to monitor all the request made by the asp.net page.

The first thing I noticed is that each time I accessed the page a lot of small queries are issued to the database to retrieve data to show in drop down lists, I put them in cache with a duration of 3 hours since these values does not change often.

The next issue was that, since I removed all data from the viewstate, the whole datatable was retrieved from the database each time I paginate the results. My next step was adding the datatable into the ASP.Net cache with a slow sliding expiration of 5 minutes. I know that the user open the page, gives a look at it, it paginates in the first 2 or 3 pages than goes away, 5 minutes cache it is enough. Now the first page still render in a couple of seconds but when you paginate the rendering time is less than a second.

 **4) retrieve only the data you use in the page** As a last improvement I needed to move pagination to server side. One of the greatest problems when using a gridview is that quite often the developer *loads all records* into a datatable letting the grid handle the pagination. This is terribly wrong; in my scenario I have long records (each one has a column that can contain 1-2kb of string data). If the filter returned 500 record (an average medium), the program loads all of them in the DataTable. This means: 500 records \* 2kb = about 1 MB of data retrieved from the database and stored in cache. This is the reason why the first version of the page contained more than 1 mb of viewState. ;)

Typical user only looks up to the first 2-3 pages of data, and with 20 record per page usually he looks at 40-60 records then goes away from the page. With Server side pagination I only retrieve 20 record  at each page rendering, and if you paginate back to a previous page the records still are in the cache so no data is retrieved.

Now each request is satisfied in less than 500 ms ;)

Quite often all performances problem of an asp.page are: too long viewstate, retrieving of too much data from database and not using the cache.

Alk.

Tags: [Asp.Net](http://technorati.com/tag/Asp.Net) [Optimization](http://technorati.com/tag/Optimization) [Page Performance](http://technorati.com/tag/Page%20Performance)
