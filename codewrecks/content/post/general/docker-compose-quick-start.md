---
title: "Docker-compose to speed up setup dev environment"
description: "Sometimes a developer should spent too much time setting up a development environment due to requirement. Docker an docker compose can comes to the resque"
date: 2020-08-22T08:00:00+02:00
draft: false
tags: ["DevOps"]
categories: ["DevOps"]
---

Even if you do not plan to use Docker to distribute your application you can use it to speedup setup of development environment, for new developers and for new machines. I have a project where we use MongoDb and ElasticSearch, **mongodb should be authenticated and ElasticSearch needs to have some special plugin installed**.

> Time to setup a new machine sometimes is high due to dependencies.

I'm aware that for experienced user setting up mongodb and ElasticSearch is not a complex task, but nevertheless you usually can have some problem.

* Which is the correct version of ElasticSearch/Mongodb that our software is using?
* Are there some Es plugin to install? Which version?
* Which version of JAVA should I install?
* How can I configure a user in Mongodb?

Clearly I wish for a developer not to be worried about these things, **thus you can simply use docker-compose to setup most of the requirements**. Here is an example.

{{< highlight yaml "linenos=table,linenostart=1" >}}
# Use root/example as user/password credentials
version: '3.1'

services:

  mongo:
    image: mongo:latest
    restart: on-failure
    volumes:
      - ${MONGODB_DATA_LOCATION}:/data/db
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGODB_ADMIN_PASSWORD}

  es:
    image: elasticsearch:2.4.6
    restart: on-failure
    volumes:
      - ${ES_DATA_LOCATION}:/usr/share/elasticsearch/data
    ports: 
      - 9200:9200
{{< / highlight >}}

This is a really simple file, it runs a mongodb image and a specific elasticsearch image. **It uses environment variables to let each developer to specify location of data files and password for mongodb**. These environment variables: ES_DATA_LOCATION, MONGODB_DATA_LOCATION, MONGODB_ADMIN_PASSWORD could be simple environment variables or you can specify in a .env file contained in the very same directory of docker-compose file.

{{< highlight yaml "linenos=false" >}}
MONGODB_DATA_LOCATION=g:\Nosql\dockermongo
ES_DATA_LOCATION=g:\Nosql\dockeres
MONGODB_ADMIN_PASSWORD=123456##
{{< / highlight >}}

Thanks to these few lines of code I can now **start up a mongodb and an elasticsearch instance in mere seconds thanks to the command**

{{< highlight bash "linenos=false" >}}
docker-compose -f filename.yml up -d
{{< / highlight >}}

Now the only thing I need to do **is installing plugins inside ElasticSearch container, with simple docker-compose exec commands.**

{{< highlight bash "linenos=false" >}}
docker-compose -f .\filename.yml exec es /usr/share/elasticsearch/bin/plugin install royrusso/elasticsearch-HQ/v2.0.3
docker-compose -f .\filename.yml exec es /usr/share/elasticsearch/bin/plugin install delete-by-query
{{< / highlight >}}

To simplify everything I create a simple Windows batch file called **FirstExecution.bat that call docker-compose up, wait for 20 seconds to give elasticsearch cluster time to start and the install plugin with docker-compose**.

You could obtain the very same result modifying the startup script of the container, but in my opinion: using standard elasticsearch container without modification, then installing plugin with standard command line is more stable and simple to understand for people not used to docker and docker-compose.

> Now a simple click and the developer can start developing not worrying about database engines.

Gian Maria.