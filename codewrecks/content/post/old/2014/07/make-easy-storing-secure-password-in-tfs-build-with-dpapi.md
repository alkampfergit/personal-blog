---
title: "Make easy storing secure password in TFS Build with DPAPI"
description: ""
date: 2014-07-22T06:00:37+02:00
draft: false
tags: [Security,TfsBuild]
categories: [Team Foundation Server]
---
I’ve blogged some days ago on [Securing the password in build definition](http://www.codewrecks.com/blog/index.php/2014/07/12/store-secure-password-in-tfs-build-definition/). I want to make a disclaimer on this subject. The technique described in that article permits you to use encrypted password in a build definition, but this password cannot be decrypted only if you have no access to the build machine. If you are a malicious user and you can schedule a build, you can simply * **schedule a new build that launch a custom script that decrypts the password and sends clear password by email or dump to the build output.** *

The previous technique is based on encrypting with DPAPI, encrypted password can be decrypted only by TfsBuild user and only in the machine used to generate the password (build machine). Despite the technique you used to encrypt the password, the build process should be able to decrypt the password, so it is possible for another user to schedule another build running a script that decrypt the password.

Every user that knows the TfsBuild user password can also remote desktop to build machine, or using Powershell Remoting to decrypt the password from the build server. This means: * **the technique described is not 100% secure and you should be aware of limitation.** *

Apart from these discussions on the real security of this technique,  **one of the drawbacks of using DPAPI is you need to do some PowerShell scripting in the remote machine to encrypt the password**. So you need to remote Desktop build machine or you need to do a remote session with PowerShell. A better solution is creating a super simple asp.net Site that will encrypt the password with a simple HTML page, then deploy that site on the Build Server.

The purpose is having a simple page running on build server with credentials of TfsBuild that simply encrypt a password using  DPAPI

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image19.png)

 ***Figure 1***: *Simple page to encrypt a string.*

You can test locally this technique simply running the site in localhost using the same credentials of logged user, encrypting a password and then try to decrypt in powershell.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image20.png)

 ***Figure 2***: *Decrypting a password encrypted with the helper site should work correctly.*

The code of this page is really stupid, here is the controller.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[HttpPost]
public ActionResult Index(String pwd)
{
    var pbytes = Protect(Encoding.Unicode.GetBytes(pwd));
    ViewBag.Encrypted = BitConverter.ToString(pbytes).Replace("-", "");
    return View();
}

public static byte[] Protect(byte[] data)
{
    try
    {
        // Encrypt the data using DataProtectionScope.CurrentUser. The result can be decrypted 
        //  only by the same current user. 
        return ProtectedData.Protect(data, null, DataProtectionScope.CurrentUser);
    }
    catch (CryptographicException e)
    {
        Console.WriteLine("Data was not encrypted. An error occurred.");
        Console.WriteLine(e.ToString());
        return null;
    }
}

{{< / highlight >}}

And the related view.

{{< highlight xml "linenos=table,linenostart=1" >}}


@{
    ViewBag.Title = "Index";
}

<h2>Simple Powershell Encryptor utils</h2>
<form method="post">
    Insert your string <input type="password" name="pwd" />
    <br />
    <input type="submit" value="Encrypt" />
    <br />
    <textarea cols="80
              " rows="10" >@ViewBag.Encrypted</textarea>

</form>

{{< / highlight >}}

Thanks to this simple site encrypting the password is much more simpler than directly using powershell and you do not need to remote desktop to build machine. To have a slightly better security you can disable remote desktop and remote powershell in the Build Machine so noone will be able to directly use PowerShell to decrypt the password, even if they know the password of TfsBuild user.

Related Articles

- [Store secure password in build definition with DPAPI](http://www.codewrecks.com/blog/index.php/2014/07/12/store-secure-password-in-tfs-build-definition/)

Gian Maria.
