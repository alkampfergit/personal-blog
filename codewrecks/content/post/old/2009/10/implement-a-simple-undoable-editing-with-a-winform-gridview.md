---
title: "Implement a simple undoable editing with a winform GridView"
description: ""
date: 2009-10-22T06:00:37+02:00
draft: false
tags: [Winforms]
categories: [NET framework]
---
I need to implement a very simple interface, the user loads from a service a certain amount of objects displayed into a gridview. Then selecting an object in the gridview the user can edit object properties in a detail panel situated under the grid. Specification ask me to

1) avoid that the user update some property of the object, then forget to press *Save* button and move to another object forgetting to update data calling the service update function.

2) the system must support an *undo* button that restore the object properties if the user decides not to save changes.

Since the service return Dto objects that supports INotifyPropertyChanged and IEditableObject everything is a breeze. I used a custom MVC structure in winform, where the view use BindingSource objects to bind control to data, and pass BindingObjects to the controller to interact with current object. The first step is intercepting when the users begins editing of an object.

{{< highlight csharp "linenos=table,linenostart=1" >}}
_bsActionList = View.SetListOfAction(ret);
_bsActionList.CurrentChanged += SelectedActionChanged;
ChangeSelectedActionFromList((ActionDto)_bsActionList.Current);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The controller simply set the list of Action to the view, then save the BindingSource (created by designer) then intercept CurrentChanged and fire the ChangeSelectedActionFromList. My view was designed in this way: when controller call SetLisOfAction it assign the list of actionDto to a bindingSource and then returns it to the caller. LEts see how to react at change of current element.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private void ChangeSelectedActionFromList(ActionDto actual)
{
    if (actual != null)
    {
        actual.PropertyChanged += (sender, e) => View.BeginEditOfAction();
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This function simply verify if the current object is different from null, if yes it intercept propertyChanged and call BeginEditOfAnAction in the view.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void BeginEditOfAction()
{
    btn2Update.Visible = true;
    btn2CancelCurrentEdit.Visible = true;
    dgActions.Enabled = false;
}
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The view reacts disabling the grid, so the user cannot move from current record until he choose to save or cancel current editing. Here is the two actions of the controller

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void UpdateAction()
{
    if (_bsActionList.Current != null)
    {
        ActionDto dto = (ActionDto)_bsActionList.Current;
        if (ManagementService.UpdateAction(dto))
        {
            View.ShowMessage("UpdateOk");
            _bsActionList.EndEdit();
            View.EndEditOfAction();
        }
    }
}

public void CancelEditOfAction()
{
    _bsActionList.CancelEdit();
    View.EndEditOfAction();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Update Action simply calls a service to update the action, if the action is successful it show an UpdateOk message then end the edit of the action and the edit of the BindingSource. If the user press cancel simply cancel edit of binding source. This is because my dto object supports both INotifyPropertyChanged and IEditableObject.

Alk.

Tags: [Winforms](http://technorati.com/tag/Winforms) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
