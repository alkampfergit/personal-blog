---
title: "How to check if a user belong to a certain role in  ASPNet"
description: ""
date: 2010-10-13T14:00:37+02:00
draft: false
tags: [ASPNET,Security]
categories: [ASPNET]
---
This question is really simple to answerâ€¦ or no? Suppose you need to verify, in a service, if the user belongs to the xxxx group, and then take a different path of execution if the condition is true.

{{< highlight csharp "linenos=table,linenostart=1" >}}
if (Roles.IsUserInRole("xxxx"))
{
...
}
{{< / highlight >}}

Ok, this seems such a piece of innocent code, but actually it caused me a bad bug. The reason is really simple, the same service is called from a program written in windows forms, (a windows service) and a web site. The programmer that is developing the web site, took the service and add that checks in one function, and I begin to get exception from the code of the service. The reason is clear Asp.Net roles and Membership are not configured in the windows program, nor I want to configure it.

To fix this, and in general to verify roles of the current user, when you does not know in advance if the code would be called  outside the context of a web application, we need to create the group xxxx in windows, assign the user that run the service or the program to this group and add this line at the very beginning of the winform program to use windows authentication.

{{< highlight csharp "linenos=table,linenostart=1" >}}
AppDomain.CurrentDomain.SetPrincipalPolicy(PrincipalPolicy.WindowsPrincipal);
{{< / highlight >}}

But this is not enough since the code in the service should not use the Roles.IsUserInRole() function because it needs to have membership configuration enabled. The solution is using this code instead of the above one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var currentPrincipal = System.Threading.Thread.CurrentPrincipal;
if (currentPrincipal.IsInRole("xxxx")
{{< / highlight >}}

This works because in windows forms the CurrentPrincipal is a [WindowsPrincipal](http://msdn.microsoft.com/en-us/library/system.security.principal.windowsprincipal.aspx), and thus it checks if the current user belong to the group xxxx, but when it is run from a web site, with ASP.NEt membership configured, the principal is of type [RolePrincipal](http://msdn.microsoft.com/en-us/library/system.web.security.roleprincipal.aspx) as you can verify from Fgure1

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/image1.png)

 ***Figure 1***: *the current principal of code running in asp.net sites with roles and membership configured is of type RolePrincipal.*

and in this situation IsInRole() method verifies the user against ASP.Net roles.

Alk.
