---
title: "Change style of user controls with css"
description: ""
date: 2007-05-31T03:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Thanks to Guardian for the suggestion on this tip, I’m not really a stylesheet guru :D.   
The problem is this, I have an ASP.NET *user control* and I want to show it with two different styles in the same page. I looked into some asp.net forums and I found some examples of peoples that changes SkinId at runtime or did some other tricks, but a much better solution is to use css. In code [Example](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2007/05/usercontrolformatting.zip "Example") attached to this post I show how to format single instances of user control with the only support of css. First of all This is the code of my user control, a simple label with a textbox.

&lt;asp:LabelID=”Label1″runat=”server”Text=”Description”CssClass=”labelDefault”/&gt;  
&lt;asp:TextBoxID=”TextBox1″runat=”server”CssClass=”textboxDefault”/&gt;

As you can see I simply use a style *labelDefault* for the label and a *textboxDefault* for the textbox. For my site the default aspect is red so I use this base css.

.labelDefault  
{  
color:  #FF0000;  
font-weight:lighter;  
}

.textboxDefault  
{  
border-color:#FF0000;  
border-width:  2;  
}

Nothing special :D. Now my objective is to create a page with an instance of this user control with default red style and another instance with a different style that will show everything in blue color. The code of the aspx page is the following.

&lt;div&gt;  
&lt;uc1:MyControlID=”MyControl1″runat=”server”&gt;&lt;/uc1:MyControl&gt;  
&lt;/div&gt;  
&lt;divclass=”bluestyle”&gt;  
&lt;uc1:MyControlID=”MyControl2″runat=”server”&gt;&lt;/uc1:MyControl&gt;  
&lt;/div&gt;  
  
As you can see I simply enclose the second instance of the user control in a div  **with a style called bluestyle**. Now here is the magic part, the css styles to format only the second instance of user control:

.bluestyle.labelDefault  
{  
color:  #0000FF;  
font-weight:lighter;  
}

.bluestyle.textboxDefault  
{  
border-color:#0000FF;  
border-width:  2;  
}  
  
It works as following, let’s consider the first style called *.bluestyle.labeldefault,*since it has a double name it  
will be applied to every object that satisfies these two conditions: has the *labelDefault* style applied and is enclosed in an object with style *bluestyle*. With this technique you can change the style of a user control simply enclosing in a div with different css style, this result is achieved only with the use of css styles, no SkinId, no procedural code and no strange tricks :D.

Alk.
