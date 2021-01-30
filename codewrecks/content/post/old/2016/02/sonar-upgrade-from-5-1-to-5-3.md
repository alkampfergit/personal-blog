---
title: "Sonar Upgrade from 51 to 53"
description: ""
date: 2016-02-12T16:00:37+02:00
draft: false
tags: [sonarqube]
categories: [Tools and library]
---
I really like SonarQube, but I need to admit that upgrade procedures are not the best experience I’ve had. **Upgrading from 5.1 to 5.3 should be a simple task, but I had a couple of problems.** I’ve followed the official upgrade instruction: [http://docs.sonarqube.org/display/SONAR/Upgrading](http://docs.sonarqube.org/display/SONAR/Upgrading "http://docs.sonarqube.org/display/SONAR/Upgrading") but the first problem was my connection string to SQL Server, that needs to be changed. Original connection string was

sonar.jdbc.url=jdbc:jtds:sqlserver://localhost/Sonar;SelectMethod=Cursor;instance=sqlexpress

But it seems that with the new version of Solr it needs to be changed because jtds is not anymore used. The string was changed to

sonar.jdbc.url=jdbc:sqlserver://localhost;databaseName=Sonar;instance=sqlexpress

And the service is able to connect to my database. Then I start upgrade procedure but I got an error, and here what I found in the log

> sonr Fail to execute DROP INDEX unique\_schema\_migrations ON schema\_migrations

Luckily enough, another person got this error  and I was able to find the solution on [StackOverflow Post](http://stackoverflow.com/questions/34858239/sonarqube-5-2-upgrade-to-5-3-fail-to-execute-drop-index-unique-schema-migrations) that explained  **how to create the missing index. Then I restart the service, re-execute again migration procedure and everything now runs fine**.

I cannot avoid to compare this experience to an upgrade of TFS on-premises, that is a fully automated procedure, a little more of next, next, next, and it is a product really more complex than SonarQube. :)

Gian Maria
