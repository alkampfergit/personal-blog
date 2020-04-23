---
title: Moving to Hugo
description: Why using server code and a database when all you need is a static code generator?
date: 2020-04-13T17:17:25+02:00
draft: false
tags: ["blogging"]
categories: ["general"]
---

I've started blogging in English in 2007 and clearly the choice was WordPress. I must admit that in lots of years of WordPress I always was quite satisfied by the result, lots of plugin, lots of resources on the internet and the ability to post from programs like Windows Live Writer having a WYSIWYG program.

You can also read one of the first post where I [enjoyed blogging in Word](http://www.codewrecks.com/blog/index.php/2007/05/03/the-advantage-of-word2007-blogging/), really long time passed since that really old post.

Years passed, and **I've started getting a little bit tired of maintaining my WordPress site**, especially because I start feeling that it is a little bit overwhelming for maintaining a simple blog.

> Believe me, WordPress is great, but it requires maintenance, while having a static site generator removes most of the problems you have in upgrading, maintaining plugin, etc etc.

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

But wait, **Hugo has syntax highlighting automatically included in the engine**, so I can use special tags to copy C# code, add line numbering decide line starting and I even have the option to highlight some lines, in this snippet I highlighted lines 5,6 and 7

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

Moreover thanks to spell check in Visual Studio code **I can really write a blog post in VS Code as I'm doing in Windows live writer**, but with notable improvements.

1. All content is now a simple Git repository hosted in GitHub, no more backup to do.
1. Publishing is done with GitHub actions, so it is external to my device.
1. Everything is a simple text file (code, formatting, etc..)
1. No more external tool to author your content.
1. I can create post from my cell phone and I do not really need more than a text editor.
1. Everything is automated.

This means that I'm able to switch away from WordPress, and if everything will be good with Hugo, probably I'll decide to convert my old blog posts and getting rid completely of WordPress.

Gian Maria.
