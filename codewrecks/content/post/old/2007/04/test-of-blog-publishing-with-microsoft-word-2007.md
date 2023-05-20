---
title: "Test of blog publishing with Microsoft word 2007"
description: ""
date: 2007-04-27T02:00:37+02:00
draft: false
tags: []
categories: [General]
---
This post is created using Microsoft word 2007. Let’s see if this makes blogging simpler. First of all some formatting  **bold** *italic*.

This is indented with tab.

1. Some ordered item
2. Another ordered item

- A bullet list
- Another element of the bullet list

Some weird code in VB.NET

1  &lt;AspNetHostingPermission(SecurityAction.LinkDemand,  Level:=AspNetHostingPermissionLevel.Minimal),  \_  
    2    AspNetHostingPermission(SecurityAction.InheritanceDemand,  Level:=AspNetHostingPermissionLevel.Minimal),  \_  
    3    ToolboxData(“&lt;{0}:MultipleFieldsValidator  runat=server&gt;&lt;/{0}:MultipleFieldsValidator&gt;”)&gt;  \_  
    4PublicClass  MultipleControlsValidator  
    5Inherits  BaseValidator  
    6  
    7        &lt;Browsable(False),  \_  
    8        EditorBrowsable(EditorBrowsableState.Never)&gt;  \_  
    9PrivateShadowsProperty  SetFocusOnError()  AsBoolean  
  10Get  
  11ReturnFalse  
  12EndGet  
  13Set(ByVal  value  AsBoolean)  
  14ThrowNew  NotSupportedException(“Cannot  focus  if  we  have  more  than  one  control  to  validate.”)  
  15EndSet  
  16EndProperty

Some in C#

38Section section, Int32 linkId) {   
  39  
  40IUnitOfWork UoW = DataAccessProviderFactory.GetConversationUnitOfWork();   
  41Query Q = Query.CreateQuery(“Field.OwnerSection.mId”, section.Id, CriteriaOperator.Equal);   
  42                 Q.AddCriteria(“LinkId”, linkId, CriteriaOperator.Equal);   
  43                 Q.Operator = QueryOperator.And;   
  44IList&lt;FieldData&gt; result = UoW.GetByCriteria&lt;FieldData&gt;(Q);   
  45foreach (FieldData f in result) {   
  46                      UoW.Detach(f);   
  47                 }   
  
And at last one image, this is the place where I work, my home...quite messy isn’t it?? :D

![External Image](http://76.163.32.29/Alkampfer/wp-content/uploads/2007/04/042707-0905-testofblogp13.jpg)

Now let’s see if word can publish all this post in my new wordpress blog. :D :D :D

The result for the code was quite messy, to have a good result I need to install a plugin for Visual Studio that gives me the option to “Copy as HTML” the code, and then once pasted in word 2007 I need to make some manual substitution for space and paragraph sign to have a good result. L

Alk.
