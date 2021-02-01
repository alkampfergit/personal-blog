---
title: "Force databinding update in Winform without waiting for lose focus"
description: ""
date: 2010-01-14T09:00:37+02:00
draft: false
tags: [Winforms]
categories: [NET framework]
---
I have a winform application where the user can select an element into a grid, edit its properties, and then decide if the modification should be saved or rejected. Thanks to binding, IEditableObject and INotifyPropertyChanged, writing such feature is a breeze, but the user signaled me that something was wrong. He told me: â€œsuppose you choose an element, then change a value in the combo, nothing happens. When I press tab or move the â€œSaveâ€ and â€œCancelâ€ button become visible, but I wanto them to be visible as soon as I press a char into textbox or change a value in the combo.

The user does not like this approach, he explicitly asked me to show â€œSaveâ€ and â€œCancelâ€ button when someone change a value and keep them hidden otherwise, but he does not like the need to focus change to make them visible. The solution was really simple, you need to intercept some events to force binding update whenever you want.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private void txtAction_TextChanged(object sender, EventArgs e)
{
    txtAction.DataBindings["Text"].WriteValue();
}

private void cmbActionStatus_SelectedValueChanged(object sender, EventArgs e)
{
    cmbActionStatus.DataBindings["SelectedValue"].WriteValue();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this code I'm simply intercepting the change in the texbox and the change in selected value of the combo, then I can simply use the DataBindings array that each control has, to find the Binding object related to the bound property (Text for textbox, and SelectedValue for combo), and simply call WriteValue() method.

With this code, all my binding logic is aware of change as soon as the user type some char into the textbox or change the value of a combo.

alk.

Tags: [Winforms](http://technorati.com/tag/Winforms) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
