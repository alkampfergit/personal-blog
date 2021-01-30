---
title: "Reference a user control from appcode"
description: ""
date: 2007-07-03T08:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
User controls are one of the most useful features of ASP.NET, but they can generate problems with dynamic generation. Suppose you create a user control and then wants to dynamically create instances of that control and reference some specific properties or method of the control itself. If the code is in another user control there is no problem, just use a @register page directive and no problem, here is an example

&lt;%@Register  
Src=”~/BackOfficeControls/ModularData/ModularDataSection.ascx”  
TagName=”ModularDataSection”  
TagPrefix=”mdc”%&gt;

Whith this directive I’m telling to ASP.NET that in this control I will reference ModularDataSection.ascx user control, this permits me to write code like this in code behind file

Dim  cnt  As  Control  =  page.LoadControl(“~/BackOfficeControls/ModularData/ModularDataSection.ascx”)  
Dim  modcont  As  BackOfficeControls\_ModularData\_ModularDataSection  
modcont  =  TryCast(cnt,  BackOfficeControls\_ModularData\_ModularDataSection)

I can reference the class that implements the control with the name *BackOfficeControls\_ModularData\_ModularDataSection*because the @register directive put that class in scope. The problem arise when I try to move the previous snippet in a class in *app\_code* directory. Code in app\_code directory cannot use @register directive, nor it can reference class behind code for user control. A solution of this problem is to define an interface in app\_code directory that contains all the properties and methods that you need to access on the user control

PublicInterface  IModularDataSectionUserControl  
Property  BaseControlDir()  AsString  
Sub  InitData(ByVal  sectionId  AsInteger,  ByVal  linkId  As  Nullable(OfInteger))  
EndInterface

Then you make your user control implement this interface, and in app\_code you can write classes that dynamically instantiate the control and works through the interface.

Dim  cnt  As  Control  =  page.LoadControl(tab.ControlPath)  
Dim  modcont  As  EasyCv.UserControl.IModularDataSectionUserControl  
modcont  =  TryCast(cnt,  EasyCv.UserControl.IModularDataSectionUserControl)  
If  modcont  IsNotNothingThen  
Dim  sect  As  Actvalue.ModularData.Entities.Section  =  DirectCast(tab.Tag,  Actvalue.ModularData.Entities.Section)  
modcont.BaseControlDir  =  “~/BackOfficeControls/ModularData/”  
modcont.InitData(sect.Id,  cvid)  
EndIf

In this way you can access specific properties and method of the user control because they are exposed through an interface shared in the app\_code directory.

Alk.
