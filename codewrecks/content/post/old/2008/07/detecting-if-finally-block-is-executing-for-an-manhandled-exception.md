---
title: "detecting if finally block is executing for an manhandled exception"
description: ""
date: 2008-07-25T00:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
[DisposableAction](http://www.ayende.com/Blog/archive/8065.aspx) pattern is one of the most useful I , I used it to manage transaction for a DataAccess helper. I begin a transaction with DataAccess.BeginTransaction() that returns an IDisposable object that automatically dispose the tranasction. Here is an example of a typical use

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (DataAccess.BeginTransaction())
{
    //Do whatever query you want with DataAccess
    DataAccess.CommitTransaction();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is similar to the TransactionScope of.NEt, but it does not involve the MSDTC. The only thing that I do not like too much is the need to call CommitTransaction() at the end of the block. It sounds unnecessary to me because committing the transaction is the *default* behavior of the block. The purpose of the transaction is to be sure that a series of operation are done atomically, so in my opinion the default behavior is committing the transaction and only if something is wrong we call Rollback. This can be a problem with disposable action pattern, because I can commit the transaction inside the Dispose() method, but in that way I will commit transaction even when the code throws an exception.

I need a way to distinguish in the Dispose method if it is called because the code has exit the using block with or without an exception. Here is a possible solution I found

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static Boolean IsInException()
{
    return Marshal.GetExceptionPointers() != IntPtr.Zero ||
             Marshal.GetExceptionCode() != 0;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With such a function I can implement dispose in a different way, if we are in exception it means that we are exiting the using block because of an unhandled exception, then I rollback the transaction, if we are not in an exception I simply check if the transaction is still alive (code in block could have called Rollback even if no exception is thrown, maybe because some business rules were violated), if the answer is Yes the transaction is still alive and I commit it.

Now I can forget to call CommitTransaction explicitly, if no exception occurred the code is committed, if an exception is raised the transaction is rollback, the only manual intervention I had to do with the transaction is calling RollbackTransaction if I need to.

alk.

<!--dotnetkickit-->

Tags: [Transaction](http://technorati.com/tag/Transaction) [Disposable Action](http://technorati.com/tag/Disposable%20Action)
