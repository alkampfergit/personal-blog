---
title: "Long numbers are truncated in MongoDb shell"
description: ""
date: 2016-06-02T16:00:37+02:00
draft: false
tags: [MongoDb,NoSql]
categories: [NoSql]
---
Let’s try this simple code in a mongo shell:

{{< highlight js "linenos=table,linenostart=1" >}}


db.TestCollection.insert({"_id" : 1, "Value" : NumberLong(636002954392732556) })
db.TestCollection.find()

{{< / highlight >}}

What you expect is that mongo inserted one record and then that record is returned. Actually a record is inserted, but  **the return value can surprise you**. Here is the output I got from RoboMongo

{{< highlight js "linenos=table,linenostart=1" >}}


{
    "_id" : 1.0,
    "Value" : NumberLong(636002954392732544)
}

{{< / highlight >}}

 **Property “Value” has not the number you inserted, the number seems to be rounded and some precision is lost** , even if it is a NumberLong and 636002954392732556 is a perfectly valid Int64 number. This behavior surprised me, because I’m expecting rounding to happen only with double, not with an Int64.

Actually a **double precision floating point number, that uses 64 bit for representation, is not capable of having the same precision of an Int64 number,** because part of those 64 bits are used to store exponent. If you try to represent a big number like 636002954392732556 in Double Floating Point precision some rounding is going to happen. If you are not convinced, try this [online converter](http://www.exploringbinary.com/floating-point-converter/), to convert 636002954392732556, here is the result.

[![In this image there is a screenshot of the online converter, that exactly demonstrate that the rounding happens due to conversion to floating point number](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/SNAGHTML20f24ca_thumb.png "Floating point conversion online")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/SNAGHTML20f24ca.png)

 ***Figure 1***: *Floating point number rounding*

This confirm that my problem was indeed caused by rounding because the number is somewhat converted to Floating Point format, even if I used NumberLong bson extension to specify that I want a long and not a Floating Point type.

The reason behind this is subtle. Lets try another example, just type NumberLong(636002954392732556) in a mongo shell (I used RoboMongo), and verify the result.

[![calling NumberLong(636002954392732556) function returns a rounded number,](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb.png "Simple call to NumberLong function")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image.png)

 ***Figure 2***: *NumberLong gots rounded directly from the shell.*

This unveils the error, the number is returned surrounded with quotes, and this suggests that quotes are the problem.  **In javascript, every number is a double, and if you write NumberLong(636002954392732556) javascript translate this to a call to NumberLong function passing the number 636002954392732556 as argument**. Since every number in javascript is a double, the number 636002954392732556 gots rounded before it is passed to NumberLong Function.

If you surround number with quotes, you are passing a string to NumberLong, in this scenario rounding does not occours and NumberLong function is perfectly capable to conver the string to number.

> In mongo shell, always use quotes when you create numbers with  NumberLong

Actually this error only happens with really big numbers, but you need to be aware of this if you are creating script that uses NumberLong.

Gian Maria.
