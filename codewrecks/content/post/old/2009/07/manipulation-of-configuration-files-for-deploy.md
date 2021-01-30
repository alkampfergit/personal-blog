---
title: "Manipulation of configuration files for deploy"
description: ""
date: 2009-07-10T08:00:37+02:00
draft: false
tags: [Programming,Tools and library]
categories: [Programming,Tools and library]
---
In my experience, one of the most feared problem during the â€œgoing in productionâ€ phase of an asp.net site or a complex project is configurations. Usually everything works perfectly on developer machines, but when you move the project in production machines all sort of problems appear.

For Asp.Net, one day one of my colleagues called me asking a little help troubleshooting some performance problem of a site in production, the problem was so big that after a couple of hours the application goes into memory overflow exception. After a brief inspection I saw that trace was keep enabled with a request limit of 10000 requestâ€¦the problem was simply due to wrong configuration.

The best approach to this sort of problem is to create a script that manipulate the standard developement config file, changing specific part and preparing it for production. To deploy an app the only stuff you need to do is to launch a script, wait for it to complete and test the site.

Basically the script does the following.

1. update the source to the latest version
2. compile everything
3. updates configuration file for production machine
4. copies all the files to the right location (expecially simple for asp.net where iis does not lock any file)

Point 4 can be done manually, the script could simply zip everything to a file, and it is your duty to move that file to production server and expand in the right location.

Modifying a configuration file can be a breeze with [xmlpeek](http://tinyurl.com/l48c5v) and [xmlpoke](http://tinyurl.com/loqp4d) function of nant, Es.

{{< highlight xml "linenos=table,linenostart=1" >}}
<xmlpoke file="${DeployDir}\Site\web.config"
    xpath="/configuration/system.web/trace/@enabled"
    value='false' >
</xmlpoke>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With xmlpoke you can simply change part of the file with xpath syntax, here I change trace enabled attribute to be set as â€˜falseâ€™, thus disabling tracing entirely ;) just to avoid another problem with the one I described before :D. Xmlpeek and xmlpoke are two of the most missing feature in [Msbuild](http://channel9.msdn.com/wiki/msbuild/equivalenttasks/), so in next posts Iâ€™ll show you how to extend msbuild with these two actions.

alk.

Tags: [Nant](http://technorati.com/tag/Nant) [xmlpeek](http://technorati.com/tag/xmlpeek) [xmlpoke](http://technorati.com/tag/xmlpoke)
