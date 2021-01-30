---
title: "Store a function to delete all db in MongoDb"
description: ""
date: 2017-06-28T06:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
Deleting everything in a test MongoDb is a common operation for test and dev machine and it is a relative simple operation that [I described here](http://www.codewrecks.com/blog/index.php/2017/06/24/delete-all-mongo-db-except-admin-and-local/). After a little while  **I got really tired every time to search my gist or into my hd the little script that deletes everything** , thus I decided to store it inside the admin db.

The solution is really really simple,  **just connect to the admin database and register a server side function to delete all databases**.

{{< highlight jscript "linenos=table,linenostart=1" >}}


db.system.js.save(
   {
     _id: "DeleteAllDb",
     value : function(db) { 
         var dbs = db.getMongo().getDBNames()
        for(var i in dbs){
            db = db.getMongo().getDB( dbs[i] );
            if (db.getName() !== 'admin' &amp;&amp; db.getName() !== 'local') 
            {
                print( "dropping db " + db.getName() );  
                db.dropDatabase();
            }
        }
      }
   }
)

{{< / highlight >}}

Once the function is saved, you should see it from a GUI tool like Robo 3T.

[![DeleteAllDb function stored inside the admin database.](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-11.png "DeleteAllDb function stored inside the admin database.")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-11.png)

 ***Figure 1***: *DeleteAllDb function stored inside the admin database.*

 **Now you can simply load all functions from the Shell and execute the new DeleteAllDbFunction**.

{{< highlight jscript "linenos=table,linenostart=1" >}}


db.loadServerScripts();
DeleteAllDb(db);

{{< / highlight >}}

And now you can avoid looking around from the script, just invoke DeleteAllDb(db) function from the shell and you will delete all db, except Admin and Local.

Gian Maria.
