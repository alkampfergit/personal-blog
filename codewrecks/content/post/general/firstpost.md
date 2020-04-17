---
title: Moving to Hugo
description: Why using server code and a database when all you need is a static code generator?
date: 2020-04-13T17:17:25+02:00
draft: false
---

I've started blogging in XXX and clearly the choice was WordPress. I must admit that in lots of years of WordPress I always was quite satisfied by the result, lots of plugin, lots of resources on the internet and the ability to post from programs like Windows Live Writer having a WYSIWYG program.

Years passed, and I've started getting a little bit tired of maintaining my WordPress site, especially because I start feeling that it is a little bit overwhelming for maintaining a simple blog.

Thanks to my friend [Giulio Vian](http://blog.casavian.eu/) I've discovered Hugo lots of time ago, but I was always reluctant to switch, especially because I do not want to spend time converting my old posts and verify that permalink are still ok after conversion.

Lastly I've decided that I can leave the old blog as is, where it is and restart from scratch with a new blog on the root site. This means that old posts are still accessible at [the usual old address](http://www.codewrecks.com/blog).

**Authoring blog post is also more linear with Hugo, just open a simple text editor and you are ready to go.** I've also find a nice plugin of Visual Studio Code that allows me to directly paste an image in markdown.

![This is the addin I use to paste images](../images/AddinPastImages.png)
**Figure 1**: *Addin I use to simply paste images in Markdown*

Another big advantage is that content is absolutely format agnostic, no weird HTML code inserted in your post done by Windows Live Writer or other WYSIWYG tools, this will dramatically improve portability of the content on a new theme.

> Portability of content is one of the problem I had with WordPress especially with specific code plugin that inserted code with some custom tags and are interpreted by custom JavaScript plugin.

Since my blog contains code, Hugo does make it really simple to just add code, simply use triple ticks.

```csharp
try
{
    var rsa = (RSA)certificate.PrivateKey;
    var aesDecryptedKey = rsa.Decrypt(data.Key, RSAEncryptionPadding.OaepSHA512);
    using var aes = Aes.Create();
    aes.Key = aesDecryptedKey;
    aes.IV = data.IV;
    using var decryptor = aes.CreateDecryptor();
    return Encryptor.DecryptWithDecryptor(decryptor, data.Data);
}
catch (CryptographicException)
{
    throw new SecurityException();
}
```

But wait, Hugo has syntax highlighting automatically included in the engine, so I can use special tags to copy C# code, add line numbering decide line starting and I even have the option to highligh some lines, in this snippet I highlighted lines 5,6 and 7

{{< highlight csharp "linenos=table,hl_lines=5-7,linenostart=1" >}}
try
{
    var rsa = (RSA)certificate.PrivateKey;
    var aesDecryptedKey = rsa.Decrypt(data.Key, RSAEncryptionPadding.OaepSHA512);
    using var aes = Aes.Create();
    aes.Key = aesDecryptedKey;
    aes.IV = data.IV;
    using var decryptor = aes.CreateDecryptor();
    return Encryptor.DecryptWithDecryptor(decryptor, data.Data);
}
catch (CryptographicException)
{
    throw new SecurityException();
}
{{< / highlight >}}

Everything is really simple, you are productive in mere minutes and the better thing is that the site is completely static, no more cache plugin to install to improve performances, just static content that can be served really quick to your reader.

This means that I'm able to switch away from WordPress, and if everything will be good with Hugo, probably I'll decide to convert my old blog posts and getting rid completely of WordPress.

Gian Maria.
