---
title: "Ndepend to the resque"
description: ""
date: 2010-11-03T15:00:37+02:00
draft: false
tags: [NDepend]
categories: [NET framework]
---
Iâ€™ve blogged about this supersimple but amazing feature of NDepend some time ago, but I want to emphasize another time how NDepend is a tool that you must have in your toolset.

Iâ€™ve deployed an application with click-once, but when I try to install it â€¦ I got this error

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image2.png)

 ***Figure 1***: *The error during the installation*

the error is strange, the application requires an assembly with a wrong version, because the system.runtime.serialization should be 3.0.0.0. Now in a solution with 55 projectâ€¦â€¦what is the project with the wrong reference?

The answer is: fire NDepend and let him find all error in references.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/image3.png)

 ***Figure 2***: *With NDepend finding the project with wrong reference is outrageously simple*

As you can see NDepend complains about the fact that there are different version of the system.runtime.serialization assembly, this even before the analysis, and it tells you where he find the different version of the assembly, so Iâ€™m able to identify the project that has the wrong version and I can fix the reference in seconds.

Amazing.

alk.
