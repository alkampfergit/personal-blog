---
title: "Pass cookie from Web Request to WebBrowser"
description: ""
date: 2011-06-29T08:00:37+02:00
draft: false
tags: [WebBrowser]
categories: [NET framework]
---
Suppose you have some domain where you are navigating with a [WebRequest](http://msdn.microsoft.com/en-us/library/system.net.webrequest%28v=VS.100%29.aspx) object and you need to be able to browser that domain in a standard WebBrowser control, using the same cookies of the WebRequest.

The solution is really simple, you need to use the [InternetSetCookieEx](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28INTERNETSETCOOKIEEX%29;k%28SOLUTIONITEMSPROJECT%29;k%28SOLUTIONITEMSPROJECT%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV3.5%22%29;k%28DevLang-CSHARP%29&amp;rd=true) Windows API. First of all the import statement

{{< highlight csharp "linenos=table,linenostart=1" >}}
[DllImport("wininet.dll", SetLastError = true)]
public static extern bool InternetSetCookieEx(
string url,
string cookieName,
StringBuilder cookieData,
Int32 dwFlags,
IntPtr lpReserved);
{{< / highlight >}}

Now you can use in a simple helper function.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static void SetCookieForBrowserControl(CookieContainer cc, Uri uri)
{
String hostName = uri.Scheme + Uri.SchemeDelimiter + uri.Host;
Uri hostUri = new Uri(hostName);
foreach (Cookie cookie in cc.GetCookies(hostUri))
{
InternetSetCookieEx(hostName, cookie.Name, new StringBuilder(cookie.Value), 0, IntPtr.Zero);
}
}
{{< / highlight >}}

This technique is really useful if you perform a login with a standard WebRequest object, and then want to browse the site in a webbrowser control using the same login credentials you are using with the WebRequest object.

alk.
