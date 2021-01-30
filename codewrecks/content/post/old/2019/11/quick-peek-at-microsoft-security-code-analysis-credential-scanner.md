---
title: "Quick Peek at Microsoft Security Code Analysis Credential Scanner"
description: ""
date: 2019-11-23T16:00:37+02:00
draft: false
tags: [AzureDevOps,build]
categories: [security]
---
[**Microsoft Security Code Analysis**](https://secdevtools.azurewebsites.net/) **contains a set of Tasks for Azure DevOps pipeline to automate some security checks during building of your software.** Automatic security scanning tools are not a substitute in any way for human security analysis, remember: if you develop code ignoring security, no tool can save you.

 **Despite this fact, there are situation where static analysis can really give you benefit,** because it can avoid you some simple and silly errors, that can lead to troubles. All Tasks in Microsoft Security Code Analysis package are designed to solve a particular problem and to prevent some common mistake.

> Remember that security cannot be enforced only with automated tools; nevertheless they are useful to avoid some common mistakes and are not meant to replace security audit of your code.

The first task I suggest you to look at is  **Credential Scanner, a simple task that searches source code for potential credentials inside files.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-12.png)

 ***Figure 1***: *Credential scanner task*

Modern projects, especially those designed for the cloud, use tons of sensitive data that can be mistakenly stored in source code. The easiest mistake is storing credential for databases or other services inside configuration file, like web.config for ASP.Net projects or  **we can left some Token for Cloud resource or services, leaving that resource unprotected.** Including Credential Scanner in your azure pipeline can save you troubles, with minimal configuration you can have it scan your source code to find credentials.  **All you need to do is drop the task in the pipeline, use default configuration and you are ready to go.** Full details on configuring the task [could be found here.](https://secdevtools.azurewebsites.net/helpcredscan.html)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-13.png)

 ***Figure 2***: *Configuration pane for Credential Scanner*

Credential scan will run in your pipeline and report problem found.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-14.png)

 ***Figure 3***: *Credential scanner found a match.*

If you look in  ***Figure 3***: Credential scanner found a match, but the task does not make the build fails (as you could expect). This is normal behvior, because  **all security tasks are meant to produce an output file with scan result, and it is duty of another dedicated task to analyze all results file and make the build fail if problems are found**.

> It is normal to have security related tasks not to fail the build immediately, a dedicated tasks is needed to analyze ALL log files and fail the build if needed

Post Analysis task is your friends here.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-15.png)

 ***Figure 4***: *Add a Post Analysis task to have the build fails if some of the security related task failed*

Actually this special task allows you to specify which of the security task you want to analyze and this is the reason why the build does not fails immediately when Credential Scanner found a problem.  **The goal here is running ALL security related tasks, then analyze all of them and have the build fails if problems where found.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-16.png)

 ***Figure 5***: *Choose which analyzer you want to use to make the build fail.*

After you added this task at the end of the build, your build fails if security problems are found.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-17.png)

 ***Figure 6***: *Build fails because some of the analysis found some problems. In this specific situation we have credentials in code.*

As you can see from  **Figure 6** Credential Scan task is green and is the Security Post Analysis Task that made the build fails. It also log some information in build errors page as you can see from  **Figure 7.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-18.png)

 ***Figure 7***: *Build fails for issues in credential scanner*

 **Now the final question is: where can I found the csv file generated by the tool?** The answer is simple, there is another special task whose purpose is upload all logs as artifacts of the build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-19.png)

 ***Figure 8***: *Simply use the PublishSecurityAnalysisLog task to have all security related logs published as artifacts.*

As you can see from  **Figure 9** all the logs are correctly uploaded as artifacts and divided by tool type.  In this example I’ve ran only the Credential Scanner Tool so it is the only output I have in my artifacts folder.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-20.png)

 ***Figure 9***: *Credential Scanner output included as artifact build.*

Downloading the file you can open it with excel (I usually use csv file output for Credential Scanner) and find what’s wrong.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-21.png)

 ***Figure 10***: *Csv output contains the file with the error, the number of the line but everything else is redacted out for security*

As I can verify from csv output, I’ve some problem at line 9 of config.json file, time to look at the code and find the problem.

[![SNAGHTML7881da](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/SNAGHTML7881da_thumb.png "SNAGHTML7881da")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/SNAGHTML7881da.png)

 ***Figure 11***: *Password included in a config file.*

> In CSV output file, Credential Scanner task only store file, row number and hash of the credential found, this is needed to avoid the credential leak from build output.

Now, this example was made for this post, so do not try that password against me, it will just not work :). If you think that you never fall for this silly mistake remember that noone is perfect. Even if I’m trying to avoid these kind of errors, I must admit that  **some**  **years ago I was contacted by a nice guy that told me that I’ve left a valid token in one of my sample source.** Shame on me, but this kind of errors could happen. Thanks to Credential Scanner you can really mitigate them.

If you wonder what kind of rules the task uses to identify password, the documentation states that

*CredScan relies on a set of content searchers commonly defined in the buildsearchers.xml file. The file contains an array of XML serialized objects that represent a ContentSearcher object. The program is distributed with a set of searchers that have been well tested but it does allow you to implement your own custom searchers too.*

So you can download the task, and examine the dll, but the nice aspect is that you can include your own searcher too.

 **If the tool find false positive and you are really sure that the match is really a false positive, you can use an exclude file** as for the documentation.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-22.png)

 ***Figure 12***: *Suppression rules for the task.*

I must admit that Credential Scanner is really a powerful tool that should be included in every build, especially if you are developing open source code.  **Remember that there are lots of tools made to scavenge projects for this kind of vulnerabilities in code** , so, if you publish some sensitive password or keys in open source project, it constitutes a big problem. Sooner or later this will bite you.

Gian Maria
