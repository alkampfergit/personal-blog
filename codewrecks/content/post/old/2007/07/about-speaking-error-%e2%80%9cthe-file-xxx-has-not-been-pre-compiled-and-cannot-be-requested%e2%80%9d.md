---
title: "About speaking error âœThe file 8216xxx8217 has not been pre-compiled and cannot be requestedâ"
description: ""
date: 2007-07-13T04:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Today I must update a web application in a pre-production environment. I use asp.net 2.0 and web deployment project, so I set the site to be precompiled, not updatable and all assemblies merged in a unique assembly. I build the site, test in developing machine than I do a xcopy deploy on preproduction server.

When I access the site I saw the IE progress bar that runsâ€¦..the login page does not appearsâ€¦. I ask to another developer to try to access the site, and he told me that nothing appears on the page. The fun thing is that after 2 minutes another developer called me and said “hey, whath is happening to that machine, I received 1600 mail of exception”. I begin to faintâ€¦â€¦ immediately I stopped the server and began  to look at the mail. I have an error handling module that intercepts all unhandled exception, create a log with enterprise library configured to send a mail to a distribution group of the developer of the project, and finally redirect the user on a error page called error.aspx.

All the 1600 mails reported the error “ **The file ‘error.aspx’ has not been pre-compiled, and cannot be requested** “, this error is generated for each page in the site. After a short search I found that this problem gets generated when the asp.net engine fails to load the assembly with precompiled code of the site, since the site is not updatable asp.net cannot build the page and generate this error.

After a short brainstorming I realized that the only reason the assembly can fail to load in pre production machine is some unresolved references, after short time I realized that we use a component that was updated in the last few days and was not updated in pre production machine. I upload the assembly, installed in the GAC and the site begin to work.

One thing that I did not like is the fact that the error message “The file xxx has not been pre-compiled, and cannot be requested” gives not any clue to find the error, maybe it could be better if the asp.net engine will show you a more meaningful error such as “cannot load assembly xxxxxxx version yyyyy”, it would have save me a 45 minutes of work.

Alk.
