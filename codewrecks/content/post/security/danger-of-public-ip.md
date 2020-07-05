---
title: "Danger of public IPs"
description: "Are you asking yourself if a public IP is needed for your cloud resources?"
date: 2020-07-16T10:13:30+02:00
draft: false
tags: ["security"]
categories: ["security"]
---

This morning I come across [this article about another data exposure](https://www.comparitech.com/blog/vpn-privacy/ufo-vpn-data-exposure/) and I could not avoid to notice that it is **another Elasticsearch exposed to the public**.

> 894 GB of data was stored in an unsecured Elasticsearch cluster. 

> Due to personnel changes caused by COVID-19, we’ve not found bugs in server firewall rules immediately, which will lead to the potential risk of being hacked. And now it has been fixed.

This information seems to suggests that the ElasticSearch cluster was exposed to a public IP and there were **some firewall rules to protect the cluster for unauthorized access**.

This kind of problem is becoming common with the adoption of the Cloud, you create a Virtual Machine, give it a public IP (mainly for configuration) and then relaying to internal/external Firewall to protect services that runs inside the VM. This is fundamentally an insecure way to use VM in a cloud provider. **Given services like Shodan that are constantly scan the internet for devices, a Firewall is not enough to secure your services.**

> But the real question is: **Does your VM really need a public IP**? The answer probably is NO.

The concept of Cloud is a quite recent one and most of the IT people are used to manage on-premise VM, where a firewall is usually enough to filter access from your internal network. This is not true if your machine has a public IP, the internet is a bad place where services are constantly scanning for open port and vulnerabilities. **Just a tiny error in your firewall configuration and you are done**.

A public IP is often justified for easy Machine administration, but you should instead check if your Cloud provider gives you a more secure way to administer your VMs, like [Azure Bastion](http://www.codewrecks.com/post/azure/azure-bastion/), **if there is no similar service, use a VPN**.

If your VM needs to expose a web site in standard port 443 (or 80 if you do not support HTTPS) you should use some load balancer or a transparent proxy that allows you to avoid having a public IP in your VM.

If your VM needs to expose some weird service in some weird ports to the public and you really need a public IP, **just avoid installing other software in the very same machine**. As a rule of thumb, if you have services with data like ElasticSearch or MongoDb or any database, the VM should not be exposed with a public IP and these services should be accessed only with internal IPs. If data really needs to be exposed to the public, just put an authenticated and secured web API that will manage access.

And please, if you are using NoSql engines like MongoDb and Elasticsearch, you **must enable authentication**, now it is free [even for ElasticSearch](https://www.elastic.co/blog/security-for-elasticsearch-is-now-free) while in older versions it used to be a paid service.

As a rule of thumb each time you create a resource in the Cloud, you should always ask yourself if a public IP (or generally speaking public exposure) is really needed. If the answer is YES, you should keep running software in the machine at a bare minimum and take great care of firewall configuration.

Gian Maria.

