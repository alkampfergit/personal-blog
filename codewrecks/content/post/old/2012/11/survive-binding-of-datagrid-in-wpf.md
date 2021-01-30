---
title: "Survive binding of DataGrid in WPF"
description: ""
date: 2012-11-23T22:00:37+02:00
draft: false
tags: [DataGrid,WPF]
categories: [WPF]
---
DataGrid is one of the most annoying control in WPF because it sometimes has really different behaviors from other controls. The very first problem is that  **inside DataGridColumns the DataContext is not what you expect**. Suppose you have this simple scenario in MVVM: *an ObservableCollection of Objects, each one has IsSelected property and you want to bind that property to a DataGridCheckBox column with a CheckBox in the header that permits you to Select all and Unselect all*.

The simplest solution in MVVM architecture is  **creating a property called IsAllSelected in the main ViewModel,** monitor whenever this property changes and at each change, update all objects inside the collection, setting the IsSelected to the value of the IsAllSelected.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public Boolean IsAllSelected
{
    get { return _AllSelected; }
    set { this.Set(p => p.IsAllSelected, value, ref _AllSelected); }
}

private Boolean _AllSelected;

private void IsAllSelectedChanged()
{
    foreach (var vm in SearchesResult)
    {
        vm.IsSelected = IsAllSelected;
    }
}

{{< / highlight >}}

Once this structure is in place (I have some structures that avoid me the burden to write code inside the setter of the property) I’m sure that whenever the IsAllSelected property changes value, my infrastructure will call the IsAllSelectedChanged. Given this structure you can write the following XAML code

{{< highlight xml "linenos=table,linenostart=1" >}}


<DataGrid.Columns>
    <DataGridCheckBoxColumn Binding="{Binding IsSelected, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" >
        <DataGridCheckBoxColumn.Header>
            <CheckBox IsChecked="{Binding IsAllSelected}" />
        </DataGridCheckBoxColumn.Header>
    </DataGridCheckBoxColumn>
  ...
</DataGrid.Columns>

{{< / highlight >}}

It is really simple, just  **customize the header of a DataGridCheckBoxColumn with a single CheckBox and Bind the IsChecked to the IsAllSelected property**. This sounds really reasonable, because the header of a DataGridColumn should have the same DataContext of the container of the DataGrid… and here it comes the surprise. *It does not work. You click on the checkbox in the header but nothing happens and if you search in Visual Studio output window you find this error*

> System.Windows.Data Error: 40 : BindingExpression path error: ‘IsAllSelected’ property not found on ‘object’ ”CheckBox’ (Name=”)’. BindingExpression:Path=IsAllSelected; DataItem=’CheckBox’ (Name=”); target element is ‘CheckBox’ (Name=”); target property is ‘IsChecked’ (type ‘Nullable`1’)

 **DataGridColumns does not share the same DataContext of DataGrid and this invalidate all the binding you can set on columns, unless you create a fix.** Since all the DataGridColumns are inside the DataGrid, you expect them to share the same DataContext, but this is not true and the reason is in how the DataGrid creates internal control. To solve this I wrote the following code in the App.xaml.cs so it got executed at the very start of the application.

{{< highlight csharp "linenos=table,linenostart=1" >}}


FrameworkElement.DataContextProperty.OverrideMetadata(typeof(DataGrid),
new FrameworkPropertyMetadata
    (null, FrameworkPropertyMetadataOptions.Inherits,
    new PropertyChangedCallback(OnDataContextChanged)));

{{< / highlight >}}

The above code is telling WPF that  **I want to override the standard metadata for the DataGridControl so I can be notified each time the DataContext of a DataGrid changes**. Now I have the ability to fix the DataContext problem, manually assigning the right DataContext to each DataGridColumn.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static void OnDataContextChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
{
    DataGrid grid = d as DataGrid;
    if (grid != null)
    {
        foreach (DataGridColumn col in grid.Columns)
        {
            col.SetValue(FrameworkElement.DataContextProperty, e.NewValue);
            var header = col.Header as FrameworkElement;
            if (header != null) 
            {
                header.SetValue(FrameworkElement.DataContextProperty, e.NewValue);
            }
        }
    }
}

{{< / highlight >}}

 **The code is simple, and based on an old article I read long time ago** , I basically scan all the columns that are in the grid.Columns collection and sets the DataContext of the column to the value of the DataContext of the whole DataGrid.  **But this is not enough to fix the problem of the header, because I need to try to cast the Header to FrameworkElement, so if the header is a Framework element I need to set the DataContext** … and this because the Header of the DataGridColumn does not inherit the same DataContext of the Column that contains the Header… so annoying.

Luckily enough, this fix is valid for all the DataGrid of the whole program, so at least it permits me to write once and have a less annoyng DataGrid in my software :)

Alk.
