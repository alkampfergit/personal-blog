---
title: "How to get TFS server address from a local folder mapped to a workspace"
description: ""
date: 2010-09-13T16:00:37+02:00
draft: false
tags: [Team Foundation Server,TfsAPI]
categories: [Team Foundation Server]
---
Sometimes you need to operate to a Tfs Version Control System with API starting from a local folder. There are a lot of API to work with workspaces, but the main problem is that you need to pass through a [VersionControlServer](http://msdn.microsoft.com/en-us/library/bb171724%28v=VS.100%29.aspx) object, and to obtain such an object you need to know the address of the Tfs server the workspace is mapped to?

The exercise is the following one :) â€“ Write a snippet of code, based on TFS API that, given a local path, retrieve ChangesetId that is currently mapped on the workspace.

The key part is the [Workstation](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.versioncontrol.client.workstation%28v=VS.100%29.aspx) class that permits you to obtain a [WorkspaceInfo](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.versioncontrol.client.workspaceinfo.aspx) object from a simple Path, thanks to the [GetLocalWorkspaceInfo](http://msdn.microsoft.com/en-us/library/bb139693.aspx) method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Workstation workstation = Workstation.Current;
WorkspaceInfo info = workstation.GetLocalWorkspaceInfo(path);
{{< / highlight >}}

Now that you have a workspace info, getting the info you need is really simple, first of all you can know the Team Project Collection address thanks to the *ServerUri* property of the WorkspaceInfo object, moreover the WorkspaceInfo object can create a valid [Workspace](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.versioncontrol.client.workspace.aspx) object with a simple call to [GetWorkspace](http://msdn.microsoft.com/en-us/library/ff732927.aspx) method, passing a valid TfsTeamProjectCollection object. Here is the code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
TfsTeamProjectCollection collection = new TfsTeamProjectCollection(info.ServerUri);
Workspace ws = info.GetWorkspace(collection);
String servername = ws.GetServerItemForLocalItem(path);
VersionControlServer vcs = collection.GetService<VersionControlServer>();
{{< / highlight >}}

Now you have both the VersionControlServer object and the Workspace object, and you can use the QueryHistory method to know the information you need.

{{< highlight csharp "linenos=table,linenostart=1" >}}
IEnumerable changesets = null;
VersionSpec spec = VersionSpec.ParseSingleSpec("W", ws.OwnerName);
 
WorkspaceVersionSpec wvs = spec as WorkspaceVersionSpec;
if (null != wvs && null == wvs.Name)
{
spec = new WorkspaceVersionSpec(ws.Name, ws.OwnerName);
}
changesets = vcs.QueryHistory(servername, VersionSpec.Latest, 0, RecursionType.Full, null,
new ChangesetVersionSpec(1), spec, 1, false, false).OfType<Changeset>().ToList();
int changesetId = changesets.Cast<Changeset>().First().ChangesetId;
{{< / highlight >}}

And you have the ChangesetId currently mapped to the local folder.

Alk
