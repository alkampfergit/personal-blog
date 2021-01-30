---
title: "Wpf Design Time Data part 3"
description: ""
date: 2012-11-30T18:00:37+02:00
draft: false
tags: [VS2012,WPF]
categories: [WPF]
---
- [Wpf Design Time Data – An introduction](http://www.codewrecks.com/blog/index.php/2012/10/22/wpf-design-time-data/)
- [Wpf and Design data, Use a concrete class](http://www.codewrecks.com/blog/index.php/2012/11/07/wpf-and-design-time-data-part-2use-a-concrete-class-2/)

If you followed the suggestion of my first couple of posts *you should have a dedicated Design Time view model for each real View Model in your application so you can effectively use Design Time Data*. You should be aware that  **Design Time data can be directly manipulated by the designer**. In property windows you can see all properties of the Windows object (remember to select the windows), so you can locate the DataContext property and expand it to view its content.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image3.png)

 ***Figure 1***: *Visual Studio designer is able to edit the values of properties of DesignTimeData View Model*

Since the designer knows the type of the DataContext it permits you to  **edit design time value properties directly in Visual Studio**. Suppose you want to verify how the UI look when the MainFilter property is a real long string, you can simply change the MainFilter design time data value, inserting a real long string.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image4.png)

 ***Figure 2***: *You can edit properties of Design Time View Model*

The designer will immediately reflect the change so you are immediately able to see how the layout of your form is affected from this real long string. If you think this is cool, I can tell you that the **VS designer is also able to create complex objects so you do not need to write C# code in constructor of Design Time Data View Model to populate property if you do not want to**.

Pressing the button with ellipsis on the Logs property makes you to edit the Logs property directly in the editor, thanks to the build in Collection Editor. This is really cool because you can now decide how much object you want in the collection at design time, but, Houston we have a problem,  **you can modify properties, but you are not able to create complex objects**.

[!\[image\](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image5.png)

 ***Figure 3***: *You are not able to fully construct a LogMessageViewModel with the designer*

The problem shown in Figure 3 derive from this fact: WPF designer has lots of default designers that permits you to edit standard properties of objects,  **but if a property if a complex object, like property called Log in Figure 3, it does not know witch editor to use**.

If you think to this limitation a little bit, it seems strange, because after all I’m able to create new LogMessageViewModel objects and edit all the properties with Collection Editor;  **why I’m not able to create object of LogMessage Type from the editor?** After all if the Collection editor is able to create complex object I should be able to populate complex properties in the same way. The solution to this problem is specifying to WPF  the editor you want to use with the attribute [TypeConverterAttribute](http://msdn.microsoft.com/en-us/library/vstudio/system.componentmodel.typeconverterattribute%28v=vs.100%29.aspx). *Since I do not want to clutter my ViewModels with attribute pertinent to designer, the simplest solution is to  **create a DesignTime subclass for each ViewModel** , so I proceed to create the LogMessageViewModelDesignData*

{{< highlight csharp "linenos=table,linenostart=1" >}}


[NewItemTypes(typeof(LogMessageViewModelDesignData))]
public class LogMessageViewModelDesignData : LogMessageViewModel
{
    [NewItemTypes(typeof(LogMessage))]
    [TypeConverter(typeof(ExpandableObjectConverter))]
    public new LogMessage Log { get; set; }
}

{{< / highlight >}}

Thanks to this approach I’m able to  **hide the original Log property with a property that has the appropriate attributes for the designer**. This is the same trick used to solve the BindingCollection problem we saw [in the previous post](http://www.codewrecks.com/blog/index.php/2012/11/07/wpf-and-design-time-data-part-2use-a-concrete-class-2/), this time I hide the property just to specify the TypeConverterAttribute, so the designer knows how to edit my object. The NewItemTypes attribute is also used to specify the exact type of object I want to create from the designer. Now I need to change the property Logs in the RawLoggerViewModelDesignData, because now it will be a collection of this specific Design Time object

{{< highlight csharp "linenos=table,linenostart=1" >}}


public new ObservableCollection<LogMessageViewModelDesignData> Logs { get; set; }

{{< / highlight >}}

If you look at the [previous post](http://www.codewrecks.com/blog/index.php/2012/11/07/wpf-and-design-time-data-part-2use-a-concrete-class-2/) you already know that  **I hided the original Logs property because it is of ICollectionViewType, a type that is not usable at design time, and I used an ObservableCollection of LogMessageViewModel** , but nothing restrict me to declare that this collection contains different objects respect the real ViewModel,  **as long as the new class has same properties as the real one**. It turns out that I can use my new LogMessageViewModelDesignData class as the type attribute for the ObservableCollection and this improves a lot the experience for users that wants to manipulate Design Time data directly from Visual Studio.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image6.png)

 ***Figure 4***: *You can now edit the Log property directly from the designer.*

As you can see from  **Figure 4** the designer actually render a beautiful “New” button that permits you to create new instance for a Complex property. **If you press that button a new instance of LogMessage is created and you can edit directly inside the designer**. Actually this is a simple commodity to embed design time data directly inside the windows, here is the code that this will generate

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image7.png)

 ***Figure 5***: *The designer is simply generating XAML code to populate the properties of the DataContext with the designData attribute*

As you can see,  **this is the very same approach taken on the first post, creating an instance of the ViewModel and populate its property at design time in XAML** , the real difference with this approach is we are actually using dedicated subclasses to manage design time data, to overcome limitation in the original viewmodel (Es. filtered collection pattern). This is really cool because gives you the best of both approach, you can programmatically generate meaningful Design Time Data, but you can always override them to verify how the layout of the View will appear with different data.

If you want to revert to the original design time data you can simply delete corresponding XAML part in the Window code, or you can reset the value from designer

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/11/image8.png)

 ***Figure 6***: *Pressing the small black square box near the property permits you to reset design time data.*

This technique  **is really useful to populate design time data directly in code to have meaningful value** ,  **but giving to the people that will skin your application the ability to change these value to verify how the interface will look with different data**.

This is one of the real advantage of using a full MVVM approach. I always heard comment by people telling that  **MVVM is useful only for Unit Testing the View Model,** but this is actually not true. A good MVVM architecture creates a complete separation from the UI appearance and UI Logic and give to the designer an unique experience thanks to Design Time Data.

Alk.
