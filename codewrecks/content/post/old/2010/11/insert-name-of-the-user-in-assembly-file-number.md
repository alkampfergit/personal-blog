---
title: "Insert name of the user in assembly file number"
description: ""
date: 2010-11-29T11:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
Assembly file numbering during a Continuous integration build is one of the most interesting feature in a project, but sometimes we need also to generate numbers even for local build, especially if the user can launch some script to do a local compile and use it to deploy somewhere.

Major and Minor number in an assembly file info are usually updated manually when a new version or milestone is reached, so we are left with two 16 bit number to store useful information. Clearly a number is suitable to store changesetId, or some other integer, but how can you include the name of the user who did the build into the assembly file info number?

The solution is to create some sort of xml file that associate a numerical id to a user, than use that id in the assembly file number, as an example you can have a file like this one.

[![SNAGHTML898b40](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML898b40_thumb.png "SNAGHTML898b40")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML898b40.png)

that actually tells me that the user id 1 is associated to WIN.Y4â€¦â€¦.. The question is, how I can handle this during a build or during a private build issued by a user? I [blogged some time ago](http://www.codewrecks.com/blog/index.php/2010/09/13/how-to-get-tfs-server-address-from-a-local-folder-mapped-to-a-workspace/) on how to grab information on the workspace with few lines of code, and that strategy could be used to solve this problem. First of all I've created a XmlUtils class that takes care of xml file handling.

[![SNAGHTML8c0282](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML8c0282_thumb.png "SNAGHTML8c0282")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML8c0282.png)

This class is able to manage the numbering, verifying if the string I want to insert already exists in the original file, creates file if it was not already created, and it has a useful property called UpdateRequired that tells me if the string I want to lookup was not originally in the file and I need to call Save().

This is needed because I do not want to take care of the Xml File manually, if a new tfs team member will be added to the team, when he will launch the script I want the script to checkout the file, add the new string, assign the new Id and finally do a checkIn and update the file for all the team.

Thanks to TFS API everything is straightforward.

{{< highlight csharp "linenos=table,linenostart=1" >}}
XmlUtils xmlUtils = new XmlUtils(path);
var ownerId = xmlUtils.GetIdForValue(ws.OwnerName, "Owner");
//use the ownerid in the file assembly numbering
if(xmlUtils.UpdateRequired)
{
//need to update data file.
String filename = xmlUtils.GetFileNameForCategory("Owner");
if (!File.Exists(filename))
{
xmlUtils.Save();
ws.PendAdd(filename);
} else
{
ws.PendEdit(filename);
xmlUtils.Save();
}
var pendingChanges = ws.GetPendingChanges(filename);
ws.CheckIn(pendingChanges, "* **NO_CI** *");
}
{{< / highlight >}}

First of all I simply use the workspace owner name, and in line 2 ask to my XmlHelper class to give me the id assigned to the owner string. Then if an Update is required I get the name of the file and verify if it exists or not. If it does not exists I save it and then add to source control with a call to Workspace.PendAdd() method, if it already exists, I issue a checkout, then save the file. Finally I simply issue a check-in with the \*\*\*NO\_CI\*\*\* comment to avoid triggering again some build if specified.

Now I can use the ownerId numerical value to simply use in the file assembly numbering.

Alk.
