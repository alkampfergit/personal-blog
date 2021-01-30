---
title: "WatiN recorder"
description: ""
date: 2007-05-29T23:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Recently I discovered [WatiN](http://watin.sourceforge.net/) library to automate testing of web site with IE. This library is very useful, but sometimes writing test is a tedious process, for this reason there are some freeware recorder that are able to record a navigation in IE and automatically create code for WatiN test. One tool is WatinTestRecord, available [here](http://watintestrecord.sourceforge.net), it is a good product, and it’s freeware. Another product is Watin Recorder Avaliable [here](http://blogs.conchango.com/richardgriffin/archive/2007/03/13/WATiN-Recorder_2B002B00_-v-1.0-Released.aspx). This second tool is very interesting because it comes with source code, available with subversion at [http://svn.openqa.org/svn/watir-recorder/trunk](http://svn.openqa.org/svn/watir-recorder/trunk).

Watin Recorder works very well with IE6, but has some problem with IE7. If I use IE7 and try to do a test it does not intercept most of the event, such as typing in textboxes, pressing button etc etc. For example, if I open a new test, navigate to [www.google.it](http://www.google.it) IE opens a new browser windows, and nothing gets recorded. The simpliest way to avoid this problem is adding the site to “trusted sites” in the IE protection options. The test works quite well, for example if I open google, type something in the search box and then press the search button, here is the script that gets generated.

[TestMethod]  
public  void  TestMethod1()  
{  
    IE  ie  =  new  IE();  
ie.GoTo(“http://www.google.it/”);  
ie.TextField(Find.ByName(“q”));  
ie.TextField(Find.ByName(“q”)).TypeText(“test”);  
ie.Button(Find.ByName(“btnG”)).Click();  
As you can see the recorder helps to find the name of the controls of the page, and makes writing WatiN test a breeze. But the most interesting product is Watin Test Record, because it appears as most complete. [This product](http://watintestrecord.sourceforge.net/) for example has a lots of options, such as visualizing the DOM of the page, visualizing all the WatiN element that can be referenced on the page and more. Moreover this project seems to be more active, last version of the program is 2 may 2007 and I’ll hope that project will stay alive for a lot.

Alk.
