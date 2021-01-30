---
title: "Security in 2019 still unprotected ElasticSearch instance exists"
description: ""
date: 2019-11-24T13:00:37+02:00
draft: false
tags: [Security]
categories: [security]
---
I’ve received today a notification from [https://haveibeenpwned.com/](https://haveibeenpwned.com/ "https://haveibeenpwned.com/") because one of my emails was present in a data breach.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-23.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-23.png)

Ok, it happens, but two things disturbed me, the first is that I really never heard of those guys (People Data Labs), this because they are one of the companies that harvest public data from online sources, aggregates them and re-sell as “Data enrichment”. This means that they probably have only public data on me.  **If you are interested you can read article by Troy Hunt** [**https://www.troyhunt.com/data-enrichment-people-data-labs-and-another-622m-email-addresses/**](https://www.troyhunt.com/data-enrichment-people-data-labs-and-another-622m-email-addresses/ "https://www.troyhunt.com/data-enrichment-people-data-labs-and-another-622m-email-addresses/") **on details about this breach.**  **But the second, and more disturbing issue is that, in 2019, still people left ElasticSearch open and unprotected in the wild.** This demonstrates really low attention about security, especially in situation where you have Elasticsearch on server that have a public exposure. It is really sad to see that Security is still a second citizen in software development, if not, such trivial errors would not be done.

> Leaving ElasticSearch unprotected binded to a public IP address is sign of zero attention to security.

 **If you have ElasticSearch in a server with public access (such as machines in the cloud) you should:** - 1) Pay for Authentication Module so you can secure your instance or, at least, use some open source module for basic auth).  **No Elasticsearch that is installed in a machine with a public access can be left without auth.** - 2) Bind ElasticSearch instance on private ip address only (the same used by all legitimate machine that should contact ES), be 100% sure that it does not listen on public address.
- 3) add firewall rule to explicitly close port 9200 for public networks (in case someone messed with rule 2)
- 4) Open port 9200 only for internal ip that are legitimate to access Elastic Search

Finally you should check with some automatic tool if, for any reason, your ES instance starts responding on port 9200 in public ip address, to verify if someone messed with the aforementioned rules.

Gian Maria.
