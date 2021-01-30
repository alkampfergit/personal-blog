---
title: "Dynamic load type with TypeGetType and TypeLoadException"
description: ""
date: 2008-04-18T23:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
I love dynamically creating object with Activator.CreateInstance, in a project of mine I created a little scheduler that accept object of type ICOmmand, it load assembly from disk, permits you to configure the command reading some custom attributes, and so on.

When You use the scheduler to schedule a command it is frequent that the command is contained in an Assembly that references some other assemblies, if the person that use the scheduler forget to include all dependencies when the code call Type.GetType(typeName, true) to resolve the type from name, it raise a TypeLoadException. The bad thing about this exception is that it does not give a lot of help, it tells you "Impossibile to load type X" and stop.

A much more better exception is the ReflectionTypeLoadException, that is raised from an assembly when you call GetTypes(), this kind of exception contains a collection of LoaderExceptions that contains all the exception raised from any types. So I added to the scheduler a simple function that I call to raise a more useful exception.

{{< highlight csharp "linenos=table,linenostart=1" >}}
internal static void RaiseTypeLoadExceptionWithExtendedMessage(string commandTypeName) {
   try {
      Assembly.Load(commandTypeName.Split(',')[1]).GetTypes();
   }
   catch (ReflectionTypeLoadException ex) {
      StringBuilder loaderException = new StringBuilder();
      loaderException.AppendLine("Cannot load command of type " + commandTypeName);
      foreach (Exception e in ex.LoaderExceptions)
         loaderException.AppendLine(e.Message);
      throw new TypeLoadException(loaderException.ToString(), ex);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This function accept the commandtypeName stored in the form Namespace.Name, AssemblyName, it split the name in two, load the assembly and then call GetTypes(), trap the ReflectionTypeLoadException and then build an extended message that contains message from all the real exceptions that are raised from any type.

When I look in the trace file to see the exception I saw this morning that in a deploy an assembly is missing, my nant script missed to copy a file, but now the error is really more exiting respect to the standard "Could not load type XX".

Alk

Tags: [Reflection](http://technorati.com/tag/Reflection)
