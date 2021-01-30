---
title: "Associate Work Items to Git commit in TF Service with API Calls"
description: ""
date: 2013-06-18T06:00:37+02:00
draft: false
tags: [Git,TfsAPI]
categories: [Visual Studio ALM]
---
I’ve already blogged how to [associate Work Items with TFS Check-ins using tags in comment and a bunch of Api Calls](http://www.codewrecks.com/blog/index.php/2013/02/02/tfs-api-to-associate-work-item-with-check-in-using-comment-tags/). This feature is now available for any TF Service based on Git, but someone asked me how can you accomplish this task with API. A possible scenario would be supporting  **different type of comment syntax** and in general to understand how this task can be accomplished though API.

The code is really similar to the one I’ve posted in the other article, the only differences is comments are taken from Git commit and not from changeset checkins. The prerequisite is having a local git repository cloned from a TF Service Git based project, than we can simply iterate through all commits to identify comments containing pattern #wid, where wid is the work item id. Once a commit is identified we can  **create**  **the link between the corresponding Work Item with some API calls**.

You can find most of the details in [the previous post](http://www.codewrecks.com/blog/index.php/2013/02/02/tfs-api-to-associate-work-item-with-check-in-using-comment-tags/), in this one I just want to show the section related to Git. First of all **to create the link that connect a Work Item to a Git commit you need to have both the guid of the Team Project, and the TFS guid of the Git Repository**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


//get a reference to the git repository service
var gitRepoService = projectCollection.GetService<GitRepositoryService>();
var gitProjectRepoService = gitRepoService.QueryRepositories(teamProjectName);
var defaultGitRepo = gitProjectRepoService.Single(gr => gr.Name.Equals(teamProjectName));

//Id needed to create the link
var tpGuid = teamProject.Guid;
var gitGuid = defaultGitRepo.Id;

{{< / highlight >}}

Git repositories has no concept of a “guid”, but in TF Service the server assign a guid to each Git Repository. Since a Team Project can contain more than one single git repository, in this simple example I take the only one that has the name equals to the Team Project, the default one.  **In real production scenario you probably should scan all the repositories**.

Thanks to LibGit2Sharp obtaining a list of commits is really simple, you need to have a local clone of the repository and you should fetch from origin (TF Service) so you have your local repository origin/master aligned with the server, then you can simply iterate through all commits of the origin.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using (var repo = new Repository(@"C:\Develop\TfService\GitTestProject"))
{

    var remoteCommits = repo.Branches["origin/HEAD"].Commits;
    foreach (var commit in remoteCommits)
    {
        Console.WriteLine("Analyzing commit {0}", commit.Id);
        var comment = commit.Message;
        var matches = Regex.Matches(comment, @"#(?<id>\d+)");
        foreach (Match match in matches)
        {
            //I have an association on the form #changesetid
            var id = Int32.Parse(match.Groups["id"].Value);
            var workItem = workItemStore.GetWorkItem(id);

            //now I should create the link, I need the guid of the team project
            var link = String.Format
                (
                    "vstfs:///git/commit/{0}%2f{1}%2f{2}",
                    tpGuid,
                    gitGuid,
                    commit.Sha
                );

{{< / highlight >}}

 **The interesting part is the one that creates a TF Service valid link to the commit** to establish a link with the Work Item. The link is composed by a vstfs:///git/commit part, followed by the id (guid) of the Team Project, then a forward slash (encoded so it is %2f), then the TF Service guid of the Git Respository, another forward slash and the sha of the commit (full commit id). The rest of the code simply uses a regular expression to find comment that contains pattern #wid to identify Work Item ids to be connected.  **Once you create the string representation of the link, you can easily create the link between the Work Item and the commit**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


//now create the link
ExternalLink changesetLink = new ExternalLink(
    workItemStore.RegisteredLinkTypes[ArtifactLinkIds.Commit],
    link);
//you should verify if such a link already exists
if (!workItem.Links.OfType<ExternalLink>()
   .Any(l => l.LinkedArtifactUri == link))
{
    Console.WriteLine("\tAssociate changeset {0} to Work Item {1}:{2}",
        commit.Id.Sha,
        workItem.Id,
        workItem.Title);
    workItem.Links.Add(changesetLink);
    workItem.Save();
}

{{< / highlight >}}

The above code simply check if the work item already was linked to the same commit (to avoid creating duplicate links) and if the link is not present it simply create a new Work Item link of type ExternalLink and the Work Item is connected..

You can use this simple Proof Of Concepts and implement the logic you like to associate Changeset and Work Items. The code is here [http://sdrv.ms/107WUgo](http://sdrv.ms/107WUgo) you can use at your own risk, * **it is not intended for production use** *, but only as a guide to familiarize with related API.

Gian Maria.
