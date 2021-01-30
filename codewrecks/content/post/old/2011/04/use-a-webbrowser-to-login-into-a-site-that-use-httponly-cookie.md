---
title: "Use a WebBrowser to login into a site that use HttpOnly cookie"
description: ""
date: 2011-04-12T09:00:37+02:00
draft: false
tags: [API,WebBrowser]
categories: [Programming]
---
Suppose you need to programmatically analyze some web pages that are protected by a login procedure and you have a valid login to the site. A simple solution is issuing a POST request to the login page with the correct credentials, then continue to use the same cookie container to issue subsequent downloads, but in some situation this is not enough. Suppose the site uses some strange login procedure that uses redirect

![](http://t0.gstatic.com/images?q=tbn:ANd9GcT7_byhJBQvWqRvzdPwFg5Rde08pVFFMESgBThHrOaBYz3f1ol2&amp;t=1)

This sometimes happens: you do a postback with your credentials, then a page is rendered where a javascript code automatically do another postback to another page, and finally another javascript finally takes you to the landing page for successful login. Other example happens when the login procedure involves some javascript code that needs to be executed before a postback.

A possible solution is using the [WebBrowser](http://msdn.microsoft.com/en-us/library/system.windows.forms.webbrowser.aspx) control to navigate to login page, then locate the texboxes controls for UserName and password, locate the â€œsubmitâ€ button, wait for all redirect and finally grab the cookie from the webbrowser control. This solution is simple, because login procedure is executed inside a real Browser and we only need to grab the cookies when the whole procedure ends.

This is a sample of possible code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
hiddenBrowser = new WebBrowser();
hiddenBrowser.DocumentCompleted += webBrowser1_DocumentCompleted;
hiddenBrowser.Navigate("myloginsite");
{{< / highlight >}}

 **Step 1:** *create a webbrowser control, handle DocumentCompleted event and then navigate to the login pag*e.

[DocumentCompleted](http://msdn.microsoft.com/en-us/library/cxy27k39%28v=VS.100%29.aspx) is raised when the page is fully loaded, and is where we need to issue the login procedure.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var theBrowser = (WebBrowser)sender;
HtmlElement inputElementByName = GetInputElementByName("name_of_the_input_control_for_username", theBrowser);
if (inputElementByName == null) return;
inputElementByName.SetAttribute("value", "username");
HtmlElement elementByName = GetInputElementByName("name_of_the_input_control_for_password", theBrowser);
elementByName.SetAttribute("value", "****** **");
HtmlElement htmlElement = GetInputElementByName("name_of_submit_button", theBrowser);
htmlElement.InvokeMember("click");
{{< / highlight >}}** Step 2:***Locate the two input controls for username and password, fill them with right values, then locate the submit button and finally invoke the â€œclickâ€ method*

As you can see the code is really simple, input control can be located by name, by id, or by classes, for this simple example I locate them by name with this simple function.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private HtmlElement GetInputElementByName(
string fieldName,
WebBrowser webBrowser)
{
HtmlElementCollection allInput =
webBrowser.Document.GetElementsByTagName("input");
foreach (HtmlElement htmlElement in allInput)
{
if (htmlElement.Name.Equals(fieldName, StringComparison.InvariantCultureIgnoreCase))
{
return htmlElement;
}
}
return null;
}
{{< / highlight >}}

 **Step 3:** *Function to locate an input control by name.*

This function is really simple, it iterates on all [HTMLElement](http://msdn.microsoft.com/en-us/library/204hxbb2%28v=VS.100%29.aspx) of type â€œinputâ€ present in the page, for each of them check if the name is equal to desidered one, and simply returns the element.

Ok, now we simplylet the WebBrowser control navigates to the login page, wait for every possible redirect, and finally grab the cookie. One of the problem you face when you try to get cookie is due to [HttpOnly](http://www.codinghorror.com/blog/2008/08/protecting-your-cookies-httponly.html) cookies. HttpOnly cookes lives only inside the browser, and cannot be managed by javascript or other browser code, but we really need to grab them to be able to use a WebRequest to download pages protected by login. Huston, we have a cookie problem

![](http://media.tumblr.com/tumblr_kxd6p1bmi71qaqkpq.jpg)

HttpOnly cookie are meant to prevent malicious javascript code to access them, but clearly they are stored somewhere in the system, so we need to resort to windows API to retrieve them.

{{< highlight csharp "linenos=table,linenostart=1" >}}
String hostName = _webBrowser.Url.Scheme + Uri.SchemeDelimiter +
_webBrowser.Url.Host;
Uri hostUri = new Uri(hostName);
CookieContainer container = CookieHelpers.GetUriCookieContainer(hostUri);
CookieCollection cookieCollection = container.GetCookies(hostUri);
_container.Add(cookieCollection);
{{< / highlight >}}

 **Step 4:** *Determine base uri of the site and grab all cookies thanks to the function CookieHelpers.GetUriCookieContainer*

All the work is done inside the [GetUriCookieContainer](http://msdn.microsoft.com/en-us/library/aa384714%28v=vs.85%29.aspx) method, that use windows API to retrieve cookie, once the CookieContainer used by the WebBrowser is grabbed, you can simply get the CookieCollection and set to another CookieContainer that will be used by subsequent WebRequest object.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[DllImport("wininet.dll", SetLastError = true)]
public static extern bool InternetGetCookieEx(
string url,
string cookieName,
StringBuilder cookieData,
ref int size,
Int32  dwFlags,
IntPtr  lpReserved);
 
private const Int32 InternetCookieHttponly = 0x2000;
{{< / highlight >}}

 **Step 5:** *declare import to use Windows API*

Now we can use the InternetGetCookieEx to grab all the cookie.

{{< highlight csharp "linenos=table,linenostart=1" >}}
/// <summary>
/// Gets the URI cookie container.
/// </summary>
/// <param name="uri">The URI.</param>
/// <returns></returns>
public static CookieContainer GetUriCookieContainer(Uri uri)
{
CookieContainer cookies = null;
// Determine the size of the cookie
int datasize = 8192 * 16;
StringBuilder cookieData = new StringBuilder(datasize);
if (!InternetGetCookieEx(uri.ToString(), null, cookieData, ref datasize, InternetCookieHttponly, IntPtr.Zero))
{
if (datasize < 0)
return null;
// Allocate stringbuilder large enough to hold the cookie
cookieData = new StringBuilder(datasize);
if (!InternetGetCookieEx(
uri.ToString(),
null, cookieData,
ref datasize,
InternetCookieHttponly,
IntPtr.Zero))
return null;
}
if (cookieData.Length > 0)
{
cookies = new CookieContainer();
cookies.SetCookies(uri, cookieData.ToString().Replace(';', ','));
}
return cookies;
}
{{< / highlight >}}

 **Step 6:** *Grab all cookie with InternetGetCookieEx api, this is needed to retrieve HttpOnly cookie*

Now the game is done. As a last warning I suggest you to clear all WebBrowser cookie before starting the login procedure, because it could lead to problems. I found this solution on StackOverflow (I do not remember the link sorry ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/wlEmoticon-smile.png) )

{{< highlight csharp "linenos=table,linenostart=1" >}}
private const int INTERNET_OPTION_END_BROWSER_SESSION = 42;
 
[DllImport("wininet.dll", SetLastError = true)]
private static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);
 
public static void ClearCookie()
{
InternetSetOption(IntPtr.Zero, INTERNET_OPTION_END_BROWSER_SESSION, IntPtr.Zero, 0);
}
{{< / highlight >}}

 **Snippet 1:** *Method to clear all the cookie, this is needed to be sure that the webControl has no cookies when login procedure begins.*

alk.
