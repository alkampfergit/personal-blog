---
title: "Mapping private properties with EF 41 RC and Fluent mapping"
description: ""
date: 2011-03-21T19:00:37+02:00
draft: false
tags: [EF Code First,Entity Framework]
categories: [Entity Framework]
---
EF [4.1 is now in RC](http://blogs.msdn.com/b/adonet/archive/2011/03/15/ef-4-1-release-candidate-available.aspx) phase and as a NHibernate user Iâ€™m curious to check the fluent API to map entities to database. One of the feature that I and [Andrea](http://blogs.ugidotnet.org/pape/Default.aspx) miss most is the possibility to map private properties with fluent interface. It seems strange to map private properties at once, but it can be useful in DDD. Suppose you have these simple classes.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image9.png)

 ***Figure 1***: *A really simple domain*

We have two things to notice, the first is that the Category class has a private property called PrivateDetails, and the other is that the Products collection is protected, and you can add products from the outside thanks to the AddProduct() method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class Category
{
public Int32 CategoryId { get; set; }
public string Name { get; set; }
private String PrivateDetails { get; set; }
 
private ICollection<Product> _products;
protected virtual ICollection<Product> Products
{
get { return _products ?? (_products = new HashSet<Product>()); }
set { _products = value; }
}
 
public void AddProduct(Product p)
{
Products.Add(p);
}
 
public void SetDetails(String details)
{
PrivateDetails = details;
}
}
{{< / highlight >}}

The idea behind this is that you should access only the AGGREGATE roots, not manipulating directly the collection of Products, this forces the user of the class to use specific methods. Now a problem arise, how we can map this class with EF 4.1 fluent interface? The problem is generated from the Fluent interface, that permits only to specify properties with Lambda.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image10.png)

 ***Figure 2***: *The HasMany() method accepts an Expression*

As you can see if I specify that CategoryId is mapped to an Identity database column with the instruction

Property(c =&gt; c.CategoryId)

this technique is known as [static reflection](http://handcraftsman.wordpress.com/2008/11/11/how-to-get-c-property-names-without-magic-strings/) and is really useful in such scenarios, but â€¦ now I could not use the HasMany() methods to map a protected property.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image11.png)

 ***Figure 3***: *How can I map a protected property if I could not use in a lambda?*

This problem derives only from the Fluent Interface, because EF is internally capable to map private members of objects, then we can use a little trick. I want to be able to write code like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
this.HasMany<Category, Product>("Products");
{{< / highlight >}}

This would solve all our problems, because with this statement Iâ€™m asking EF to map a collectino called Products. Fortunately writing such an extension method is quite simple, it is just a bunch of Expressions

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static ManyNavigationPropertyConfiguration<T, U> HasMany<T, U>(
this EntityTypeConfiguration<T> mapper,
String propertyName)
where T : class
where U : class
{
Type type = typeof(T);
ParameterExpression arg = Expression.Parameter(type, "x");
Expression expr = arg;
 
PropertyInfo pi = type.GetProperty(propertyName,
BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance);
expr = Expression.Property(expr, pi);
 
LambdaExpression lambda = Expression.Lambda(expr, arg);
 
Expression<Func<T, ICollection<U>>> expression =
(Expression<Func<T, ICollection<U>>>)lambda;
return mapper.HasMany(expression);
 
}
{{< / highlight >}}

This code seems complex but it is rather simple. It creates a parameter expression of the same type of the object, then grab a reference to the property from its name with reflection and with the PropertyInfo creates an Expression.Property. This expression (created in line 13) is the equivalent of c =&gt; c.Products lambda and it can be passed to the Expression.Lambda to create an Expression&lt;Func&lt;T, ICollection&lt;U&gt;&gt;&gt; object, expected from the HasMany() method.

With the same technique I can write an extension method that maps a private string property.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static StringPropertyConfiguration PropertyStr<T>(
this EntityTypeConfiguration<T> mapper,
String propertyName) where T : class
{
Type type = typeof(T);
ParameterExpression arg = Expression.Parameter(type, "x");
Expression expr = arg;
 
PropertyInfo pi = type.GetProperty(propertyName,
BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance);
expr = Expression.Property(expr, pi);
LambdaExpression lambda = Expression.Lambda(expr, arg);
 
Expression<Func<T, String>> expression = (Expression<Func<T, string>>) lambda;
return mapper.Property(expression);
}
{{< / highlight >}}

Thanks to those two methods now Iâ€™m able to write this mapping for the category class.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class CategoryMapping : EntityTypeConfiguration<Category>
{
public CategoryMapping()
{
Property(c => c.CategoryId).HasDatabaseGeneratedOption(
DatabaseGeneratedOption.Identity);
 
this.PropertyStr("PrivateDetails").HasColumnName("Details");
 
this.HasMany<Category, Product>("Products");
ToTable("Category");
}
}
{{< / highlight >}}

As you can see Iâ€™m able to map the PrivateDetails property and I can choose column name, and the Products property with no problem. Now I can use my model

{{< highlight csharp "linenos=table,linenostart=1" >}}
var food = new Category { Name = "Foods" };
food.SetDetails("Details");
db.Categories.Add(food);
Product p = new Product() {Name = "Beer"};
food.AddProduct(p);
int recordsAffected = db.SaveChanges();
{{< / highlight >}}

As you can ses Iâ€™m able to add product without the need to directly access the collection, and I can set a private property through a method (not so useful technique, but just to show that mapping private properties works). Running the sample I got

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image12.png)

 ***Figure 4***: *The fact that three entities were saved confirmed me that the mapping of the protected collection works.*

I can verify that everything is ok thanks to [EFProfiler](http://efprof.com/).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image13.png)

 ***Figure 5***: *Thanks to EFProf I can verify that products are correctly saved and linked to the category object*

EF 4.1 Code first finally gives to EF the direction towards a real ORM, usable in DDD scenario.

alk.

[<font size="1">Code is here.</font>](http://www.codewrecks.com/blog/storage/ef41.zip)
