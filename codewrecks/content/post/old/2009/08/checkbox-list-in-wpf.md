---
title: "Checkbox list in wpf"
description: ""
date: 2009-08-04T10:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
One of most missing control of Wpf is in my opinion a Checkbox list. Since in a project Iâ€™m working into, I really need such a control I worked with my fellow [Guardian](http://www.nablasoft.com/guardian) to create one that will satisfies our needs.

Our goal is to use less code possible and rely mainly on binding, and this was a little difficult to accomplish because of various problems, here is the XAML of the final control.

{{< highlight xml "linenos=table,linenostart=1" >}}
<UserControl x:Class="RepManagement.Browser.Controls.CheckBoxList"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:Controls="clr-namespace:RepManagement.Browser.Controls"
    x:Name="ThisCheckBoxList">
    <ScrollViewer  VerticalScrollBarVisibility="Auto">
        <StackPanel>

            <ItemsControl x:Name="host"
        ItemsSource="{Binding ElementName=ThisCheckBoxList, Path=ItemsSource}">
                <ItemsControl.ItemTemplate>
                    <DataTemplate>
                        <Controls:MyCheckBox x:Name="theCheckbox"
                        DisplayMemberPath="{Binding ElementName=ThisCheckBoxList, Path=DisplayPropertyPath}" 
                         Unchecked="MyCheckBox_Checked"  Checked="MyCheckBox_Checked" Tag="{Binding Path=.}">
                            <Controls:MyCheckBox.IsChecked >
                                <MultiBinding Mode="OneWay" >
                                    <MultiBinding.Converter>
                                        <Controls:IsCheckedValueConverter />
                                    </MultiBinding.Converter>
                                    <Binding Path="."></Binding>
                                    <Binding ElementName="ThisCheckBoxList" Path="SelectedItems"></Binding>
                                    <Binding ElementName="ThisCheckBoxList" Path="DisplayPropertyPath"></Binding>
                                </MultiBinding>
                            </Controls:MyCheckBox.IsChecked>
                        </Controls:MyCheckBox>

                    </DataTemplate>
                </ItemsControl.ItemTemplate>
            </ItemsControl>
        </StackPanel>
    </ScrollViewer>
</UserControl>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

There are some remarkable stuff. To generate checkboxes we decided to use a simple ItemsControl, acting as a template. This controls has the ItemSource property bound to the ItemSource dependency property of our control. The tricky part is generating the checkboxes, first of all you can see that we does not use standard checkbox but a customized one called MyCheckbox.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class MyCheckBox : CheckBox
{
    public String DisplayMemberPath
    {
        get { return (String)GetValue(DisplayMemberPathProperty); }
        set { SetValue(DisplayMemberPathProperty, value); }
    }

    // Using a DependencyProperty as the backing store for DisplayMemberPath.  This enables animation, styling, binding, etc...
    public static readonly DependencyProperty DisplayMemberPathProperty =
         DependencyProperty.Register("DisplayMemberPath",
         typeof(String),
         typeof(MyCheckBox),
         new UIPropertyMetadata(String.Empty, (sender, args) =>
         {
             MyCheckBox item = (MyCheckBox)sender;
             Binding contentBinding = new Binding((String)args.NewValue);
             item.SetBinding(ContentProperty, contentBinding);
         }));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It inherits from the standard checkbox but declares the DisplayMemberPath dependency property, needed to permit to the user to specify the property name path to show. All the logic rely in creating a binding object in code and assign it to the Content property of the checkbox.

Then you can check that the IsChecked property of MyCheckBox is bound with a MultiValueConverter that is needed to draw the logic. The goal is having a control where I can simply bind a list of objects, and a list of selected objects, so I need a way to determine if a checkbox must be checked looking into a collection of selected objects. The MultiValueConverter was the only solution we can find to this problem.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public object Convert(object[] values, Type targetType, object parameter, System.Globalization.CultureInfo culture)
{
    if (values[1] == null) return false; //IF I do not have no value for selected simply return false

    String PropertyName = values[2] as string;
    if (PropertyName == null) return false;

    if (String.IsNullOrEmpty(PropertyName)) return false;
    if (!targetType.IsAssignableFrom(typeof(Boolean))) throw new NotSupportedException("Can convert only to boolean");
    IEnumerable collection = values[1] as IEnumerable;
    Object value = values[0];
    if (value.GetType() != ObjectType)
    {
        PropertyInfo = value.GetType().GetProperty(PropertyName, BindingFlags.Instance | BindingFlags.Public);
        ObjectType = value.GetType();
    }
    foreach (var obj in collection)
    {
        if (PropertyName == ".")
        {
            if (value.Equals(obj)) return true;
        }
        else
        {
            if (PropertyInfo.GetValue(value, null).Equals(PropertyInfo.GetValue(obj, null))) return true;
        }

    }
    return false;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The trick is simply looking for each object into the selected collection, extract the property and verify if one object have the same property of the actual checkbox, if yes it must be selected. With this basic arrange Iâ€™m able to write code like this.

{{< highlight xml "linenos=table,linenostart=1" >}}
    <Control:CheckBoxList Height="200"
        SelectedItems="{Binding Path=SelectedCustomers}"
        ItemsSource="{Binding Path=Customers}"
        DisplayPropertyPath="CustomerID"    />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Actually the Customers and SelectedCustomers are two observable collections populated with entityFramework entities based on database northwind. As you can verify Iâ€™m able to select the property used to show content, and I can directly bind two collection for the list of all objects and selected ones.

The good stuff about such a control, is that is quite useful in MVVM architectures, where you want to be able to bind everything from the MV to the View. Actually you can grab [the full sample here](http://www.codewrecks.com/blog/storage/checkboxlist.zip), it needs to be fully tested but it work quite good, here is what you see when you run the above view on a EntityFramework model based on northwind.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image9.png)

The code of the button is really stupid.

{{< highlight csharp "linenos=table,linenostart=1" >}}
foreach (Customers customer in ((MyDataContext) this.DataContext).SelectedCustomers)
{
    Debug.WriteLine(customer.CustomerID);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It verify only that the SelectedCollection will be populated correctly by the control.

Thanks again to [Guardian](http://www.nablasoft.com/guardian) for his precious help.

[Full code avaliable here.](http://www.codewrecks.com/blog/storage/checkboxlist.zip)

Alk.

Tags: [WPF](http://technorati.com/tag/WPF)
