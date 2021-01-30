---
title: "Custom services failed to start even if automatic start is enabled"
description: ""
date: 2007-09-14T09:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
One of my colleague write a service for windows, he install the service on a server, then set the startup mode as “automatic” but the service fail to start. When the server is rebooted the service is in state stopped, if you start the service all is good, but the service is not started whenever the system restarts.

The major cause of the problem is that the service is installed without specifying some dependency. The service of my colleague uses tcp/ip to communicate with a server and a local instance of sqlserver 2005 to store data. This means that the service must declare to the system these dependencies, if not the system could try to start the service before the tcp/ip service or sql service is started. The solution is to use * **sc.exe** *to modify the service declaring right dependencies. Open a Dos prompt ant type.

*sc config servicename depend= “tcpip/mssql$sql2005”*

now the service start fine when the system start.

Alk.
