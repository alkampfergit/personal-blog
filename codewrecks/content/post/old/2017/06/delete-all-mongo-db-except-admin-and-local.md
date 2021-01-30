---
title: "Delete all mongo db except admin and local"
description: ""
date: 2017-06-24T06:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
When you develop with mongo, sometimes  **you simply need to delete all database quickly because you need to start from scratch**. Using shell is really simple, because [this gist](https://gist.github.com/alkampfergit/f9fe4f38c85e04f899fe4e4c20f6979a)  does exactly what you need.

{{< highlight jscript "linenos=table,linenostart=1" >}}


var dbs = db.getMongo().getDBNames()
for(var i in dbs){
    db = db.getMongo().getDB( dbs[i] );
    if (db.getName() !== 'admin' && db.getName() !== 'local') 
    {
        print( "dropping db " + db.getName() );  
        db.dropDatabase();
    }
}

{{< / highlight >}}

This snippet is a little bit smarter than deleting everything, because  **it keeps safe Local and Admin database** , and this will preserve users of the database. I always suggest people to develop [with authentication enabled](http://www.codewrecks.com/blog/index.php/2016/05/19/secure-your-mongodb-installation/), it is a good way to avoid forgetting to secure your production mongo installation and exposing your data at risk.

> If you simply delete ALL databases or delete data directory, you will lose users of the database, as well as any information that is stored in admin or local db.

The script is super simple, you can use the getDBNames() function to grab a list of all database names, then you can iterate for each database doing what you want. In this example I simply check the name of the db, and if the db name is different from local or admin, I simply drop it.

The very same script can be used to delete all collection named logs from all databases, or you can simply decide to  **delete all database with a name that starts with a specific string**.

{{< highlight jscript "linenos=table,linenostart=1" >}}


var dbs = db.getMongo().getDBNames()
for(var i in dbs){
    db = db.getMongo().getDB( dbs[i] );
    if (db.getName().startsWith('blah')) 
    {
        print( "dropping db " + db.getName() );  
        db.dropDatabase();
    }
}

{{< / highlight >}}

The script is almost the same.

Gian Maria.
