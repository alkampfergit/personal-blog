---
title: "T4 toolbox RenderCore no suitable method to override"
description: ""
date: 2010-05-12T11:00:37+02:00
draft: false
tags: [T4 Generator]
categories: [NET framework]
---
[T4 toolbox](http://t4toolbox.codeplex.com/) a very good Visual Studio addin to efficiently manage T4 template. If you move to the new version you should be aware that there is a breaking change in the base Template class. In old version you render all text inside the method RenderCore()

{{< highlight csharp "linenos=table,linenostart=1" >}}
protected override void RenderCore()
{
GenerateDto(
AssemblyName,
HostDirectory,
TypeName,
DtoName,
NameSpaceName,
DataContractNameSpace,
InheritLevel,
Properties,
PropertyDataList,
GenerateINotifiedPropertyChanging,
GenerateINotifiedPropertyChanged,
GenerateIEditableObject);
}
{{< / highlight >}}

In the new version the function RenderCore is not accessible anymore from derived classes, and you should override the TransformText() function. In my DtoGenerator the above function will be modified in

{{< highlight csharp "linenos=table,linenostart=1" >}}
public override string TransformText()
{
GenerateDto(
AssemblyName,
HostDirectory,
TypeName,
DtoName,
NameSpaceName,
DataContractNameSpace,
InheritLevel,
Properties,
PropertyDataList,
GenerateINotifiedPropertyChanging,
GenerateINotifiedPropertyChanged,
GenerateIEditableObject);
 
return this.GenerationEnvironment.ToString();
}
{{< / highlight >}}

Since everything is generated into GenerateDto function, I simply changed the declaration of the function and added the return this.GenerationEnvironment.ToString(); to make everything work. If you forget to do this you get the error

Compiling transformation: ‘Microsoft.VisualStudio.TextTemplating.blablabla. **RenderCore(): no suitable method found to override.** alk.
