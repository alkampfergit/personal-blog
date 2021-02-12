---
title: "Asp net and an HiddenField inside a disable panel"
description: ""
date: 2010-04-15T10:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
I've hit a strange behavior of Hidden Field inside a disable asp.net panel, here is a simplified scenario that can reproduce my problem:

{{< highlight csharp "linenos=table,linenostart=1" >}}
<form id="form1" runat="server">
<asp:HiddenField ID="hf1" runat="server" />
<asp:TextBox ID="tb1" runat="server"></asp:TextBox>
<asp:Panel ID="Panel1" runat="server" Enabled="false">
<asp:HiddenField ID="hf2" runat="server" />
<asp:TextBox ID="tb2" runat="server"></asp:TextBox>
</asp:Panel>
<asp:Label ID="Label1" runat="server" Text="Label"></asp:Label>
<asp:Button ID="Button1" runat="server" Text="Button" />
</form>
{{< / highlight >}}

This is a simple piece of code with two textbox, and two hidden fields, but the important aspect is that two of them are inside an asp:panel that has disabled=*true*. Then I have a label and a simple Button. Here is the code behind.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Public Sub PageLoad(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
If (Page.IsPostBack = False) then
hf1.Value = "HF1"
hf2.Value = "HF2"
tb1.Text = "TB1"
tb2.Text = "TB2"
End If
End Sub
 
Protected Sub Page_PreRender(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreRender
Label1.Text = "hf1=" & hf1.Value & "<br /> hf2=" & hf2.Value
End Sub
{{< / highlight >}}

The code set values for all controls in the pageLoad, only at the first call, while in PreRender I dump the content of the hiddenfield in a label to have a visual clue of what is happening. This is the page when it is loaded for the first time.[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image11.png)

Now I cause a postback pressing the Button, and the output become

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image12.png)

While the two texboxes mantain the value that I set by code in pageLoad, the  **hidden field inside the disabled panel has lost his value**. The key to understand this behavior is to have a first look with fiddler at the request issued when the button is pressed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image13.png)

Clearly the browser send the content of the HTML Web Form and *it sends only the value for enabled control*, but how can the disabled textbox retain its value if the value is not passed with Request.Form parameters? The answer is: ViewState. Thanks to [Web Developement Helper](http://projects.nikhilk.net/WebDevHelper) I can inspect viewstate

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image14.png)

As you can verify the content of the Disabled textbox is placed in viewstate, so it can be restored during a postback, but for the hiddenField, the value is not present in the viewState so the value is lost between postback because it is disabled.

This is the problem I have in a control that I've developed, I use hidden field to communicate value to jQuery script, but when the user control is disabled, if I set a value by code in the hiddenField, value is null at the next postback, because the value is not passed with request.form nor it is inserted in the viewstate.

A solution to this problem can be found if you notice that even the first textbox does not have the text value stored in ViewState. This happens because the asp.net engine does not need it, because the value of the textbox can be retrieved from post parameters. Now if you add this handler to the code behind

{{< highlight csharp "linenos=table,linenostart=1" >}}
Protected Sub tb1_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles tb1.TextChanged
ischanged = true
End Sub
{{< / highlight >}}

the asp.net engine need to know if the user changed the value of the textbox to raise the event and the situation is really different. If you take a look at viewstate

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image15.png)

value of Text property of the first texbox is now in the viewstate because asp.net engine needs it to understand when to raise textboxchanged event. This bring me the solution for hiddenField, because I can simply handle the event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Protected Sub hf2_ValueChanged(
ByVal sender As Object,
ByVal e As System.EventArgs) Handles hf2.ValueChanged
End Sub
{{< / highlight >}}

Now asp.net insert the value of the Value property of HiddenField in the viewstate, because he needs to manage the ValueChanged event and the value of the HiddenField is persisted even if it is contained in a disabled Panel.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image16.png)

Alk.

Tags: [Asp.Net](http://technorati.com/tag/Asp.Net)
