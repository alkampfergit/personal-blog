---
title: "Dynamic creation of controls in aspnet 20"
description: ""
date: 2007-05-16T11:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Today I was [discussing with a friend](http://blogs.ugidotnet.org/crad/archive/2007/05/16/78405.aspx) about dynamic creation of control in asp.net 2.0 pages. It comes out that the matter is not so easy. The first question is when the controls must be created to work correctly in page lifecycle? The story start with this snippet

protectedvoid  Page\_Load(object  sender,  EventArgs  e)  {  
this.form1.Controls.AddAt(0,  newButton());  
if  (!IsPostBack)  {  
        DropDownList1.Items.Add(“Value  1”);  
        DropDownList1.Items.Add(“Value  2”);  
        DropDownList1.Items.Add(“Value  3”);  
  
  }  
}

This code is wrong, if you run the page you can see that when the button is pressed the dropdownlist does not retain the values from the viewstate. The problem arise from the fact that asp.net 2.0 engine restore controls value from the viewstate following the ordinal position of the controls in the form. In the above example, at load we creates a button that is inserted as the first control of the form, subsequently viewstate is created. At this moment page layout has one button at position 0 and a ddl at position 1. When we do a postback, before load the asp.net engine restore the viewstate, but since restoration is done by ordinal position, at this moment the button is not still created, so the viewstate of the button is restored on the ddl. Possible solution are:

Create  the controls in page\_init event, in this way all dynamic controls are created when the viewstate is restored. This approach has the side effect that in init event the viewstate cannot be accessed because is not still restored

Add the control at the end of the page, so the order of controls does not change.

Use a placeholder or a panel control, position the placeholder where you want the control to be created and then add the control to controls collection of the placeholder.

Solution number 3 is the best, you can choose where to position the dynamic control and you can create the control on load event, when the viewstate was restored and all other control can be accessed without problem. A little question remains, how can a control created after the restore of the viewstate can retain its value between postback? [Lutz Roeder’s Reflector](http://www.aisto.com/roeder/dotnet/) comes to help. If you check the add method of ControlsCollection class you can notice that this function calls AddedControl() method of the owner control. This means that when we add a button inside a placeholder the AddedControl of the placeholder gets called. Inside the AddedControl we can see that the viewstate of the added control gets restored explicitly, so it can work as expected.

When you need to create dynamic control in a page, to avoid any problem, use placeholder controls to host dynamically created controls.

Alk.
