---
title: "Secure your queryString with encription in aspnet 20"
description: ""
date: 2008-06-13T12:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
This post is mainly a tralation of an [old post](http://blogs.ugidotnet.org/rgm/archive/2007/10/08/88796.aspx) in italian. [Here is the source Code](http://www.codewrecks.com/blog/storage/SecureQueryString.zip).

QueryString is a common and easy way to move state between pages in web applications, but it can lead to a security problem. Suppose you are writing a forum engine, you write a simple page to edit a post that accepts the id of the post in querystring. Es

[http://myforum.com/editpage.aspx?PostId=1342](http://myforum.com/editpage.aspx?PostId=1342)

This can lead to a problem, what happened if a malicious user change the id trying to edit another post of another user? This kind of problem lead to security vulnerabilities, because querystring data can be easily manipulated by attackers and this is usually a bad thing.

The correct way to handle this kind of situation is to do security checks, for example check that the id of the post to be edited is associated to current logged user and so on, but often it is useful to add a further level of security. Let’s see how to encrypt your querystring with a url rewriter module. First of all we needs a IHttpModule that rewrite the querystring

{{< highlight csharp "linenos=table,linenostart=1" >}}
 1 public void Application_BeginRequest(object sender, System.EventArgs args) {
 2     if (HttpContext.Current.Request.QueryString["ck"] != null) {
 3         String criptedQueryString = HttpContext.Current.Request.QueryString["ck"];
 4         Byte[] rawQueryString = Convert.FromBase64String(criptedQueryString);
 5         MemoryStream ms = new MemoryStream();
 6         RijndaelManaged crypto = new RijndaelManaged();
 7         ICryptoTransform ct = crypto.CreateDecryptor(
 8             HexEncoding.GetBytes(ConfigurationManager.AppSettings["QueryStringEncryptionKey"]),
 9             HexEncoding.GetBytes(ConfigurationManager.AppSettings["InitializationVector"]));
10         CryptoStream cs = new CryptoStream(ms, ct, CryptoStreamMode.Write);
11         cs.Write(rawQueryString, 0, rawQueryString.Length);
12         cs.Close();
13         String decryptedQueryString = Encoding.ASCII.GetString(ms.ToArray());
14         HttpContext.Current.RewritePath(HttpContext.Current.Request.Path + "?" + decryptedQueryString);
15     } else if (HttpContext.Current.Request.QueryString.Count > 0 ) {
16         throw new SecurityException("Wrong querystring");
17     }
18 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is really simple, I check if the querystring contains a item with code “ck”, if this condition is true I decrypt the value using the RijndaelManaged class, and a key stored in web.config (the location of the key is web.config for this little example, you can store it everywhere if you like). Then after I decoded the real original querystring the line 14 rewrites the old path with the querystring now in clear text. This approach makes the encryption completely transparent to the page, here is the code of a simple page that expects some parameters in querystring.

{{< highlight xml "linenos=table,linenostart=1" >}}
protected void Page_Load(object sender, EventArgs e) {
    foreach(String key in Request.QueryString.AllKeys) {
        Response.Write(key + "=" + Request.QueryString[key] + "<BR />");
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Even if the real url is [http://localhost:1266/SecureQueryString.aspx?ck=xRAqZ2GkfDROxm3MkWfTSdghEAHVrOjp53W850Bjx98TjRXP5J79SsJ%2bvsI5Z%2bz7](http://localhost:1266/SecureQueryString.aspx?ck=xRAqZ2GkfDROxm3MkWfTSdghEAHVrOjp53W850Bjx98TjRXP5J79SsJ%2bvsI5Z%2bz7 "http://localhost:1266/SecureQueryString.aspx?ck=xRAqZ2GkfDROxm3MkWfTSdghEAHVrOjp53W850Bjx98TjRXP5J79SsJ%2bvsI5Z%2bz7") this code render this text on the page thanks to url rewriting.

{{< highlight csharp "linenos=table,linenostart=1" >}}
a=pippo
b=pluto
test=valoredi test
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The page did never known that the querystring was encrypted, the process is completely transparent. The generation of encrypted links can be made also transparent in most of the situation? The first step is creating a function that encrypt a link

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static String EncodeLink(String link)
{
    if (link.Contains("?") && active) {
        String[] linkpart = link.Split('?');
        if (!linkpart[1].StartsWith("ck")) {
            return linkpart[0] + "?" + EncodeQueryString(linkpart[1]);
        }
    }
    return link;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This function is static on module QueryStringSecure, it accepts a full link to a page of the project, and if the url contains “?” and the variable active is true, it encrypts the querystring part. The function also checks if the querystring starts with ck, this means that the link was already encrypted.

The active variable is a shared one and it is set to true on module init. With this trick, if you disable the module from the web.config, all urls will be generated without encryption. At this point Whenever you have to generate a link to a page from code, you need to call this function to encrypt the url, but it can be done automatically for web controls, thanks to the concept of “Control Adapters and adaptive rendering”. First of all I created an handler for the HyperLink standard asp.net control

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class HyperLinkControlAdapter : System.Web.UI.Adapters.ControlAdapter
{
    protected override void Render(System.Web.UI.HtmlTextWriter writer)
    {
        HyperLink link = (HyperLink) base.Control;
        link.NavigateUrl = QueryStringSecure.EncodeLink(link.NavigateUrl);
        base.Render(writer);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The adapter is really simple, before the rendering takes place I change the NavigateUrl original property of the control, encrypting with the routine I showed you before. Then all you need to do is to insert a.brower file int he App\_Browser directory with this content.

{{< highlight xml "linenos=table,linenostart=1" >}}
<browsers>
    <browser refID="Default">
        <controlAdapters>
            <adapter controlType="System.Web.UI.WebControls.HyperLink"
                        adapterType="SecureQueryString.HyperLinkControlAdapter" />
            <adapter controlType="System.Web.UI.HtmlControls.HtmlForm"
                adapterType="SecureQueryString.FormRewriterControlAdapter" />
        </controlAdapters>
    </browser>
</browsers>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now every HyperLink control you drop on the page will have its querystring automatically encrypted.

The second adapter (that adapt the htmlform control) is needed to adapt the action property on the main form of the page. When we rewrite the url, the action property of the form is set to the rewrited url, so whenever a postback occurs (simply press a asp.button as example) the querystring is in clear form again. The solution is to create another adapter that intercepts the action attribute and use the context.Request.RawUrl property, this solution is take from [this post of Scott Gu](http://weblogs.asp.net/scottgu/archive/2007/02/26/tip-trick-url-rewriting-with-asp-net.aspx).

The final result of this little article is a module, that with less effort, can secure your querystring from external tampering.

alk.

Tags: [QueryString](http://technorati.com/tag/QueryString) [Encryption](http://technorati.com/tag/Encryption)

Tags: [ASP.NET](http://technorati.com/tag/ASP.NET)

<!--dotnetkickit-->
