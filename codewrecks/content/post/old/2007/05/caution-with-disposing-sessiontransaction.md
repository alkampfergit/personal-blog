---
title: "Caution with disposing sessionTransaction"
description: ""
date: 2007-05-07T05:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
In nhibernate 1.2.0 beta versions a similar code path works well without problem

ISession  session  =  SessionHelper.GetSession();  
session.BeginTransaction();  
//do something  
session.Transaction.Rollback();  
session.Transaction.Dispose();  
session.BeginTransaction();  
//Do something  
session.Transaction.Rollback();

But above code is not legal since a disposed transaction cannot be used anymore. Until version 1.2.0 beta 3 the Dispose method of the Transaction Object did not mark transaction as disposed, so it can be reused.  Starting from NHibernate 1.2.0 GA the above code will throw a NullReferenceException. The solution is not to dispose Session.Transaction if you plan to restart a new transaction again.

Alk.
