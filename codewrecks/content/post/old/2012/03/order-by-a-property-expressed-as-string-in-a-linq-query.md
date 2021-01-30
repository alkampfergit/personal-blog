---
title: "Order by a property expressed as string in a LINQ Query"
description: ""
date: 2012-03-23T21:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
This is one of the most common question you got when you show  **LINQ to Entities** or  **LINQ to Nhibernate** to people that are not used to LINQ: *How can I order by a property if I have the name of the property expressed as String?* I’ve blogged in the past how you can do [dynamic sorting and pagination in  **Entity Framework**](http://www.codewrecks.com/blog/index.php/2009/03/21/entity-framework-dynamic-sorting-and-pagination/), but that solution uses ESQL, a dialect to query EF that is similar to  **NHibernate** HQL language.

The solution to the above problem is really simple, you should only start thinking on how the  **OrderBy LINQ** operator works, it basically accepts a lambda that express the ordering criteria, for a customer object it can be something like OrderBy( c=&gt; c.CustomerName). The problem of having the*property expressed as string* is that the OrderBy method accepts an Expression, so you only need to *convert the string to the appropriate expression*. The solution is quite simple, you can [find the solution in this post](http://stackoverflow.com/questions/41244/dynamic-linq-orderby), the above code is a slightly variation of the code you find in the previous link.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static IQueryable<T> OrderByName<T>(
    this IQueryable<T> source,
    string propertyName,
    Boolean isDescending)
{
    if (source == null) throw new ArgumentNullException("source");
    if (propertyName == null) throw new ArgumentNullException("propertyName");
    Type type = typeof(T);
    ParameterExpression arg = Expression.Parameter(type, "x");
    PropertyInfo pi = type.GetProperty(propertyName);
    Expression expr = Expression.Property(arg, pi);
    type = pi.PropertyType;
    Type delegateType = typeof(Func<,>).MakeGenericType(typeof(T), type);
    LambdaExpression lambda = Expression.Lambda(delegateType, expr, arg);
    String methodName = isDescending ? "OrderByDescending" : "OrderBy";
    object result = typeof(Queryable).GetMethods().Single(
        method => method.Name == methodName
                && method.IsGenericMethodDefinition
                && method.GetGenericArguments().Length == 2
                && method.GetParameters().Length == 2)
       .MakeGenericMethod(typeof(T), type)
       .Invoke(null, new object[] { source, lambda });
    return (IQueryable<T>)result;
}

{{< / highlight >}}

As you can see this is a simple extension method that  **extends the IQueryable&lt;T&gt;** interface. The code can appear complex, but is really simple because it simply create an expression tree that specify the property you want to use for ordering, then it invoke the correct  **OrderBy** or  **OrderByDescending** method through reflection. The above code is quite complex because it must use reflection, so you could try to create a version that does not need to use reflection to invoke the OrderBy method.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static IQueryable OrderBy(
    this IQueryable source,
    string propertyName)
{
    if (source == null) throw new ArgumentNullException("source");
    if (propertyName == null) throw new ArgumentNullException("propertyName");
    Type type = typeof(T);
    ParameterExpression arg = Expression.Parameter(type, "x");
    PropertyInfo pi = type.GetProperty(propertyName);
    Expression expr = Expression.Property(arg, pi);
    var lambda = Expression.Lambda(expr, arg);
    return source.OrderBy((Expression>)lambda);
}

{{< / highlight >}}

This version is much simpler because it uses two Type parameter so it can avoid using reflection to invoke the right OrderBy version. The only disadvantage is that in this version you should specify the right type of the property you are using to order by

{{< highlight csharp "linenos=table,linenostart=1" >}}


  query.OrderBy("Name").ToList();

{{< / highlight >}}

This call orders by the Name property, specifying that the property is a property of Type String. Clearly this second version is simpler but it *is not usable, because in dynamic ordering you does not know in advance the type of the property that will be specified for ordering*, this means that the first version based on [Mark Gravell’s solution](http://stackoverflow.com/questions/41244/dynamic-linq-orderby) is the only way to go.

Gian Maria.
