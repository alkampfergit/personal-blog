---
title: "Create a list of attachments with jQuery and ajax calls"
description: ""
date: 2009-04-09T09:00:37+02:00
draft: false
tags: [JQuery]
categories: [JQuery]
---
Iâ€™ve found [this exceptional component](http://valums.com/ajax-upload/) to do file upload with jQuery and ajax call. I have a page where I need to edit a domain entity that have a property of type List&lt;FileAttach&gt;, and I need to permit to the user to easily add and remove attachments. The asp.net webform where this control resides is quite complex, so I really want to avoid a full page postback each time the user want to Add, remove or download an attachment.

My technique is quite simple, I created a page called AttachmentAjaxAction.aspx, this pages have two main functions, the first is to render a grid with all the attachments of related entity, the other is to add or remove an attach from the list. It accepts some parameter in post, and it does all the work in the load event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
      Dim command As String = Request.Form("command")
      Dim entityid As Guid = New Guid(Request.Form("relid"))
      Dim service As New InterventionService

      If command = "add" Then
         Dim attach As New FileAttach()
         attach.FileName = Request.Files(0).FileName
         Dim buffer(8192) As Byte
         Dim read As Integer
         read = Request.Files(0).InputStream.Read(buffer, 0, buffer.Length)
         Using ms As New MemoryStream
            While read > 0
               ms.Write(buffer, 0, read)
               read = Request.Files(0).InputStream.Read(buffer, 0, buffer.Length)
            End While
            attach.FullContent = New FileAttachData()
            attach.FullContent.Data = ms.ToArray()
         End Using
         service.AddAttachmentToIntervention(entityid, attach)
      ElseIf command = "del" Then
         Dim attachid As Guid = New Guid(Request.Form("attachid"))
         service.DeleteAttach(entityid, attachid)
      End If
      Dim interventino As DomainIntervention = service.GetInterventions(domaininterventionid)
      grdIntervention.DataSource = interventino.Attachments
      grdIntervention.DataBind(){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is really simple, all parameters are passed in post variables, when the action is â€œaddâ€ I need to check the request.Files collection because this indicates that a file was uploaded to the server, when the action is â€œdelâ€ I simply delegate to the service the task to delete the attach. Finally after all operations are completed the page renders the whole grid. Files are stored in its binary form directly in the database (to use full text search). Now in the main page, I simply place a div where I want this grid to be shown.

{{< highlight xml "linenos=table,linenostart=1" >}}
 <asp:Panel ID="pnlAttachments" runat="server">
      <h3>Attachments</h3>

     <div id="attachmentgrid" relid='<%# Eval("Id") %>' style="min-height:100px;min-width:300px;"><h2>Attendere caricamento lista attach in corso</h2>
     </div>
      <input id="btnUpload" relid='<%# Eval("Id") %>' type="button" value="Aggiungi" />
   </asp:Panel>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I simply create an header, a div and an html button both with the attribute relid equal to the id of the entity we are managing. Now it is time for jQuery to wire everything with a simple script. In the first part I wireup the plugin used to upload the file

{{< highlight javascript "linenos=table,linenostart=1" >}}
$(document).ready(function() {
   if ($('#btnUpload').size() == 1) {
    new AjaxUpload('#btnUpload', {
      action: 'AttachAjaxAction.aspx',
      name: 'uploadedfile',
      data: {
         relid: $('#btnUpload').attr('relid'),
         command: 'add',
      },
      autoSubmit: true,
      responseType: false,
      onChange: function(file, extension) { },
      onSubmit: function(file, extension) { 
         $('#attachmentgrid').setwait();
      },
      onComplete: function(file, response) {
         $('#attachmentgrid').clearwait();
         var content = $($(response).html()).filter('div[id=thecontent]');
         $('#attachmentgrid').html(content.html());
         rewire();
      }
   });
  }
  loadAttachmentAjax('', '');
});{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to the [ajax-upload](http://valums.com/ajax-upload/) plugin, uploading a file is a breeze, first of all in the onSubmit I call one of my extension named setwait, that greys out the div containing the list of attachment, command is â€˜addâ€™ and when the calls succeded the funcion onComplete clear the waiting gif, parse the result of the page (remember that my AttachAjaxAction.aspx renders the grid after it performed desidered action.), filter to find the div with id â€˜the contentâ€™ and substitute all html into the div that shows the grid. The rewire function is used to wire up some events. The last line calls a funcion named loadAttachmentAjax to load the grid the first time.

{{< highlight jscript "linenos=table,linenostart=1" >}}

function loadAttachmentAjax(cmd, atid) {
   $('#attachmentgrid')
     .setwait()
     .load(
         'DomainInterventionAjaxAction.aspx #thecontent',
         { relid: $('#attachmentgrid').attr('relid'), command: cmd, attachid: atid}, 
         rewire);
}

function rewire() {
   //Rewire 
   $('img.deleteattach').click(function() {
      loadAttachmentAjax('del', $(this).attr('relid'));
   });
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

These two function are really simple, the first one simply uses the load jQuery function to load the grid the first time, the rewire simply adds click functionality to the image used to remove attachment.

The result is a much more interactive page, where the user can add, remove and download attachments without a single postback.

alk.

Tags: [jQuery](http://technorati.com/tag/jQuery)

Tags: [FileUploader](http://technorati.com/tag/FileUploader)
