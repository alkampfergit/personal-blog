---
title: "Aspnet Mvc plus jQuery client template engine  have fun with them"
description: ""
date: 2009-04-15T10:00:37+02:00
draft: false
tags: [AspNet MVC,JQuery]
categories: [AspNet MVC,JQuery]
---
jQuery has really a lot of interesting plugins, but the one I like most is a template engine called [jtemplates](http://jtemplates.tpython.com/). Basically it consist of a jQuery extension that is capable of rendering html with javascript on client machine. You really have a lot of flexibility on how to specify a template, basically you can embed it into an [hidden textarea](http://jtemplates.tpython.com/example2.html), the one you see in the above sample is created in this way

{{< highlight xml "linenos=table,linenostart=1" >}}
    <textarea id="template" style="display:none">
        <div>{$T.name}: {$T.list_id} [{$P.lang.language}]</div>
        <table>
            <thead style="font-weight: bold">
                <tr>
                    <td>{$P.lang['name']}</td>
                    <td>{$P.lang['mail']}</td>
                </tr>
            </thead>
            <tbody>
                {#foreach $T.table as record}
                <tr>
                        <td>{$T.record.name}</td>
                        <td>{$T.record.mail}</td>
                </tr>
                {#/for}
            </tbody>
        </table>
    </textarea>
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see jtemplates has a simple syntax to render data where $T identify the object that contains data to be rendered. The template engine supports many constructs: foreach, if, and many other ones. To actually render something you need to assign the above template to a div:

{{< highlight csharp "linenos=table,linenostart=1" >}}
$(".jTemplatesTest").setTemplateElement("template");
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Assigning a template is just a matter of selecting a wrapped-set and then assign the template passing the id of the textarea that contains the template. Now the div has a template assigned, to render something you need only to fire the template engine passing it the object that contains data to be rendered. It is accomplished with the function processTemplate(data). The data is a simple javascript object that will be substituted to the $T object inside the template.

This is not the only way to set a template, the other one is using setTemplateURL and processTemplateURL that actually gets the template from an URL and render it with a json object returned from the url passed to processTemplateURL. If this sounds you interesting, think to asp.net mvc, where you can create a controller that manages templates, and other controllers that returns data with JsonResult. If you structure the site in this way, you can maximize performance passing only json data with the server. You only need to render the page with empty divs, assign template to the div, and finally gets data to be rendered from the server.

Actually Iâ€™m experimenting with the PhotoAlbum application I did for the jQuery workshop of our usergroup DotNetMarche, as soon as possible Iâ€™ll begin to post some concrete code that works with client-side rendering, showing you pratical example that uses this technique.

alk.

Tags: [jQuery](http://technorati.com/tag/jQuery) [jtemplates](http://technorati.com/tag/jtemplates) [Asp.net MVC](http://technorati.com/tag/Asp.net%20MVC)
