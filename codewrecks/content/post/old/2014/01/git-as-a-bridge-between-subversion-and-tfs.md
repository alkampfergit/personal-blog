---
title: "Git as a bridge between Subversion and TFS"
description: ""
date: 2014-01-01T07:00:37+02:00
draft: false
tags: [Git,Tfs]
categories: [Team Foundation Server]
---
This is the scenario: *Nablasoft company uses TFS with standard TFVC (TFS Version Control System) and needs to assign some of the work to some external Company (lets call it Acme), as an example developing for Android or iOs*. The simplest solution is giving Acme developers access to TFS server, but then Nablasoft should pay the CAL for Acme developers, moreover, Acme uses subversion and they do not want to use another VCS unless it is strictly necessary.

Since part of the contract requires Acme to give Nablasoft full code history, using Git-svn and Git-Tf can easily solves this scenario.

## Setting everything up

First Step: Nablasoft managers can create another [team](http://blogs.ripple-rock.com/colinbird/2012/11/19/MultipleTeamsWithMicrosoftTeamFoundationServer2012VisualStudioScrumV2xUpdated1452013.aspx) inside their Team Project to create a backlog that contains all the work that will be given to Acme Company.  **This will permits to Manager to schedule User Stories for Acme and monitor the progress**. Only Nablasoft managers should access this team, no people from Acme company will ever use it.

After the backlog is created, you can simply email it to Acme developers with Email, or import in excel and send the excel.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/11/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/11/image.png)

 ***Figure 1***: *Send a mail to Acme company with all details on the feature we want them to work on*

This can be useful if Acme people can access the TFS of Nablasoft, but if we assume that Acme people has not access to Nablasoft Tfs, an addin of word like [Word To Tfs](http://www.aitgmbh.de/?id=222) can be useful to  **load all definition of your specification into a single Word file that can be sent to Acme**.  **The overall goal is being able to send specification to acme as well as the original Id of the Work Item in the original Nablasoft Tfs**.

Acme developers will develop on their own Subversion server, they should give to Nablasoft manager access to this Svn repository and should include in every subversion commit a comment containing an hastag followed by the id of the Feature related to that commit, Es #884

 **Nablasoft Manager will create a git clone of Acme Subversion repository using standard Git-Svn features of msysgit distribution with a simple command like**.

{{< highlight bash "linenos=table,linenostart=1" >}}


git svn clone https://acmedev.googlecode.com/svn/trunk c:\temp\AcmeCode

{{< / highlight >}}

This creates a full clone of subversion repository, then Nablasoft’s manager can simply  **download all modification with a simple git svn rebase** ,  **but the interesting part is that he can simply connect the local git repository to standard TFS repository with the command** {{< highlight bash "linenos=table,linenostart=1" >}}


git-tf configure https://gianmariaricci.visualstudio.com /DefaultCollection $/NablasoftCompany/Main/ReactiveSite

{{< / highlight >}}

You can specify any path in TFVC source control, in previous command line I’ve decided to map my local git repository to the $/NablasoftCompany/Main/ReactiveSite but you can choose whatever folder you want. Once you have connected the same Git repository to remote Svn server and to your TFVC based repository you are able to grab modification from subversion and move them to TFS. With a

<font face="Consolas">Git svn rebase</font>

You download all new modification from SVN repository, and when you want to move everything into TFVC repository you can issue a

<font face="Consolas">git-tf checkin &#8211;deep</font>

 **and all modifications will be transferred to TFS**. The nice stuff is that you can use a bunch of API call to automatically [associate check-ins to Work Items based on comment content](http://www.codewrecks.com/blog/index.php/2013/02/02/tfs-api-to-associate-work-item-with-check-in-using-comment-tags/).

## Example

Suppose Acme did a copule of commit on SVN Repository

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image4.png)

 **Fifure 2:** *Log of subversion repository showing the two commits with code related to a couple of features.*

Now if you issue a git svn rebase you can download those two commits into local git repository. If you view log of Git repository you realize that all subversion checkins are cloned in local repository.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image5.png)

 ***Figure 3***: *Commits cloned from subversion repository to a local Git repository*

Now a  **git-tf checkin with –deep option will transfer those commits to TFVC**. The first commit (the one with comment initial directory structure) is the first one used to create the trunk directory, so it will not cause any check-in in the final repository, but the other two were transferred.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image6.png)

 ***Figure 4***: *Check-ins created in TFVC from local Git repository thanks to git-tf tool.*

The last part is running the little utility to associate Check-Ins and Work Items with hashtag in the comment. Thanks to this workflow, Nablasoft company is able to let Acme work with Subversion but they can keep all their work with history in a subfolder of Company’s TFS and maintaining association with Work Item.  **The only drawback of this approach is “Time Compression”, because all the commits that are transferred in TFS do not maintain the original date of Subversion Repository** , because all changesetId should maintain sequential order of timestamp. To minimize this problem, you can script the import process manually and run several time a day.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/12/image7.png)

 ***Figure 5***: *Association between check-in and Work Item based on content of Comment.*

## Summary

Thanks to git you can actually create a collaboration bridge between an external company that works with subversion and the internal TFS. The steps are

1) Send to external company the list of task/feature to do thanks to TFS Work Item Emailling system  
2) Let the external company works with their subversion, but ask them to include #workitemId in subversion comments  
3) Clone subversion repository of External Company in a local Git Repository  
4) Connect that repository to TFS with git-tf  
5) Move code from TFS and subversion using git as a bridge

*If you use Git as a back end of your TFS Team Project the overall process will be even simpler, because you do not need to use git-tf, the association between code and Work Items will be automatically done by TFS and finally you will not suffer Time Compression issue.*

Gian Maria.
