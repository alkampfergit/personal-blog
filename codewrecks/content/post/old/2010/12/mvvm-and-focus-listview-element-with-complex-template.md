---
title: "MVVM and focus ListView element with complex template"
description: ""
date: 2010-12-22T09:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
This is the scenario: I have a complex object with a lot of properties, I created a user control in MVVM style to edit those properties, then in the main View I have a list of those objects, and I simply used a ListView control that uses the aforementioned user control as a template.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<DataTemplate x:Key="RilevazioneTemplate">
<Border BorderThickness="8" BorderBrush="{Binding BorderBrush, Mode=OneWay}" CornerRadius="8" Margin="0,2" Padding="3">
<Controls:RilevazioneForTreeEditor />
</Border>
</DataTemplate>
 
...
 
<ListView ItemTemplate="{DynamicResource RilevazioneTemplate}"
...
{{< / highlight >}}

Now the problem is the following one: when I use that ListView at runtime and I click on a texbox inside that user control, the SelectedItem of the ListView does not change, it changes only if I click on a empty part of the USerControl.

[![SNAGHTML262378](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML262378_thumb.png "SNAGHTML262378")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML262378.png)

* ***Figure 1***: The problem: focusing a textbox of the usercontrol does not select the item of the ListView.*

I could solve this problem with a little bit of Code Behind, but this is not MVVM style, and moreover is not maintainable because I want that logic to be declared only in one part of my project and reused in multiple views and I want a way to tell declaratively with XAML *Hey, when this textbox got focus, select the listviewItem that contains it*. I absolutely need to know selected element because I have logic on it to be done on the ViewModel and I want to keep at minimum the Code behind.

The solution is AttachedBehaviors; after a little browsing on the internet I find some hint to solve my problem. The solution is in this class.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class ListViewFocusBehaviour
{
public static readonly DependencyProperty SelectListViewItemOnFocusProperty =
DependencyProperty.RegisterAttached
(
"SelectListViewItemOnFocus",
typeof(bool),
typeof(SelectListViewItemOnFocusBehaviour),
new UIPropertyMetadata(false, OnSelectListViewItemOnFocusPropertyChanged)
);
public static bool GetSelectListViewItemOnFocus(DependencyObject obj)
{
return (bool)obj.GetValue(SelectListViewItemOnFocusProperty);
}
public static void SetSelectListViewItemOnFocus(DependencyObject obj, bool value)
{
obj.SetValue(SelectListViewItemOnFocusProperty, value);
}
 
private static void OnSelectListViewItemOnFocusPropertyChanged(DependencyObject dpo, DependencyPropertyChangedEventArgs args)
{
FrameworkElement element = dpo as FrameworkElement;
if (element != null)
{
if ((bool)args.NewValue)
{
element.PreviewGotKeyboardFocus += OnControlPreviewGotKeyboardFocus;
}
else
{
element.PreviewGotKeyboardFocus -= OnControlPreviewGotKeyboardFocus;
}
}
}
 
private static void OnControlPreviewGotKeyboardFocus(object sender, KeyboardFocusChangedEventArgs e)
{
DependencyObject p = sender as DependencyObject;
while (p != null && !(p is ListBoxItem))
{
p = VisualTreeHelper.GetParent(p);
}
 
if (p == null)
return;
 
((ListBoxItem) p).IsSelected = true;
}
 
 
}
{{< / highlight >}}

This is a simple class that declares an AttachedProperty called SelectedListViewItemOnFocus, that simply (line 10) declare a callback function every time its value changes. The callback function simply try to cast the sender object to FrameworkElement, and if the cast succeeds it add an handler to PReivewGotKeyboardFocus, thus permitting to handle the event of focus change.

Finally the handler of focus change simply iterate to all parents  to find a parte that is of type ListBoxItem, and if it founds it, it simply select it. Now all the logic is in a simple class and you can use in XAML in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 
<TextBox Grid.ColumnSpan="4"
Behaviours:ListViewFocusBehaviour.SelectListViewItemOnFocus="True"
Height="Auto" HorizontalAlignment="Stretch" />
{{< / highlight >}}

With this piece of XAML I'm telling to WFP engine to attach the SelectListViewItemOnFocus property to the textbox and give it a value of true. What happens at runtime? First of all the engine attach that property to the textbox and assign the value true, thus raising the OnSelectListViewItemOnFocusPropertyChanged property, that in turn add an handler to the PreviewGotKeyboardFocus even of the textbox. My final goal is achieved, I'm able to add logic to even of a Framework Element with only XAML declaration.

The final effect is that with this technique we can add behaviors to a control declaratively with XAML, keeping MVVM pattern intact and keeping all the logic only in one class, that can be reused for multiple views.

alk.
