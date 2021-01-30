---
title: "Invalidate cache of TFS after a Server Move"
description: ""
date: 2016-01-15T17:00:37+02:00
draft: false
tags: [Tfs,Upgrade]
categories: [Team Foundation Server]
---
> If you move your TFS server in a new hardware be sure to follow the instructions in MSDN: [Move or clone Team Foundation Server (hardware move)](https://msdn.microsoft.com/en-us/library/ms404869%28v=vs.120%29.aspx "https://msdn.microsoft.com/en-us/library/ms404869(v=vs.120).aspx").

There are many reason why you want to move TFS to a different hardware, probably you want to use a new powerful hardware and you have not virtualized TFS, or you need to upgrade TFS and you need to move Sql to a new hardware with a more recent version of SQL. Sometimes you simply want to startup with a clean TFS machine (probably you installed too much stuff in the old one, or you have some other services running in the very same machine).

One of the important step is** **[** refreshing the data cache on client computers **](https://msdn.microsoft.com/en-us/library/ms404869%28v=vs.120%29.aspx#RefreshDataCache), sometimes if you forget to follow this step client start behaving weird. An example could be: a user is reporting that Visual Studio shows some files as “pending add” but the file was already in TFVC and also the user is able to see the file from the web interface of TFS.** The problem is that Visual Studio erroneusly believe that a file needs to be added to source code repository but the file is already there. **To globally invalidate all caches for all users you can use the** witadmin rebuildcache**command (as described in previous listed MSDN article). With this command you are sure that, upon new connection, all clients will have cache invalidated.

Also follow this instruction to [refresh the Version Control Cache](https://msdn.microsoft.com/en-us/library/cc716728%28v=vs.120%29.aspx) on client computers to ensure that all workspaces are in sync with the new server.

> Always remember, after moving TFS to a new hardware it is a good idea to invalidate cache from server and to tell all users to refresh local version control cache to avoid weird problems.

Gian Maria.
