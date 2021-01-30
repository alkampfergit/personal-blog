---
title: "Again on dynamic control creation in aspnet 20"
description: ""
date: 2007-05-17T10:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
In a [previous post](http://www.nablasoft.com/Alkampfer/?p=38) I explain best practices to follow when dealing with dynamic controls in asp.net 2.0, but I missed one important point. Try to insert this snippet of code in a blank page

ProtectedSub  Button1\_Click(ByVal  sender  AsObject,  ByVal  e  As  System.EventArgs)  
        Trace.Warn(“clicked  button  “  +  DirectCast(sender,  Button).Text)  
EndSub  
  
ProtectedSub  Page\_Load(ByVal  sender  AsObject,  ByVal  e  As  System.EventArgs)  HandlesMe.Load  
        CreateButtons()  
EndSub  
  
PrivateSub  CreateButtons()  
  
IfNotMe.IsPostBack  Then  
Dim  button  AsNew  Button  
              button.Text  =  “Bottone  che  poi  scompare”  
AddHandler  button.Click,  AddressOf  Button1\_Click  
              Page.Form.Controls.Add(button)  
EndIf  
Dim  button2  AsNew  Button  
        button2.Text  =  “Button2”  
AddHandler  button2.Click,  AddressOf  Button1\_Click  
        Page.Form.Controls.Add(button2)  
EndSub

In this code we create two buttons dynamically during the get of the page, but in each subsequent post only one button gets created, because IsPostBack is true. The behavior of the page can be surprising, pressing “button2” the first time does not fire the Click event, but subsequent clicks work as ususal. The problem is due to the fact that during the first rendering there are two buttons on the page, the first click does the first post on the page, now the code creates only one button and when the asp.net engine check the post variables to look for any event to be generated find this post variables (Sniffed with Fiddler).

\_\_VIEWSTATE=/wEPDwUJNzgzNDMwNTMzZGQ=

Ctl23=Button2

As we can see the button is called *ctl23* because it does not have an id, but when the page render in the first postback the first button does not gets rendered, so the button with text “Button2” now has Id *Ctl22*, and no event can be generated. In subsequent call the name of the control does not change so no problems happen. As a proof of this theory try to create the two buttons in this way.

Dim  button2  AsNew  Button  
        button2.Text  =  “Button2”  
AddHandler  button2.Click,  AddressOf  Button1\_Click  
        Page.Form.Controls.Add(button2)  
IfNotMe.IsPostBack  Then  
Dim  button  AsNew  Button  
              button.Text  =  “Bottone  che  poi  scompare”  
AddHandler  button.Click,  AddressOf  Button1\_Click  
              Page.Form.Controls.Add(button)  
        End  If

The only differences is that the button that gets created only in the first call now is created after the button with text “Button2”, this means that the id of the button with text “button2” is *Ctl22* at each post and all works as expected.

The obvious solution to this kind of problems is to *assign an unique ID to each dynamically generated control* so the id in the page will be unique and no problem will arise if controls tree change at each postback.

Alk.
