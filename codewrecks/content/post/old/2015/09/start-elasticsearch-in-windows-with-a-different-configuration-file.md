---
title: "Start ElasticSearch in windows with a different configuration file"
description: ""
date: 2015-09-24T06:00:37+02:00
draft: false
tags: [NoSql]
categories: [NoSql]
---
When you start elasticsearch double clicking on Elasticsearch.bat in windows, it uses the standard config/elasticsearch.yml files that is contained in the installation directory. Especially for development,  **it is really useful to be able to start ES with different configuration file**.

Probably my googleFu is not perfect, but each time that I need to find the correct option to pass to Elasticsearch.bat batch file I’m not able to find with the first search and I always loose some time, and this means that probably this information is not indexed perfectly.

If you are interested the configuration option is called –Des.config and permits you to specify the config file used to start your ES Node.

> elasticsearch.bat -Des.config=Z:\xxxx\config\elasticsearch1.yml

You can now create how many config file you need, and simply create multiple link to the original bat file with different config file to start ES with your preferred options.

Gian Maria.
