---
title: "Writing a custom Activity for TFS 2010 Build workflow"
description: ""
date: 2010-02-25T17:00:37+02:00
draft: false
tags: [Team Foundation Server,TFS Build]
categories: [General]
---
A good option to customize TFS2010 build workflow is creating a Custom Activity, an operation that is quite different from creating a Custom  **Code** Activity. A custom activity does not contain any code at all and it is only composed by sub activities. This kind of customization is really useful to create pieces of workflow that will be inserted in main build workflow. As an example I created a simple custom activity to deploy a database project on a custom Database Server.

The overall operation was already covered [in this post](http://www.codewrecks.com/blog/index.php/2010/01/04/deploy-a-database-project-with-tfs-build-2010/), but as you can see that technique involved a MsBuild Activity and you needed to specify values with a really bad â€œcommand line parameterâ€ syntax.

[![Immagine1](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine1_thumb.png "Immagine1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine1.png)

Specifying parameter with this technique is awkward and error prone. To solve this situation you can simply create a custom activity. Once you created it, you need to go to â€œArgumentsâ€ tab and insert all the input and output parameters you need.

[![Immagine2](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine2_thumb.png "Immagine2")](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine2.png)

With this approach, you can use default value for arguments, and you can specify the exact type for arguments, so the workflow can do type checking against the input arguments. Iâ€™ve inserted all the input parameters I need: database name, server name, dbProjectname etc etc. Inside the Activity I simply drop a sequence and inside the sequence all the actions needed to deploy the database. The exact technique is described in my old post, the only remarkable difference is logging, because now I can directly drop a WriteBuildMessage activity inside the sequence to log messages. Here is the final activity

[![Immagine3](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine3_thumb.png "Immagine3")](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine3.png)

Once you have compiled this, you can insert in the build workflow. The great advantage of this approach is that you are now able to specify parameters with great easy.

[![Immagine4](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine4_thumb.png "Immagine4")](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/Immagine4.png)

Compare this with the original approach, where you needed to insert the string

*"/p:TargetDatabase=NorthwindTest" +        
" /p:""DefaultDataPath=C:Program FilesMicrosoft SQL ServerMSSQL10.SQL2008MSSQLDATA""" +         
" /p:""TargetConnectionString=Data Source=10.0.0.99SQL2008,49400%3Buser=sa%3Bpwd=Pa$$w0rd""" +         
" /p:DeployToDatabase=true"*

Directly inside the CommandLineArgument of MsBuild activity. Now each parameter can be specified alone, and the whole action is much more readable.

Clearly the output result is exactly the same as before, because under the hood it is composed by exactly the same sequence of actions, but now they are all wrapped inside a single Activity, making the workflow more readable.

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
