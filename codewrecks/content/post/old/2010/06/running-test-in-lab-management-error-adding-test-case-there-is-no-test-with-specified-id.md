---
title: "Running test in lab management 'Error adding test case there is no test with specified id"
description: ""
date: 2010-06-16T15:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
One of the most exiting capability of Lab Environment is the ability to

1) Record a Coded Ui Test     
2) Assign it to a test       
3) Run the test in an lab management virtual environment.

It is possible that running the test will return an error, and in the log you find an error like

Error adding test case [xx] to test run: There is no test with specified Id {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}.

The error is due to the fact that you are running your test against a build that does not contain the coded UI Test associated with the Test case. This is a common error if you:

1) register the coded UI Test     
2) assign to a Test Case    
3) go to MTM and run the test, without changing the build.

To solve this error: queue a build, verify that the build succeeded, then change the build associated with the test plan.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb33.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image33.png)

Be sure that the build in use is one that contains the test associated with automation, then run the test again and everything should succeed.

Alk.
