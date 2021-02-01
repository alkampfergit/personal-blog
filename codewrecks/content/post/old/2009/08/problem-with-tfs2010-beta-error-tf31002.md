---
title: "Problem with TFS2010 Beta error  TF31002"
description: ""
date: 2009-08-18T02:00:37+02:00
draft: false
tags: [TeamFoundationServer]
categories: [Team Foundation Server]
---
I'have a virtual machine with TFS2010 Beta, everything was ok, I've not worked with it for the last month, this morning I fire the virtual machine again, open visual studio and found that the TFS is not working. It gave me error TF31002, so I begin to investigate the reason for failure.

When TFS does not work the first thing you should try is to access it from the web interface [http://tfs2010/tfs/web](http://tfs2010/tfs/web "http://tfs2010/tfs/web") when I goes to this page it gave me this error.

>  **Team Foundation services are not available from the server**. Technical information (for administrator): TF31002: Unable to connect to this Team Foundation Server: http://tfs2010/tfs. Team Foundation Server Url: http://tfs2010/tfs. Possible reasons for failure include: – The Team Foundation Server name, port number or protocol is incorrect. – The Team Foundation Server is offline. – Password is expired or incorrect. For further information, contact the Team Foundation Server administrator.

It is possible that this is caused by authentication problems, you should verify in IIS that the site is running under the right account (in my situation the TfsServiceAccount user), then you should verify that that user does not have an expired password. I've immediately tried to access the system with TfsServiceAccount user, and everything is ok. Then verified that all application pool used by the TFS web site runs under the TfsServiceAccount. Everything was ok so I was a little bit puzzled on the reason why tfs does not work.

After a brief check I verify that the folder *C:\Program Files\Microsoft Team Foundation Server 10.0\Microsoft Team Foundation Server 2010 Beta 1 â€“ ENU*does not grant right access to the TfsServiceAccount user, even if Administrators group has permissions to read and write to the folder. I added TfsServiceAccount with *Full Control*permission, and everything started again.

I do not know exactly why it happened, but if you encounter the same problem this post maybe can help you.

Alk.

Tags: [Tfs](http://technorati.com/tag/Tfs)
