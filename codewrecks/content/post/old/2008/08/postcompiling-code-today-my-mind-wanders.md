---
title: "PostCompiling code Today my mind wanders"
description: ""
date: 2008-08-07T11:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In these days in our italian blogs we were ruminating about the possibility to have some sort of automation to implements automatically INotifyPropertyChanged for our classes, without having to explicitly write code.

Why we could want such an automation? The answer is: to make our domain more “*Infrastructure Ignorant*“, the goal is use POCO object for our domain, moving the infrastructure stuff (Like the INotifyPropertyChanged) somewhere else.

First of all, I’m not an advocate of “POCO at any cost!”, I’m quite sure that the best approach is implementing such interfaces directly in your domain classes, maybe with the use of custom snippet like [Marco](http://www.codemetropolis.com/) suggests. But the technical part of such a problem really intrigues me a lot.

This afternoon I was chatting with Marco, investigating possible solutions to this kind of problem

1) *Dynamic Generated Proxies.* Not so useful, after all you do not know at compile time the real type of the object, BindingList&lt;&gt; does not work well as [Matteo](http://blogs.ugidotnet.org/bmatte/archive/2008/08/06/mixin-poco-e-inotifypropertychanged-mito-o-realtagrave.aspx) shows in his post. Ypu need to write interceptor for NHibernate, because each time you ask for a Customer object you need to actually makes nhibernate use the CustomerProxy, a lot of work and complicates things too much.

2) *Design Time Generated Proxy.*CodeDom can helps you a lot, you can generate cs or vb file at compile time with the proxy. The situation is a little better than solution 1, you can map the proxy object in nhibernate since they are known at compile time, but it generates a lot of confusion. If my domain class is called Customer, why I had to ask for a Session.Get&lt;CustomerProxy&gt;() ? You can define a convention of keeping the real domain and the proxy one in different namespaces, so the proxy is called Customer….but in the end we only have a great confusion because we have two different domain model, the good one, and the generated one…… I do not wish myself to work in such an environment.

3) *Disassemble and reassemble code*. This can be good, thanks to ILdasm and ILasm tools you can disassemble your domain, modify the IL, and reassemble again. In the end you have only one domain, you do not need to write the code, the original assembly is made by POCO object, and the other stuff are inserted maybe with a post build action.

The option number 3 seems quite good, you can find an implementation [here](http://www.codewrecks.com/blog/storage/dtrtry1.zip). The code is really far to be a complete example, it was written in less than 2 hours, but it shows that this can be a possible solution. Here is the original content of MyDomain.dll assembly in reflector.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/08/image-thumb2.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/08/image2.png)

When you run the example, in the DomainDecorator output folder you should see both  MyDomain.dll and a MyDomainReassembled.Dll, If you open the last one you see that reflector ask you to unload the MyDomain.dll, this because they are really the same assembly. After you reload you can find that customer class is now implementing INotifyPropertyChanged.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/08/image-thumb4.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/08/image3.png)

The code is really simple, it is only a matter of, calling ildasm to generate the IL file, then some regular expression magic to find the declaration of the class, and finally insert some standard IL code to implement the feature I need. To makes things really simple I first create a Customer class with INotifyPropertyChanged implemented and disassemble it, this permits me to cut and paste the relevant code without having to write a single row of MSIL code.

The program find the relevant part with RegularExpression, add the part we need and then reassemble again. The part of OnPropertyChanged and all the methods needed to manage the event are simply a matter of pasting the IL in the target class. Changing the set part of the properties is simple too.

This example is really far to be a complete ones, Is surely break with property that are not trivial, but it shows that deassemble/modify/reassemble can be a possible solution to the original problem.

alk.

Tags: [Domain Model](http://technorati.com/tag/Domain%20Model) [MSIL](http://technorati.com/tag/MSIL)

<!--dotnetkickit-->
