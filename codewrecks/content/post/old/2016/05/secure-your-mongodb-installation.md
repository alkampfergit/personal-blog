---
title: "Secure your MongoDb installation"
description: ""
date: 2016-05-19T14:00:37+02:00
draft: false
tags: [MongoDb,NoSql]
categories: [NoSql]
---
In last months a lots of rumor spreads about [MongoDb and Data Leak](http://thehackernews.com/2015/07/MongoDB-Database-hacking-tool.html) because  **people found lots of MongoDb exposed on the internet** [**without any protection**](http://thehackernews.com/2015/02/mongodb-database-hacking.html).

The root of the problem is probably a bad default for MongoDb that actually starts without any autentication by default. Developers usually download mongodb, configure without authentication and access MongoDb instance without any knowledge of MongoDb security model. This simplicity of usage can lead to unsecure installation in production.

While this can be tolerable for MongoDb instances that lives in intranets, it is always not a good strategy to leave MongoDb completely unauthenticated.  It turns out that  **enabling a really basic authentication is really simple even in the community edition.** Once you started your MongoDb instance without authentication just connect with your tool of choice (ex robomongo) and  **create a user admin in the admin database**.

{{< highlight jscript "linenos=table,linenostart=1" >}}


use admin
db.createUser(
  {
    user: "admin",
    pwd: "mybeautifulpassword",
    roles: [{ role: "root", db: "admin" }]
  }
)

{{< / highlight >}}

Once this user is created, just stop MongoDb, change configuration to enable authentication.

{{< highlight bash "linenos=table,linenostart=1" >}}


security:
   authorization: enabled

{{< / highlight >}}

If authorization is enabled in the configuration file, MongoDb requires that all of your connection to the server is authenticated. There is a nice [tutorial in MongoDb site](https://docs.mongodb.com/v2.6/tutorial/enable-authentication/), but basically once authorization is enabled you can authenticate on a single database or to the admin db. With the above instruction I’ve created a user admin on the admin database with the role root.  **This is the minimum level of authentication you should have, a single user that can do anything.** This configuration is far to be really secure, but at least avoid to access MongoDb instance without password. It is equivalent to enable only the user “sa” on a Sql Server.

The next step is changing your connection string inside your sofware to specify user and password. The format of the url is this:

mongodb:// **user** : **password** @localhost/newDb? **authSource=admin** As for native authentication in Sql Server, username and password are stored in connection string, and **pay attention to the authSource parameter of the connection string**. If you omit that parameter C# driver try to authenticate against specified database (newDb in this example) and it fails because the only user is in the admin database. Thanks to the authSource parameter you are able to specify the database to use to authenticate.

You don’t need to change anything else in your code, because the connectionstring contains all the information to authenticate the connection.

To avoid having unsecure instance of mongoDb in production, starts immediately to secure database directly during developing phase, so every person included in the process knows that he need a password to access the database.

Gian Maria.
