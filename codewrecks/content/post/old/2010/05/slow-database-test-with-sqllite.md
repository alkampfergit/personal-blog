---
title: "Slow database test with SqlLite"
description: ""
date: 2010-05-12T15:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
I’ve a project where I wrote all nhibernate mapping tests against a sqllite db. At this time a test fixture gave me this result.

*44 passed, 0 failed, 0 skipped, took 54,46 seconds (NUnit 2.5.5).*

As you can see the time needed to run the test is quite high, and the worst stuff is that is gets higher over time, at the beginning of the project it is acceptable now it is becoming annoying. The problem is that, since I need to run each test starting with a clean database, I have an helper that simply recreates the schema of the database with Nhibernate SchemaExport class before each test. This scenario is inefficient, because schema creation is an heavy operation to perform, but I’ve used because it is quick and it works very well.

Now it is time to optimize it, because having this slow tests is not a good stuff and, since sqllite database is composed by a simple file, I’ve modified my initialization test using the following pseudocode

1) identify file name from connection string

2) at the first call of InitSchema function simply use the SchemaExport to create the schema and save a copy of the database file.

3) at each subsequent call, simply delete the database file and restore the copy with a File.Copy() call.

I’ve also moved the database to a ram disk to speedup stuff a little more. Here is the new run result.

*44 passed, 0 failed, 0 skipped, took 12,97 seconds (NUnit 2.5.5).*

As you can see I gain a tremendous amount of time, just with this little trick. The conclusion is that, whenever you need to do Unit Testing against a database, do not underestimate the loss of performances and do a little bit of optimization against test code :).

alk.
