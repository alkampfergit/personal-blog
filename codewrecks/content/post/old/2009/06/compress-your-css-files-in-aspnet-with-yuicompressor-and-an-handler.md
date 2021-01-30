---
title: "Compress your CSS files in aspnet with YUICompressor and an Handler"
description: ""
date: 2009-06-01T03:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Some times ago [I spoke](http://www.codewrecks.com/blog/index.php/2009/01/24/optimization-of-javascript-and-css-files/) about using [YUICompressor](http://www.codeplex.com/YUICompressor) to reduce number and size of your css files. That solution was based on the original msbuild action included in youicompressor library. That solution has a major drawback, css files gets compressed only during the deploy phase, so during testing the site was tested only with the original css set. I like to test in an environment similar to production one, so I decided to develop a simple IHttpHandler to handle css compression.

Moreover asp.net has a not so good handling of themes, and all css that are in theme folder are included in final pages (if I compress files into 1 with youicompressor Iâ€™ll end with a lot of 404 request), I want to insert only a single css in the theme. Here is the solution, place in theme folder a single css files and include all original css files with include directive

{{< highlight csharp "linenos=table,linenostart=1" >}}
@import url("../../ThemesCss/v2/BackOffice.css");
@import url("../../ThemesCss/v2/CollapsiblePanel.css");
@import url("../../ThemesCss/v2/control.css");
@import url("../../ThemesCss/v2/EMailEditor.css");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now create a folder in the root named ThemesCss and put all your css there. Now everything works ok, but you have no compression and you still suffer from too many css in the site, but now you have only a css file included in the theme.

Now I created another file, with the same name of the single theme css file, but with extension.FileList, inside it I put all path of the css files that are used in the site.

{{< highlight csharp "linenos=table,linenostart=1" >}}
~/ThemesCss/v2/BackOffice.css
~/ThemesCss/v2/CollapsiblePanel.css
~/ThemesCss/v2/control.css
~/ThemesCss/v2/EMailEditor.css{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is a simple text file, but now Iâ€™m able to write an handler that use this file list to compress all site.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
    class YUICompressorHandler : IHttpHandler
    {
        #region IHttpHandler Members

        public bool IsReusable
        {
            get { return true; }
        }
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.FilePath.EndsWith(".css"))
            {
                String path = context.Server.MapPath(context.Request.FilePath);
                String compressedFileName = Path.ChangeExtension(path, ".csscompressed");
                String cssListFileName = Path.ChangeExtension(path, ".FileList");

                //Check if some source file was changed.
                if (File.Exists(compressedFileName))
                {
                    DateTime csscompressedDate = File.GetLastWriteTime(compressedFileName);
                    foreach (String cssfile in File.ReadAllLines(cssListFileName))
                    {
                        String realCssFile = context.Server.MapPath(cssfile);
                        if (File.GetLastWriteTime(realCssFile) > csscompressedDate)
                        {
                            File.Delete(compressedFileName);
                        }
                    }
                }

                //if not in debug mode activate caching. in debug mode we does not want cache.
                if (!context.IsDebuggingEnabled)
                {
                    //We are in release with debug="true" check for request cache
                    if (File.Exists(compressedFileName))
                    {
                        string ifModifiedSince = context.Request.Headers["If-Modified-Since"];
                        DateTime modifiedSince;
                        if (!string.IsNullOrEmpty(ifModifiedSince) && ifModifiedSince.Length > 0 && DateTime.TryParse(ifModifiedSince, out modifiedSince))
                        {
                            DateTime fileDate = File.GetLastWriteTime(compressedFileName);
                            TimeSpan difference = fileDate - modifiedSince;
                            if (difference.TotalSeconds > 0)
                            {
                                //Data is cachable.
                                context.Response.StatusCode = 304;
                                context.Response.StatusDescription = "Not Modified";
                                context.Response.AddHeader("Content-Length", "0");
                                return;
                            }
                        }
                    }
                    //If we reach here the caller does not specified If-Modified-Since, tells client that this is cacheable
                    context.Response.Cache.SetCacheability(HttpCacheability.Public);
                    context.Response.Cache.SetLastModified(File.GetLastWriteTime(compressedFileName));
                    context.Response.Cache.VaryByHeaders["If-Modified-Since"] = true;
                }
                //If we reach here we must stream the file, if is not present recreate.
                if (!File.Exists(compressedFileName))
                {
                    CompressCssFile(context, compressedFileName, cssListFileName);
                }
                context.Response.ContentType = "text/css";
                context.Response.TransmitFile(compressedFileName);
            }
        }

        private void CompressCssFile(HttpContext context, string compressedFileName, string cssListFileName)
        {
            StringBuilder sb = new StringBuilder();
            String[] lines = File.ReadAllLines(cssListFileName);
            foreach (string cssFile in lines)
            {
                //Each line of the file is a relative path to real file name
                sb.AppendLine(File.ReadAllText(context.Server.MapPath(cssFile)));
            }
            File.WriteAllText(compressedFileName,
                              CssCompressor.Compress(sb.ToString(), 80, CssCompressionType.StockYuiCompressor));
        }

        #endregion
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the very first version of the handler, it basically compress all original files into one, it checks if the previously compressed file is out-of-date because one of the original css is changed. If nothing is changed it returns the compressed file to the caller. It has even a simple check, if the site has debug=â€falseâ€ and is in release mode, I honor cache of the browser, using appropriate headers.

It works really well, now even in test site deployed by CC.net I can have compression and I can enable/disable simply from the IIS control panel, if I send css request to asp.net engine Iâ€™ll have compression, if I do not map css extension to asp.net I have standard IIS behaviour.

In a site Iâ€™m working in I moved from 25 css files and 45Kb of uncompressed css, to a 1 css and a 28k of uncompressed css, that became 5.5k when gzipped.

alk.

Tags: [asp.net](http://technorati.com/tag/asp.net) [css compression](http://technorati.com/tag/css%20compression)
