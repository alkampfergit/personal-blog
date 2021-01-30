---
title: "AspNET 20 CustomValidator and Client script validation"
description: ""
date: 2007-07-18T08:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
When it’s time to validate the user input on an asp.net page the validators control come to the rescue. If you want to do some custom validation that is not supported by the standard validator controls that ship with asp.net 2.0 you can resort to use asp:CustomValidator. Let’s do a little example on how to build a CustomValidator to check the text length of a textbox, useful I need to be sure that that the user insert a string whose length is between two values. First of all here is the declaration of the control on the page.

&lt;asp:CustomValidator  
ControlToValidate=”txtBoxData”  
ID=”valLength”Display=”Dynamic”  
runat=”server”CssClass=”lblError”  
ErrorMessage=”MyValidator”  
OnServerValidate=”ValidateLength”  
min=”5″max=”15″  
ClientValidationFunction=”CheckLen”&gt;&lt;/asp:CustomValidator&gt;

As you can see the control simply defines the function that is called during a server validation with OnServerValidate attribute, the function is really simple and is not worth to show here. To enable client side validation I need to specify a javascript function with ClientValidationFunction attribute, and also, as you can see, I added the two attributes min and max, that are signaled as warning in the designer but are useful to specify minimum and maximum length for the string contained in the textbox. Here is the client side javascript function that does the validation.

&lt;scriptlanguage=”JavaScript”&gt;  
//&lt;!–  
function  CheckLen(sender,  args)  
{  
var  min;  
var  max;  
        min  =  sender.attributes[‘min’].nodeValue;  
        max  =  sender.attributes[‘max’].nodeValue;  
        args.IsValid  =  args.Value.length  &gt;=  min  &&  args.Value.length  &lt;=  max;  
}  
//  –&gt;  
&lt;/script&gt;

The function is really simple, just retrieve the min and max value from the attributes of the sender and check against the args.Value.length that contains the length of the string to validate. To tell asp.net infrastructure code the result of the validation, simply set the value of args.IsValid to either true or false. If you need to set the min and max value from server code you can add dynamically attributes to the validator.

valLength.Attributes.Add(“min”,  “5”)  
valLength.Attributes.Add(“max”,  “15”)

CustomValidator will bring you all the infrastructure code needed to create a validator, leaving to you the task to only create the server side validation function and a client validation functions that is needed only if you want to leverage the client side validation for the page.

Alk.
