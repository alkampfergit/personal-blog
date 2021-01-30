---
title: "Binding combobox to Enum in silverlight"
description: ""
date: 2008-07-29T09:00:37+02:00
draft: false
tags: [Silverlight]
categories: [Silverlight]
---
These days I’m playing a bit with Silverlight, to realize a little piece of backoffice of an ASP.NEt classic application. We decided to give a chance to silverligth because the backoffice is used only internally and so we can make experience with a noncritical piece of software.

Even If I do not adopt a MVC or [M-V-VM](http://blogs.msdn.com/johngossman/archive/2005/10/08/478683.aspx) pattern I like to create a little domain model, than expose it with a [transaction script](http://martinfowler.com/eaaCatalog/transactionScript.html) pattern, make it avaliable through a WCF service, and create interface with really no logic. Each service method return [DTO](http://martinfowler.com/eaaCatalog/dataTransferObject.html) not real domain object,  this make possible for the caller not to worry about all the crap that can exists in the domain. The silverlight interface is a simple series of control, that can be bound to a DTO, so the typical pattern is to ask service for some object, then bind them to a control, let the user play with the interface and thanks to twoway binding we can simply wait for the user to press a “Save” button or other such events to call update method from the service.

Thanks to DTO all the work to update the real domain object is done by the service, that can do whatever check you want (optimistic concurrency,etc). The question is “how far can we push silverlight binding to avoid to write any code to make the DTO synchronized with the UI?” The answer is  “really far”.

As an example you can [download this code](http://www.codewrecks.com/blog/storage/SL2BindEnum.zip), that shows you how you can bind a property of an object of some Enum type, both to a series of radio button and to a textbox. The example is a modified version of the enum binder that you can find from [this article](http://blogs.interknowlogy.com/johnbowen/archive/2007/06/21/20463.aspx) where you can find also a lot of good example about binding. The key of everything is in the IValueConverter interface that permits you to convert from a type to another and back. Here is my enum converter.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
    public class EnumConverter : IValueConverter
    {

        #region IValueConverter Members

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (targetType.IsAssignableFrom(typeof(Boolean)) && targetType.IsAssignableFrom(typeof(String)))
                throw new ArgumentException("EnumConverter can only convert to boolean or string.");
            if (targetType == typeof(String))
                return value.ToString();

            return String.Compare(value.ToString(), (String) parameter, StringComparison.InvariantCultureIgnoreCase) == 0;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (targetType.IsAssignableFrom(typeof(Boolean)) && targetType.IsAssignableFrom(typeof(String)))
                throw new ArgumentException("EnumConverter can only convert back value from a string or a boolean.");
            if (!targetType.IsEnum)
                throw new ArgumentException("EnumConverter can only convert value to an Enum Type.");

            if (value.GetType() == typeof(String))
            {
                return Enum.Parse(targetType, (String)value, true);
            }
            else
            {
                //We have a boolean, as for binding to a checkbox. we use parameter
                if ((Boolean)value)
                    return Enum.Parse(targetType, (String)parameter, true);
            }
            return null;
        }

        #endregion
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a first try implementation, not fully tested but it seems to work quite well. It handles conversion between the original enum type to a string or to a boolean value. The conversion to boolean value is needed to use it withRadioButton, in combination with the ConversionParameter. Back conversion is also implemented so you can easily use the twoway binding. Here is a typical use in a user control.

{{< highlight xml "linenos=table,linenostart=1" >}}
<UserControl x:Class="TestSilverlight.Page"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" 
    xmlns:TestSilverlight="clr-namespace:TestSilverlight" 
    Width="400" Height="300"
     Loaded="ControlLoaded">
    <UserControl.Resources>
        <ResourceDictionary>
            <TestSilverlight:EnumConverter x:Key="EnumConverter"/>
        </ResourceDictionary>
    </UserControl.Resources>
    <Grid x:Name="LayoutRoot" Background="White">
        <StackPanel Orientation="Horizontal" Grid.Row="2" Grid.Column="1"    >
            <RadioButton GroupName="TestEnum" Content="One" 
                             IsChecked="{Binding Path=TestProp, ConverterParameter=one, Mode=TwoWay, Converter={StaticResource EnumConverter}}" />
            <RadioButton GroupName="TestEnum" Content="Two" 
                             IsChecked="{Binding Path=TestProp, ConverterParameter=two, Mode=TwoWay, Converter={StaticResource EnumConverter}}" />
            <RadioButton GroupName="TestEnum" Content="Three" 
                             IsChecked="{Binding Path=TestProp, ConverterParameter=three, Mode=TwoWay, Converter={StaticResource EnumConverter}}" />
            <RadioButton GroupName="TestEnum" Content="Four" 
                             IsChecked="{Binding Path=TestProp, ConverterParameter=four, Mode=TwoWay, Converter={StaticResource EnumConverter}}" />
            <TextBox Text="{Binding Path=TestProp, Mode=TwoWay, Converter={StaticResource EnumConverter}}" />
        </StackPanel>
    </Grid>
</UserControl>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see for the textbox you need no particular stuff to do, only set the converter, but for the RadioButton you should set the ConverterParameter for each RadioButton to set the corresponding enum value. The game is done, my DTO object stay in sync with interface with no line of code :D

alk.

Tags: [Silverlight](http://technorati.com/tag/Silverlight)

<!--dotnetkickit-->
