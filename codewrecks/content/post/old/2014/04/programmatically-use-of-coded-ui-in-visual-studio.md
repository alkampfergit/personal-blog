---
title: "Programmatically use of Coded UI in Visual Studio"
description: ""
date: 2014-04-10T20:00:37+02:00
draft: false
tags: [Testing,Visual Studio]
categories: [Visual Studio ALM]
---
 **Coded UI Tests are a specific type of UI testing introduced with Visual Studio 2010**. You can create your first Coded UI test following [simple instruction from MSDN](http://msdn.microsoft.com/en-us/library/dd286681%28v=vs.100%29.aspx) documentation. Most of the introductory examples shows you how you can use the Recorder tools to  **record interaction with a software (Web, WinForm, Wpf. etc) to generate what is called a** [**UiMap**](http://msdn.microsoft.com/en-us/library/ff398062.aspx). An UiMap is nothing more than a big Xml files where the recorder records the interaction with the UI and a bunch of automatic generated classes to interact with the UI.

Using a UiMap is probably not the best option for large projects, because the cost of maintaining it could become really high. This is usually not a big problem, because UiMap is used to generate code based on a  **set of classes belonging to Visual Studio Testing Framework that makes possible to interact with a UI from code.** If maintaining a UiMap is difficult for you you can directly use these classes in your test. To show you the “hello world” equivalent of CUIT, here is the code needed to open a page in a browser and click an hyperlink.

{{< highlight csharp "linenos=table,linenostart=1" >}}


using ( BrowserWindow browserWindow =
            BrowserWindow.Launch
            (
                new System.Uri("http://tailspintoys.azurewebsites.net/")
            ))
{
    HtmlHyperlink link = new HtmlHyperlink(browserWindow);
    link.SearchProperties.Add
        (
            HtmlHyperlink.PropertyNames.InnerText,
            "Model Airplanes"
        );
    Mouse.Click(link); 
}

{{< / highlight >}}

The code is really simply, you must use the BrowserWindow.Launch static method to create an instance of BrowserWindow class pointing to a given Url.  **The BrowserWindow class is a wrapper defined Visual Studio Coded Ui assemby used to abstract the interaction with a web browser**. The next step is locating the hyperlink you want to click, operation that can be accomplished with the [HtmlHyperlink](http://msdn.microsoft.com/en-us/library/microsoft.visualstudio.testtools.uitesting.htmlcontrols.htmlhyperlink.aspx) object. This object derives from the [UiTestControl](http://msdn.microsoft.com/en-us/library/microsoft.visualstudio.testtools.uitesting.uitestcontrol.aspx) base class, and abstracts the concept of a control in the User Interface. The constructor of HtmlHyperlink object needs an instance of a containing control, in this example the whole browserWindows object. The need for the Container is having a root control that will be searched for the control.

 **To specify the exact Hyperlink control you want to interact with, you should populate SearchProperties collection** , specifying the criteria you want to use. In this example I used the InnerText property, but you can use a lot of other criteria. Thanks to PropertyNames static collection of HtmlHyperlink object you can enumerate all the properties that can be used to locate the control. Inner Text is not usually the best option, using unique Id is usually a better approach, but  **the key concept is: You should use the criteria that is most stable in your scenario/environment**. If you can ask to development team to assign unique id or unique names to each control, tests will be more robust and quicker.

Once SearchProperties collection is filled with critera, you can interact with the control, accessing properties or passing it to Mouse.Click method to simulate a click.  **CodedUI engine will locate the control on the page only when You will access properties or pass the control to some method that interact with it**. This is really important, until you do not access properties the engine will not try to locate the control on the UI.

 **Remember to enclose the BrowserWindow object in a using block, this will ensure that the instance of the browser opened during the test will be always closed**. This prevents multiple browser windows to remain opened after the test if some exception occurred.

Gian Maria.
