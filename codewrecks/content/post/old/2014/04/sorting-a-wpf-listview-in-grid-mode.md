---
title: "Sorting a WPF ListView in Grid Mode"
description: ""
date: 2014-04-29T18:00:37+02:00
draft: false
tags: [MVVM,WPF]
categories: [WPF]
---
There is  **an** [**article on MSDN**](http://msdn.microsoft.com/en-us/library/ms745786.aspx) **that demonstrates how to enable sorting column for a ListView used with Grid layout**. The solution presented there works perfectly, but  **I do not want to put code behind my windows, because I work with MVVM approach**. The solution is wrapping everything in a behavior, so I took the code from original MSDN example and I wrapped inside a behavior.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class ListViewGridSortableBehavior : Behavior
    {
        protected override void OnAttached()
        {
            if (AssociatedObject != null)
            {
                AssociatedObject.AddHandler(GridViewColumnHeader.ClickEvent, new RoutedEventHandler(GridHeaderClickEventHandler));
            }
            base.OnAttached();
        }
        GridViewColumnHeader _lastHeaderClicked = null;
        ListSortDirection _lastDirection = ListSortDirection.Ascending;
        void GridHeaderClickEventHandler(object sender, RoutedEventArgs e)
        {
            GridViewColumnHeader headerClicked =
                  e.OriginalSource as GridViewColumnHeader;
            ListSortDirection direction;
            if (headerClicked != null)
            {
                if (headerClicked.Role != GridViewColumnHeaderRole.Padding)
                {
                    if (headerClicked != _lastHeaderClicked)
                    {
                        direction = ListSortDirection.Ascending;
                    }
                    else
                    {
                        if (_lastDirection == ListSortDirection.Ascending)
                        {
                            direction = ListSortDirection.Descending;
                        }
                        else
                        {
                            direction = ListSortDirection.Ascending;
                        }
                    }
                    if (_lastHeaderClicked != null) 
                    {
                        SetSortDownVisibility(_lastHeaderClicked, Visibility.Collapsed);
                        SetSortUpVisibility(_lastHeaderClicked, Visibility.Collapsed);
                    }
                    //string header = headerClicked.Column.Header as string;
                    String sortString = GetSortHeaderString(headerClicked);
                    if (String.IsNullOrEmpty(sortString)) return;
                    Sort(sortString, direction);
                    if (direction == ListSortDirection.Ascending)
                    {
                        SetSortDownVisibility(headerClicked, Visibility.Collapsed);
                        SetSortUpVisibility(headerClicked, Visibility.Visible);
                    }
                    else
                    {
                        SetSortDownVisibility(headerClicked, Visibility.Visible);
                        SetSortUpVisibility(headerClicked, Visibility.Collapsed);
                    }
                    // Remove arrow from previously sorted header 
                    if (_lastHeaderClicked != null &amp;&amp; _lastHeaderClicked != headerClicked)
                    {
                        _lastHeaderClicked.Column.HeaderTemplate = null;
                    }
                    _lastHeaderClicked = headerClicked;
                    _lastDirection = direction;
                }
            }
        }
        private void Sort(string sortBy, ListSortDirection direction)
        {
            ICollectionView dataView =
              CollectionViewSource.GetDefaultView(AssociatedObject.ItemsSource);
            dataView.SortDescriptions.Clear();
            SortDescription sd = new SortDescription(sortBy, direction);
            dataView.SortDescriptions.Add(sd);
            dataView.Refresh();
        }
        public static readonly DependencyProperty SortHeaderStringProperty =
           DependencyProperty.RegisterAttached
           (
               "SortHeaderString",
               typeof(String),
               typeof(GridViewColumnHeader),
               new UIPropertyMetadata(String.Empty)
           );
        public static String GetSortHeaderString(DependencyObject obj)
        {
            return (String)obj.GetValue(SortHeaderStringProperty);
        }
        public static void SetSortHeaderString(DependencyObject obj, String value)
        {
            obj.SetValue(SortHeaderStringProperty, value);
        }
        public static readonly DependencyProperty SortDownVisibilityProperty =
          DependencyProperty.RegisterAttached
          (
              "SortDownVisibility",
              typeof(Visibility),
              typeof(GridViewColumnHeader),
              new UIPropertyMetadata(Visibility.Collapsed)
          );
        public static Visibility GetSortDownVisibility(DependencyObject obj)
        {
            return (Visibility)obj.GetValue(SortDownVisibilityProperty);
        }
        public static void SetSortDownVisibility(DependencyObject obj, Visibility value)
        {
            obj.SetValue(SortDownVisibilityProperty, value);
        }
        public static readonly DependencyProperty SortUpVisibilityProperty =
         DependencyProperty.RegisterAttached
         (
             "SortUpVisibility",
             typeof(Visibility),
             typeof(GridViewColumnHeader),
             new UIPropertyMetadata(Visibility.Collapsed)
         );
        public static Visibility GetSortUpVisibility(DependencyObject obj)
        {
            return (Visibility)obj.GetValue(SortUpVisibilityProperty);
        }
        public static void SetSortUpVisibility(DependencyObject obj, Visibility value)
        {
            obj.SetValue(SortUpVisibilityProperty, value);
        }
    }

{{< / highlight >}}

The code is really simple, I just add and handler to the ClickEvent of the GridViewColumnHeader for the ListView and then used the code from MSDN example to do the sorting. I’ve added also a couple of Dependency Properties called SortDownVisibility and SortUpVisibility that determines the visibility of graphical indicator of the current sorting.  **I also added a property called SortHeaderString that will contains the name of the property that should be used to sort.** Thanks to this simple code I can simply enable sorting in XAML.

{{< highlight xml "linenos=table,linenostart=1" >}}


<ListView ItemsSource="{Binding SearchesResult}" HorizontalContentAlignment="Stretch" >
    <i:Interaction.Behaviors>
        <Behaviours:ListViewGridSortableBehavior />
    </i:Interaction.Behaviors>

{{< / highlight >}}

Now I need to enable sorting for all sortable columns, using my SortHeaderString property.

{{< highlight xml "linenos=table,linenostart=1" >}}


<GridViewColumn  DisplayMemberBinding="{Binding Dto.Author}" >
    <GridViewColumn.Header>
        <GridViewColumnHeader Behaviours:ListViewGridSortableBehavior.SortHeaderString="Dto.Author">
            <StackPanel Orientation="Horizontal">
                <Label Content="?" Visibility="{Binding Path=SortDownVisibility, RelativeSource={RelativeSource AncestorType={x:Type GridViewColumnHeader}}}"></Label>
                <Label Content="?" Visibility="{Binding Path=SortUpVisibility, RelativeSource={RelativeSource AncestorType={x:Type GridViewColumnHeader}}}"></Label>
                <Label Content="Author"></Label>
            </StackPanel>
        </GridViewColumnHeader>
    </GridViewColumn.Header>
</GridViewColumn>

{{< / highlight >}}

Thanks to my Dependency Properties, it is really simple to enable sorting for a column because I need only to populate the SortHeaderString property of the Header. In previous example, the column is bound to Dto.Author property, the header shows the string Author, and I’ve also added a couple of Arrows to show the actual sorting.  **No resource is needed because I’ve used a couple of Unicode chars to represent up and down arrows**.

Here is the result

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/04/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/04/image3.png)

 ***Figure 1***: *Clickable and sortable header in ListView with Grid layout*

This simple approach is perfectly compatible with MVVM and permits you to choose the exact layout of the header while maintaining the option to sort with clickable headers.

Gian Maria.
