---
title: "On a way to lab management 8211 TF260078 error"
description: ""
date: 2009-12-13T08:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Team Foundation Server]
---
Iâ€™m configuring Lab Management in the virtual machine with the test contrller and TFS, but when it ask me for credentials to connect to System Center Virtual Machine Manager, I specify the credentials of Domain Admin and it gives me this error.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image13.png)

It is strange, because administrator is the user I currently use to manage SCVMM, but maybe there is some restrictions to be used by the Lab management agent, so I decided to create a specific user in active directory called Labmanagement, and then goes to the administration tab of SCVMM and added to the admin role

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image14.png)

Now I return to the lab management configuration and everything works as expected.

alk.

Technorati Tags: [Lab Management](http://technorati.com/tags/Lab+Management)
