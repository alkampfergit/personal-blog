---
title: "WPF IValueConverter and binding"
description: ""
date: 2008-04-02T06:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
People often look at WPF and XAML only for the possibility to create more appealing interface, but XAML is a lot more, because it is a way to create object with xml syntax. Here is an example on how to make some advanced binding.

Suppose I have some objects with a property called StartingTime that is a DateTime and I want to visualize the elapsed time from StartingTime to Now. Please resist the temptation to create a presentation object with a suitable property, and lets dig into IValueConverter, here is an example

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public  class DateConverter :IValueConverter {
  public enum ConversionType {
     Elapsed = 0,
  }

  #region IValueConverter Members

   public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture) {
      if (value.GetType() != typeof(DateTime)) throw new ArgumentException("The DateConverter can be used only to format datetime valuyes");
     switch(Type) {
        case ConversionType.Elapsed:
           TimeSpan span = DateTime.Now.Subtract((DateTime) value);
           return String.Format("{0:00}:{1:00}:{2:00}", span.TotalHours, span.Minutes, span.Seconds);
           break;
        default:
           throw new NotImplementedException("This conversion is not implemented");
     }
   }

   public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture) {
      return null;
   }

   public ConversionType Type { get; set; }

   #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is not a good class, but is serves as example, it permits to convert from a DateTime to other object, in this example I only support elapsed that permits to me to convert DateTime values in a string representing elapsed time. Now you can use this converter without writing a single line of code, and you have full intellisense

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/04/image-thumb.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/04/image.png)

As you can see I simply add a Binding object, sets the path to the correct property of the object bound, and I declare the converter with full intellisense power.

This can give you a taste of the power of XAML.

Alk.

Technorati Tags: [XAML](http://technorati.com/tags/XAML),[IValueconverter](http://technorati.com/tags/IValueconverter)
