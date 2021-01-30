---
title: "NUNIT and C 35"
description: ""
date: 2008-03-21T01:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
One of the most important characteristic of a test is readability, the test should be clear and its intent should be self evident. When working with domain object it is recurring to make test to assert that in some collection we have a fixed amount of objects with a given property equal to a given value. Suppose we have a simple class with two properties, PropertyA and PropertyB. Lets build a little collection to make some assert.

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image-thumb.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image.png)

Ok now suppose we want to assert that all the object in the collection has propertyB equal to “B”, here we have two way to assert this, one is nunit standard the other is a class of mine

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image-thumb1.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image1.png)

Ok they are equals, the difference happens when we need to assert something like “all object has propertyB equal to “B” and one object with PropertyA equal to “C”, this is the assertion with my class

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image-thumb2.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image2.png)

I like it, it is small and very readable, but there is one thing I do not like, I’m forced to specify property name as string, so it is possible to make typo errors, and you do not have intellisense to help you. After some thinking I wrote a simple class that permits me to do this.

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image-thumb3.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image3.png)

Now the assertion can be less readable, but the lambda expression are really short, the code does not use reflection to access property value, and we have full intellisense power inside the assertion. If you are interested in the code, you can find in this subversion repository [[http://nablasoft.googlecode.com/svn/trunk/UnitTest/SomeNunitHelpers](http://nablasoft.googlecode.com/svn/trunk/UnitTest/SomeNunitHelpers "http://nablasoft.googlecode.com/svn/trunk/UnitTest/SomeNunitHelpers")]. All the code is in very early stage, but it could be interesting.

Alk.

Technorati Tags: [Nunit](http://technorati.com/tags/Nunit),[Extension Methods](http://technorati.com/tags/Extension%20Methods),[Fluent Assertion](http://technorati.com/tags/Fluent%20Assertion)
