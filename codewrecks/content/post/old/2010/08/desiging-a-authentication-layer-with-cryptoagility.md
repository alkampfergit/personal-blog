---
title: "Desiging a authentication layer with cryptoagility"
description: ""
date: 2010-08-30T07:00:37+02:00
draft: false
tags: [Security]
categories: [NET framework]
---
Today I was working a little bit on [Dexter](http://dexterblogengine.codeplex.com/), and I'm trying to update the security system, the actual login system is based on a membership provider quite old, but I'd like to update it to be [CryptoAgile](http://msdn.microsoft.com/en-us/magazine/ee321570.aspx). First of all here is the class UserDto (the name Dto should be changed because it is really a domain class but we are in the middle of a reorganization ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/wlEmoticonsmile.png) so do not mind the name ) that has some methods to manage authentication.

To be flexible the class should support storing of the password in clear form (strongly discouraged) and in hashed form with salt (the default one). Here is the code of the ChangePassword function

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image6.png)

The key factor is that the [HashAlgorithm](http://msdn.microsoft.com/query/dev10.query?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28SYSTEM.SECURITY.CRYPTOGRAPHY.HASHALGORITHM%29;k%28TargetFrameworkMoniker-%22.NETFRAMEWORK%2cVERSION%3dV3.5%22%29;k%28DevLang-CSHARP%29&amp;rd=true) used is not hardcoded in source code, the trick is in the shared factory method [HashAlgorithm.Create](http://msdn.microsoft.com/en-us/library/wet69s13%28v=VS.90%29.aspx?appId=Dev10IDEF1&amp;l=EN-US&amp;k=k%28SYSTEM.SECURITY.CRYPTOGRAPHY.HASHALGORITHM.CREATE%29;k%28TargetFrameworkMoniker-&quot;.NETFRAMEWORK&amp;k=VERSION=V3.5&quot;%29;k%28DevLang-CSHARP%29&amp;rd=true) that permits to create a sha provider from a string code like: MD5, SHA1, etc. The user object stores used hash provider in a property called *HashProvider* and has a default value of SHA1 type.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image7.png)

This test verify that for a newly constructed User object the HashProvider is of SHA1 type, but since the HashProvider property is stored to database so we can apply a little bit of cryptoagility. Suppose that at a certain point in the future the SHA1 provider is broken. To solve this problem we can store a global application setting that tells the HashProvider to use, and when a specific algorithm is broken we can change it. I write a test to verify this.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image8.png)

This test uses a different VerifyPassword function, that pass both the password and the global Hash provider. In this test you can verify that the password is hashed with SHA1, but the software requires SHA512 to be used, so, after a successful login, the current password should change and the current HashProvider should be set to the default one.

The code to accomplish this is really simple.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/08/image9.png)

If the password is good you can simply check if the required HashProvider is different from the current one, and if they are different you can change the HashProvider and recalculate the password using the current one. This is good because with this simple technique we are not bound to a specific hash provider and we can change the provider at any time.

alk.
