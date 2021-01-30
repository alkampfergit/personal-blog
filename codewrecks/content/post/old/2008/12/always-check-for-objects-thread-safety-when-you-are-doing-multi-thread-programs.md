---
title: "Always check for objects thread safety when you are doing multi thread programs"
description: ""
date: 2008-12-04T04:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Yesterday I fight with a strange bug, I have a simple class that calculate Sha256 of a string, It was used in a old part of a project where a single thread does a series of operations. Some months later the program is heavily evolved, and there is a new part that uses async pattern to do some operations, since I need to have a Sha256 value I reused the old function called Utils.CalculateSha256.

After some days, some strange thing happened, in application logs I see that sometime there are exception in a routine, I double check the code with [Guardian](http://www.nablasoft.com/guardian) and we could not find the reason for the error. Since the function is executed concurrently by several thread we double check every line for thread safety, but we could not find any error. After some investigation we found that sometime the Sha256 value is wrong for some input string. The error was the following: the function relays on the Utils.CalculateSha256(), this function uses a static SHA256Managed object, and when we check the documentation we found that SHA256Managed object is not thread safe.

Since that function was written when the software does not use it by multiple thread it was considered safe. The rule is, when you do multi thread programming always check for thread safety for every shared object, even for the utility function you use inside the main function thread.

Alk.

Tags: [Threading](http://technorati.com/tag/Threading)
