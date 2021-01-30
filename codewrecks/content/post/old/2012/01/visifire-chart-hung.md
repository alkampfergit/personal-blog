---
title: "visifire chart hung"
description: ""
date: 2012-01-12T12:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Today I lost a lot of time diagnosing a problematic Visifire Silverlight chart. If you own 3.X version of the visifirechart and you experience some Chart to completely hung the browser you should update to the 4.x version, as described in [this article](http://www.visifire.com/blog/2011/12/23/visifire-silverlight-wpf-wp7-charts-gauges-v4-5-0-5-beta-released/).

I’ve found it after a couple of hour of diagnosing why the page hung, actually I hit two of the bug, the last one that makes chart crash when dataseries was empty, and the first one.

- Chart was crashing when only one DataPoint was present inside the series with larger YValue.

God only knows why the chart should hang with only one value and large Y value :).

Gian Maria.
