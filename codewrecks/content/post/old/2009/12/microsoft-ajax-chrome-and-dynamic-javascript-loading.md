---
title: "Microsoft Ajax Chrome and dynamic javascript loading"
description: ""
date: 2009-12-04T15:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
In a site I need to dynamically load a javascript from javascript code, and I used this function.

{{< highlight jscript "linenos=table,linenostart=1" >}}
function AddScriptTag(src) {
var node = document.getElementsByTagName("head")[0] || document.body;
if (node) {var script = document.createElement("script");script.type = "text/javascript";script.src = srcnode.appendChild(script);
} else {document.write("<script src='" + src + "' type='text/javascript'></script>");
}
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now my problem is the following, one of the dynamically loaded script is made with microsoft ajax, and it uses namespace and class like piece of code. In a page I call one of this class in this way.

{{< highlight xml "linenos=table,linenostart=1" >}}
<script type="text/javascript">

        var multiSelector = new NSxxxx.MultiSelector('nselected', <%= MultiSelectionStatus %>);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok, this is quite old code that is still in production, I really do not like using javascript this way, but at the time this code was written, this was the solution of choiche. The problem is that everything works fine, except in Chrome, where I have an error of type â€œNSRilevazioni is undefinedâ€.

This is due to the fact that when this piece of script gets loaded, the NSRilevazioni script is loaded with the above function, but it still not executed, so the namespace is not registered. Too bad.

A quick and really dirty solution is the following one.

{{< highlight xml "linenos=table,linenostart=1" >}}
<script type="text/javascript">

    function InitializeNSxxxx() {
        if (typeof(NSxxxx) == 'undefined') {
            setTimeout(InitializeNSxxxx, 100);
            return;
        }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is REALLY DIRTY :), I simply check if the NSRilevazioni namespace is still undefined, and if it is still unregistered I simply fire again the same function to be executed after 100 milliseconds.

Dirty but it works until I have time to pay this technical debt and translate everything to jQuery.

alk.
