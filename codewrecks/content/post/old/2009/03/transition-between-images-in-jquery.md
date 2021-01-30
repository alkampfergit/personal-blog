---
title: "Transition between images in jQuery"
description: ""
date: 2009-03-31T13:00:37+02:00
draft: false
tags: [JQuery]
categories: [JQuery]
---
Sometimes it is needed to change an image into another image, if possible with a smooth transiction. There are a lot of solution to the problem, but one of the simpliest approach is using the background of a containing div. Here is a possible and really raw solution

{{< highlight javascript "linenos=table,linenostart=1" >}}
(function($) {

   $.fn.transictionto = function(options) {
      var settings = $.extend({
   }, options || {});
   //wrap into div if no div is present.
   $(this).each(function() {
      if ($(this).parent('div').size() == 0) {
         $(this).wrap('<div></div>')
      }
      //now swap with background trick
      $(this)
     .parent()
        .css('background-image', 'url(' + settings.destinationImage + ')')
        .css('background-repeat', 'no-repeat')
     .end()
     .fadeOut(1000, function() {
         this.src = settings.destinationImage;
         $(this).show();
      });
   });
};
})(jQuery);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the code is really simple, first of all if the image is not contained in a div I wrap it into a div. This can change a little the layout of the page, so I suggest for every image that need to be swapped with another image to be originally enclosed in a div to make the transition happens. Next I set the new image as the div background, set the background-repeat to â€œno repeatâ€, then fade out the original image. When the original image fades out it slowly merge with the new image into the background. Finally when the fading out is completed I change the source of the image and finally show the image again.

You can use this plugin with great easy.

{{< highlight javascript "linenos=table,linenostart=1" >}}
 <script type="text/javascript">
      $(function() {
      $('input').click(function() {
            $('img').transictionto({ destinationImage: '/Images/photo2.jpg' });
         });
      });
   </script>

</head>
<body>
   <img src="../Images/photo1.jpg" />
   <div style="float: left;">
      <img src="../Images/photo3.jpg" /></div>
   <input type="button" value="PressMe" />
</body>
</html>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This page contains only two images, the first is not enclosed in a div. It contains a simple button and thanks to jQuery I make a call to trasictionto plugin for each image in the page. The result is that both images gracefully transiction to destination image :D. It is amazing how jQuery can accomplish such a beautiful task in few lines of code.

alk.

Tags: [jQuery](http://technorati.com/tag/jQuery)
