---
title: "Linq provider via IEnumerable"
description: ""
date: 2009-11-20T17:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
If you ever tried to implement a linq provider, you know that this is not a simple [task](http://blogs.msdn.com/mattwar/pages/linq-links.aspx). This is true for a full linq provider, but sometimes we need only a basic support, and in these situations there is probably a simpler approach.

Suppose you need to give LINQ support to find user in Active Directory via LDAP, you need to make query for the various properties of the User object, and you need also to make change to some of these properties and propagate those changes back in the AD. Sounds complicated? Maybe not.

Look at this class.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class ADUser
{
    System.DirectoryServices.DirectoryEntry userDirEntry = null;
    private DirectoryEntry root;
    public ADUser(DirectoryEntry userDirEntry, DirectoryEntry root)
    {
        this.root = root;
        this.userDirEntry = userDirEntry;
    }

    public String Description
    {
        get { return (String)userDirEntry.Properties["description"].Value; }
        set { userDirEntry.Properties["description"].Value = value; }
    }

    public String UserName
    {
        get { return (String)userDirEntry.Properties["samaccountname"].Value; }

    }

    public void Update()
    {
        userDirEntry.CommitChanges();
    }

    public ADGroupCollection Groups { get; private set; }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see, this is a simple object that wraps a DirectoryEntry related to an ActiveDirectory user, it wraps only Name and Description, but it can be updated to support all user properties. Now I create another simply class.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class ADUsers : IEnumerable<ADUser>
{
    private IList<ADUser> Users;
    System.DirectoryServices.DirectoryEntry root = null;
    public ADUsers(System.DirectoryServices.DirectoryEntry root)
    {
        this.root = root;
        Users = new List<ADUser>();
        DirectorySearcher search = new DirectorySearcher(root);
        search.Filter = "(&(objectClass=user)(objectCategory=person))";
        search.PropertiesToLoad.Add("cn");
        SearchResultCollection results = search.FindAll();
        foreach (SearchResult result in results)
        {
            var de = result.GetDirectoryEntry();
            Users.Add(new ADUser(de, root));
        }
    }
    public IEnumerator<ADUser> GetEnumerator()
    {
        return Users.GetEnumerator();
    }
    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a real simple classes, it accepts a DirectoryEntry root used to query the Ldap, then it retrieves all the users object with a simple LDap query issued by DirectorySearcher object, for each result, it builds a wrapper ADuser. Now that we have these two simple classes we can write.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image19.png)

Since I loaded in memory a wrapper for each object, I can issue LINQ queries against the AdUsers, because I can rely on the support of Linq 2 Object, simply making AdUsers implementing IEnumerable. Since everything is in memory we can issue condition like u.UserName.Contains(â€œampâ€) or whatever you like.

Surely this is not the optimal solution, but is quick and works well. The main drawback is that all Users needs to be loaded into memory, so we are using more resources respect a full LINQ provider, that can analyze the expression and retrieve only users that satisfies the query. But since we are not expecting Thousands of users, this can be a viable KISS solution.

This simple example shows that, to support LINQ for some source, sometimes there is no reason to pass for the full IQueryable&lt;T&gt;.

Alk.

Tags: [LINQ](http://technorati.com/tag/LINQ)
