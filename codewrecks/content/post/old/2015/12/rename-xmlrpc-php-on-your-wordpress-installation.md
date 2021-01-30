---
title: "Rename xmlrpcphp on your WordPress installation"
description: ""
date: 2015-12-30T16:00:37+02:00
draft: false
tags: [EverydayLife]
categories: [EverydayLife]
---
Last month my Live Writer stopped being able to publish on this blog. Using Fiddler I discovered that I got an error calling xmlrpc.php. I’ve opened a ticket on my blog hosting, and the support told me that  **access to xmlrpc.php was blocked on that machine (my blog is on a shared host) because of spam attack**.

The problem is, malicious script try continuously to send spam content to WordPress blogs using standard API and this usually causes a spike in CPU usage. For this reason many providers block access to xmlrpc.php file.

If you care about your WordPress blog, leaving xmlrpc.php unchanged is a bad practice, because it left you vulnerable to attacks. The solution is simple, I’ve simply renamed my xmlrpc.php file to something strange, something like xjearhsaherbsaera.php. Using a random series of letters makes your wordpress API endpoint not discoverable by an attacker. If it try to access xmlrpc.php he immediately got a 404 error, and it is really unlikely that they are able to guess the real name of the file.

Thanks to this solution I can use again my Windows Live Writer, even if my provider blocks xmlrpc.php file.

Gian Maria.
