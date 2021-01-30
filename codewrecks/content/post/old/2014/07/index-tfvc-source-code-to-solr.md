---
title: "Index TFVC Source Code to Solr"
description: ""
date: 2014-07-08T14:00:37+02:00
draft: false
tags: [TfsAPI]
categories: [Team Foundation Server]
---
If you use good comments in your code, sometimes you need to search inside those comment to find a certain part of code associated to a specific comment that contains specific word. The sad part is that you can do it only for the latest version of the code and not for the entire history of all files. Suppose you want to do a simple  **Proof Of Concept to insert all content of all C# source code files in some search server (Es Solr, or Elastic Search) how it can be done with TFVC** ?

The answer is: with few lines of codes. First of all you need to connect to the Project collection you want to index and query for the whole history of your source code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (var projectCollection = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(collectionUri))
{
    var versionControl = projectCollection.GetService < VersionControlServer>();

    ChangesetVersionSpec versionFrom = new ChangesetVersionSpec(1);
    VersionSpec versionTo = VersionSpec.Latest;

    var changesets = versionControl.QueryHistory(
        "$/",
        versionTo,
        0,
        RecursionType.Full,
        null,
        versionFrom,
        versionTo,
        Int32.MaxValue,
        true,
        false,
        true,
        true
        );

{{< / highlight >}}

One you got the list of all the changesets of the collection you can start enumerating and storing data inside your Solr Server.

{{< highlight vb "linenos=table,linenostart=1" >}}


foreach (Changeset changeset in changesets)
{
    //Check the comment... 
    //Console.WriteLine("Changeset ID:" + changeset.ChangesetId);
    //Console.WriteLine("Owner: " + changeset.Owner);
    //Console.WriteLine("Committed By: " + changeset.Committer);
    //Console.WriteLine("Date: " + changeset.CreationDate.ToString());
    //Console.WriteLine("Comment: " + changeset.Comment);
    //Console.WriteLine();
    logger.Info("Analyzing changeset " + changeset.ChangesetId);
    Int32 partcommit = 0;
    foreach (var change in changeset.Changes)
    {
        //Console.WriteLine("\tChanged: " + change.Item.ServerItem);
        //Console.WriteLine("\tOwChangener: " + change.ChangeType);
        if (change.Item.ItemType == ItemType.File) 
        {
            String tempFile = Path.Combine(Path.GetTempPath(), Path.GetFileName(change.Item.ServerItem));
            if (Path.GetExtension(tempFile) == ".cs") 
            {
                logger.Debug("Indexing: " + change.Item.ServerItem);
                String content = null;
                using (var reader = new StreamReader(change.Item.DownloadFile()))
                {
                    content = reader.ReadToEnd();
                }
                XElement elementNode;
                XDocument doc = new XDocument(
                    new XElement("add", elementNode = new XElement("doc")));

                elementNode.Add(new XElement("field", new XAttribute("name", "id"), change.Item.ServerItem + "_Cid" + changeset.ChangesetId));
                elementNode.Add(new XElement("field", new XAttribute("name", "changesetId"), changeset.ChangesetId));
                elementNode.Add(new XElement("field", new XAttribute("name", "author"), changeset.Owner));
                elementNode.Add(new XElement("field", new XAttribute("name", "path"), change.Item.ServerItem));
                elementNode.Add(new XElement("field", new XAttribute("name", "content"), content));

                solrServer.Post(doc.ToString());
            }
        }
        if (partcommit++ % 100 == 0) 
        {
            solrServer.Commit();
        }
    }
}

{{< / highlight >}}

 **This is not production-quality code, just a quick test to find how simple is downloading all files for each commits from your TFVC repository**. The key part is enumerating the Changes collection of the changeset object, that contains the list of changes. If the change is of type File, I simply check if the file has.cs extension and if it is a csharp file I download that specific version in a local temp directory.

Thank to the change.Item.DownloadFile() method I do not need to create workspace and I can simply download only the file I need, and once the file is on a local folder, I use a simple custom class to index it into a Solr Server. This approach has pro and cons.

- * **Pro** *: It is simple, few lines of codes, and you have data inside a Solr (or Elastic Search) server to be queried
- * **Cons** *: it breaks security, you should now secure your Solr or ES server so people are not free to access it.

In real production scenario you need to

-  **Change the code so it runs incremen** tally, just store last ChangesetId you indexed and restart from the next.
- Put some webservice in front of your ES or Solr server, issue the search to the Solr or ES Server, and once it returns you the list of the files that matches query, you need to check if the actual user has permission to access those files in original TFS Server.

Gian Maria.
