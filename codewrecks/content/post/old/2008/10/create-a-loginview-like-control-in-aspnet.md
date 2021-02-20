---
title: "Create a 'LoginView like' control in aspnet"
description: ""
date: 2008-10-17T07:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
The LoginView control is a very interesting one, it permits you to specify different content templates in the page depending on the role of the current user. Sometimes this scheme is not enough, in a project I'm working in, we have five roles, and the software is subdivided in areas, each role can have  read, write or none permission on each area (an access matrix), and the permissions can be set through an administration page.

I want to create a control similar to loginView but with only two template, the first used when the user has no access to a particular area, and another used when the user has at least read access level for that area. This is the code of the control

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    public class LoginViewForArea : WebControl, INamingContainer
    {
        private ITemplate unpermittedTemplate;
        private LoginArea loginArea;

        [PersistenceMode(PersistenceMode.InnerProperty),
        Browsable(false),
        DefaultValue((string)null),
        TemplateContainer(typeof(LoginViewForArea))]
        public virtual ITemplate UnpermittedTemplate
        {
            get
            {
                return this.unpermittedTemplate;
            }
            set
            {
                this.unpermittedTemplate = value;
            }
        }

        [Browsable(false),
        DefaultValue((String)null),
        PersistenceMode(PersistenceMode.InnerProperty),
        TemplateContainer(typeof(LoginViewForArea))]
        public LoginArea Area
        {
            get
            {
                return loginArea;
            }
            set { loginArea = value; }
        }
        protected override void CreateChildControls()
        {
            ITemplate template = null;
            AccessLevel al = SecurityService.GetAccessLevelForAreaKey(Area.AreaName);
            if (al.IsRead() || al.IsWrite())
                template = Area.ContentTemplate;
            else
                template = unpermittedTemplate;

            Control container = new Control();
            template.InstantiateIn(container);
            this.Controls.Add(container);
        }
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see it has only a couple of properties, one of type ITemplate and the other of type LoginArea, all the game is done in the CreateChildControls, where we check the access level of current user against the name of the area, and if the user has read or write access level then we display the container of the Area, if the user has no access we show the unpermittedTemplate. To show an ITemplate object we need to create a simple control and use the function InstantiateIn of the ITemplate to instantiate all controls in the newly created control, then you simple need to add the control to the control collection. The code for the LoginArea class is the following.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    [AspNetHostingPermission(SecurityAction.LinkDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    public class LoginArea
    {
        public String AreaName { get; set; }

        [Browsable(false),
        TemplateContainer(typeof(LoginViewForArea)),
        DefaultValue((string)null),
        PersistenceMode(PersistenceMode.InnerProperty)]
        public ITemplate ContentTemplate { get; set; }
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is a simple class that have a String property an a property of type ITemplate and a bunch of attributes that indicates to the designer how this object will be used in a page, here is aspx code that uses this control.

{{< highlight xml "linenos=table,linenostart=1" >}}
<cc1:LoginViewForArea ID="LoginViewForArea1" runat="server">
    <UnpermittedTemplate>
        unpermitted
    </UnpermittedTemplate>
    <Area AreaName="RIL_ACC">
        <ContentTemplate>
            Sei permesso
        </ContentTemplate>
    </Area>
</cc1:LoginViewForArea>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In this situation if the user has at least read access for area RIL\_ACC I showed the string *Sei Permesso* if the user has no access to that area I show *unpermitted*.

alk.

Tags: [Asp.net](http://technorati.com/tag/Asp.net) [Security](http://technorati.com/tag/Security) [LoginView](http://technorati.com/tag/LoginView)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/17/create-a-loginview-like-control-in-aspnet/';</script><script type="text/javascript">var dzone_title = 'Create a *LoginView like* control in asp.net';</script><script type="text/javascript">var dzone_blurb = 'Create a *LoginView like* control in asp.net';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/17/create-a-loginview-like-control-in-aspnet/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/17/create-a-loginview-like-control-in-aspnet/)
