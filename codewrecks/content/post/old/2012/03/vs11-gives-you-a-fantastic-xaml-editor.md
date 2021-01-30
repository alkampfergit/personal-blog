---
title: "VS11 gives you a fantastic XAML Editor"
description: ""
date: 2012-03-16T14:00:37+02:00
draft: false
tags: [VS11,XAML]
categories: [Visual Studio,WPF]
---
XAML editing in Visual Studio 2010 is not one of the most exiting experience you can have, it works, but compared to Blend it is really poor. One of the thing I really do not like is the lack of information on design time data. Since I really develop every XAML application with MVVM or MVVM like approach, I always have design time data and I’d like Visual Studio to be able to use it during binding operation.

You should be happy because VS11 incorporates a Blend Like designer, that permits you a really improved XAML editing experience. Suppose you insert a Grid inside the XAML page and want to bind to a property of corresponding ViewModel that contains all Customers returned from a search. You should simply select the DataGrid, push the little square related to the ItemsSource property and choose Create Data Binding

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image17.png)

 ***Figure 1***: *Blend-like interface in VS11 editor*

Now a really nice UI appears that lists all the properties of the ViewModel, so you can immediately choose the one you need. The nice part is that VS11 now shows you the full name of the ViewModel and permits you even to choose Value Converter if you need.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image18.png)

 ***Figure 2***: *Choose the property of the VM you want to bind to and a ValueConverter if needed.*

The interesting aspect is that you can choose from different type of Binding type, as shown in Figure 3.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image19.png)

 ***Figure 3***: *Binding type*

You can easily create standard binding based on FindAncestor, previous data and many others. The really interesting part is that, once you bound the ItemsSource property of DataGrid to the Clients property of the view model, you can simply add a DataGridTextColumn and again choose the property of the Client object to bind to directly in the Designer.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image20.png)

 ***Figure 4***: *The designer understand the type of each Item and permits you to choose the property to bind to*

This makes really simple to develop a nice XAML interface directly from VS11 editor.

Gian Maria.
