---
title: "Set a wait image with JQuery for asyncronous operations"
description: ""
date: 2009-03-26T08:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
I'm modifying an ASP.NEt site to achieve better performances, I'm actually moving some operations client-side with jquery. A typical pattern is to issue requests to a webservice instead of making a postback of the whole page. Here is a typical situation, I have a lot of rows in a grid and the user must be able to change some values.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image4.png)

A standard asp.net approach uses an autopostback dropDownList to do a postback when the user change a value, but this force the server to render the  **whole page again**. This is a tremendous waste of resource, because the page has a big viewstate. The obvious solution is to use JQuery or some other client side script library to invoke a webservice function. I use a simple JQuery script that hides all the dropDownList and insert a click handler on the value, in this way when the user click on a value the dropdownlist appears.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image5.png)

The layout is much more clearer, beacuse all the dropdownlists disappeared, and they are shown only when the user want to change a value. When the user changes value I simply call a webservice function that does all the stuff, and update the interface accordingly. Since the response type from the webservice cannot be estimated (this operation sometime can trigger a massive update of thousands of records  ) I need to inform the user that the operation is in progress. This is a very common pattern, so I decided to create a little JQuery extension to manage this. Here is how I use it

{{< highlight javascript "linenos=table,linenostart=1" >}}
$('select[id$=ddlMassiveAvgDomainContext]')
  .hide()
  .change(function() {
      $(this).parent().setwait({waitoffset: 1000});
      //Qui Ãƒ ¨ dove debbo aggiornare il servizio
      Rilevazioni.MassiveUpdateTargetContext(
      $(this).attr('relid'),
      $(this).val(),
       function(result, context, method) {
          $(context).parent().clearwait();
          var labelRelated = $(context).toggle()[0].data;
          $(labelRelated).text(result);
       },
      function(error, context, method) {
         $(context).parent().clearwait();
         alert('Si sono verificati errori.');
         $(context).toggle();
      },
      this);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Th code is really simple, I select all the dropdownlist of interest, then hide them all, then wire the change event. Inside the event I grab the div that contains the cell with $(this).parent() and use my  **setwait** extension, specify an offset of one second, this means that if the server answer before one second nothing is shown, if more than one second elapses a wait image get shown. When the webserver returns I call  **clearwait** to return the DOM to the original state. Here is what happens

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image6.png)

I show two div, one with 0.5 opacity and white background, and then another div with a gif image as background. Now the user is informed that the server is working. Here is the code of the extender.

{{< highlight javascript "linenos=table,linenostart=1" >}}

(function($) {

   $.fn.setwait = function(options) {
      var settings = $.extend({
         slidecss: 'waitindicatormasx',
         imagecss: 'waitindicator',
         waitoffset: 200
      }, options || {});
      var context = this;
//      debugger;
      context[0].timer = setTimeout(function() {
         var position = context.position();
         var thediv = context;
         var innerslide = $('<div style="width:' + thediv.width() + 'px; height:' + thediv.height() + 'px" class="' + settings.slidecss + '" />')
           .css('opacity', 0.5);
         var progress = $('<div style="width:' + thediv.width() + 'px; height:' + thediv.height() + 'px" class="' + settings.imagecss + '"/>');
         thediv.prepend(innerslide)
         thediv.prepend(progress);
         context[0].innerslide = innerslide;
         context[0].progress = progress;
      }, settings.waitoffset);
      return this;
   };
})(jQuery);

(function($) {

   $.fn.clearwait = function() {
      var context = this[0];
      if (context.timer) {
         clearTimeout(context.timer);
      }
      if (context.innerslide) {
         $(context.innerslide).remove();
         $(context.progress).remove();
      }
      return this;
   };
})(jQuery);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And these are the two basic css.

{{< highlight css "linenos=table,linenostart=1" >}}
.waitindicatormasx 
{
   position: absolute;
   background-color: White;
   z-index: 2;
}

.waitindicator 
{
   position: absolute;
   background-image: url(Images/autocomplete.gif);
   background-repeat: no-repeat;
   background-position:center;
   z-index: 3;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I have not fully tested it, but it worked well in three different places of the software so I'm quite happy of it. This code simply fires a timer, if the timer elapsed the extender creates two div and prepend them to the target div. The clearwait simply clears the timer (so if the server answer before elapsed time nothing happens), then remove from the dom the two inserted div and everything is back to the original state.

Jquery is really a powerful tool, and a thanks to my friend [Andrea Balducci](http://dotnetmarche.org/blogs/andreabalducci/) for giving me the original idea of the timer to avoid setting the wait state if the server responds quickly.

alk.

Tags: [JQuery](http://technorati.com/tag/JQuery) [Asp.NET](http://technorati.com/tag/Asp.NET)
