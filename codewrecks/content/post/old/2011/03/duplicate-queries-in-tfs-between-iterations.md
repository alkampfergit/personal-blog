---
title: "Duplicate queries in tfs between iterations"
description: ""
date: 2011-03-07T19:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
One of the most common operation when you move to another iteration is moving queries to the new one. Here is a sample, this is the Iteration 1 of the TailSpin Toys of the Demo Tfs machine.[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image.png)

 ***Figure 1***: *Team project queries of the Iteration 1*

As you can see you have a lot of queries under the Iteration 1 path, and if you open one of them, you can see that in definition it got a filter to grab only Iteration 1 bugs:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image1.png)

 ***Figure 2***: *Definition of the Active Bugs query under the Iteration 1 path.*

Now suppose you need to move to Iteration 2, you clearly want to copy all the query from the Iteration 1 Folder to the Iteration 2 folder, and at the same time changing all the definition to apply a filter to the new iteration. With few lines of code made with TFS API I build a simple and primitive command line utils that can be used in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
TfsUtils
DuplicateQuery
/collection:"http://10.0.0.101:8080/tfs/DefaultCollection"
/user:abuobe
/pwd:P2ssw0rd
/teamproject:"Tailspin Toys"
/iterationsource:"Iteration 1"
/iterationdest:"Iteration 2"
{{< / highlight >}}

After I run this command I have all the queries duplicated in the new iteration.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image2.png)

 ***Figure 3***: *All the Queries were copied from the Iteration 1 to Iteration 2*

The cool part is that if I open the Active Bugs query I got:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image3.png)

 ***Figure 4***: *The copied query automatically point to the new iteration*

As soon as possible Iâ€™ll release those few lines of codes. Actually Iâ€™ve not tested it extensively, and only tried with the sample data of the sample Virtual Machine.

alk.
