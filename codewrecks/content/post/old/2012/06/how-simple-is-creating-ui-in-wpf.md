---
title: "How simple is creating UI in WPF"
description: ""
date: 2012-06-23T13:00:37+02:00
draft: false
tags: [MVVM]
categories: [WPF]
---
I have this UI already working, it is a simple interface where users are presented with a list of Customers object, for each customers some feature could be enabled or not, so we have nice checkboxes to immediately enable/disable a feature with One Click.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image3.png)

 ***Figure 1***: *Actual situation all the checkboxes are always enabled*

But the very same form is used to edit customer details, so you need to select a row in the DataGrid and then started editing detailed information. Now the user want a little modification that permits to check various checkboxes only if the Customer row is selected, like shown in the following image

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image4.png)

 ***Figure 2***: *Desired result, only the checkboxes of selected row are enabled.*

The image is small, but if you look closely only the checkboxes of the currently selected row are enabled and doing this in WPF is surprisingly simple.

The solution is really really simple, since I’m using a DataGridTemplateColumn I have full control on the XAML used inside the column, and I can easily bind the IsEnabled property of controls to the IsSelected property of the first ancestor of type DataGridRow, that in turn is the row where the control resides.

Few lines of code, no C# code, MVVM and WPF is just beautiful.

Gian Maria.
