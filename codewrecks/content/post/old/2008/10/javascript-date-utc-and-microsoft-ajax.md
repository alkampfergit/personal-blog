---
title: "Javascript date UTC and Microsoft Ajax"
description: ""
date: 2008-10-16T05:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Since I'm a noob javascript programmer I tend not to write javascript code if possible, [JQuery](http://jquery.com/) helped me a lot because it permits me to do complex thing in a very simple way, but quite often javascript continues to surprise me.

Yesterday I had to write a really simple piece of js code, I have a method in a .net webservice that accepts a complex object, and one of the property of the object is of type Date. I need to do 2 simple things

1. Parse the date with the locale of browser so 1/2/2008 is 2 of January for english user and 1 of February for an Italian one.
2. Understand if the date is written in current format and pass it to the webservice.

Here is my tentative list. All the code is in this [sample file](https://www.codewrecks.com/blog/wp-content/uploads/2008/10/sampleweb.zip) where I created a simple webservice method that accepts a date and return its string format to the caller. This is the first code

{{< highlight CSharp "linenos=table,linenostart=1" >}}
function SendDate() {
    var date = new Date($get('txtBox').value);
    if (date == null || date == NaN) {
        alert('Invalid date');
    } else {
        SampleWeb.TestSvc.PassDate(date, function(result) { alert(result); });
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I create a Date object from the text in the textbox, and passed it to the service method. I face two problem, first if I write â€œ1/2/2008â€ the webservice told me that he received â€œJanuary 01 2008â€. This seems to be absurd, because how it is possible that 1/2/2008 can be transferred to the server as January 1. Then if I write â€œ1/207/2008â€ the service told me he received July 24 2008. I decided to shift to the Date.parseLocal of the Microsoft Ajax Library

{{< highlight CSharp "linenos=table,linenostart=1" >}}
function SendMsAj() {
    var date = Date.parseLocale($get('txtBox').value);
    if (date == null) {
        alert('Invalid date');
    } else {
        SampleWeb.TestSvc.PassDate(date, function(result) { alert(result); });
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The situation is better, if I write 1/207/2008 it told me invalid date, but if I write â€œ1/2/2008â€ the service returned me â€œ 31 january 2008, with Date.parseLocale I was able to detect invalid date, to parse with the locale of the user, but the date that arrived at the server method is wrong. Then I changed server code to return me date and time and I saw that the date passed to the server function was 31/01/2008 23.00.00, since I live in Italy (GMT +1) I begin to realize that I have a GMT problem. The problem arise from the fact that the json serializer used by the ajax.net library pass date as the number of millisecond elapsed since an initial time, since I'm in GMT+1 this value is adjusted to the GMT+0 so an hour is subtracted. When this value arrives at the server, the JSON deserializer does not know that the original request originated from a GTM+1 time zone, so the value is deserialized as GMT+0 and I have a nasty difference of one hour.

After some time of test and try I found this patch to overcome this issue.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
function SendMsAjGood() {
    var date = Date.parseLocale($get('txtBox').value);
    if (date == null) {
        alert('Invalid date');
    } else {
        SampleWeb.TestSvc.PassDate(date.toLocaleString(), function(result) { alert(result); });
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I use parseLocal to be able to validate the string and to parse with the locale identifier of the user browser, but when I pass to the the service method I use the date.toLocaleString() method. Where is the difference? if you use alert to see at the value, you can check that date output a value like â€œFri Feb 1 00:00:00 UTC+0100 2008â€ so the date contains information about timezone, but date.toLocaleString() output the value â€œFriday, February 01, 2008 12:00:00 AMâ€ so the locale information is dropped. Now the JSON serializer does not make any adjustment to the value before passing to the server and the value is right.

alk.

Tags: [.NET Framework](http://technorati.com/tag/.NET%20Framework) [JSON](http://technorati.com/tag/JSON) [Ajax.NET](http://technorati.com/tag/Ajax.NET) [Date](http://technorati.com/tag/Date) [Localization](http://technorati.com/tag/Localization)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/?p=461';</script><script type="text/javascript">var dzone_title = 'Javascript date UTC and Microsoft Ajax';</script><script type="text/javascript">var dzone_blurb = 'Javascript date UTC and Microsoft Ajax';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/?p=461&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/?p=461)
