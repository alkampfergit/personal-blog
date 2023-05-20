---
title: "TFS Api to associate work item with check-in using comment tags"
description: ""
date: 2013-02-02T09:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
In my post “[Associate Work Items to check-in in a TF Service Git Enabled repository](http://www.codewrecks.com/blog/index.php/2013/01/31/associate-work-items-to-check-in-in-a-tf-service-git-enabled-repository/)” I explained how simple is to  **associate a commit in git to a Work Item simply inserting an hashtag followed by the id of the work item**. Some of my friend and colleagues told me that it would be nice to have such kind of integration even in standard TFS VCS. This feature can be extremely useful for people not using Visual Studio, or people that are lovers of command line (TFS has the tf.exe command that permits you do do everything you need to do).

The solution is really simple, because * **thanks to TFS API you can build a little utility that simply scans your TFS for check-ins, find all comments that contains #xxx code and create the association between the ChangesetId and the Work Item** *. The code is really simple, first of all get a reference to all check-ins of the project

{{< highlight csharp "linenos=table,linenostart=1" >}}


// get a reference to the team project collection
using (var projectCollection = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(collectionUri))
{
    // get a reference to the work item tracking service
    var workItemStore = projectCollection.GetService<WorkItemStore>();

    var teamProject = workItemStore.Projects
       .OfType<Project>()
       .Single(proj => proj.Name == "FabrikamFiber");

    //now look for all the changeset
    var versionControl = projectCollection.GetService<VersionControlServer>();
    ChangesetVersionSpec versionFrom = new ChangesetVersionSpec(1);
    VersionSpec versionTo = VersionSpec.Latest;

    var changesets = versionControl.QueryHistory(
        "$/FabrikamFiber",
        versionTo,
        0,
        RecursionType.Full,
        null,
        versionFrom,
        versionTo,
        Int32.MaxValue,
        true,
        false
        );

{{< / highlight >}}

This code will get a reference for all the changesets of the project, to make it “production-ready” you should store the latest changeset id scanned, so at each run it will scan only newest changesets, but remember that developers can change the comment at any time, so a full scan it should be done from time to time. Now it  **is just a matter of cycling thought all changesets to find comments that contains association tag #workitemid** {{< highlight csharp "linenos=table,linenostart=1" >}}


foreach (Changeset changeset in changesets)
{
    Console.WriteLine("Analyzing changeset {0}", changeset.ChangesetId);
    var comment = changeset.Comment;
    var matches = Regex.Matches(comment, @"#(?<id>\d+)");
    foreach (Match match in matches)
    {
        //I have an association on the form #changesetid
        var id = Int32.Parse(match.Groups["id"].Value);
        var workItem = workItemStore.GetWorkItem(id);

        //now create the link
        ExternalLink changesetLink = new ExternalLink(
            workItemStore.RegisteredLinkTypes[ArtifactLinkIds.Changeset],
            changeset.ArtifactUri.AbsoluteUri);
        //you should verify if such a link already exists
        if (!workItem.Links.OfType<ExternalLink>()
           .Any(l => l.LinkedArtifactUri == changeset.ArtifactUri.AbsoluteUri))
        {
            Console.WriteLine("\tAssociate changeset {0} to Work Item {1}:{2}", 
                changeset.ChangesetId,
                workItem.Id,
                workItem.Title);
            workItem.Links.Add(changesetLink);
            workItem.Save();
        }
    }
}

{{< / highlight >}}

As you can verify it is just a matter of scanning the comment, use a regular expression to find all #wid pattern, then for each work item you need to associate:

1. query it from the WorkItemStore
2. create a new link of type Changeset
3. finally verify if the Work Item has not already been associated to that Work Item, to avoid creating multiple association if you run this tool multiple times against all changesets.

To verify that everything works as expected, simply create a comment with tags association

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image3.png)

 ***Figure 1***: *This comment will associate the changeset to Work Items 46 and 47, the Changeset does not have any associated WI*

Now run the tool and you should got something like this.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image4.png)

 ***Figure 2***: *The tool correctly associate Work Items to changeset based on comment content*

Now you can run the tool again to verify that this second run no association will be done because the link was already in place and clearly refresh the changeset details to verify if the association was correctly done.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image5.png)

 ***Figure 3***: *Association is now correctly done between the Changeset and work items*

[The code is here](http://sdrv.ms/14wkKRe) [http://sdrv.ms/14wkKRe](http://sdrv.ms/14wkKRe "http://sdrv.ms/14wkKRe"). Remember that this is just a quick experiment, and you should probably improve it to be really production-ready :).

Happy TFS.

Gian Maria.
