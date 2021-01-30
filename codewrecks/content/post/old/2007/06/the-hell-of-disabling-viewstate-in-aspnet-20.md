---
title: "The hell of disabling viewstate in aspnet 20"
description: ""
date: 2007-06-05T09:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
The application model of Web Forms is not the most intuitive one, but to avoid being surprised and loosing time the most important thing to keep in mind is * **page lifecycle**.* If you forget page lifecycle hell awaits you. Here is one of the most common example, look at the following code.

&lt;body&gt;  
&lt;formid=”form1″runat=”server”&gt;  
&lt;div&gt;  
&lt;asp:DropDownListID=”MyDDListe1″EnableViewState=”true”AutoPostBack=”true”AppendDataBoundItems=”true”  
runat=”server”OnSelectedIndexChanged=”SelectedIndexChanged”&gt;  
&lt;asp:ListItem&gt;Select  a  team&lt;/asp:ListItem&gt;  
&lt;/asp:DropDownList&gt;  
&lt;/div&gt;  
&lt;/form&gt;  
&lt;/body&gt;  
&lt;/html&gt;

&lt;scriptrunat=”server”&gt;  
protectedvoid  Page\_Load(object  sender,  EventArgs  e)  {  
if  (!IsPostBack)  {  
                    MyDDListe1.DataSource  =  newstring[]  {  “Ferrari”,  “McLaren”,  “Renault”  };  
                    DataBind();  
            }  
    }  
protectedvoid  SelectedIndexChanged(object  sender,  EventArgs  e)  {  
string  msg  =  string.Format(@”alert(‘Selected  item  {0}’);”,  MyDDListe1.SelectedValue);  
            ClientScript.RegisterStartupScript(GetType(),  “blah”,  msg,  true);  
    }    
&lt;/script&gt;

It is a very simple one, a simple page with a single dropdownlist, when you select a different item in the ddlist, a messageBox appears showing the selected element. All works fine until you choose to disable viewstate, mainly for performance reason and for page size reduction. When you set EnableViewState property of the DDL to false, the example ceases to work. When you choose a team the message box does not show selected team, and all the items in the DDL disappear. First thing to do is remove the check  **if (!IsPostBack)** made in form Load event, now all content of the DDL must be reloaded at every postback because there is no viewstate anymore to restore the old values. Now the DDL retains all elements, but the messagebox continues to miss the selected item. Now you should resist the temptation to open google to find the solution, and instead you should really ask yourself “why the combo does not retain the selected value in SelectedIndexChanged event?”. The answer is in page lifecycle; every control has an event called * **LoadPostData()** *that is called from infrastructure to make control restore its current value from post data. The AspNet infrastructure calls LoadPostData() in a time between page  **init** and page  **load** , so if you disable the viewstate and reload DropDownList elements in page load, when the page controller calls LoadPostData the DropDownList tries to recover selected values from post but it has no items yet, and so nothing gets selected.  **To solve the problem you must bind the ddl in page Init**.

To verify that this is really the reason you can do a simple test, first of all create a new control that inherits from the dropdownlist and exposes a method that internally calls protected method LoadPostData().

[DefaultProperty(“Text”)]  
[ToolboxData(“&lt;{0}:MyDDListe  runat=server&gt;&lt;/{0}:MyDDListe&gt;”)]  
publicclassMyDDListe  :  DropDownList    {  
  
publicvoid  reloadValueFromPost()  {  
this.LoadPostData(this.ClientID,  HttpContext.Current.Request.Form);  
  }  
}

As you can see the LoadPostData() method accepts the key of the data in the post (the control id contained in ClientId property) and the collection of post parameters. With this control at hand change the page in this way

&lt;body&gt;  
&lt;formid=”form1″runat=”server”&gt;  
&lt;div&gt;  
&lt;cc1:MyDDListeID=”MyDDListe1″EnableViewState=”false”AutoPostBack=”true”AppendDataBoundItems=”true”  
runat=”server”OnSelectedIndexChanged=”SelectedIndexChanged”&gt;  
&lt;asp:ListItem&gt;Select  a  team&lt;/asp:ListItem&gt;  
&lt;/cc1:MyDDListe&gt;  
&lt;/div&gt;  
&lt;/form&gt;  
&lt;/body&gt;  
&lt;/html&gt;  
&lt;scriptrunat=”server”&gt;  
protectedvoid  Page\_Load(object  sender,  EventArgs  e)  {  
            MyDDListe1.DataSource  =  newstring[]  {  “Ferrari”,  “McLaren”,  “Renault”  };  
            DataBind();  
            MyDDListe1.reloadValueFromPost();  
    }  
protectedvoid  SelectedIndexChanged(object  sender,  EventArgs  e)  {  
string  msg  =  string.Format(@”alert(‘Selected  item  {0}’);”,  MyDDListe1.SelectedValue);  
            ClientScript.RegisterStartupScript(GetType(),  “blah”,  msg,  true);  
    }    
&lt;/script&gt;

As you can see the DropDownList now gets substituted by MyDDListe control, in page load I simply calls *reloadValueFromPost()* method, this make my ddl to calls again LoadPostData() of the base control, and the example now works again, even if the data binding is done in Page Load event. When the viewstate is enabled the viewstate is restored before LoadPostData() gets called and all works as expected.

**So, every time a WebForm seems to behave in a strange way *first of all think about page lifecycle*, and most of the time you’ll find the answer.**

Alk.

P.S another way to verify this issue without the need to create a new control just to be able to call LoadPostData() that is a protected method, remember that through reflection calling a protected method is a breeze. The following code makes the combo work even if databinding is done in page load, clearly the best thing to do is rebind the combo in page init, but the following code is a verification that the reason why the combo stops to work with viewstate disabled is really the fact that LoadPostData() is called before page load.

protectedvoid  Page\_Load(object  sender,  EventArgs  e)  {  
    MyDDListe1.DataSource  =  newstring[]  {  “Ferrari”,  “McLaren”,  “Renault”  };  
    DataBind();  
    MyDDListe1.GetType().GetMethod(“LoadPostData”,  System.Reflection.BindingFlags.NonPublic  
            |  System.Reflection.BindingFlags.Instance).Invoke(MyDDListe1,  
newobject[]  {  MyDDListe1.UniqueID,  Request.Form  });    
}
