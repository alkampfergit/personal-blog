---
title: "Aspnet 20 Controls adapter to the rescue"
description: ""
date: 2008-07-08T09:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
In an asp.net 2.0 application of our team we inserted long time ago a Theme Manager, a simple module that is used to retrieve the theme selected for current user (from profile management) and dynamically apply it to the page of the site. With this module each user can choose a theme for the site. We usually insert this theme in all the site we are working on since we always like dynamic theme management.

I’m not in charge of that particular web application but sometimes I create some critical pages on it. Today I found that for some reason the theme manager is not working well. It works for css..but it is not working for images……….and with horror I discovered that in all the pages images are used in this way

{{< highlight xml "linenos=table,linenostart=1" >}}
 <asp:Image ID="Image1" runat="server" ImageUrl="~/App_Themes/V2/images/bkgArchivioFiltri.jpg"/>
 <img runat="server"  src="../App_Themes/V2/images/bkgArchivioFiltri.jpg" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a real problem, whenever we need to show an image, the developer linked the static images inside the theme directory for the V2 themes (the default one). At present time only a theme is active (the V2 one), but I do not like that themes management does not work. Usually it is better to apply images with css to be theme enabled, then whenever you need to programmatically specify an image you should use the method in themeManager called *AdjustPathForCurrentTheme.* You should pass relative path like “images/bkgArchivioFiltri.jpg” and this function gives you the real path based on the theme for current user.

Maybe for lack of communication developers in charge of the UI does not used css for images, nor they used the function in theme manager….too bad now we have to scan all the source pages to find asp:image and &lt;img&gt; tag to correct the url……no, we have a better solution :), first of all I created a couple of adapters

{{< highlight CSharp "linenos=table,linenostart=1" >}}
Public Class ImageForThemes : Inherits System.Web.UI.Adapters.ControlAdapter
        Private Const ThemeRex As String = "(?<themepath>.*app_themes/.*?/)"
        Private Const opt As RegexOptions = RegexOptions.IgnoreCase
        Protected Overrides Sub Render(ByVal writer As System.Web.UI.HtmlTextWriter)
            Dim img As Image = DirectCast(MyBase.Control, Image)

            If Regex.IsMatch(img.ImageUrl, ThemeRex, opt) Then
                img.ImageUrl = RepManagement.ThemeManager.AdjustPathForCurrentTheme( _
                 Regex.Replace(img.ImageUrl, ThemeRex, "", opt))
            Else
                img.ImageUrl = RepManagement.ThemeManager.AdjustPathForCurrentTheme(img.ImageUrl)
            End If
            MyBase.Render(writer)
        End Sub
    End Class

    Public Class HtmlImageForThemes : Inherits System.Web.UI.Adapters.ControlAdapter
        Private Const ThemeRex As String = "(?<themepath>.*app_themes/.*?/)"
        Private Const opt As RegexOptions = RegexOptions.IgnoreCase

        Protected Overrides Sub Render(ByVal writer As System.Web.UI.HtmlTextWriter)
            Dim img As HtmlImage = DirectCast(MyBase.Control, HtmlImage)

            If Regex.IsMatch(img.Src, ThemeRex, opt) Then
                img.Src = RepManagement.ThemeManager.AdjustPathForCurrentTheme( _
                 Regex.Replace(img.Src, ThemeRex, "", opt))
            Else
                img.Src = RepManagement.ThemeManager.AdjustPathForCurrentTheme(img.Src)
            End If
            MyBase.Render(writer)
        End Sub
    End Class{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

These  adapters are used to adapt standard asp:image control and the HtmlImage control. Inside the function I simply use a regex to remove from the path the theme part and then I call the function in ThemeManager to adjust the path. For relative path I simply use the AdjustPathForcurrentTheme, then I instruct asp.net with a.browser file to use these adapters

{{< highlight xml "linenos=table,linenostart=1" >}}
<browsers>
    <browser refID="Default">
        <controlAdapters>
            <adapter controlType="System.Web.UI.WebControls.Image"
                        adapterType="RepManagement.V2.ImageForThemes" />
            <adapter controlType="System.Web.UI.HtmlControls.HtmlImage"
                        adapterType="RepManagement.V2.HtmlImageForThemes" />
        </controlAdapters>
    </browser>
</browsers>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this settings, all asp:image control are automatically “ThemeManager enabled” even if we hardcoded theme name in the path. The only modification to original code is to modify the &lt;img&gt; tag adding the runat=”server” attribute. the runat=”server” is needed because the &lt;img tag is now bound to a server HtmlImage control that I can adapt with the adapter. Now I can write

{{< highlight xml "linenos=table,linenostart=1" >}}
<asp:Image ID="Image1" runat="server" ImageUrl="~/App_Themes/V2/images/bkgArchivioFiltri.jpg"/>
<asp:Image ID="Image2" runat="server" ImageUrl="images/bkgArchivioFiltri.jpg"/>
<img runat="server"  src="../App_Themes/V2/images/bkgArchivioFiltri.jpg" />
<img id="Img1" runat="server"  src="images/bkgArchivioFiltri.jpg" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

as you can see I can use asp:image or a simple &lt;img runat=”server” , I can use a relative path to the theme or I can link to a specific theme, and the adapter change it to refer to the current theme. If I run the previous page with a user that have another theme I obtain this html

{{< highlight xml "linenos=table,linenostart=1" >}}
  <div>
 <img id="Image1" src="/RepManagement/App_Themes/NightVision_5_1_2/images/bkgArchivioFiltri.jpg" style="border-width:0px;" />
  <img id="Image2" src="/RepManagement/App_Themes/NightVision_5_1_2/images/bkgArchivioFiltri.jpg" style="border-width:0px;" />
 <img src="/RepManagement/App_Themes/NightVision_5_1_2/images/bkgArchivioFiltri.jpg" />
 <img src="/RepManagement/App_Themes/NightVision_5_1_2/images/bkgArchivioFiltri.jpg" id="Img1" />
    </div>
    {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

All the images are taken from the NightVision\_5\_1\_2 theme, that is the current theme for the current user, even if the code in aspx pages never refer to the correct themes.

alk.

Tags: [asp.net control adapter](http://technorati.com/tag/asp.net%20control%20adapter)

<!--dotnetkickit-->
