---
title: "Changing language specification is a risky business"
description: ""
date: 2011-04-26T08:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Sometimes I heard people crying to have new features in languages like C#, and sometimes they believe that adding this and that feature is simple for a team working on language compiler. I want to remember to everyone how risky and delicate process is to change language specification.

I installed the [Async CTP](http://blogs.msdn.com/b/visualstudio/archive/2011/04/13/async-ctp-refresh.aspx) refresh on a production machine, and I discovered that some of my project now fails to compile, simply because I used the token *async* as function parameter name, and now it is a reserved keyword. This demonstrates that even adding a new reserved word can break existing code, and creating pain for the users of the language. Thus even small language modification should be heavily tested and considered before adding anything to a widespread language such as C#. I know that we, as programmers, love new cool addition to languages, but probably we should have the patient to wait a little bit ![Winking smile](http://www.codewrecks.com/blog/wp-content/uploads/2011/04/wlEmoticon-winkingsmile.png) just to be sure that all ramification of an addition is considered.

alk.
