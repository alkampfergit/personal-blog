---
title: "Manage Scope or Execution Context of Repository"
description: ""
date: 2009-08-07T03:00:37+02:00
draft: false
tags: [Castle,Nhibernate]
categories: [Castle,Nhibernate]
---
In a project Iâ€™m working with [Guardian](http://www.nablasoft.com/guardian), we are using [NHibernate](https://www.hibernate.org/343.html) behind a Repository Pattern. Despite the question if is good or not good to shield the session behind a Repository,we encountered a classic problem.

The software is structured as service, we use [Castle Nhibernate Facility](http://www.castleproject.org/container/facilities/trunk/nhibernate/index.html) and [Wcf Integration Facility](http://www.castleproject.org/container/facilities/trunk/wcf/index.html) plus a simple interceptor that manages the concept of â€œSingle session per service callâ€. Now we are developing some interface in WPF, and this program can dialogate directly with database, without the need to access the db through wcf service. Since we are using MVVM, we makes heavy use of binding, and we like to use lazy load, to keep the logic simple. Instead of returning Dto, a special service class is used to directly return NHibernate persistent object, and if the user want to browse some internal collection of this object we can simply bind the view to entity collection property, and the collection will be fetched when needed with lazy load. Since we have a tree structure this solution is really simple and works really well.

The problem arise because the repository use a single session per call, so when the ViewModel ask for an object, the service return a disconnected object.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image15.png)

This happens because the repository does not have control over the lifetime of the session, it simply open the session, does whatever he need to does with the session, and then Dispose it. Nhibernate Castle integration helps a lot because it keeps track of session reference counting, so if you open a session, and in the same CallContext you open another session, you get a sort of a â€œweak referenceâ€ to the original session. This means that the session gets disposed only when the first created session is disposed.

To use Lazy load in the ViewModel we could simply call ISessionManager.OpenSession() in the constructor of the ViewModel and dispose resulting session in ViewModel Dispose() function. This is not good because it violates repository encapsulation, because you must know how repository is implemented internally.

Moreover it is really ugly to see a nhibernate ISession created in the ViewModel, only to keep session alive, because it vanished all benefit of shielding the ISession behind a repository. A better solution is to create a class like this one.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class RepositoryScope : IDisposable
{
    private ISessionManager SessionManager { get; set; }
    private ISession Session { get; set; }

    protected RepositoryScope(ISessionManager manager)
    {
        SessionManager = manager;
    }

    #region IDisposable Members

    public void Dispose()
    {
        ///close the most external scope
        Session.Dispose();
    }

    #endregion

    public static RepositoryScope BeginScope()
    {
        RepositoryScope scope = new RepositoryScope(
            IoC.Resolve<ISessionManager>());
        scope.Session = scope.SessionManager.OpenSession(
            ConfigurationRegistry.MainDatabaseConnectionName);
        return scope;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This simple class does internally a simple task, it creates a session and dispose in Dispose() method. In this way if you call RepositoryScope.BeginScope() you are actually creating a ISEssion that will be disposed when you will call Dispose() on the RepositoryScope object.

With this simple class the repository remains unchanged, and the caller can manage the lifecycle of repository context, without the need to know his internal implementation.

Alk.

Tags: [Castle](http://technorati.com/tag/Castle) [Nhibernate](http://technorati.com/tag/Nhibernate)
