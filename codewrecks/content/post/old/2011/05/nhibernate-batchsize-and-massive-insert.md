---
title: "Nhibernate BatchSize and massive insert"
description: ""
date: 2011-05-13T16:00:37+02:00
draft: false
tags: [Nhibernate,Performance]
categories: [Nhibernate]
---
I have an application that analyze some data and insert about 1000 objects for each cycle into the database. The insertion  **needs to be transactional** , and I need to insert 500 instances of object A and 500 instances of object B, and each B have a reference to A.

When I launch the application I see this insert pattern, even if I enabled batch size in Nhibernate.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/image6.png)

 ***Figure 1***: *Each object has his own insert instruction A then B then A then B again.*

This is a typical bulk insert problem with an ORM, but it is strange that it happens even if I enabled Batch size. Thanks to NhProf I verified that NH inserted objects one by one, alternating object of type A and B. The only flush is at the very end of the insertion, and I verified with NHProf that all the insert are issued when I call flush(). Performances are unacceptable because due to network latency (database accessed over an internet based vpn) each insert requires ~100 ms, so I have about 1000 \* 100 = 100 seconds. Since everything is transactional I have a transaction open for more than one minute.

Iâ€™m using NH 2.1 and I do not know exactly if bulk inserting of linked objects was fixed in version 3 but the solution is simple, instead of creating couple of A and B object and immediately pass them to Session.Save object I took this different strategy

1) created all object in memory, for 500 times I create A, create B and set B.refa = A     
2) now that all 1000 objects are in memory, I call Session.Save for each object of type A      
3) call Session.Flush()      
4) call Session.Save() for each B object      
5) commit the transaction.

Since object of type A does not depend from objects of type B, when I call flush() in point 3, session contains only objects of type A, so it can use batching. Then when I insert all B objects and commit transaction, the session should only insert all B objects and it can use batching again. The result is

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/05/image7.png)

 ***Figure 2***: *Batching in action, since I have 50 as batch size, inserting 500 objects requires only 10 insert query.*

The improvement in performances is really high, because each batch requires about ~500 ms to complete, so Iâ€™m able to insert everything in 20 \* 500 = ~10 seconds, and the insertion time is reduced by one order of magnitude.

This simple example shows, that for some specific operations, like massive insert, you should always double check what your ORM does behind the curtain, to avoid unnecessary performance loss.

alk.
