---
title: "Validate Business Entities with WPF"
description: ""
date: 2009-08-14T06:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
With [Guardian](http://www.nablasoft.com/guardian) we were investigating about a strategy to validate business entities in a project we work into. You can find a lot of examples around the web on how to use validators, but most of them deal with basic textbox, and property validation stuff. What we need is the ability to *use a validation framework on a business entity* or dto returned from a service,*without adding properties to those objects*. Basically we have a library with a set of rules that can tells us if an object is valid or not, and give us a list of errors, the aim is to validate a whole object while the user is editing single properties.

The solution lies in a new introduction of 2008 SP1 the [BindingGroup](http://msdn.microsoft.com/en-us/library/system.windows.data.bindinggroup.aspx). In the example I simply create two controls, the first is responsible to show a list of customers, the other is responsible to edit currently selected customer. My goal is having the possibility to validate a Customers instance, showing the list of errors to the user, and change some visual appearance of the control to better signal the error. All those requirements must be satisfied without adding properties related to validation in Business Object instances. Here is the appearance of the control with everything is ok

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image20.png)

Then I have some rule for properties length, if I change strings with too long values the validation fails.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image21.png)

As you can see I have clear indication of all errors, and at the same time a rectangle under the labels will change the fill from lightYellow to Orange to help the user to visualize that something is wrong. Ok letâ€™s see how we can reach this solution. First of all here is the validator for the businessEntities

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class BusinessEntityValidationRule : ValidationRule
{
    private static Validator validator;

    static BusinessEntityValidationRule()
    {
        validator = new Validator();
        validator.AddRule(Rule.For<Customers>(c => c.CustomerID)
                             .LengthInRange(5, 5)
                             .Message("CustomerID: must be 5 chars length"));
        validator.AddRule(Rule.For<Customers>(c => c.ContactName)
                             .LengthInRange(1, 20)
                             .Message("ContactName: length must be in range 1-20"));
        validator.AddRule(Rule.For<Customers>(c => c.Country)
                 .LengthInRange(1, 10)
                 .Message("Country: length must be in range 1-10"));
    }

    public override ValidationResult Validate(object value, System.Globalization.CultureInfo cultureInfo)
    {
        BindingGroup bindingGroup = (BindingGroup)value;
        if (bindingGroup.Items.Count == 0) return ValidationResult.ValidResult;
        var lastValidationResult = validator.ValidateObject(bindingGroup.Items[0]);
        if (lastValidationResult.Success)
        {
            return ValidationResult.ValidResult;
        }

        return new ValidationResult(false, lastValidationResult.ErrorMessages);
    }

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I use a custom validation library, in this example I simply set all rules inside the validator static constructor, in real scenario I can use attributes or xml configuration files. The important stuff is that I have an object called Validator that is able to validate business entities. In the Validate function I cast the value to BindingGroup, then check if I have one item to validate. Since my validator can validate every object, *I simply validate the bindingGroup.Items[0].* If the validation fails, I return ErrorMessages property that is a simple list of strings, where each one is a message for a failing rule. Now is the time to go to xaml, here is the declaration of the grid that contains all other controls.

{{< highlight xml "linenos=table,linenostart=1" >}}
    <Grid x:Name="TheGrid" Validation.Error="GridValidationError">

        <Validation.ErrorTemplate>
            <ControlTemplate>
                <AdornedElementPlaceholder Name="adornerPlaceholder"></AdornedElementPlaceholder>
            </ControlTemplate>
        </Validation.ErrorTemplate>

        <Grid.BindingGroup >
            <BindingGroup NotifyOnValidationError="True" >
                <BindingGroup.ValidationRules>
                    <ValidationInWpf:BusinessEntityValidationRule ValidationStep="UpdatedValue" x:Name="ObjectValidation" />
                </BindingGroup.ValidationRules>
            </BindingGroup>
        </Grid.BindingGroup>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Two things are important here, first I redefine the ErrorTemplate of the Grid, so I get rid of annoying default red border used for controls that fails validation. Then I create a simple BindingGroup, set the [ValidationStep](http://msdn.microsoft.com/en-us/library/system.windows.controls.validationrule.validationstep.aspx) to UpdateValue, this means that Iâ€™m asking to validate the object after the properties are update with the binding. Then I simply declare the rest of the controls as usual, the only important stuff is that with BindingGroup, validation must be done explicitly, so I need to react to some event of the textbox, the TextChanged is quite good.

{{< highlight xml "linenos=table,linenostart=1" >}}
<TextBox x:Name="ContactName" Grid.Row="1" Grid.Column="1" Text="{Binding ContactName}"
                 Height="40" TextChanged="TextBox_LostFocus" Margin="15,4,15,4" />
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I used the TextChanged event to call the TextBox\_TextChanged method

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private void TextBox_TextChanged(object sender, RoutedEventArgs e)
{
    TheGrid.BindingGroup.CommitEdit();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

To make validation happens you must simply call the CommitEdit() method on the BindingGroup object. This calls the BusinessEntityValidationRule Validate Method, thus validating the entire object. Now the only stuff that remains to do is to react to validation errors. First of all I want to show to the user All the errors that occurred during validation.

{{< highlight xml "linenos=table,linenostart=1" >}}
<ListView  Grid.Row="4" Grid.ColumnSpan="2"  
ItemsSource="{Binding Path=(Validation.Errors)[0].ErrorContent,  ElementName=TheGrid}">
        <ListView.ItemTemplate>
            <DataTemplate>
                <Label Foreground="Red"  Grid.Row="3" Content="{Binding}" />
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I used a simple list view, I bind the ItemsSource to the ErrorContent of the Grid, since I know that the ErrorContent is a list of String, I can simply show each error with a simple label. When there is no errors the listView is empty, when there are errors they are immediately shown with a series of red label. The last stuff is changing the background of the rectangle under the label from yellow to orange.

{{< highlight xml "linenos=table,linenostart=1" >}}
<Rectangle Grid.RowSpan="4" >
    <Rectangle.Style>
        <Style TargetType="{x:Type Rectangle}">
            <Setter Property="Fill" Value="LightYellow" />
            <Style.Triggers>
                <DataTrigger Binding="{Binding ElementName=TheGrid, Path=(Validation.HasError)}" Value="True">
                    <Setter Property="Fill"  >
                        <Setter.Value>
                            <SolidColorBrush Color="Orange" />
                        </Setter.Value>
                    </Setter>
                </DataTrigger>
            </Style.Triggers>
        </Style>
    </Rectangle.Style>
</Rectangle>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is equally simple, because I use a simple DataTrigger to change the fill from LightYellow to Orange when the property (validation.HasError) of the main grid is True. Remember that Validation.HasError is an AttachedProperty and to use it in a binding you need to surround with parenthesis.

The final result is that I can validate the whole object as once, I do not need to insert anything related to validation in the business objects, but everything is done into the validator. Thanks to BindingGroup Iâ€™m able to trigger validation whenever I need (textchanged, lostfocus, etc), and I can react to validation error showing details for each error, and changing visual appearance of the control.

Alk.

Tags: [WPF](http://technorati.com/tag/WPF) [Validation](http://technorati.com/tag/Validation)
