---
title: "Use multiple techniques to protect your data "
description: "You should always put in place multiple protection for your data"
date: 2020-09-12T08:00:00+02:00
draft: false
tags: ["security", "developing"]
categories: ["security"]
---

## The problem

Several years ago I had a friend called me for a problem with MongoDb, it turns out that **someone, from an IP geolocated in China, accessed the instances during the night and wiped out everything**.

The problem was due to some misconfiguration or human error or whatever that: 

1. turned off Windows firewall and port 27017 was open to the internet
2. MongoDb was installed with no password.
3. MongoDb was bound to all ip addresses of the machine

When it is time to protect your data, you **should add as many layers / techniques of protection as you can**, this because, if one if them is failing, another one can still offer protection.

> Relaying on a single protection for your data is a single point of failure for security.

Let's see as an exercise how you should approach building software based on MongoDb with a Security Oriented mind. This is not an academic exercise, because **in last years lots of data bread regarded MongoDb and other NoSql database left opened in the wild with little or no protection**.

Most of the time people left MongoDb bound to public ip with no password.

![Horrified eyes](../images/horrified-eyes.png)

## Stick to well known plan made by experts

First of all you should check **security guidance offered you by people responsible for the product you are using**. If you check MongoDb site you have a [good page with a checklist for security.](https://docs.mongodb.com/manual/administration/security-checklist/) you should read carefully to avoid doing mistakes. Clearly, before the checklist, you **should learn how your [product support security](https://docs.mongodb.com/manual/security/)**, because if you do not know all security features available in your products, you are in trouble.

> Most of the time, producer/maintainer of software publish security guideline for the product.

Always check if there are updated version of Security Guidance for every product you use.

## What can you do to enforce the plan

**Problem number 1:** most common error is using  database in production without Password.  

A typical solution to this problem is inserting in your software a kill switch that will completely stop everything if MongoDb connection has no password. But the real solution is: take connection string, strip away authentication and try to connect to the DB, **if the connection is OK just stop everything**. This will **prevent anyone to deploy the app connecting to an unauthenticated MongoDb**.

Then enforce a password complexity, using "12345" it is like having no password at all, if the password is not secure enough, the software will not start.

**Problem number 2:** having your MongoDb instance bind to public ip

Never install MongoDb in a machine with a public IP, 99% of the time there is no need for public IP and **if you really need to have a public instance of MongoDb accessible from the internet please have a look at [Atlas](https://www.mongodb.com/cloud/atlas)**.

> Do you really want to take the risk of managing a public instance of mongo instead of paying those who build it to run the instance for you?

Most of the time you have a small software where **everything runs on the very same machine**, be sure to verify that **MongDb bind only to localhost or private addresses. Again, you can do a quick check in your software.

![Check MongoDB configuration at runtime](../images/mongodb-check-commandline.png)
**Figure 1:** *Check MongoDB configuration at runtime*

You can always check actual configuration by code to see all Ip MongoDb is bound to, as usually **you can refuse to start application if MongoDB is bound to public ip**. As you can see in **Figure 1** this instance of mongo bounds to all ip and this is not an optimal situation.

**Problem number 3:** Try to turn down the firewall

Well, this happens when you let non trained people to configure production machine, the very first time that a developer or an untrained person got a network error, the first thing he/she does is **Lets turn down the firewall to see if it is a firewall issue**. Then the firewall sometimes is never turned on again.

> Use the firewall to give MongoDb an extra layer of security

For maximum security configure the firewall to allow access in port 27017 (MongoDb standard port) only from the IP of machines that are running services that can legitimately access MongoDb. **If you have a single machine installation, add an explicit rule to block port 27017 for every ip except loopback**. Use local firewall of the OS and if you have an external firewall use that too. This is valid even if you are in on-premise environment.

As a developer, create a simple script/program that verifies if the machine has a public IP assigned, try to access 27017 port on that public ip, and if the port is open immediately stop MongoDb services.

If you have a **machine in the same private subnet of MongoDb cluster that should not have access to MongoDb, install same check to verify that port 27017 is closed, if it is open send an alert.

## Conclusion

In a DevOps culture, everyone should work together as a single team to create the best outcome for your process and security should be one of the top priority. **Every person of the team should contribute to create a more secure product and help other avoiding mistakes**.

These suggestions works for MongoDb, but the concept is always valid, put in place how many layer of protection you can to avoid security problem due to misconfiguration, human errors and failure of a component.

Gian Maria