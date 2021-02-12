---
title: "Microsoft Ajax ScriptManager and AspNet MVC"
description: ""
date: 2009-04-05T10:00:37+02:00
draft: false
tags: [ASPNET,JQuery]
categories: [ASPNET,JQuery]
---
I'm porting a sample application from asp.net to MVC, I used this app to make my session during last DotNetMarche event dedicated to JQuery. Now I'm writing the same sample pages in asp.net mvc to compare both technologies. In an Asp.Net page I showed how to use jQuery to do *Edit in place* of some Photo Description in an application that manages photo album. At a certain point my jQuery script will communicate with the server through an asmx webservice exposed with a ScriptManager.

Now that I'm working in asp.net MVC I'm asking if the same approach is valid, so the question is *I really need the ScriptManager to dialogate with the server?* and clearly the answer is *NO*. I'm not happy of the Script manager, because it generates a lot of Javascript code to create the infrastructure to make the SOAP request to the webserver. If it is possible I really prefer to avoid these external scripts and thanks to ASP.Net mvc this is possible. Here is the original call to the web service.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 DotNetMarche.PhotoAlbum.Ui.AspNet.Services.PhotoManager
.ChangePhotoDescription(photoid, this.value,
 function(result, context, method) {
    //call succeeded
    $(context).parent().clearwait();
    if (result) {
       span.text(context.value);
       context.endedit();
    } else {
       alert('Error during save.');
    }
 },
function(error, context, method) {
  alert('Exception during the save.');
  $(context).parent().clearwait();
}, this);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this code I'm calling the ChangePhotoDescription method of the PhotoManager webService, as usual I pass parameters, then the two callback (success and failure) and the contex. Now that I'm in asp.net MVC all this infrastructure is completely unnecessary, first of all I write this action in the PhotoManagerController.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 [AcceptVerbs("POST")]
 public JsonResult ChangePhotoDescription(Guid photoId, String newPhotoDescription)
 {
    System.Threading.Thread.Sleep(2000);
    return Json(Services.PhotoManagerService
      .ChangePhotoDescription(photoId, newPhotoDescription));
 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I declare that this action accepts only post, I inserted a sleep for demo purpose (Actually I shows that when the server needs time to answer, the ui shows a waiter gif), then I call my business logic (behind a Service) and return the result to the caller as a JSonResult. I've completely eliminated the asmx webservice, now here is the code to call this controller.

{{< highlight csharp "linenos=table,linenostart=1" >}}
$.ajax({
  url: "/PhotoManager/ChangePhotoDescription",
  type: "POST",
  data: {photoId: photoid, newPhotoDescription: this.value},
  success: function (data, textStatus) {
       console.log("%o - %o", data, textStatus);
        if (data) {
           span.text(this.mycontext.value);
            this.mycontext.endedit();
         } else {
            alert('Error during save.');
         }
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
     alert('Exception during the save.');
  },
  complete: function (XMLHttpRequest, textStatus) {
     $(this.mycontext).parent().clearwait();
  },
  mycontext: this
  });{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to jQuery I simply use the [ajax](http://docs.jquery.com/Ajax/jQuery.ajax) method to make a call to the server, the url is composed by /ControllerName/ActionName, with the data parameter I set POST data, that will be passed to the controller action (pay attenction to the name), then I setup the various callback, and finally I insert into ajax options object a custom property called mycontext that contains the actual span I'm modifying.

Thanks to the JsonResult ASp.Net Mvc permits to call controller's action from client code really in a breeze.

alk.

Tags: [asp.net mvc](http://technorati.com/tag/asp.net%20mvc) [jQuery](http://technorati.com/tag/jQuery)
