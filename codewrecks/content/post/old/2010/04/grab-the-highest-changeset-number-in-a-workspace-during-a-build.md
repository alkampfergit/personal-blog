---
title: "Grab the highest changeset number in a workspace during a build"
description: ""
date: 2010-04-09T10:00:37+02:00
draft: false
tags: [Team Foundation Server,TFS Build]
categories: [Tfs]
---
In a [very old post](http://www.codewrecks.com/blog/index.php/2009/09/07/again-on-assembly-numbering-during-tfs-build/) I explained how to grab (with API) the latest changeset number during a build to use for assembly numbering, but I need to do a correction, after a comment on the post.

The ChangesetId is an unique number for all the source control system, so I have two distinct problem.

1) while the build is running, developers do check-in, so when I retrieve the GetLatestChangesetId at a certain point during the buil, I do not get the real changesetId that I'm building, but an incorrect one. The problem is that a user can lookup the assembly number, see a changesetid and then verify that the changesetId is not related to that project.

2) If the build is customized to get a specific version during the CoreGet step of the End-To-End interation, I still use the latest changeset number and this is real wrong.

This issue is complicated, because it is possible to customize the build and get different changeset for different folders, or you can simply build by label, and a label can contain files that are in the latest version or file at some time in the past.

A solution can be found in the simple scenario, when the build executes a GetLatest of all the source before the build (the default behavior). With this assumption you can find the highest changeset present in the workspace, avoiding the risk of getting the wrong changesetid.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Workspace ws = vcs.GetWorkspace(BuildDirectory);
LatestChangeset = GetLatestChangeset(BuildDirectory, ws, vcs).ChangesetId;
{{< / highlight >}}

The vcs variable is the VersionControlServer object, and the GetWorkspace() method permits to pass a folder, and getting a workspace in return for the current user, the current machine and the folder passed as parameter. Then I call a function called GetLatestChangeset passing the folder, the workspace and the VersionControlServer object.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private Changeset GetLatestChangeset(String directoryName, Workspace ws, VersionControlServer vcs)
{
String servername = ws.GetServerItemForLocalItem(directoryName);
IEnumerable changesets = null;
 
VersionSpec spec = VersionSpec.ParseSingleSpec("W", ws.OwnerName);
WorkspaceVersionSpec wvs = spec as WorkspaceVersionSpec;
if (null != wvs && null == wvs.Name)
{
spec = new WorkspaceVersionSpec(ws.Name, ws.OwnerName);
}
changesets = vcs.QueryHistory(servername, VersionSpec.Latest, 0, RecursionType.Full, null,
new ChangesetVersionSpec(1), spec, 1, false, false).OfType<Changeset>().ToList();
 
return changesets.Cast<Changeset>().FirstOrDefault();
}
{{< / highlight >}}

In line 3 thanks to the GetServerItemForLocalItem I can retrieve the server path of the local folder mapped on the workspace, then lines from 6 to 11 are needed to create a VersionSpec object that represents the actual workspace. Finally the [QueryHistory](http://msdn.microsoft.com/en-us/library/bb138960%28v=VS.80%29.aspx) method permits me to grab the list of changeset of path contained in ServerName variable.

The QueryHistory method needs the server path to query, then it is important to specify RecursionType.Full to query all objects of specified path, then there are two params called versionFrom and versionTo, used to specify a range. For this example I used 1 as the From and the workspace spec build in lines 6-11, to maximize performance I ask only for a single changeset (they are ordered from higher to lower).

With this function included in a msbuild custom action I'm able to grab the highest changeset number actually present in a workspace, and I can use it to number the assembly during the build if I'm sure that the build issue a getlatest or get specific changeset.

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
