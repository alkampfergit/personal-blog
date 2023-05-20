---
title: "Getting code coverage result in drop folder during a TFS2010 buils"
description: ""
date: 2011-05-09T06:00:37+02:00
draft: false
tags: [CodeAnalysis,Tfs,TFS Build]
categories: [Tfs]
---
In a [very old post](http://www.codewrecks.com/blog/index.php/2010/06/14/running-code-coverage-in-tfs2010-builds/) I explained how to enable code coverage in TFS2010 builds and today I received a mail asking an interesting question.

> The question is: *Is it possible to have Code Coverage result to be included in drop folder?*.

Answering this question is a two phase process, the first one is understanding where MsTest store results of code coverage and verify that is possible to do something useful with them. The answer is simple, you can simply look at the TestResult directory after you execute tests inside visual studio, and you will find a data.coverage file.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image1.png)

 ***Figure 1***: *Test results does contains data.coverage file*

If you open the file you find that this is a binary file, so it is really useful to have it copied on the Drop Folder? The answer is yes, because if you [read this post](http://codebadger.com/blog/post/2009/05/12/Turning-Visual-Studio-MSTEST-code-coverage-files-into-Xml.aspx), you will learn how to transform it into a XML file that can be human readable. You will find even some detail [here](http://blogs.msdn.com/b/ms_joc/archive/2005/11/22/495996.aspx), on how to create a stylesheet that convert the XML in something more readable, another Xsl stylesheet can [be found here](http://dbebek.wordpress.com/continuous-integration/xslt-for-mstest-code-coverage/).

I must admit that I never tried those solutions, but the conclusion is:  **from a.coverage file is possible to extract useful data outside Visual Studio**.

Now we should solve the other problem: how to have this data available on the drop folder after a TFS2010 Build is completed. A really quick and dirty way is to edit the workflow used in the build to copy the *entire* test result folder in the Drop Folder.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image2.png)

 ***Figure 2***: *Copy all test results folder in drop location.*

This modification simply copy *the whole TestResults* directory, from the folder where the build occours (variable TestResultDirectory) to the drop folder directory (BuildDetail.DropLocation variable).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/05/image3.png)

 ***Figure 3***: *Test results gets copied into the drop folder.*

As you can verify, after a build, the entire TestResults folder is copied to the drop folder, so you can anlyze code coverage result with the tool you prefer.

This is a simply and dirty way to copy everything related to test result to the drop folder, you can issue a more intelligent command (even a xcopy.exe) that copy only the data.coverage if you are only interested in that file.

alk.
