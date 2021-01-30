---
title: "JQuery your first plugin"
description: ""
date: 2009-03-28T04:00:37+02:00
draft: false
tags: [JQuery]
categories: [JQuery]
---
One of the most interesting feature of JQuery is its extendibility. Writing a plugin is a breeze, and here an example of your first [JQuery](http://jquery.com/) plugin, a logger to the [firebug](http://getfirebug.com/) console.

Firebug is â€œde factoâ€ the best developer tool for web developer Iâ€™ve ever used, and its console logging features are really amazing. Letâ€™s see how it can help [JQuery](http://jquery.com/) progammers.

{{< highlight javascript "linenos=table,linenostart=1" >}}
(function($) {

   $.fn.log = function(msg) {
      if (typeof (console) == "undefined") {
         console = { log: function() { } };
      }
      if (console) {
         console.log("%s: %o", msg, this);
      }
      return this;
   }
})(jQuery);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code can look strange, and this is due to preserve the [no conflict mode](http://docs.jquery.com/Using_jQuery_with_Other_Libraries). Since we like to use the $ you can simply create a function that accepts a single argument called $, then inside that function you can use $ as usual, and finally you immediately invoke the function passing jQuery as argument.  This technique is described in â€œ[JQuery in action](http://www.manning.com/bibeault/)â€, one of the best book Iâ€™ve read.

This extension is really simple, first of all I check if console object is defined, if not I create a console object with a simple log function that does nothing. This is needed to avoid javascript errors in IE or in other browser that have no firebug console.

Then I simply call the log function of firebug console, passing a message and the whole wrapped-set. Now lets see what kind of information we can find in the console. First of all you can log a wrapped-set with little effort.

{{< highlight javascript "linenos=table,linenostart=1" >}}
    $('div[id^=photo] img')
     .log('Images Thumbnail')
     .draggable({
          helper: 'clone',{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I simply select all div with an id that begins with â€œphotoâ€, then I call log and since this is a plugin that does not modify the wrapped-set I can continue to use the wrapped-set as if the log call was not present, in this example Iâ€™m using some drag and drop. Here is what I see in the firebug console.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/03/image7.png)

Actually I have two log, the first is the one showed in the example. as you can see I immediatly check that the wrapped-set contains 6 elements, but I can also expand that log to obtain much more informations.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/03/image8.png)

As you can see you can view details of every object selected in the dom, *when you move the mouse over the element description the elements gets hilited in the page*. This is an invaluable extension that permits you to immediately and visually check DOM selection. I could not believe I can really develop Javascript code without firebug :)

alk.

Tags: [Firebug](http://technorati.com/tag/Firebug) [Jquery](http://technorati.com/tag/Jquery)
