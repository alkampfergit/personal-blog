---
title: "TFS 2018 Update 3 is out what changes for Search"
description: ""
date: 2018-09-18T19:00:37+02:00
draft: false
tags: [searching,Tfs]
categories: [Tfs]
---
[TFS 2018 Update 3 is finally out](https://docs.microsoft.com/en-us/visualstudio/releasenotes/tfs2018-update3) and in release notes there is a nice news for Search functionality, **basic security now enforced through a custom plugin**. Here is what you can read in release notes

> Basic authorization is now enabled on the communication between the TFS and Search services to make it more secure. Any user installing or upgrading to Update 3 will need to provide a user name / password while configuring Search (and also during Search Service setup in case of remote Search Service).

 **ES is not secured by default, anyone can access port 9200 and interact with all the data without restriction**. There is a commercial product made by ElasticSearch Inc to add security (Called Shield), but it is not free.

 **Traditionally for TFS search servers, it is usually enough to completely close port 9200 in the firewall (if the search is installed in the same machine of Application Tier)** or to  **open the port 9200 of Search Server only for Application Tiers instances if Search services are installed on different machine** , disallowing every other computer of the network to directly access Elastic Search instance.

> Remember to always ensure minimum attack surfaces with a good Firewall Configuration. For ElasticSearch the port 9200 should be opened only for TFS Application Tiers.

Here is the step you need to perform when you upgrade to Update 3 to install and configure search services: first  **of all in your search configuration you can notice a warning sign** , nothing was really marked as wrong, so you can teoretically move on with configuration.

[![2018-09-05_13-14-38](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-14-38_thumb.jpg "2018-09-05_13-14-38")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-14-38.jpg)

 ***Figure 1***: *Search configuration page in TFS Upgrade wizard, notice the warning sign and User and Password fields*

When you are in the review pane, the update process complain for missing password in the Search configuration (Figure 1). At this point people get a little bit puzzled because they do not know what to user as username and password.

[![2018-09-05_13-15-00](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-15-00_thumb.jpg "2018-09-05_13-15-00")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-15-00.jpg)

 ***Figure 2***: *Summary of upgrade complains that you did not specified user and password in search configuration (Figure 1)*

If you move on, you find that it is Impossible to prosecute with the update because the installer complains of a missing ElasticSearch plugin installed.

> The error ElasticSearch does not have a plugin AlmSearchAuthPlugin installed is a clear indication that installation on Search server was outdated.

[![2018-09-05_13-22-37](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-22-37_thumb.jpg "2018-09-05_13-22-37")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-22-37.jpg)

 ***Figure 3***: *During Readiness check, the upgrade wizard detect that search services installed in the search server (separate machine) missed some needed components.*

 **The solution is really simple, you need to upgrade the Search component installation before you move on with Upgrading the AT instance.** In my situation the search server was configured in a separate machine (a typical scenario to avoid ES to suck up too resource in the AT).

All you need to do is to **copy search installation package** (You have a direct link in search configuration page shown in Figure 1)  **to the machine devoted to search services and simply run the update command.** [![2018-09-05_13-25-32](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-25-32_thumb.jpg "2018-09-05_13-25-32")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-25-32.jpg)

 ***Figure 4***: *With a simple PowerShell command you can upgrade the installation of ElasticSearch in the Search Server.*

The * **–Operation update** *parameter is needed because I’ve already configured Search services in this server, but for  **Update 3 I needed also to specify a user and password to secure your ES instance.** User and password could be whatever combination you want,  **just choose a secure and long password.** After the installer finished, all search components are installed and configured correctly; now  you should  **reopen the Search configuration page (Figure 1) in the upgrade wizard, specify the same username and password you used during the Search Configuration and simply re-run readiness checks.** Now all the readiness checks should pass, and you can verify that your ElasticSearch instance is secured simply browsing port 9200 of your search server. Instead of being greeted with server information you will be first ask for user and password. Just type user and password chosen during Search component configuration and the server will respond.

[![2018-09-05_13-29-08](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-29-08_thumb.jpg "2018-09-05_13-29-08")](https://www.codewrecks.com/blog/wp-content/uploads/2018/09/2018-09-05_13-29-08.jpg)

This is a huge step to have a more secure TFS Configuration, because without resorting to commercial plugin, ElasticSearch is at least protected with basic authentication.

> Remember to always double check your TFS environment for potential security problems and always try to minimize attack surface with a good local firewall configuration.

I still strongly encourage you to configure firewall to allow for connection in port 9200 only from TFS Application Tier machines, because is always a best practice not to leave ports accessible to every computer in the organization.

Gian Maria.
