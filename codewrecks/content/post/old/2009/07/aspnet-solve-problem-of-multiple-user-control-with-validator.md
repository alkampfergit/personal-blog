---
title: "Aspnet solve problem of multiple user control with validator"
description: ""
date: 2009-07-09T08:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
The problem is described in [this post](http://forums.asp.net/p/1402608/3040712.aspx), basically it can be summarized in *you have a user control with validators, you put more than one instance of the user control in a page, all validators are fired together*

The above post already gives a solution, but is not a general one. I want to avoid the need to go into the user control and tweak with validators, so I came up with this little solution

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static void AssignValidationGroup(Control rootControl)
{
    AssignValidationGroup(rootControl, rootControl.ID);
}

private static void AssignValidationGroup(Control control, String rootName)
{
    if (control is BaseValidator)
    {
        ((BaseValidator) control).ValidationGroup = "vg_" + rootName;
    } else if (control is Button)
    {
        Button thebtn = (Button) control;
        thebtn.ValidationGroup = "vg_" + rootName;
    }
    else if (control is ValidationSummary)
    {
        ValidationSummary theSummary = (ValidationSummary)control;
        theSummary.ValidationGroup = "vg_" + rootName;
    }
    foreach (Control child in control.Controls)
    {
        AssignValidationGroup(child, rootName);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The function AssignValidationGroup accepts a Control, then it iterates recursively into inner controls, and for each control that descends from BaseValidator, it assign a group name based on the id of the root control. Now in the load event of a page that instantiate more than one instance of a user control with validator I can write.

{{< highlight csharp "linenos=table,linenostart=1" >}}
WebUtils.AssignValidationGroup(MyUserControl1)
WebUtils.AssignValidationGroup(MyUserControl2){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This automatically assign different validation group to both the user control.

alk.

Tags: [asp.net](http://technorati.com/tag/asp.net)
