---
title: "Dealing with a lot of data usually lot of problems"
description: ""
date: 2012-04-20T16:00:37+02:00
draft: false
tags: [Programming]
categories: [Programming]
---
I’ve just read a post of my friend Mauro, “[Dealing with log of Data](http://milestone.topics.it/2012/04/dealing-with-lot-of-data-problem.html)” and I really agree with his position, because projects that needs to manage big amount of data usually brings a lot of problems both on production server, but also on the everyday developer life.

We tend to think that since  **disk space is quite cheap in these days** , it is not a big problem, but this is usually false. Even if we are not worried about performance, having really big databases makes more difficult to manage backups. If you have 1GB Sql Server database, you can use much more easy backup strategy than a situation where you have three database that account for 150GB in total. Time to do a full backup is usually really *high*, time to restore a database is even higher and these are only few of the problem that you will start to face on production server. For performance we can buy really fast hardware (after all it is production hardware so it worth spend on it) and we can reach good performance even with such big databases.

The situation starts to become worst in *Staging or PreProduction servers*, because we are usually used to test milestone of the software on a copy of production data to be sure to find bugs caused by specific data in database. Doing a  **Backup Restore from production to PreProduction** with 150GB of data, usually requires that PreProduction  **servers are located in the same network of Production Servers** and this is not always possible. Managing multiple parallel environment in PreProduction starts to become really expensive, if each environment uses 150GB of data, you usually ends storing that environment in slower SAN or in machines with 7200 RPM disks.  After all if you can afford buying really fast machine for  **a single production environment** , it is difficult to justify a similar expense for  **multiple PreProduction servers**. Running complex suite of tests usually requires being able to restore the database to a known state between each suite of test, this can be easily accomplished with Virtual Machines and snapshot, because a restore of the database is not so easy to do.

If in PreProduction environment the situation is not so good, the situation become really bad for the single developer. With ~4GB of database data you can even use a RAMDisk to achieve lightning speed to run tests, but with 150 GB of data, if you need a full database with real data to run certain suite of tests it is a huge pain. It is true that running test or working with a  database with real data is not the typical everyday work for developers, but some data shapes are really complex, *you can have thousands of unit tests, but from time to time you need to run integration test with real data*.  **Database of that kind of size usually tends to exhibit all sort of problem regarding performance** , and working on a reduced sets of data create an high risk that some code become really unusable when run on production data. When a developer write a new piece of the software, despite unit testing, he need to do some runs against a database of the same size of production database to verify that the queries are good.

This lead to an obvious conclusion: *when you design your data storage, keep in mind that size is a problem, even if storage space is cheap, the real cost become maintaining a good infrastructure to make developers and testers productive*.

Gian Maria.
