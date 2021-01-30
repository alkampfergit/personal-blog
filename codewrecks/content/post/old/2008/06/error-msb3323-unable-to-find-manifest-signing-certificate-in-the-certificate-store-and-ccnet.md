---
title: "error MSB3323 Unable to find manifest signing certificate in the certificate store and CCNEt"
description: ""
date: 2008-06-26T04:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
This morning I did some modification to a project that is deployed with click once, I checked in and the build was broken. I go to CC.NET dashboard and I see that the error is

*error MSB3323 Unable to find manifest signing certificate in the certificate store*

I tried to do various experiments, but after half hour I came to the solution, simply go to the Project Properties, Signing tab, then I deselect “Sign the ClickOnce manifest” and check it again, all works well again.

I really does not know why but seems like if the old certificate had a problem

alk.

<!--dotnetkickit-->
