---
title: "Be friendly with Web Test"
description: ""
date: 2010-01-26T14:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
I'm creating some web tests with Visual Studio to test an application in an end-to-end fashion. This is absolutely not a unit test, but I want to be able to launch a series of automatic tests against a web server to verify if the whole site satisfy an initial set of core requirements.

One of this test is used to verify if some filters are passed correctly to the Service Layer, because this is a really core feature, and sometimes it happened that someone changes name of parameters, binding will fail and filters does not work anymore on various pages. One of the test populates a couple of textbox with a date range, I set range between 1/1/1900 and 1/1/1901, and I want to verify that this query returns no records. I admit that this is absolutely a bad way to write a test :), but I want to be able to *smoke test* the page as quickly as possible. If the page returns no record, the filter was surely passed because I'm sure that there is no record in that text range.

The page is quite complex, so I do not want to test the absence of records looking for the message *your query returns no record*, because if someone changes the message this test will have no meaning. When you do this kind of *end-to-end* test, it is useful to output in the page some debug information that can be used from the test.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb30.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image30.png)

I have a property called TotalResults of the page that contains the total number of records returned, and I decided to output this value with an hidden field. It makes the page bigger, but since the page contains really a lot of data, adding such a simple piece of html does not affects performances. The use of an hidden field, make possible for the web test to put that value in the context of the text, thanks to the HiddenField extraction rule.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb31.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image31.png)

You can see that in the first iteration records returned are 8, then you can scroll down the context to find value in the subsequent iteration. The second request is the one with the filter active

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb32.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image32.png)

And you can easily verify that the value of the TotalResult is zero. Now I can simply insert a rule that look for the test in the response output.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb33.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image33.png)

And look for the text ‘&lt;input name="dbTotalResult" type="hidden" value="0"/&gt;' in the response of the page.

Alk.

Tags: [Testing](http://technorati.com/tag/Testing)
