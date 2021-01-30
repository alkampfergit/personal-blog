---
title: "Three state checkbox in aspnet"
description: ""
date: 2010-02-02T09:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Yesterday I need to implement in a quick way a three style checkbox in a project based on asp.net 3.5. The requirements stated that I must not spend too much time designing an entire new control, but the solution should be usable by other people with minimum impact. Here is the result I obtained.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/02/image.png)

The checkbox can be, selected, not selected, or not used and when it is not used it is blue, like the one in windows forms. This was needed to satisfy a requirement, I need to make possible for the user to specify complex filters, and I have boolean fields on my entities where the user can ask for: filter only the one with field==true or field==false or no filter for that field. To achieve the result you can simply use a standard checkbox.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<asp:CheckBox ID="chkCCSignaled" CssClass="threestate" runat="server" />
{{< / highlight >}}

The only stuff you need is that you need to assign the â€œthreestateâ€ style to the checkbox. (this satisfy the need of the minimuym impact, other developers that want to use that checkbox can simply add that css to a standard checkbox). The dirty work is done by an unobtrusive jquery javascript that gets injected with the masterpage.

{{< highlight csharp "linenos=table,linenostart=1" >}}
$(function() {
$('span.threestate')
.log('checkboxes')
.each(function() {
var thespan = $(this);
var checkbox = $(thespan.children().get(0));
var name = checkbox.attr('id') + '_hf';
 
var innerhf = $('<input type="hidden" name="' + name + '" id="' + name + '" />');
thespan.prepend(innerhf);
 
var innerslide = $('<div style="width:' + thespan.width() + 'px; height:' + thespan.height() + 'px" class="chboverlay" />')
.css('opacity', 0.8)
.click(function() {
//debugger;
if (innerhf.val() == 2) {
$(this).css('opacity', 0.0)
checkbox.attr('checked', true);
innerhf.val(1);
} else {
if (innerhf.val() == 1) {
checkbox.attr('checked', false);
innerhf.val(0);
} else {
$(this).css('opacity', 0.8)
checkbox.attr('checked', false);
innerhf.val(2);
}
}
});
var chkvalue = "2";
if (checkbox.parent().attr('threestatevalue') != undefined) {
chkvalue = checkbox.parent().attr('threestatevalue');
if (chkvalue == "0" || chkvalue == "1") {
innerslide.css('opacity', 0.0)
}
}
innerhf.val(chkvalue);
thespan.prepend(innerslide);
});
{{< / highlight >}}

The solution is quite simple, I create a new div with a specific class to overlay the checkbox and create the blue layer when the checkbox is in state â€œundefinedâ€. the tricky part is that I need to manage three possible value for the checkbox and I need to pass that value to the server during a postback, so I create dynamically an hidden input with the same id of the checkbox and the â€œ\_hfâ€ string at the end. In that hidden field I store the actual value of the checkbox, 0 not selected, 1 selected and 2 undefined. The rest of the script is needed to manage the transition between states reacting to the click event of the checkbox.

In the server code I need to grab the three state value, so I created a simple extension method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Namespace SiteCode.V2
Public Module ThreeStateCheckbox
 
<Extension()> _
Public Function GetThreeStateValue(ByVal cb As CheckBox) As Nullable(Of Boolean)
Dim value As String = HttpContext.Current.Request.Form(cb.ClientID + "_hf")
cb.Attributes("threestatevalue") = value
Select Case value
Case "0" : Return False
Case "1" : Return True
Case "2" : Return Nothing
End Select
 
End Function
End Module
End Namespace
{{< / highlight >}}

This simple method is an extension method for the checkbox control, it simply grab the value of the dynamically generated hidden field from the Request.Form collection. After taking actual value, he add the attribute â€œthreestatevalueâ€ to the checkbox, because the client script should be able to restore the state of the checkbox after a postback. Now you can simply get the value with this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Public ReadOnly Property IsCCChecked() As Nullable(Of Boolean)
Get
Return chkCC.GetThreeStateValue()
End Get
End Property
{{< / highlight >}}

With this structure the developer can simply add the css (as seen before) and use this extension method to grab the value, this without the need to author a whole new control.

I used this in a user control (that represents a complex filter and gets used in several pages), and this user control exposes the selection status to external control with readonly property that return Nullable(of Boolean). Thanks to extension method I can simply add the css to the checkbox, use GetThreeStateValue to grab the actual status of the checkbox and the game is done.

alk.

Tags: [asp.net](http://technorati.com/tag/asp.net)
