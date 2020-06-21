---
title: "Advantage of Hugo"
description: "Why using Hugo and in general why static site generator is a good idea"
date: 2020-05-02T08:00:00+02:00
draft: false
tags: ["blogging"]
categories: ["general"]
---

I should admit that I was one of the people that loved blogging with Windows Live Writer and in general with software that is able to simple **edit content, paste images, press a button and your post is online**.

Sometimes you just need to go out from your comfort zone a little bit to change perspective and to find what you are doing wrong. Let me do an example: **I used different plugins to print formatted code in my blog** and after some migration you can see what happened to very first posts (around 2007).

![Nice unformatted code](../images/unformattedCode.png)
***Figure1***: *Nice formatted code after more than 10 years*.

As you can see, nothing of the original formatting is preserved and the code **is completely unreadable**. The real problem is that, if I really want to fix that post, this is the HTML I see in the editor: garbage...

![Horrible formatted html](../images/horribleFormattedHtml.png)
***Figure 2***: *Code as seen in the editor*

This happens because instead of code, my editor of choice (probably was Word) generated some weird HTML and when I migrated from an earlier version of WordPress to another, I lost formatting and got Unicode problems or whatever.

Believe me **there is no need to have preformatted code stored as post content**, a better approach is writing standard code as text and let Hugo take care of all the formatting using a nice meta tag during rendering. This allows **the original content, *the code*, to be stored without formatting**.

> This will completely **separate your content by any formatting you need**, makes your blog content more exportable and human readable.

For publishing part, thanks to a simple GitHub action, my live site is updated with each version I push on master branch. Instead of pressing button "publish" I should simply merge the branch with my post in master branch and push to GitHub.

{{< highlight yaml "linenos=table,linenostart=1" >}}
name: publish-on-master

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.68.3'
          extended: true

      - name: Build
        working-directory: ./codewrecks
        run: hugo --minify
 
      - name: Upload ftp
        uses: sebastianpopp/ftp-action@releases/v2
        with:
          host: ${{ secrets.FtpHostName }}
          user: ${{ secrets.FtpUserName }}
          password: ${{ secrets.ftpPassword }}
          localDir: "codewrecks/public"
          remoteDir: "codewrecks.com/wwwroot"

{{< / highlight >}}
***Code Snippet 1***: *GitHub action workflow that automatically publish code on my host"

As you can see with few lines of YAML and thanks again to my friend [Giulio Vian](http://blog.casavian.eu/), I was able to **automate publishing of post on my blog hosting through a simple ftp.**. I have also all git goodness to my hand, I can create post on feature branch and merge in master only when I want the post to be public, but in the meanwhile I retain the whole history of all modifications. I can easily **ask for a review because the repo is public** and a reviewer can make fix / correction to my post with a simple pull request, how cool is that.

> Using a markdown based blog gives you the ability to create a post with every os/device that can edit a text file.

Since it is hosted on GitHub I can even directly edit online and even if it does not have final aspect, I can quick have a look post content directly in GitHub since MarkDown is rendered. 

![markdown post](../images/markDownPost.png)
***Figure 3***: *Post view through the standard GitHub UI*

This will allows me to write post from any device that can have a browser and can edit content directly on GitHub. Also the whole history of all of my posts will be preserved in Git repository, with full history.

With very few lines of code I added cookie consent thanks to powerful template engine of Hugo. At the end, with a decent grammar checker I'm able to write blog posts directly in Visual Studio Code, **with greater productivity than I was used in Windows Live Writer**.

Another advantage is: since everything is static, your site will run really fast and you can rent a really cheap provider, without needing database or other stuffs.

Finally, since everything is static, security of the site will dramatically improve, no need for backup anymore, no need for upgrade anymore, zero, nada, niet.

> No more upgrade, backup or worrying because some plugin got some vulnerability will make maintenance a breeze.

If you still are on wordpress with your blog, I strongly suggests to have a real look at Hugo.

Gian Maria.
