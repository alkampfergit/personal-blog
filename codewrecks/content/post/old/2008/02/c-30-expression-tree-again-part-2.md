---
title: "C 30 Expression Tree Again part 2"
description: ""
date: 2008-02-16T05:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In the [preceding post](http://www.nablasoft.com/Alkampfer/?p=141) I showed that a lambda expression can be converted by the compiler in an object of type Expression that actually models the expression tree. With this post we can begin to have more fun, first of all I modified the visitor to show the exact tree of the expression. Here is a screenshot

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image-thumb2.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image2.png)

As you can see the structure of the lambda is more clear, the original lambda contains an Add Expression that in turns contains two parameter expression. The lambda has a collection of parameters that can be inspected at runtime, I simply show them in a listview and permit to the user to set a value. When you set values for parameters you can press the Execute button and “voilÃ “, the expression is executed. The code to execute the function is the following.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
LambdaExpression ex = treeView1.SelectedNode.Tag as LambdaExpression;
if (ex == null) return;
Delegate d = ex.Compile();
Object[] parameters = new Object[lstParameters.Items.Count];
for (Int32 I = 0; I < ex.Parameters.Count; ++I)
{
    parameters[I] = lstParameters.Items[I].SubItems[1].Tag;
}
txtResult.Text = d.DynamicInvoke(parameters).ToString();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I simply compile the LambdaExpression calling Compile() method, it returns a Delegate, then I retrieve the value of the parameters, that are stored in tag property of the listview items, I create the Object[] array of parameters and then call DynamicInvoke on the Delegate….the game is done.

Welcome into the marvelous world of Expression Tree ;)

Alk.

[Download the Example code](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/expressiontree1.zip "Example code")
