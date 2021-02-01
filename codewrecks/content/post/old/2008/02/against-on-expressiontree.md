---
title: "Against on ExpressionTree"
description: ""
date: 2008-02-19T02:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Previous part: [Part1](http://www.nablasoft.com/Alkampfer/?p=141), [Part2](http://www.nablasoft.com/Alkampfer/?p=145)

Ok, lets move on on the anatomy of an expression, let’s take as example the following screenshot.

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image-thumb3.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image3.png)

The original expression is customer =&gt; customer.Property.StartsWith(“A”), and the expression is dissected in a node of type Lambda that contains a Call node. The *Call* node is a node that express the invocation of a method, and internally contains all the needed information.

{{< highlight csharp "linenos=table,linenostart=1" >}}

protected override Expression VisitMethodCall(MethodCallExpression m)
{
    StringBuilder parameterList = new StringBuilder();
    foreach (ParameterInfo pi in m.Method.GetParameters()) {
        parameterList.Append(pi.ParameterType.Name);
        parameterList.Append(", ");
        }
    if (parameterList.Length > 0) parameterList.Length -= 2;
    Current.Text = String.Format("{0}   [{3} {1}.{2}({4})]", 
        Current.Text, m.Method.DeclaringType.Name, m.Method.Name, 
        m.Method.ReturnType.Name, parameterList.ToString());
    return base.VisitMethodCall(m);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The real node type is MethodCallExpression and internally contains the *MethodInfo* object that will be invocated, in this example the StartsWith of class String. The base visitor has this code for the *Call*node

{{< highlight xml "linenos=table,linenostart=1" >}}
protected virtual Expression VisitMethodCall(MethodCallExpression m)
{
    Expression obj = this.Visit(m.Object);
    IEnumerable<Expression> args = this.VisitExpressionList(m.Arguments);
    if (obj != m.Object || args != m.Arguments)
    {
        return Expression.Call(obj, m.Method, args);
    }
    return m;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

So a Call node internally has a property called Object that represent the Expression that will return the instance of the object to call the method from, then the MethodCallExpression has an *Arguments* property that contains a series of arguments to call the method. All these properties are of type Expression, this is the most important part. If you look at the image at the beginning of the post you can see that the Call node contains two nodes, the first is the object to invocate the method on, and is a MemberAccess, because we need to evaluate the call on the “Property” property of the customer object.

To really understand how the Expression is executed you need to traverse the tree from the leaf, first of all we see a  **parameter** node (customer) this is the parameter of the whole expression, then we have a  **MemberAccess** used to found the value of Property, then the MemberAccess node has a sibiling of type  **Constant** , that represent the first and only parameter of the parent  **Call** node, so the call can use inner MemberInfo to dynamically invoke the StartsWith.

I hope I was quite clear. If you are interested in code you can grab from subversion on [http://nablasoft.googlecode.com/svn/trunk/Linq/ExpressionTree](http://nablasoft.googlecode.com/svn/trunk/Linq/ExpressionTree "http://nablasoft.googlecode.com/svn/trunk/Linq/ExpressionTree") and the revision of this example is 10.

Alk.
