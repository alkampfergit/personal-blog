---
title: "Windsor Container ResolveIDictionary"
description: ""
date: 2007-05-18T22:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
Castle framework is really interesting, but do not forget to checkout current trunk in subversion repository, since it is full of new and exciting features. In a little demo that I’m doing to made a screencast for [dotnetmarche](http://dotnetmarche.org/) community, I show how to structure a simple web page to follow [Design For Testability](http://en.wikipedia.org/wiki/Design_For_Test) principles, and I made a really basic example of a page with a controller. Since the controller needs to use the session I abstracted the session with an interface

publicinterfaceICustomWebContext  {

void  AddToSession(String  key,  Object  value);  
Object  GetFromSession(String  key);  
void  ClearSession();  
}

I admit that this is not really an exceptional interface J but it will live only for the sake of my screencast. Using this interface I can abstract the concept of session, so the controller is not forced to run inside a live asp.net application. For the website I plug into controller a simple class that simply stores objects into HttpContext.Current.Session, while for test I can use a simple Dictionary&lt;String, object&gt;. To assemble the object I use Windsor container, since it is lightweight and simple to use, but I need to use the current version in the trunk, since rc2 missed a functionality that I love too much. Here is the problem, page controller has this signature

public  Page4Controller(IPageAddition  page,  ICustomWebContext  context)  {

it needs an instance of the IPageAddition interface, that abstract the methods of the UI interface and also need a concrete implementation of context. I need to create an instance of the Page4Controller whenever the page needs to perform some operation, and I need to pass the instance of the current page and the context. The page is different at each time while context is a singleton class. First I create a little helper class for Windsor

publicstaticclassIoC  {

privatestaticIWindsorContainer  \_container  =  
newWindsorContainer(  
newXmlInterpreter(newConfigResource(“castle”)));

publicstatic  T  Resolve&lt;T&gt;()  {  
return  \_container.Resolve&lt;T&gt;();  
    }

publicstatic  T  Resolve&lt;T&gt;(string  name)  {  
return  \_container.Resolve&lt;T&gt;(name);  
    }

publicstatic  T  Resolve&lt;T&gt;(paramsobject[]  values)  {

System.Collections.Hashtable  arguments  =  new  System.Collections.Hashtable();  
for  (Int32  I  =  0;  I  &lt;  values.Length;  I  +=  2)  {  
                    arguments.Add(values[I],  values[I  +  1]);  
            }  
return  \_container.Resolve&lt;T&gt;(arguments);  
    }  
}

This is only a matter of convenience, the third resolve method is the interesting one, because it use container.Resolve&lt;&gt;(IDictionary) method, that is able to construct an object and lets the caller pass some of the dependencies. Caller code creates a Page4Controller object in this way.

Page4Controller  controller  =  WebSite.IoC.Resolve&lt;Page4Controller&gt;(“page”,  this);

Caller specify that the page argument should be passed the current instance of the page, while all other argument are passed according to the setting in config file.

&lt;component  
id=“PageControllerForPage4“  
service=“WebLogic3.Page4Controller,  WebLogic3“  
type=“WebLogic3.Page4Controller,  WebLogic3“  
lifestyle=“Transient“/&gt;  
&lt;component  
id=“WebContext“  
service=“WebLogic3.ICustomWebContext,  WebLogic3“  
type=“WebLogic3.StandardWebContext,  WebLogic3“  
lifestyle=“Singleton“/&gt;

As you can see I specifify that the Page4Controller class has a lifestyle of transient, because I need a fresh controller at each page postback and the ICustomWebContext dependency is satisfied by the StandardWebContext class. With this useful feature, we can use object with mixed dependencies, some of them will be resolved by Windsor according to the configuration file, while some others are resolved directly by the caller.

Alk.
