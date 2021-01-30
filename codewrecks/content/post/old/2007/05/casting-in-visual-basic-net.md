---
title: "Casting in Visual Basic NET"
description: ""
date: 2007-05-15T06:00:37+02:00
draft: false
tags: [Languages]
categories: [Languages]
---
In all type safe languages there is the concept of “casting”, an operation used to specify to the compiler that a variable of a certain Type has to be considered of different Type. Visual Basic has three operators to do a cast: *DirectCast, CType*and *TryCast*, each one behaving in a different way from the other. To understand the subtle differences from these three operators lets present a simple example.

PrivateSub  DirectCastExample(ByVal  obj  AsObject)  
        Console.WriteLine(“string  lenght={0}”,  DirectCast(obj,  String).Length)  
EndSub  
  
PrivateSub  CTypeExample(ByVal  obj  AsObject)  
        Console.WriteLine(“string  lenght={0}”,  CType(obj,  String).Length)  
EndSub  
  
PrivateSub  trycastExample(ByVal  obj  AsObject)  
        Console.WriteLine(“string  lenght={0}”,  TryCast(obj,  String).Length)  
EndSub

PrivateSub  Test()  
        DirectCastExample(30)  
        CTypeExample(30)  
        trycastExample(30)  
EndSub

The three instruction of the Test() function give really three different results, the first throws an InvalidCastException, the second writes “string length=2” and the third throws a NullReferenceException. To understand what is happening we could look at generated MSIL. DirectCast operator is translated with this code

L\_0007: castclass [string](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String "string")  
L\_000c: callvirt instance [int32](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.Int32 "int32") [[mscorlib](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089 "mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089")][System.String](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String "[mscorlib]System.String")::[get\_Length](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String/get_Length%28%29:Int32 "get_Length")()

DirectCast is translated to castclass opcode, that simply pushes on the stack the object reference to the cast instance. If at run time the instance passed to the function is not a String class an InvalidCastException is thrown. DirectCast can convert if the object is of the exact type, if inherits from the type specified, or if the object implements the interface when the destination type is an interface.

TryCast operator behaves a little different, this is the MSIL generated

L\_0007: isinst [string](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String "string")  
L\_000c: callvirt instance [int32](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.Int32 "int32") [[mscorlib](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089 "mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089")][System.String](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String "[mscorlib]System.String")::[get\_Length](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String/get_Length%28%29:Int32 "get_Length")()

TryCast  use the isinst opcode, that is analogous to castclass, but if the cast is not successful instead of throwing an exception a null value is push on the stack. The third type of cast, CType is not really a cast operator, but instead a conversion operator, even if in a lot of documentation CType is considered to be a cast operator, to understand the difference here is generated MSIL.

L\_0007: call [string](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String "string") [[Microsoft.VisualBasic](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://Microsoft.VisualBasic:8.0.0.0:b03f5f7f11d50a3a "Microsoft.VisualBasic, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")][Microsoft.VisualBasic.CompilerServices.Conversions](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://Microsoft.VisualBasic:8.0.0.0:b03f5f7f11d50a3a/Microsoft.VisualBasic.CompilerServices.Conversions "[Microsoft.VisualBasic]Microsoft.VisualBasic.CompilerServices.Conversions")::[ToString](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://Microsoft.VisualBasic:8.0.0.0:b03f5f7f11d50a3a/Microsoft.VisualBasic.CompilerServices.Conversions/ToString%28Object%29:String "ToString")([object](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.Object "object"))  
L\_000c: callvirt instance [int32](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.Int32 "int32") [[mscorlib](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089 "mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089")][System.String](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String "[mscorlib]System.String")::[get\_Length](http://www.aisto.com/roeder/dotnet/Default.aspx?Target=code://mscorlib:2.0.0.0:b77a5c561934e089/System.String/get_Length%28%29:Int32 "get_Length")()

As you can see CType operator calls internally the function ToString() of class Microsoft.VisualBasic.CompilerServices.Conversions, this means that CType does not make a cast, but it makes conversions. The example in fact reveals that when we pass the integer value 30 to the function, this value gets converted to the string “30” and the code does not throw errors. The annoying issue is that you use CType to convert a variable to a custom type class it defaults to use castclass opcode, since the Microsoft.VisualBasic.CompilerServices.Conversion has methods to convert only to.NET basic types.

Alk.
