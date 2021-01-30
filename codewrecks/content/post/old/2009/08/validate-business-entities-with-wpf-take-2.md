---
title: "Validate Business Entities with WPF ndash Take 2"
description: ""
date: 2009-08-17T10:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
In [the first part](http://www.codewrecks.com/blog/index.php/2009/08/14/validate-business-entities-with-wpf/) I showed how to validate an entire object with the help of [BindingGroup](http://msdn.microsoft.com/en-us/library/system.windows.data.bindinggroup.aspx) class, now I want to extend the discussion to handle a typical problem that arise with it. Suppose your business object has a property of type Int32, and you bind this property to a standard textbox, what happens when you digit in the previous example a string that is not convertible to an Int32? The answer is nothing.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb22.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image22.png)

The reason is quite simple, thanks to BindingGroup Iâ€™m actually validating the entire Customers class, thus here is what happens, when I write 0aada into the textbox, the binding try to convert this value to an Int32, it fails throwing an exception, so the value of property Count remains unchanged, thus when you validate the entire Customer object, the value of the property *IntProperty* is always a valid Int32. The smart reader can immediately say â€œthe solution is to use a [ExceptionValidationRule](http://msdn.microsoft.com/en-us/library/system.windows.controls.exceptionvalidationrule.aspx) objectâ€, this is true with standard binding, but with validation of the entire business object we have some strange behaviour.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb23.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image23.png)

If you remember the previous article, the error message is shown with a simple listview, that shows each error with a label. This because our entity validator returns us a list&lt;String&gt; containing all error messages. If you use the ExceptionValidationRule, the error is set to the message of the exception, thus, since a string is an IEnumerable&lt;Char&gt; the result is a series of label, each one showing a single char of the single error message. Moreover if you type a long text into the Country textbox, the error wont show.

The solution is a little change to our validator

{{< highlight csharp "linenos=table,linenostart=1" >}}
List<String> alreadyFailed = new List<string>();
public override ValidationResult Validate(object value, System.Globalization.CultureInfo cultureInfo)
{BindingGroup bindingGroup = (BindingGroup)value;if (bindingGroup.Items.Count == 0) return ValidationResult.ValidResult;
alreadyFailed.Clear();foreach (BindingExpressionBase bindingExpression in bindingGroup.BindingExpressions){	if (bindingExpression.HasError)	{		String property = ((Binding) bindingExpression.ParentBindingBase).Path.Path;		alreadyFailed.Add(property + ":" +bindingExpression.ValidationError.ErrorContent.ToString());		Validation.ClearInvalid(bindingExpression);	}}
var lastValidationResult = validator.ValidateObject(bindingGroup.Items[0]);if (lastValidationResult.Success){	if (alreadyFailed.Count == 0) return ValidationResult.ValidResult;}
return new ValidationResult(false, lastValidationResult.ErrorMessages.Union(alreadyFailed));
}
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Iâ€™ve simply declared a list of string called alreadyFailed, this list was cleared at the start of each validation. Since the BindingGroup contains the list of the single inner bindingExpressions objects, I did a simple foreach scanning each bindingExpression, and if the bindingExpression has errors (line 10) I add the error message to the alreadyFailed list, and clear the error status (line 14).

The trick is clearing the error status, in this way the only errors are those ones returned from the BusinessEntityValidationRule. The result is the following.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb24.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image24.png)

As you can see both the standard entity validation error and the conversion error are correctly shown into the error list.

Code is avaliable [Here](http://www.codewrecks.com/blog/storage/wpfvalidation.7z).

Alk.

Tags: [Wpf](http://technorati.com/tag/Wpf) [Validation](http://technorati.com/tag/Validation)
