---
title: "How to report a bug the importance of good details and reproducibility information"
description: ""
date: 2008-10-20T08:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
During application's lifecycle, the activity of bug tracking is a really important one. You should use some software ([Team foundation server](http://en.wikipedia.org/wiki/Team_Foundation_Server) or some free tools like [mantis](http://www.mantisbt.org/)) to keep track of application's bugs. Usually, even if you use Test Driven Approach, you cannot intercept all bugs with unit tests, so you should be prepared to receive some issues in the Bug Tracker.

Issues are inserted by *testers, users*or *developer* or whoever person that uses the software during development,  and it is really important that bugs are reported correctly. Using a [Bug Tracking System](http://en.wikipedia.org/wiki/Bug_tracker) helps you a lot, but there is always the need of some rules that everyone should follow to report a bug. One of the most important rule is â€œalways add [reproducibility](http://en.wikipedia.org/wiki/Reproducibility) informationâ€. Here is a story happened to me some time ago.

I opened the issue tracker and found a bug with this information: â€œThe application crashes when I try to insert a new userâ€, I opened the test site, went to the â€œusers managementâ€ page, tried to insert a user and everything went well, I tried for three times but everything went ok. The only operation I can do was requesting feedback asking to the tester: â€œI inserted three user and no errors occurred, maybe someone had already corrected the bug, please verify againâ€. After some times the bug was reopened and the tester wrote â€œI still not be able to insert a new user, the bug is still thereâ€, I tried again and no errors occurred to me. Now it was time to ask to the tester to repeat all operations with my supervision (thanks to vnc), and I found that he is trying to create a new user with a password of â€œabcâ€, the system does not allow password of length less than 6 and the routine that does the check throws an error, finally I can correct the bug.

This story tells us some rules:

1. **When you trace a bug *always include reproducibility* **2.** Add so much details as you can into the Bug Tracking System. **Reproducibility is the most important one, if the tester would have tested for reproducibility he could found that the error occurred only with small password. When you try to determine reproducibility you should always try the operation with different input. The previous bug should have been tracked in this way.** *Bug**: Error when you try to insert a user with a small password.*

* **Reproducibility** : Open the â€œUsersManager.aspxâ€ page and try to insert a new user with a password of less than 6 characters*

With such a useful information developers can immediately check the routine that verify password length because the bug probably is there. Reproducibility should always be verified; a tester should always try different input, different operations sequence (if applicable), and generally he should try to add as many variation he is aware of to correctly determine reproducibility information. Even if the tester does not have time to determine it, he should specify as much data as possible, Es.

* **Bug** : Error when you try to insert a user*

* **Reproducibility** : Not tested*

* **Input Sequence** : Open the â€œUsersManager.aspxâ€ page and  try to insert a user with the name â€œTestUserâ€ belonging to administrator role, with the password 123.*

This bug contains no information on reproducibility, but at least told developers the exact sequence of operations that lead the tester to the bug, at least the developer can try the exact sequence and reproduce the bug. There is nothing more frustrating to see a bug issue that tells you: â€œThe software crashed when I print a reportâ€ when the software is a very big one and there are about 100 reports around there. A good rule of thumb is â€œTry to reproduce the bug a couple of times, if the bug does not happens, ask to the tester for  **exact sequence of operation that leads to the bug** , before wasting time to hunt bug in the code.

The rule for testers is: *Before inserting a bug into the bug tracking system, always try to determine reproducibility, and insert in the system the exact sequence of operations, including the exact data that leaded to the bug.*

Alk.

Tags: [Testing](http://technorati.com/tag/Testing) [Bug Traking](http://technorati.com/tag/Bug%20Traking) [Reproducibility](http://technorati.com/tag/Reproducibility)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/20/how-to-report-a-bug-the-importance-of-good-details-and-reproducibility-information/';</script><script type="text/javascript">var dzone_title = 'How to report a bug, the importance of good details and reproducibility information';</script><script type="text/javascript">var dzone_blurb = 'How to report a bug, the importance of good details and reproducibility information';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/20/how-to-report-a-bug-the-importance-of-good-details-and-reproducibility-information/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/20/how-to-report-a-bug-the-importance-of-good-details-and-reproducibility-information/)
