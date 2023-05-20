---
title: "Copy TFS queries between iterations"
description: ""
date: 2011-03-17T11:00:37+02:00
draft: false
tags: [TfsAPI]
categories: [Tfs]
---
In an [old post](http://www.codewrecks.com/blog/index.php/2011/03/07/duplicate-queries-in-tfs-between-iterations/) I spoke about a simple routine to copy queries between iterations in TFS, now it is time to show the code, behind this simple command.

Everything is really simple, the first step is creating a connection with the TFS server and retrieve a reference to [QueryHierarchy](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.workitemtracking.client.queryhierarchy.aspx) object

{{< highlight csharp "linenos=table,linenostart=1" >}}
string userName = GetParameterValue<String>("user");
string password = GetParameterValue<String>("pwd");
TfsTeamProjectCollection tfs =
new TfsTeamProjectCollection(new Uri(GetParameterValue<String>("collection")),
new NetworkCredential(userName, password));
 
 
string projectName = GetParameterValue<String>("teamproject");
WorkItemStore store = (WorkItemStore) tfs.GetService<WorkItemStore>();
string iterationsource = GetParameterValue<String>("iterationsource");
QueryHierarchy queryHierarchy = store.Projects[projectName].QueryHierarchy;
{{< / highlight >}}

The code is really simple, just create a [TfsTeamProjectCollection,](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.CLIENT.TFSTEAMPROJECTCOLLECTION%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true) pass the url of the collection as well as network credential and the connection to the TFS is done. Now I recover projectName from the command line parameters, and grab a reference to a [WorkItemStore](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.WORKITEMTRACKING.CLIENT.WORKITEMSTORE%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true) object thanks to the well known [GetService](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28%22MICROSOFT.TEAMFOUNDATION.CLIENT.TFSCONNECTION.GETSERVICE%60%601%22%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true)() method of the TfsTeamProjectCollection object.

After I got a reference to the WorkItemStore I can finally grab a reference to QueryHierarchy object  (line 11) from the WorkItemStore object, passing the name of the team project you want to handle.

Since the query structure of TFS is a tree, I need to build a function that iterate in all the node of the tree to find the source iteration and the destination iteration.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private QueryFolder Search(QueryHierarchy hierarchy, String name)
{
foreach (QueryFolder queryFolder in hierarchy)
{
var result = Search(queryFolder, name);
if (result != null) return result;
}
return null;
}
private QueryFolder Search(QueryFolder hierarchy, String name)
{
foreach (QueryItem queryFolder in hierarchy)
{
QueryFolder folder = queryFolder as QueryFolder;
if (folder == null) continue;
if (name.Equals(folder.Name, StringComparison.OrdinalIgnoreCase))
return folder;
var result = Search(folder, name);
if (result != null)
return result;
}
return null;
}
{{< / highlight >}}

The code is really simple, the entry point Search method accepts a QueryHierarchy object and the name of the iteration to search, it simply iterates in all the QueryItem contained in the hierarchy, and for each one it checks the type, and if it a QueryFolder, it calls a recursive function. Everything is based on the fact that a [QueryFolder](http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.workitemtracking.client.queryfolder.aspx?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.WORKITEMTRACKING.CLIENT.QUERYITEM%29;k%28TargetFrameworkMoniker-&quot;.NETFRAMEWORK&amp;k=VERSION=V4.0&quot;%29;k%28DevLang-CSHARP%29&amp;rd=true) implements the IEnumerable&lt;[QueryItem](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.WORKITEMTRACKING.CLIENT.QUERYITEM%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true)&gt; interface, that permits to iterate in all child nodes, of type [QueryItem](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.WORKITEMTRACKING.CLIENT.QUERYITEM%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true). During the loop, since I'am searching for an Iteration folder, I need to verify if the [QueryItem](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.WORKITEMTRACKING.CLIENT.QUERYITEM%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true) is a QueryFolder object, if not I simply skip that element and move to the next one with a  *continue*. If a QueryFolder with the desidered name is found, simply returns it to the caller.

Thanks to this function in the main flow of execution I can simply search for the two iteration folder, and then duplicate all the queries.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var qj = Search(queryHierarchy, iterationsource);
string iterationdest = GetParameterValue<String>("iterationdest");
var qd = Search(queryHierarchy, iterationdest);
Duplicate(qj, qd, iterationsource, iterationdest);
queryHierarchy.Save();
{{< / highlight >}}

Line 5 calls the method [Save()](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.WORKITEMTRACKING.CLIENT.QUERYHIERARCHY.SAVE%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true) of the queryHierarchy item, because all the modification you can do to this object are held in memory until you explicitly save to the TFS server. Now lets examine the Duplicate() method that does all the work.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void Duplicate(QueryFolder qj, QueryFolder qd, string iterationsource, string iterationdest)
{
foreach (QueryItem item in qj)
{
if (item is QueryFolder)
{
QueryFolder queryFolder = new QueryFolder(item.Name);
qd.Add(queryFolder);
Duplicate(item as QueryFolder, queryFolder, iterationsource, iterationdest);
}
else if (item is QueryDefinition)
{
if (qd.Contains(item.Name)) continue;
 
QueryDefinition def = item as QueryDefinition;
string queryText = def.QueryText.Replace(iterationsource, iterationdest);
QueryDefinition queryDefinition = new QueryDefinition(def.Name, queryText);
qd.Add(queryDefinition);
}
}
}
{{< / highlight >}}

Thanks to TFS API the code is really really simple, it accepts the source and destination QueryFolder, as well as the name of the source iteration and the destination iteration.

The code simply iterate in all QueryItem, if it is a QueryFolder I create a QueryFolder with the same name on destination node, and I recursively call the Duplicate function. If the QueryItem is a [QueryDefinition](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28MICROSOFT.TEAMFOUNDATION.WORKITEMTRACKING.CLIENT.QUERYDEFINITION%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV4.0%22%29;k%28DevLang-CSHARP%29&amp;rd=true) object (the actual query that you find in TeamExplorer) it sould be duplicated. First of all I check if the destination folder already contains a QueryItem with the same name, (to avoid error for conflicting names), then I create a copy of the QueryDefinition, replacing the name of the old iteration with the new one. This is possible because the query is a simple text, that can be handled with the standard string functions.

Thanks to few lines of code you are able to duplicate query definition, changing at the same time the Query Text to make copies point to the new iteration.

Alk.
