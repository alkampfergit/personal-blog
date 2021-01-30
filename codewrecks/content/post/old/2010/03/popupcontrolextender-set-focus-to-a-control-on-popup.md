---
title: "PopupControlExtender set focus to a control on popup"
description: ""
date: 2010-03-05T16:00:37+02:00
draft: false
tags: [ASPNET]
categories: [General]
---
I have a project with a complex user control used to select some values in hierarchic categories, it was realized with the UpdatePanel, it supports searching, selection by cascade of combo and much more, everything works great, but performances are not so good.

Now I decide to create another version that use jQuery to do real ajax calls and manage json data to maximize performances, but I face a problem

- I need to create a UserControl.
- I can have more than one instance of this user control in a single page (but I want a single jquery script)
- The user want to move the focus on a specific part of my control when the popup opens.

This is an interesting problem, because the popup logic is done with the [PopupControlExtender](http://www.asp.net/AJAX/AjaxControlToolkit/Samples/PopupControl/PopupControl.aspx) and I do not want to change it. My goal is to be able to execute some jQuery code when the popup appears and move the focus on a control contained in the popup. Since Microsoft Ajax library, used by the PCE, creates a client side javascript object for each PopupControlExtender, my first problem is â€œhow can I select the javascript object that correspond to my server side control, when I can have more than one instance of the user control in the page (this means multiple PCE)?

If you know the microsoft ajax library you already know the [$find()](http://www.asp.net/AJAX/Documentation/Live/ClientReference/Global/FindShortcutMethod.aspx) function, and you should know also that you can use a particular property called BehaviorID to give a unique Id to the client part of a component. A partial solution to my problem [can be found here](http://forums.asp.net/t/1440825.aspx) (look in the end of the post). In that post the PopupControlExtender was declared in this way

{{< highlight csharp "linenos=table,linenostart=1" >}}
<AjaxControlToolkit:PopupControlExtender ID="TextBox1_PopupControlExtender" BehaviorID="pce" runat="server"
TargetControlID="tbPrompt" PopupControlID="popupPanel" Position="Bottom">
{{< / highlight >}}

*As you can see the BehaviorID property is set to â€œpceâ€.* Now you can write this client side javascript code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
function pageLoad() {
//find the PopupControlExtender's client behavior
var pce = $find("pce");
//add the shown event handler
pce.add_shown(pceShownHandler);
}
function pceShownHandler(sender, args) {
var pce = $find("pce");
//find the popup Panel of the PopupControlExtender
var popup = pce._popupElement;
var input = popup.getElementsByTagName("input");
for (i = 0; i < input.length; i++) {
// To check whether the TextBox is the "setFocusToMeOnPopup".
// This is just a sample, please modify this condition yourself.
if (input[i].id == "FocusTextBox1_setFocusToMeOnPopup") {
input[i].focus();
input[i].select();
}
}
}
{{< / highlight >}}

As you can verify from line3,*the $find(â€œpceâ€) finds the javascript object that contains the client side scripting function of the PopupControlExtender*, so you can use the  **add\_shown** method *to register a client side script to execute when the popup opens*. If I use the same technique, when I drop two instance of my usercontrol in the page I obtain this javascript error.

> * **Error: Sys.InvalidOperationException: Two components with the same id ‘pce’ can’t be added to the application.** *

The reason is that BehaviorID must be unique in the page. The solution is quite simple, first of all I insert this function in the jQuery script.

{{< highlight csharp "linenos=table,linenostart=1" >}}
function pceShownHandler(sender, args) {
var txtControl = sender._parentElement;
$(txtControl).parents('.hierarchicmaindiv').find('#txtSearch').focus();
}
{{< / highlight >}}

This is the function I want to register with the  **add\_shown** method, it simply get the textbox control with the \_parentElement field of the pce object, then it is time of some magical jQuery selector. *Each of my usercontrol instance is rendered inside a div with the class hierarchicmaindiv*, now I want to find the textbox wiht â€œtxtSearchâ€ id, but I want only the one related to the specific popup.

To reach this goal we need to find the containing div with the parents jQuery function, then with find() function we look for a textbox with the â€œtxtSearchâ€ id but that is also contained in the div. With this little trick Iâ€™m sure that you can drop multiple instance of the control in the page without any problem because when the popup opens, I can find the txtSearch textbox inside the popup even when there are multiple txtSearch textbox in the whole page.

Now I need to wireup this function to the  **add\_shown** method of the popupcontrolextender, and this can be obtained with this little snippet on the PreRender server events of the UserControl

{{< highlight csharp "linenos=table,linenostart=1" >}}
hierarchicPce.BehaviorID = Guid.NewGuid.ToString()
 
Dim script As String = _
"Sys.Application.add_load(function() {" & _
"var pce = $find('" & hierarchicPce.BehaviorID & "');" & _
"pce.add_shown(pceShownHandler);" & _
"});"
 
Page.ClientScript.RegisterStartupScript(Me.GetType(), hierarchicPce.BehaviorID, script, True)
{{< / highlight >}}

To avoid duplication of BehaviorID I use a guid, then I create a stupid and little script that uses Sys.Application.add\_load() method of Microsoft Ajax library  to register a couple of javascript lines of code :), the first finds the PopupControlExtender client side object using the guid assigned to BehaviorId and the second one cals the add\_shown function to register the function to give focus to correct control.

alk.

Tags: [asp.net](http://technorati.com/tag/asp.net) [Microsoft Ajax](http://technorati.com/tag/Microsoft%20Ajax)
