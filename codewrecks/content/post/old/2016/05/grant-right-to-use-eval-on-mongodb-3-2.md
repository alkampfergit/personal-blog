---
title: "Grant right to use eval on Mongodb 32"
description: ""
date: 2016-05-21T07:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
One of the side effect of enabling authorization on MongDb is that,  **even if you create a user with “root” right, this account is not able to execute the $eval command**. The simpthom is, when you try to execute $eval you got this error

{{< highlight bash "linenos=table,linenostart=1" >}}


mongodb Command '$eval' failed: not authorized on jarvis-framework-saga-test to execute command

{{< / highlight >}}

This happens because $eval is somewhat deprecated, and it should not be used. Since it is a dangerous command, a user should have access to all action on all resources, and you need to create a role that has anyAction on anyResource.

 **If you really need to use $eval, you should create a role, just connect to the admin database and create a new role with the command.** {{< highlight java "linenos=table,linenostart=1" >}}


db.createRole( { 	role: "executeEval", 	privileges: [{ 		resource: { anyResource: true }, 		actions: ["anyAction"] }], 	roles: []
 } ) 

{{< / highlight >}}

Now that you have this new role, just add to all the users that need to use $eval, as an example, if you have a single admin user in admin database, just run this against the admin db.

{{< highlight java "linenos=table,linenostart=1" >}}


db.grantRolesToUser("admin", [{ role: "executeFunctions", db: "admin" }])

{{< / highlight >}}

And now the admin user can execute $eval against all databases.

Gian Maria.
