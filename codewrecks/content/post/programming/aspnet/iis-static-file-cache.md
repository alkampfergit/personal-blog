---
title: "IIS cache management for static files"
description: "How can you modify how IIS handle static files for your application."
date: 2021-11-16T20:13:30+00:00
draft: false
tags: ["aspnet"]
categories: ["aspnet"]
---

We have an application with ASP.NET web api plus an angular frontend and we use a client library for translation that is based on plain json files hosted on the server. We have a problem with new releases, because some clients **are needed to force cache clear in the browser to see the new translated terms**, basically it seems that the browser is using older files and not the new ones. 

> If you have static json files served by IIS and you do not change names but only content, it can happens that the client uses cached version regardless change in server version.

This behavior is confirmed looking with developer toolbar, if we check what IIS answers when the browser ask for a json file we found these headers:

![Standard IIS response for .json files](../images/iis-answer-no-cache.png)

***Figure 1***: *Standard IIS response for .json files*

From Figure 1 we verified that IIS does **not include any header for cache control, leaving decision to the browser on how to cache response**. After first request if I reload the page I can indeed verify that all json files are served from local cache, no request is done to the server. This is really good for performances, but if the client does not made any request to the server, how can it understand if file content changed?

![Subsequent requests are answered from cache](../images/iis-cached-json-file.png)

***Figure 2***: *Subsequent requests are answered from cache*

In this scenario the browser does not request anything from the server, it just reuse a local cached version of the file, so we need to instruct IIS to **correctly specify cache policy for json files to allow for a better caching strategy**. This can be entirely done in web.config because we can specify **different cache strategies for different paths of the application**. This allow us to change how cache is handled only for the path UI/assets that contains all json assets files.

{{< highlight xml "linenos=table,linenostart=1" >}}
<location path="UI/assets">
    <system.webServer>
        <caching enabled="true">
            <profiles>
                <add extension=".json" policy="CacheUntilChange"/>
            </profiles>
        </caching>
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge"
                            cacheControlMaxAge="3.00:00:00"></clientCache>
        </staticContent>
    </system.webServer>
</location>
{{< / highlight >}}

With the above configuration we are specifying a different cache strategy to be used in UI/assets path of the application. It consists of a <staticContent> section that specifies a max age of 3 days, and **a <caching> section that set different strategies for various extensions**. For json files we simply ask for a CacheUntilChange that is optimal for ours situation. Once that modification is done to web.config file, you can immediately verify that there is a different pattern of request/response between client/server. **Upon a first request with cache clear all request are correctly returns 200**. Now server response headers correctly contains a cache-control header.

![IIS now correctly include cache-control header](../images/iis-correctly-handle-caching.png)

***Figure 3***: *IIS now correctly include cache-control header*

To verify that cache is working correctly, we should check what the **client requests and what the server answers upon page refresh**. As you can see from Figure 4, all requests are now returning a 304, thus allowing the client to reuse cached version, but this time it is the server that assure to the client **that the file was not modified returning a 304**. 

![All requests are cached because the server answered 304](../images/iis-request-cached.png)

***Figure 4***: *All requests are cached because the server answered 304*

As a final verification we modified a single json localization file then refresh again the page. **The test aims to verify that the client does not incorrectly use old local cached version.**

![Correct usage of etag and if-modified-since headers](../images/correct-cache-and-etag-usage.png)

***Figure 5***: *Correct usage of etag and if-modified-since headers*

As you can verify from Figure 5, request includes two special headers, an if-modified-since and an if-none-match. **With these information the server can understand if the cached version of the browser corresponds to real file in the server**, if the two versions corresponds it will return 304 so the client can use cached version, if version mismatch it returns new data with the new tag and modification date as a standard 200 code.

Gian Maria.

