---
title: "Move blog post from subtext to WordPress with Metaweblog API"
description: ""
date: 2012-03-24T07:00:37+02:00
draft: false
tags: [Blog,Tools]
categories: [Programming]
---
My desire is to move my Italian blog located in [http://blogs.ugidotnet.org/rgm](http://blogs.ugidotnet.org/rgm) to a [**WordPress**](http://wordpress.com/) blog in our domain [http://www.nablasoft.com](http://www.nablasoft.com), because I really feel nostalgic of my old domain, but I face a bad problem, because the export routine of the original blog, based on  **[Subtext](http://subtextproject.com/default.aspx?AspxAutoDetectCookieSupport=1)** , seems not to work. I started thinking to a solution and I decided to try to write a simple program that download post from an original blog engine via [**Metaweblog API**](http://xmlrpc.scripting.com/metaWeblogApi.html) and repost to destination blog.

The starting point is looking for a library that takes care of implementing Metaweblog API communication in your language of choice, I’ve find the [**Joe Blogs**](http://joeblogs.codeplex.com/) ** ** on *Codeplex* so I decided to give it a look to verify if it suits my need. I’ve started creating a minimal interface in Winform.

[![A screenshot of the tool in action while it is migrating my blog](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb29.png "A screenshot of the tool in action while it is migrating my blog")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image29.png)

 ***Figure 1***: *A screenshot of the tool in action while it is migrating my blog*

As you can see from the screenshot the only information I need for each blog is Username/Password and the url that implement the  **XMLRPC Metaweblog API** and since all major *Blog Engine* actually implement this interface, this utility can virtually migrate blog from every source and destination. The code is really simple, you can grab the list of post of the source blog with a single call.

{{< highlight csharp "linenos=table,linenostart=1" >}}


AlexJamesBrown.JoeBlogs.MetaWeblogWrapper wrapper = 
new MetaWeblogWrapper(xmlrpcurlSource.Text, usernameSource.Text, passwordSource.Text);
var posts = wrapper.GetRecentPosts(10000);

{{< / highlight >}}

Now you could simply create another wrapper to the Destination blog, iterate into all the post returned from the GetRecentPost and save them to the new blog.

{{< highlight csharp "linenos=table,linenostart=1" >}}


Post newPost = new Post();
newPost.categories = post.categories;
newPost.title = post.title;
newPost.description = document.DocumentNode.InnerHtml;
newPost.dateCreated = post.dateCreated;
var result = wrapperDest.NewPost(newPost, true);

{{< / highlight >}}

In *less than 10 lines of codes you can migrate post from a source blog to a destination one.*The only drawback is that you need to  **replicate categories manually** from the original blog to the destination one, because the Joe Blog library does not support creation of categories, but this is a simple process that takes little works. My routine actually takes care of moving also the image resources from the original post to the destination one. When you blog with tools like *Windows Live Writer*, when you embed images into a post, the tool usually upload the image in destination blog, and if you only copy the blog post with the above code,  **all the images still refer to the one uploaded to the old blog**. If the old blog will remain online usually this is not a big problem, but if you plan to turn off source blog entirely, all the image will not be available anymore.

The solution is fairly simple, usually in my post, windows live writer creates a thumbnail and each image is enclosed in  **anchor tag** that will link to the full size image, so I start to identify all images in the post thanks to  **[HtmlAgilityPack](http://htmlagilitypack.codeplex.com/).** {{< highlight csharp "linenos=table,linenostart=1" >}}


HtmlDocument document = new HtmlDocument();
document.LoadHtml(post.description);
var images = document.DocumentNode.SelectNodes("//img");
 if (images != null)
 {
 		foreach (var imageNode in images)

{{< / highlight >}}

Finding images is really simple, now for each image I need to  **download from the original source blog and reupload to the new destination blog**. I will not show the entire code, but basically it is a matter of using a  **WebRequest** object to download the image locally and reupload with the Joe Blog library

{{< highlight csharp "linenos=table,linenostart=1" >}}


MediaObject newBlogImage = new MediaObject();
 newBlogImage.bits = ms.ToArray();
 newBlogImage.name = Guid.NewGuid().ToString() + realImageName;
newBlogImage.type = Path.GetExtension(realImageName);
info = wrapper.NewMediaObject(newBlogImage);

{{< / highlight >}}

Now you can simply  **change the src attribute** of the image with the new url returned from the NewMediaObject call and the game is done, you are migrating both post and image resources from your old blog to the new one.

Full code [can be downloaded here](http://www.codewrecks.com/files/blogmigrator.zip), use at your own risk, because it is not tested, I’ve only tried to do migration of my blog and nothing more. The result of the export is in [http://www.nablasoft.com/gianmaria/](http://www.nablasoft.com/gianmaria/ "http://www.nablasoft.com/gianmaria/") and I’m actually doing some verification right now to verify if the export/import went good.

Gian Maria
