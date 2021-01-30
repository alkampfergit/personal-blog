---
title: "Mantain your test code carefully"
description: ""
date: 2009-05-11T06:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Iâ€™m working on a project where access to the db is mixed, some data is managed with nhibernate and some other data with stored procedure. This is needed because the project was born without nhibernate, and moreover there are operation that needs to managed bulk insert of a lot of data and I need these operation to be superquick. Despite the reason why I’m working this way I have a lot of test that are bound to database.

For some test I need to clear data from all the table to avoid test interaction, in some situation it is enough doing this only before each test, in other situation I need to clear database after each run. Moreover for some test I need to disable integrity check. Sometimes I need to check logic only for one table, and I know that it does not matter to have related record in related table, I do not want to fill data in tables that I do not need, so I simple disable integrity when it is needed.

My problem is the following: time to refactor test is increasing. Letâ€™s make an example, I changed a little thing in the schema, and when I ran the testâ€¦a lot of them failed. This happened because in the setupfixture part I have a lot of instruction like

{{< highlight csharp "linenos=table,linenostart=1" >}}
DataAccess.ExecuteNonQuery("delete from table1");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the reason is, now tabl1 have a new foreign key with tabl2, so I need to delete record from table2 before cleaning up table1. What I do not like is that this instruction appears in the setupfixture of 4 tests, so I need to change them all. So I decided to move some test helper classes I have in another project, now Iâ€™m able to create such a test.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    [TestFixture()]
    [ClearSqlServer(ClearAtEachTest = true)]
    [DisableIntegrityCheck]
    public class PpDomini : BaseDatabaseTest  {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

What is changed? The first advantage is that code to clear the database is only in one place, when I create more foreign key I just need to modify the main clear function. But the improvement I like most is that now I have a really clear way to express fixture of the test. With attribute everyone that read this test immediately understand that this test is based on db cleanup before each test, and tests run without integrity check enabled.

The problem with the original tests, is that I did not spent enough time to refactor test classes as if they were production code. Remember, always tread test classes like production code, and refactor often to minimize code duplication and maximize test readability.

alk.

Tags: [TEst](http://technorati.com/tag/TEst)
