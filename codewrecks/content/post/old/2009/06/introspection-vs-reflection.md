---
title: "Introspection vs reflection"
description: ""
date: 2009-06-24T02:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
As every.Net programmer know, reflection is the standard way to analyze an assembly finding types, interfaces etc. This approach cannot be used in all situations, as an example when you generate code with T4 engine in visual studio 2008.

As [Oleg](http://www.olegsych.com/2008/09/t4-tutorial-debugging-code-generation-files/) states here, if you need to analyze assemblies during code generation, you should use fxcop introspection vs standard reflection. Using introspection is really simple, first of all you need to locate a couple of dll in the fxcop installation folder, and references them in the solution.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb34.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image34.png)

Microsoft.Cci.dll contains a lot of classes to use Introspection. The main problem is that there is not great help on how to use these classes, but it can be quite intuitive.

{{< highlight csharp "linenos=table,linenostart=1" >}}
AssemblyNode modelAssembly = AssemblyNode.GetAssembly(@"KilogWms.Model.dll");
Identifier namespaceIdentifier = Identifier.For("KilogWms.Model");
Identifier typeIdentifier = Identifier.For("Location");
TypeNode locationNode = modelAssembly.GetType(namespaceIdentifier, typeIdentifier);
Assert.That(locationNode.BaseType.Name.Name, Is.EqualTo("LocationBase"));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this code I load an assembly specifying dll name, then create a couple of identifier, the namespace and the name of a class, finally with the GetType() method of the AssemblyNode I get a TypeNode that contains all information on the Type. The good part of introspection engine is that the assembly is not really loaded into the appdomain of the caller. You can verify with with a little test, start code and load an AssemblyNode, then try to delete the assembly from disk, you cannot do this because the file is in use, now call Dispose() on AssemblyNode object, and try to delete the assembly again, now you can delete it with no problem. This happens because Introspection does not really load the assembly file into the process, it simply inspect it, so when you dispose the AssemblyNode the file is free again.

Looking at the above code you can see that using Introspection is really intuitive, with intellisense is really simple to figure out how to find information about classes.

Alk.

Tags: [FxCop Introspection](http://technorati.com/tag/FxCop%20Introspection)
