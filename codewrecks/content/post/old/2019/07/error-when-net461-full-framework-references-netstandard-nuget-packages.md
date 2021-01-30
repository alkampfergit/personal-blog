---
title: "Error when NET461 full framework references NETStandard nuget packages"
description: ""
date: 2019-07-19T16:00:37+02:00
draft: false
tags: [NETCORE]
categories: [NET Core,NET framework]
---
After updating MongoDb driver in a C# big project **I start having a problem in a Web Project where we have this error after a deploy in test server (but we have no error in local machine of developers)** > An assembly with the same identity ‘System.Runtime, Version=4.1.2.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a’ has already been imported. Try removing one of the duplicate references.

This happens because MongoDB driver &gt; 2.8 reference in the chain System.Buffer 4.4.0. If you take an empty.NET Full Framework 4.6.1 and references MongoDb 2.8.x driver you can verify that you have

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-18.png)

 ***Figure 1***: *System.Buffers reference for the project*

This seems an innocuous reference, but  **if you look closely to what is inside System.Buffer you can verify that there is no package for full framework. Just check in the packages directory to verify that there is no.NET full framework package.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-19.png)

 ***Figure 2***: *There is no full framework package inside System.Buffers*

This imply that, when you build the project, in the bin directory you will find all the dll of netstandard project, because actually you are referencing netstandard 2.0 dll.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-20.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-20.png)

 ***Figure 3***: *All netstandard dlls included in the bin directory of the project.*

Now you have a problem, because you have netstandard runtime included in your project, most of the time it is safe, but there are situation where this can generate errors.

You can find the issue in GitHub [#39362](https://github.com/dotnet/corefx/issues/39362), that in turn is a duplicate of [#39362](https://github.com/dotnet/corefx/issues/39362) (my original issue).

 **Actually, if you want to avoid problems, you should be 100% sure not to reference any netstandard dll in a.NET 4.6.1 full framework project, or you should use full framework 4.7.2 or greater.** Gian Maria.
