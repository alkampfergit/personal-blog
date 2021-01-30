---
title: "How to implement INotifyPropertyChanged with CodeDom"
description: ""
date: 2008-08-14T01:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In a little series of posts I showed how to create runtime class that extend a base entity to implement INotifyPropertyChanged. Despite the fact that dynamic code generation is surely not the best option to implement such an interface, I’m still interested in showing how to do it.

The greatest problem of Run-Time code generation with Reflection.Emit or Castle.DynamicProxy is that you cannot use generated class in your code, this is simply due to the fact that the type exists only at runtime. Another approach is to generate source code at design time, this makes possible to use the generated type wherever you want, and extend it thanks to Partial keyword.

A straightforward approach is simply generating the source code in a string, after all writing a.cs file filled with code is not a difficult task, but what about visual basic? It turns out that CodeDom is a best approach to generate source files, because you create a definition of the code with code, and then you can transform such a definition into source code with the provider of your language of choice. In the project that you can download [here](http://www.codewrecks.com/blog/storage/codedyn.zip) you find a possible implementation in the file CodeDomProxy. In the beginning of the file you generate the type

{{< highlight csharp "linenos=table,linenostart=1" >}}
newType = new CodeTypeDeclaration(className);
newType.BaseTypes.Add(baseType);
newType.TypeAttributes = TypeAttributes.Public;
newType.IsPartial = true;
newType.BaseTypes.Add(new CodeTypeReference(typeof(INotifyPropertyChanged)));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is really simple, as to create a new CodeTypeDeclaration object setting the base class, and various other properties. Then we must generate the PropertyChanged event

{{< highlight csharp "linenos=table,linenostart=1" >}}
CodeMemberEvent PropertyChangedEvent = new CodeMemberEvent();
PropertyChangedEvent.Name = "PropertyChanged";
PropertyChangedEvent.Type = new CodeTypeReference( typeof(PropertyChangedEventHandler));
PropertyChangedEvent.Attributes = MemberAttributes.Public;
newType.Members.Add(PropertyChangedEvent);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see, working with codedom is mainly a matter of creating the right member of the class, CodeMemberEvent for an event, setting name, and finally adding the members collection of the CodeTypeDeclarationClass. Now our class has the event, but it lack a method called OnPropertyChanged used to invoke the event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 1 CodeMemberMethod OnPropertyChanged = new CodeMemberMethod();
 2 OnPropertyChanged.Name = "OnPropertyChanged";
 3 OnPropertyChanged.Attributes = MemberAttributes.Family;
 4 OnPropertyChanged.Parameters.Add(new CodeParameterDeclarationExpression(
 5     new CodeTypeReference(typeof(String)), "Property"));
 6 
 7 //Declare temp variable holding the event
 8 CodeVariableDeclarationStatement vardec = new CodeVariableDeclarationStatement(
 9     new CodeTypeReference(typeof(PropertyChangedEventHandler)), "temp");
10 vardec.InitExpression =  new CodeEventReferenceExpression(
11     new CodeThisReferenceExpression(), "PropertyChanged");
12 OnPropertyChanged.Statements.Add(vardec);
13 
14 //The part of the true, create the event and invoke it
15 CodeObjectCreateExpression   createArgs = new CodeObjectCreateExpression(
16     new CodeTypeReference(typeof(PropertyChangedEventArgs)),
17     new CodeArgumentReferenceExpression("Property"));
18 CodeDelegateInvokeExpression raiseEvent = new CodeDelegateInvokeExpression(
19     new CodeVariableReferenceExpression("temp"), 
20     new CodeThisReferenceExpression(), createArgs);
21 
22 //The conditino
23 CodeExpression condition = new CodeBinaryOperatorExpression(
24     new CodeVariableReferenceExpression("temp"),
25     CodeBinaryOperatorType.IdentityInequality,
26     new CodePrimitiveExpression(null));
27 
28 //The if condition
29 CodeConditionStatement ifTempIsNull = new CodeConditionStatement();
30 ifTempIsNull.Condition = condition;
31 ifTempIsNull.TrueStatements.Add(raiseEvent);
32 OnPropertyChanged.Statements.Add(ifTempIsNull);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In lines 1-5 I setup the method, declaring name, attributes and a parameter of type string called Property. In line 8-12 I created a temp variable to store a temp reference of the event handler, to declare a variable you use the CodeVariableDeclarationStatement, the constructor accepts an CodeTypeReference used to specify the type of the variable and a string specifying the name. The CodeVariableDeclarationStatement has a property named InitExpression that accepts a *CodeExpression* object, that is the base type used to declare statements with CodeDom. Since I want the temp variable to be initialized with the actual value of the event handler, I use a CodeEventReferenceExpression that needs the object instance (a CodeThisReferenceExpression() used to reference this) and the name of the Event. Finally you can add this instruction to the Statements collection of the OnPropertyChangedMethod.

Finally I have to define a simple condition (temp != null) and invoke the handler if it is true. Line 15-20 declare the block of the code used in the true part, is simply a CodeObjectCreateExpression used to create the PropertyChangedEventArgs needed by the event and finally a CodeDelegateInvokeExpression to invoke the delegate itself.

Lines 23-26 are used to create the condition, then lines 29-31 are used to generate the if and setup all the code block.

All this code to define a simple method that invoke the handler of the event if it’s not null, the CodeDom is really verbose. The rest of the code is really similar, it simply iterate all properties of the original object creating an override for each virtual one, finally if you want to generate the code you can call this function.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private String GenerateCSharpFile()
{
    StringBuilder sb = new StringBuilder();
    TextWriter tw = new StringWriter(sb);
    CodeDomProvider provider = new CSharpCodeProvider();
    CodeNamespace nspace = new CodeNamespace("MyProxy");

    nspace.Types.Add(newType);

    provider.GenerateCodeFromNamespace(nspace, tw, new CodeGeneratorOptions());
    tw.Close();
    return sb.ToString();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Really simple, isn’t it? the result with the Customer sample class is the following.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
namespace MyProxy {
    public partial class MyClass : VariousTests.Customer, System.ComponentModel.INotifyPropertyChanged {
        public override string Property {
            get {
                return base.Property;
            }
            set {
                this.OnPropertyChanged("Property");
                base.Property = value;
            }
        }
        public override int AnotherProp {
            get {
                return base.AnotherProp;
            }
            set {
                this.OnPropertyChanged("AnotherProp");
                base.AnotherProp = value;
            }
        }
        public override double Added {
            get {
                return base.Added;
            }
            set {
                this.OnPropertyChanged("Added");
                base.Added = value;
            }
        }
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        protected virtual void OnPropertyChanged(string Property) {
            System.ComponentModel.PropertyChangedEventHandler temp = this.PropertyChanged;
            if ((temp != null)) {
                temp(this, new System.ComponentModel.PropertyChangedEventArgs(Property));
            }
        }
    }
}
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The game is done :D, you have generated dynamic code to subclass a base class and make it implements the INotifyPropertyChanged.

[Sample code download.](http://www.codewrecks.com/blog/storage/codedyn.zip)

alk.

<!--dotnetkickit-->

Tags: [CodeDom](http://technorati.com/tag/CodeDom) [INotifyPropertyChanged](http://technorati.com/tag/INotifyPropertyChanged)
