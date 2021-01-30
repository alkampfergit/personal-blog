---
title: "Three levels master detail with WPF"
description: ""
date: 2008-11-08T05:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
Binding in WPF is really more powerful respect its counterpart in windows forms. Suppose you have to show this hierarchy of classes in an interface.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image6.png)

This is a simple structure where a LogGroup have a collection of LogMessages and each LogMessage has a collection of StackSteps. I have a collection of LogGroup and I need to create a *three level master detail* interface to make the user browse through all objects in hierarchy.

Thanks to powerful WPF binding you can create such an interface without procedural code. I used three ListView enclosed in a StackPanel. The first peculiarity of WPF binding is that you can set an ObservableCollection&lt;LogGroup&gt; object into the BindingContext on the StackPanel that contains the three listviews. The first listview have this declaration.

{{< highlight xml "linenos=table,linenostart=1" >}}
<ListView x:Name="GroupsView" ItemsSource="{Binding}" 
         IsSynchronizedWithCurrentItem="True"
         HorizontalContentAlignment="Stretch"
         ScrollViewer.HorizontalScrollBarVisibility="Disabled">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The IsSynchronizedWithCurrentItem is true to enable automatic synchronization, the binding is set with the instruction **{Binding},** that means â€œcreate a binding object with default propertiesâ€. A default binding walks controls stack and bind to the first Datacontext property that is not null, in our situation the ObservableCollection&lt;LogGroup&gt; set in the StackPanel that contains the ListView.

Now the second ListView should bind to the property *Messages*of the item currently selected in the previous ListView, the solution is really simple

{{< highlight xml "linenos=table,linenostart=1" >}}
<ListView x:Name="GroupsView" ItemsSource="{Binding Path=Messages}" 
     HorizontalContentAlignment="Stretch"
     ScrollViewer.HorizontalScrollBarVisibility="Disabled"
     IsSynchronizedWithCurrentItem="true">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The binding is  **{Binding Path=Messages}** that means, â€œbuild a Binding object and set the Path Property to the value Messagesâ€, since the IsSynchronizedWithCurrentItem is true you get this master detail binding for free. Thus when you change selection of the first ListView the second ListView updates accordingly and shows the element of the Messages collection of selected LogGroup. To bind the third and last ListView I have to use a special syntax of WPF Path binding

{{< highlight xml "linenos=table,linenostart=1" >}}
<ListView x:Name="GroupsView" ItemsSource="{Binding Path=Messages/StackSteps}" 
     HorizontalContentAlignment="Stretch"
     ScrollViewer.HorizontalScrollBarVisibility="Disabled"
     IsSynchronizedWithCurrentItem="true">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the binding now is  **{Binding Path=Messages/StackSteps}**. If you wonder why I had not written the path â€œMessages.StackStepsâ€ take a look back at the object model. Messages is a collection, *if you write Messages.StackSteps* WPF binding engine throws and errors.  **Now you need to be aware that every exception that is thrown during binding operation is swallowed by the binding engine, and you should look into the debug windows of visual studio to see binding errors**. In fact you can find this error

System.Windows.Data Error: 39 : BindingExpression path error: ‘StackSteps’ property not found on ‘object’ ”List`1′ (HashCode=58377472)’. BindingExpression:Path=Messages.StackSteps; DataItem=’ObservableCollection`1′ (HashCode=7457061); target element is ‘ListView’ (Name=’GroupsView’); target property is ‘ItemsSource’ (type ‘IEnumerable’)

the binding engine told you that he could not find a StackSteps Property in the object List&lt;Messages&gt;. In such a situation the WPF binding engine permits you to use slash â€œ/â€ character to indicate â€œThe current selected item in the viewâ€ ([read here for more details](http://msdn.microsoft.com/en-us/library/ms752347.aspx)).  Thus writing the path â€œMessages/StackStepsâ€ told the engine to take selected LogGroup from the first level, then take the Messages property, then the slash indicates to take the current selected element of Messages collection and finally bind to the StackSteps collection of that element.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image7.png)

Whoa, you get three level master detail with not a single line of procedural code :D

alk.

Tags: [WPF](http://technorati.com/tag/WPF) [Master Detail Binding](http://technorati.com/tag/Master%20Detail%20Binding) [Binding](http://technorati.com/tag/Binding)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/08/three-levels-master-detail-with-wpf/';</script><script type="text/javascript">var dzone_title = 'Three levels master detail with WPF';</script><script type="text/javascript">var dzone_blurb = 'Three levels master detail with WPF';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/08/three-levels-master-detail-with-wpf/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/08/three-levels-master-detail-with-wpf/)
