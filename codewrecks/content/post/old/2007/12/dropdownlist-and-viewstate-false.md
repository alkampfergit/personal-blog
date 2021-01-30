---
title: "DropDownList And ViewState  false"
description: ""
date: 2007-12-04T10:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
It is a while that I do not write in my English blog, today I want to continue a issue discussed [in an old post](http://www.nablasoft.com/Alkampfer/?p=65). Consider this code

&lt;body&gt;  
&lt;formid=”form1″runat=”server”oninit=”Page\_Init”&gt;  
&lt;div&gt;  
&lt;asp:DropDownListID=”ddlist1″EnableViewState=”false”AutoPostBack=”true”AppendDataBoundItems=”true”  
runat=”server”OnSelectedIndexChanged=”SelectedIndexChanged”&gt;  
&lt;asp:ListItem&gt;Select  a  team&lt;/asp:ListItem&gt;  
&lt;/asp:DropDownList&gt;  
  
&lt;asp:DropDownListID=”ddlist2″EnableViewState=”false”AutoPostBack=”true”AppendDataBoundItems=”true”  
runat=”server”OnSelectedIndexChanged=”SelectedIndexChanged”&gt;  
&lt;asp:ListItem&gt;Select  a  team&lt;/asp:ListItem&gt;  
&lt;/asp:DropDownList&gt;  
&lt;/div&gt;  
&lt;/form&gt;  
&lt;/body&gt;  
&lt;/html&gt;

&lt;scriptrunat=”server”&gt;

protectedvoid  Page\_Init(object  sender,  EventArgs  e)  {  
              ddlist1.DataSource  =  newstring[]  {  “Ferrari”,  “McLaren”,  “Renault”  };  
              ddlist2.DataSource  =  newstring[]  {  “Ferrari”,  “McLaren”,  “Renault”  };  
          DataBind();  
    }  
protectedvoid  SelectedIndexChanged(object  sender,  EventArgs  e)  {  
DropDownList  ddl  =  (DropDownList)  sender;  
            Response.Write(String.Format(“SelectedIndexChanged  {0}  value  =  {1}&lt;BR/&gt;”,  
                                                                      ddl.ID,  ddl.SelectedValue));  
    }    
&lt;/script&gt;  
This code contains two simple DropDownList, both with ViewState disabled, the datasource is rebound at each PageInit and in SelectedIndexChanged we simple write a string in response output. You can be surprised that if you change the first dropdown all was good, but when you change the second one you find that the output contains string like this

SelectedIndexChanged ddlist1 value = McLaren  
SelectedIndexChanged ddlist2 value = Ferrari

This means that the SelectedIndexChanged of the first DropDownList fired even if we do not change it. This is due to the ViewState, the DropDownList control store in viewstate his current selected value, so at LoadPostData() he can find if the selected item is really changed, but if you have no viewstate the control assumes that previous selectedvalue is 0, so [it fire the event at each postback](http://connect.microsoft.com/VisualStudio/feedback/ViewFeedback.aspx?FeedbackID=103844). To solve this problem change the code in this way

&lt;scriptrunat=”server”&gt;

protectedvoid  Page\_Init(object  sender,  EventArgs  e)  {  
              ddlist1.DataSource  =  newstring[]  {  “Ferrari”,  “McLaren”,  “Renault”  };  
              ddlist2.DataSource  =  newstring[]  {  “Ferrari”,  “McLaren”,  “Renault”  };  
          DataBind();  
    }  
protectedvoid  SelectedIndexChanged(object  sender,  EventArgs  e)  {  
DropDownList  ddl  =  (DropDownList)  sender;  
if  ((String)  ViewState[ddl.ID]  !=  ddl.SelectedValue)  {  
                            Response.Write(String.Format(“SelectedIndexChanged  {0}  value  =  {1}&lt;BR/&gt;”,  
                                                                      ddl.ID,  ddl.SelectedValue));  
            }  
    }

protectedvoid  Page\_PreRender(object  sender,  EventArgs  e)  {  
            ViewState[“ddlist1”]  =  ddlist1.SelectedValue;  
            ViewState[“ddlist2”]  =  ddlist2.SelectedValue;  
    }  
  
&lt;/script&gt;  
Now we store in viewstate the selection of each dropdown list, so we can use in SelectedIndexChanged to verify that the selection is really changed.

Alk.
