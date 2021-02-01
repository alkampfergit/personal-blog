---
title: "TF255352 and TF255331 warning during tfs 2010 beta2 install"
description: ""
date: 2009-10-27T08:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
This can happen when you change machine name after you installed and configured sql server. I'm trying various type of installation of tfs2010 just to verify the various options, my virtual machine had the default name, so I changed after I installed sql server 2008. I already know that this could cause problems, so I started a fresh installation of TFS just to verify if I guess correctly.

Here is the two warnings I got during installation

{{< highlight csharp "linenos=table,linenostart=1" >}}
Warning    [Reporting] TF255352: Permissions could not be verified because an error occurred while communicating with the following report server: http://TFS2010B2:80/ReportServer_SQL2008/ReportService2005.asmx. The server returned the following error: Impossibile stabilire una connessione al database del server di report. Ãˆ necessaria una connessione al database per tutte le richieste e le elaborazioni..
Warning    [Project Collection] TF255331: The existence of the following folder on the report server could not be verified: Impossibile stabilire una connessione al database del server di report. Ãˆ necessaria una connessione al database per tutte le richieste e le elaborazioni.. A network problem might have prevented communication, the report server might be offline, Windows Management Instrumentation (WMI) may be disabled, or your account might not have permissions on the report server. The team project collection could not be created. To complete this wizard, you must specify the option not to create a collection. As an alternative, you can close this wizard, correct the problem, and then restart the wizard.
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok, to solve this problem I first tried a simple solution, opened Management Studio, then deleted the two databases of Reporting Services, then started again the configuration of reporting services. [The discussion was originally done here](http://social.msdn.microsoft.com/Forums/en-US/tfsprerelease/thread/750302b5-12fb-4a92-8249-bcb64aadc23a).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image25.png)

I ask to create new databases, and when the wizard showed me the form, it had the old machine name WMblablablabla, so I changed to actual machine name TFS2010B2.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image26.png)

Now reporting services recreates all database he needs, and everything returns green in tfs installation.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb27.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image27.png)

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
