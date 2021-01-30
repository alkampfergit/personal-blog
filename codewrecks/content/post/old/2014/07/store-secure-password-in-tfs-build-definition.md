---
title: "Store secure password in TFS Build Definition"
description: ""
date: 2014-07-12T08:00:37+02:00
draft: false
tags: [TfsBuild]
categories: [Team Foundation Server]
---
Some days ago I had some tweet exchange with [Giulio](https://twitter.com/giulio_vian) about a post of [Gordon](https://twitter.com/GordonBeeming) on  **storing security info in TFS Build Definition**. The question is: * **how can I store password in build definition without people being able to view them simply editing the build definition itself?** *

With TFS 2013 a nice new Build template that allow customization with scripts is included and this is my preferred build customization scenario. Now I question myself on *How can I pass a password to a script in build definition in a secure way?* When you are on Active Directory, the best solution is using AD authentication.  **My build server runs with credentials of user cyberpunk\\TfsBuild where cyberpunk is the name of my domain** and the build is executed with that credentials. Any software that supports AD authentication can then give rights to TfsBuild users and there is no need to specify password in build definition.

> *As an example, if you want to use Web Deploy to deploy a site in a build you can avoid storing password in Clear Text simply using AD authentication. I’ve described this scenario in the post how to*[*Deploy from a TFS Build to Web Site without specifying password in the build definition*](http://www.codewrecks.com/blog/index.php/2013/11/29/deploy-from-a-team-foundation-server-build-to-web-site-without-specifying-password-in-the-build/)*.*

But sometimes you have services or tools that does not supports AD authentication. This is my scenario: I need to call some external service that needs username and password in querystring; credentials are validated against custom database. In this scenario AD authentication could not be used. I’ve setup a simple web service that ask for username and password, and returns a json that simply dumps parameters. This simple web service will represent my external service that needs to be invoked from a script during the build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image5.png)

 ***Figure 1***: *Simple service that needs username and password without supporting AD Authentication.*

As you can see the call does nothings except returning username and password to verify if the script was really called with the rights parameters. Here is a simple script that calls this service, this script can be invoked during a TFS Build with easy and it is my preferred way to customize TFS 2013 build.

{{< highlight powershell "linenos=table,linenostart=1" >}}


Param
(
[string] $url = "http://localhost:2098/MyService/Index",
[string] $username = "",
[string] $password = ""
)

Write-Host "Invoking-Service"

$retValue = Invoke-RestMethod $url"?username=$username&password=$password"  

Write-Host "ReturnValueIs: "$retValue.Message

{{< / highlight >}}

Once I’ve cheked-in this script in source code, invoking it in TFS Build is a breeze, here is how I configured the build to **invoke the service after source code is built**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image6.png)

 ***Figure 2***: *Invoke script but password is in clear text.*

This works perfectly, you can verify in the build Diagnostics that the web site was correctly called with the right username and password ( **Figure 3** ), but as you can see in  **Figure 2** password is in clear text, everyone that has access to the build now knows the password. This is something that could no be accepted in some organization, so I need to find a way to not specify password in clear text.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image7.png)

 ***Figure 3***: *Web site was called with the right password.*

> <font>My problem is: <em>how can I pass a password to the script in a secure way?</em></font>

Luckily enough,  **windows implements a set of secure API called DPAPI that allows you to encrypt and decrypt a password using user/machine specific data**. This means that a string encrypted by a user on a machine can be decrypted only by that user on the same machine and not from other users.

* **Thanks to DPAPI we can encrypt the password using Cyberpunk\\TfsBuild user from build machine, then use encrypted password in build definition.** *

* **Anyone that looks at build definition will see the encrypted password, but he could not decrypt unless he knows credentials of Cyberpunk\\TfsBuild user and runs the script on the same Build machine.** *

* **Build agent can decrypt the password because it runs as Cyberpunk\\TfsBuild user on the Build machine.** *

Now I remote desktop on the Build Machine, opened a powershell console using credentials of Cyberpunk\TfsBuild user, then I encrypted the password with the following code. For this second example the password will be * **MyPassword** *to distinguish from previous example.

{{< highlight powershell "linenos=table,linenostart=1" >}}


PS C:\Users\Administrator.CYBERPUNK> $secureString = ConvertTo-SecureString -String "MyPassword" -AsPlainText -Force
PS C:\Users\Administrator.CYBERPUNK> $encryptedSecureString = ConvertFrom-SecureString -SecureString $secureString
PS C:\Users\Administrator.CYBERPUNK> Write-Host $encryptedSecureString
01000000d08c9ddf0115d1118c7a00c04fc297eb010000007b3f6d7796acef42b98128ebced174280000000002000000000003660000c00000001000
0000dee3359600e9bfb9649e94f3cfe7b24f0000000004800000a000000010000000e12de6a220f9a542655d75356be128511800000012a173b8fe8b
09244f7050da6784289a308ce6888ace493614000000e3dcb31c16ac3ff994d50dac600ed766d746e901

{{< / highlight >}}

Encrypted password is that long string you see in the above script and can be used in build definition instead of a clear-text password.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image8.png)

 ***Figure 4***: *Password is now encrypted in the build definition*

This password can be decrypted only by users that knows the password of TfsBuild user and can open a session in the Build machine.  **The main drawback of this technique is that the person that creates the build (and knows the password for the external service) should know also the password of TfsBuild user and access to Build machine to encrypt it**. This problem will be fixed in a future post, for now I’m happy enough of not having clear text password in build definition.

Clearly the script that invokes the service should be modified to takes encryption into account:

{{< highlight powershell "linenos=table,linenostart=1" >}}


Param
(
[string] $url = "http://localhost:2098/MyService/Index",
[string] $username = "",
[string] $password = ""
)

Write-Host $password
$secureStringRecreated = ConvertTo-SecureString -String $password

$cred = New-Object System.Management.Automation.PSCredential('UserName', $secureStringRecreated)
$plainText = $cred.GetNetworkCredential().Password

Write-Host "Invoking-Service"

$retValue = Invoke-RestMethod $url"?username=$username&password=$plainText"  

Write-Host "ReturnValueIs: "$retValue.Message

{{< / highlight >}}

This code simply decrypts the password and then calls the service. This is a simple piece of powershell code I’ve found on some sites, nothing complex. Then I checked in this new script and fire the build. After the build completes I verified that the script correctly decrypted the right password and that the service was invoked with the right decrypted password.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image9.png)

 ***Figure 5***: *Script correctly decrypted the password using TFSBuild credentials*

To verify that this technique is secure I connected as Domain Administrator, edited the build and grabbed encrypted password from the definition. Once I’ve got the encrypted password I run the same PowerShell script to decrypt it, but I got an error.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image10.png)

 ***Figure 6***: *I’m not able to decrypt the string once encrypted by a different user*

Even if I’m a Domain Admin, I could not decrypt the password, because I’m a different user. It is not a matter of permission or of being or not ad administrator, the original password is encrypted with data that is available only for the same combination of user/machine, so it is secure.

*If you have multiple build controllers / agent machines, you can still use this technique, but you need to specify the build machine you used to generate the password in the build definition.*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/07/image12.png)

 ***Figure 7***: *I specified the exact agent that should run the build, because it is on the machine where I’ve encrypted the password.*

In this example I’ve used powershell, but the very same technique can be used in a Custom Action because DPAPI is available even in C#.

Gian Maria.
