---
title: "WatiN and weird names of aspnet controls"
description: ""
date: 2007-05-30T00:00:37+02:00
draft: false
tags: [ASPNET,Testing]
categories: [ASPNET,Testing]
---
Asp.Net gives to HTML controls weird names, composed by the hierarchy of control used to generate the page. This causes problems for example writing WatiN test, because we cannot use Find.ById or use the Id of the control, because if we will change the layout of the page the name of the controls will change.

One of the possible solution is to use regular expression, using a regex that will search for controls that ends with a specific string value. To easy the use of this method we can realize a simple helper class.

publicclassAspNetControlFinder  :  WatiN.Core.Attribute  {  
  
public  AspNetControlFinder(String  controlName)  
        :  base(“id”,  new  System.Text.RegularExpressions.Regex(“.\*”  +  controlName))  {  
  }  
  
publicstaticAspNetControlFinder  Find(String  controlName)  {  
returnnewAspNetControlFinder(controlName);  
  }  
}      
This is really a simple class that inherits from Attribute class of WatiN library, that supports natively the option to search with regular expression. Our class has a simple constructor that accepts control name, it calls base constructor telling Attribute class to search for “id” addribute and use a regex “.\*”+controlName that simply means *Any control whose id ends with controlName*. We include a Factory Method to make this class more usable. Now we can write this test

browser.TextField(AspNetControlFinder.Find(“TextBox1”)).TypeText(“19”);

The syntax is very straightforward and it works J

Alk.
